"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { productTree } from "./productTreeData";
import type { ProductNode, ProductNodeKind, ChangeEntry, Comment, ActivityEntry, Priority } from "./types";

const POLL_INTERVAL = 3000; // 3 seconds

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}
const API_URL = "/api/product-tree";

// Local-only: author name persists per browser
const AUTHOR_KEY = "tb_product_tree_author";

interface SharedState {
  overrides: Record<string, Record<string, unknown>>;
  changelog: ChangeEntry[];
  comments: Comment[];
  customNodes: ProductNode[];
  updatedAt?: string;
}

async function fetchShared(): Promise<SharedState> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    return {
      overrides: data.overrides ?? {},
      changelog: (data.changelog ?? []).map((c: ChangeEntry) => ({ ...c, kind: "edit" as const })),
      comments: (data.comments ?? []).map((c: Comment) => ({ ...c, kind: "comment" as const, priority: c.priority ?? "none" })),
      customNodes: data.customNodes ?? [],
      updatedAt: data.updatedAt,
    };
  } catch {
    return { overrides: {}, changelog: [], comments: [], customNodes: [] };
  }
}

async function pushShared(state: { overrides: Record<string, Record<string, unknown>>; changelog: ChangeEntry[]; comments: Comment[]; customNodes: ProductNode[] }) {
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
  } catch {
    // silent fail — next poll will retry
  }
}

export function useProductTreeStore() {
  const [overrides, setOverrides] = useState<Record<string, Record<string, unknown>>>({});
  const [changelog, setChangelog] = useState<ChangeEntry[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [customNodes, setCustomNodes] = useState<ProductNode[]>([]);
  const [authorName, setAuthorNameState] = useState("");
  const initialized = useRef(false);
  const lastUpdatedAt = useRef<string | undefined>(undefined);
  const pushPending = useRef(false);

  // Refs for latest state (used in interval callback)
  const overridesRef = useRef(overrides);
  const changelogRef = useRef(changelog);
  const commentsRef = useRef(comments);
  const customNodesRef = useRef(customNodes);
  overridesRef.current = overrides;
  changelogRef.current = changelog;
  commentsRef.current = comments;
  customNodesRef.current = customNodes;

  // Load from shared API on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Author name from localStorage (per-browser)
    const savedAuthor = localStorage.getItem(AUTHOR_KEY) ?? "";
    setAuthorNameState(savedAuthor);

    // Shared state from API
    fetchShared().then((data) => {
      setOverrides(data.overrides);
      setChangelog(data.changelog);
      setComments(data.comments);
      setCustomNodes(data.customNodes);
      lastUpdatedAt.current = data.updatedAt;
    });
  }, []);

  // Poll for updates from other team members
  useEffect(() => {
    const interval = setInterval(async () => {
      // Don't poll if we have a pending push (avoid overwriting our own changes)
      if (pushPending.current) return;

      const data = await fetchShared();
      if (data.updatedAt && data.updatedAt !== lastUpdatedAt.current) {
        lastUpdatedAt.current = data.updatedAt;
        setOverrides(data.overrides);
        setChangelog(data.changelog);
        setComments(data.comments);
        setCustomNodes(data.customNodes);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Push to shared API whenever state changes
  const pushToServer = useCallback(async () => {
    pushPending.current = true;
    await pushShared({
      overrides: overridesRef.current,
      changelog: changelogRef.current,
      comments: commentsRef.current,
      customNodes: customNodesRef.current,
    });
    // Re-fetch to get the server's updatedAt timestamp
    const fresh = await fetchShared();
    lastUpdatedAt.current = fresh.updatedAt;
    pushPending.current = false;
  }, []);

  const isDeleted = useCallback((id: string) => !!(overrides[id] as Record<string, unknown> | undefined)?._deleted, [overrides]);

  const allNodes = [...productTree.tours, ...productTree.exclusives, ...productTree.addons, ...productTree.products, ...customNodes]
    .filter((n) => !isDeleted(n.id));

  // Merged data that includes custom nodes distributed into their categories, respecting kind overrides
  const mergedData = useMemo(() => {
    const allBase = [
      ...productTree.tours, ...productTree.exclusives, ...productTree.addons, ...productTree.products,
      ...customNodes,
    ].filter((n) => !isDeleted(n.id));

    // Apply kind overrides so nodes appear in the correct category
    const withKind = allBase.map((n) => {
      const o = overrides[n.id] as Record<string, unknown> | undefined;
      if (o?.kind && o.kind !== n.kind) return { ...n, kind: o.kind as ProductNode["kind"] };
      return n;
    });

    return {
      tours: withKind.filter((n) => n.kind === "tour"),
      exclusives: withKind.filter((n) => n.kind === "exclusive"),
      addons: withKind.filter((n) => n.kind === "addon"),
      products: withKind.filter((n) => n.kind === "product"),
      edges: productTree.edges,
    };
  }, [customNodes, overrides, isDeleted]);

  const getNode = useCallback(
    (id: string): ProductNode | undefined => {
      const base = allNodes.find((n) => n.id === id);
      if (!base) return undefined;
      const nodeOverrides = overrides[id];
      if (!nodeOverrides) return base;
      return {
        ...base,
        ...nodeOverrides,
        pricing: { ...base.pricing, ...(nodeOverrides.pricing as Record<string, unknown> ?? {}) },
        meta: { ...base.meta, ...(nodeOverrides.meta as Record<string, unknown> ?? {}) },
      } as ProductNode;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [overrides],
  );

  const applyEdit = useCallback(
    (nodeId: string, field: string, value: unknown) => {
      const base = allNodes.find((n) => n.id === nodeId);
      if (!base) return;

      const current = overridesRef.current[nodeId] ?? {};
      const oldValue = field in current
        ? (current as Record<string, unknown>)[field]
        : (base as unknown as Record<string, unknown>)[field]
          ?? (base.pricing as unknown as Record<string, unknown>)[field]
          ?? (base.meta as unknown as Record<string, unknown>)[field];

      const entry: ChangeEntry = {
        id: uid(),
        kind: "edit",
        nodeId,
        nodeName: base.name,
        field,
        oldValue,
        newValue: value,
        timestamp: new Date().toISOString(),
        author: authorName || undefined,
      };

      setChangelog((prev) => {
        const next = [entry, ...prev];
        changelogRef.current = next;
        return next;
      });

      setOverrides((prev) => {
        const existing = prev[nodeId] ?? {};
        let next: typeof prev;
        if (field in base.pricing) {
          next = {
            ...prev,
            [nodeId]: {
              ...existing,
              pricing: { ...(existing.pricing as Record<string, unknown> ?? {}), [field]: value },
            },
          };
        } else if (field in base.meta) {
          next = {
            ...prev,
            [nodeId]: {
              ...existing,
              meta: { ...(existing.meta as Record<string, unknown> ?? {}), [field]: value },
            },
          };
        } else {
          next = { ...prev, [nodeId]: { ...existing, [field]: value } };
        }
        overridesRef.current = next;
        // Push after state update
        setTimeout(pushToServer, 0);
        return next;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authorName, pushToServer],
  );

  const addComment = useCallback(
    (nodeId: string, text: string) => {
      const base = allNodes.find((n) => n.id === nodeId);
      if (!base || !text.trim()) return;

      const comment: Comment = {
        id: uid(),
        kind: "comment",
        nodeId,
        nodeName: base.name,
        text: text.trim(),
        author: authorName || "Anonymous",
        timestamp: new Date().toISOString(),
        priority: "none",
      };

      setComments((prev) => {
        const next = [comment, ...prev];
        commentsRef.current = next;
        setTimeout(pushToServer, 0);
        return next;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authorName, pushToServer],
  );

  const deleteComment = useCallback((commentId: string) => {
    setComments((prev) => {
      const next = prev.filter((c) => c.id !== commentId);
      commentsRef.current = next;
      setTimeout(pushToServer, 0);
      return next;
    });
  }, [pushToServer]);

  const setCommentPriority = useCallback((commentId: string, priority: Priority) => {
    setComments((prev) => {
      const next = prev.map((c) => (c.id === commentId ? { ...c, priority } : c));
      commentsRef.current = next;
      setTimeout(pushToServer, 0);
      return next;
    });
  }, [pushToServer]);

  const resetField = useCallback((nodeId: string, field: string) => {
    setOverrides((prev) => {
      const existing = prev[nodeId];
      if (!existing) return prev;
      const updated = { ...existing };
      delete (updated as Record<string, unknown>)[field];
      if (updated.pricing) {
        const p = { ...(updated.pricing as Record<string, unknown>) };
        delete p[field];
        (updated as Record<string, unknown>).pricing = p;
      }
      if (updated.meta) {
        const m = { ...(updated.meta as Record<string, unknown>) };
        delete m[field];
        (updated as Record<string, unknown>).meta = m;
      }
      let next: typeof prev;
      if (Object.keys(updated).length === 0) {
        next = { ...prev };
        delete next[nodeId];
      } else {
        next = { ...prev, [nodeId]: updated };
      }
      overridesRef.current = next;
      setTimeout(pushToServer, 0);
      return next;
    });
  }, [pushToServer]);

  const clearChanges = useCallback(() => {
    setOverrides({});
    setChangelog([]);
    overridesRef.current = {};
    changelogRef.current = [];
    setTimeout(pushToServer, 0);
  }, [pushToServer]);

  const addNode = useCallback(
    (kind: ProductNodeKind, name: string, fields?: Record<string, unknown>) => {
      const id = `${kind}-${uid()}`;
      const node: ProductNode = {
        id,
        kind,
        name,
        active: true,
        tags: [],
        pricing: {},
        meta: fields ?? {},
        compatibleTours: null,
        tourOptional: false,
      };
      setCustomNodes((prev) => {
        const next = [...prev, node];
        customNodesRef.current = next;
        setTimeout(pushToServer, 0);
        return next;
      });
      return id;
    },
    [pushToServer],
  );

  const removeNode = useCallback(
    (nodeId: string) => {
      // Check if it's a custom node
      const isCustom = customNodesRef.current.some((n) => n.id === nodeId);
      if (isCustom) {
        setCustomNodes((prev) => {
          const next = prev.filter((n) => n.id !== nodeId);
          customNodesRef.current = next;
          setTimeout(pushToServer, 0);
          return next;
        });
      }
      // For built-in nodes, mark as deleted via override
      // For custom nodes, also clean up overrides
      setOverrides((prev) => {
        const next = { ...prev };
        if (isCustom) {
          delete next[nodeId];
        } else {
          next[nodeId] = { ...next[nodeId], _deleted: true };
        }
        overridesRef.current = next;
        setTimeout(pushToServer, 0);
        return next;
      });
    },
    [pushToServer],
  );

  const setAuthorName = useCallback((name: string) => {
    setAuthorNameState(name);
    try { localStorage.setItem(AUTHOR_KEY, name); } catch { /* ignore */ }
  }, []);

  const exportChangesAsJson = useCallback(() => {
    return JSON.stringify(
      { exportedAt: new Date().toISOString(), changes: changelog, comments, overrides },
      null,
      2,
    );
  }, [changelog, comments, overrides]);

  const hasOverride = useCallback(
    (nodeId: string) => {
      return !!overrides[nodeId] && Object.keys(overrides[nodeId]).length > 0;
    },
    [overrides],
  );

  // Unified activity feed: edits + comments sorted newest first
  const activity: ActivityEntry[] = [...changelog, ...comments].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  // Comment count per node
  const commentCounts: Record<string, number> = {};
  for (const c of comments) {
    commentCounts[c.nodeId] = (commentCounts[c.nodeId] ?? 0) + 1;
  }

  return {
    data: mergedData,
    overrides,
    changelog,
    comments,
    activity,
    commentCounts,
    authorName,
    getNode,
    applyEdit,
    addNode,
    removeNode,
    addComment,
    deleteComment,
    setCommentPriority,
    resetField,
    clearChanges,
    setAuthorName,
    exportChangesAsJson,
    hasOverride,
  };
}
