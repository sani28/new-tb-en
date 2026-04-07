"use client";

import { useState, useMemo } from "react";
import { NODE_COLORS } from "../_lib/colors";
import { t, tName, type Lang } from "../_lib/i18n";
import type { ActivityEntry, ChangeEntry, Comment, Priority, ProductTreeData } from "../_lib/types";
import PriorityBoard from "./PriorityBoard";

interface Props {
  activity: ActivityEntry[];
  comments: Comment[];
  data: ProductTreeData;
  authorName: string;
  commentCounts: Record<string, number>;
  onAddComment: (nodeId: string, text: string) => void;
  onDeleteComment: (commentId: string) => void;
  onSetCommentPriority: (commentId: string, priority: Priority) => void;
  onSetAuthorName: (name: string) => void;
  onSelectNode: (id: string) => void;
  lang: Lang;
}

// ── Helpers ──

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function getNodeColor(nodeId: string, data: ProductTreeData) {
  const tour = data.tours.find((t) => t.id === nodeId);
  if (tour) return NODE_COLORS.tour;
  const excl = data.exclusives.find((e) => e.id === nodeId);
  if (excl) return NODE_COLORS.exclusive;
  const product = data.products.find((p) => p.id === nodeId);
  if (product) return NODE_COLORS.product;
  const addon = data.addons.find((a) => a.id === nodeId);
  if (addon?.type && addon.type in NODE_COLORS) return NODE_COLORS[addon.type as keyof typeof NODE_COLORS];
  return NODE_COLORS.tour;
}

// Generate a consistent color from author name for avatar
function authorColor(name: string): string {
  const colors = ["#E20021", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#14B8A6", "#F97316"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function initials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

// ── Edit Entry ──

function EditEntry({ entry, data, onSelectNode }: { entry: ChangeEntry; data: ProductTreeData; onSelectNode: (id: string) => void }) {
  const color = getNodeColor(entry.nodeId, data);
  return (
    <div className="flex gap-3 py-3">
      {/* Icon */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
        <i className="fas fa-pen text-[10px] text-amber-500" />
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {entry.author && (
            <span className="text-xs font-semibold text-[#333]">{entry.author}</span>
          )}
          <span className="text-xs text-[#888]">edited</span>
          <button
            onClick={() => onSelectNode(entry.nodeId)}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: color.bg, color: color.text }}
          >
            {entry.nodeName}
          </button>
          <span className="text-[10px] text-[#bbb]" title={formatDate(entry.timestamp)}>{timeAgo(entry.timestamp)}</span>
        </div>
        <div className="mt-1.5 bg-[#f8f8f8] rounded-lg px-3 py-2 text-xs border border-[#eee]">
          <span className="text-[#888] font-medium">{entry.field}:</span>{" "}
          <span className="line-through text-rose-400">{formatValue(entry.oldValue)}</span>
          {" "}
          <i className="fas fa-arrow-right text-[8px] text-[#ccc] mx-1" />
          {" "}
          <span className="text-emerald-600 font-medium">{formatValue(entry.newValue)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Comment Entry ──

function CommentEntry({
  comment,
  data,
  onSelectNode,
  onDelete,
}: {
  comment: Comment;
  data: ProductTreeData;
  onSelectNode: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const color = getNodeColor(comment.nodeId, data);
  const avatarBg = authorColor(comment.author);

  return (
    <div className="flex gap-3 py-3 group">
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
        style={{ background: avatarBg }}
      >
        {initials(comment.author)}
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[#333]">{comment.author}</span>
          <span className="text-xs text-[#888]">commented on</span>
          <button
            onClick={() => onSelectNode(comment.nodeId)}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: color.bg, color: color.text }}
          >
            {comment.nodeName}
          </button>
          <span className="text-[10px] text-[#bbb]" title={formatDate(comment.timestamp)}>{timeAgo(comment.timestamp)}</span>
        </div>
        <div className="mt-1.5 bg-blue-50 rounded-lg px-3.5 py-2.5 text-sm text-[#333] leading-relaxed border border-blue-100 relative">
          {comment.text}
          {/* Delete button */}
          <button
            onClick={() => onDelete(comment.id)}
            className="absolute top-1.5 right-2 text-[10px] text-[#ccc] hover:text-rose-500 cursor-pointer bg-transparent border-none opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete comment"
          >
            <i className="fas fa-trash" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── New Comment Form ──

function NewCommentForm({
  data,
  authorName,
  onAddComment,
  onSetAuthorName,
  lang,
}: {
  data: ProductTreeData;
  authorName: string;
  onAddComment: (nodeId: string, text: string) => void;
  onSetAuthorName: (name: string) => void;
  lang: Lang;
}) {
  const [text, setText] = useState("");
  const [nodeId, setNodeId] = useState(data.tours[0]?.id ?? "");

  const allNodes = [...data.tours, ...data.exclusives, ...data.addons, ...data.products];

  const submit = () => {
    if (!text.trim() || !nodeId) return;
    onAddComment(nodeId, text);
    setText("");
  };

  return (
    <div className="bg-[#fafafa] rounded-xl border border-[#e5e5e5] p-4">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
          style={{ background: authorName ? authorColor(authorName) : "#ccc" }}
        >
          {authorName ? initials(authorName) : "?"}
        </div>
        <input
          type="text"
          placeholder={t("activity.yourName", lang)}
          value={authorName}
          onChange={(e) => onSetAuthorName(e.target.value)}
          className="px-2.5 py-1.5 border border-[#ddd] rounded-lg text-xs outline-none focus:border-[#E31E24] transition-colors w-[130px]"
        />
        <select
          value={nodeId}
          onChange={(e) => setNodeId(e.target.value)}
          className="px-2.5 py-1.5 border border-[#ddd] rounded-lg text-xs outline-none cursor-pointer focus:border-[#E31E24] max-w-[200px]"
        >
          <optgroup label="Classic Tours">
            {data.tours.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </optgroup>
          <optgroup label="Exclusive Tours">
            {data.exclusives.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </optgroup>
          <optgroup label="Add-ons">
            {data.addons.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </optgroup>
          {data.products.length > 0 && (
            <optgroup label="Products">
              {data.products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      {/* Comment text */}
      <div className="flex gap-2">
        <textarea
          placeholder="Add a note or insight for the team..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          }}
          rows={2}
          className="flex-1 px-3 py-2 border border-[#ddd] rounded-lg text-sm outline-none focus:border-[#E31E24] transition-colors resize-none"
        />
        <button
          onClick={submit}
          disabled={!text.trim() || !authorName.trim()}
          className="self-end px-4 py-2 bg-[#E31E24] text-white rounded-lg text-xs font-semibold cursor-pointer border-none hover:bg-[#c41a20] transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <i className="fas fa-paper-plane mr-1" /> Post
        </button>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-[#bbb] mt-1.5 m-0">
          Press <kbd className="px-1 py-0.5 bg-white border border-[#ddd] rounded text-[9px]">Ctrl+Enter</kbd> to post
        </p>
        {!authorName.trim() && (
          <p className="text-[10px] text-rose-400 mt-1.5 m-0">
            <i className="fas fa-circle-info mr-0.5" /> Enter your name to post
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main Feed ──

export default function ActivityFeed({ activity, comments, data, authorName, commentCounts, onAddComment, onDeleteComment, onSetCommentPriority, onSetAuthorName, onSelectNode, lang }: Props) {
  const [activeTab, setActiveTab] = useState<"feed" | "board">("feed");
  const [filterKind, setFilterKind] = useState<"all" | "edit" | "comment">("all");
  const [filterNode, setFilterNode] = useState<string>("all");

  const allNodes = [...data.tours, ...data.exclusives, ...data.addons, ...data.products];

  const filtered = useMemo(() => {
    let result = activity;
    if (filterKind !== "all") result = result.filter((e) => e.kind === filterKind);
    if (filterNode !== "all") result = result.filter((e) => e.nodeId === filterNode);
    return result;
  }, [activity, filterKind, filterNode]);

  const prioritized = comments.filter((c) => c.priority !== "none").length;

  return (
    <div className="mt-8 border-t border-[#e5e5e5] pt-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5 max-md:flex-col max-md:items-start max-md:gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#111] m-0 flex items-center gap-2">
            <i className="fas fa-comments text-[#E31E24]" />
            {t("activity.title", lang)}
          </h2>
          <p className="text-xs text-[#888] mt-0.5 m-0">
            {activity.length} {activity.length === 1 ? "entry" : "entries"} — edits and team notes
          </p>
        </div>

        {/* Tab toggle + Filters */}
        <div className="flex items-center gap-3">
          {/* Feed / Board tabs */}
          <div className="flex rounded-lg border border-[#ddd] overflow-hidden text-xs font-medium">
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-3 py-1.5 cursor-pointer border-none transition-colors flex items-center gap-1.5 ${activeTab === "feed" ? "bg-[#111] text-white" : "bg-white text-[#666] hover:bg-[#f5f5f5]"}`}
            >
              <i className="fas fa-stream text-[10px]" /> {t("activity.feed", lang)}
            </button>
            <button
              onClick={() => setActiveTab("board")}
              className={`px-3 py-1.5 cursor-pointer border-none transition-colors flex items-center gap-1.5 ${activeTab === "board" ? "bg-[#111] text-white" : "bg-white text-[#666] hover:bg-[#f5f5f5]"}`}
            >
              <i className="fas fa-columns text-[10px]" /> {t("activity.board", lang)}
              {prioritized > 0 && (
                <span className={`text-[9px] px-1 py-0.5 rounded-full leading-none ${activeTab === "board" ? "bg-white/20" : "bg-[#E31E24] text-white"}`}>
                  {prioritized}
                </span>
              )}
            </button>
          </div>

          {/* Filters (only in feed mode) */}
          {activeTab === "feed" && (
            <div className="flex gap-2">
              <select
                value={filterKind}
                onChange={(e) => setFilterKind(e.target.value as "all" | "edit" | "comment")}
                className="px-2.5 py-1.5 border border-[#ddd] rounded-lg text-xs outline-none cursor-pointer focus:border-[#E31E24]"
              >
                <option value="all">{t("activity.allActivity", lang)}</option>
                <option value="edit">{t("activity.edits", lang)}</option>
                <option value="comment">{t("activity.comments", lang)}</option>
              </select>
              <select
                value={filterNode}
                onChange={(e) => setFilterNode(e.target.value)}
                className="px-2.5 py-1.5 border border-[#ddd] rounded-lg text-xs outline-none cursor-pointer focus:border-[#E31E24]"
              >
                <option value="all">{t("activity.all", lang)}</option>
                {allNodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} {commentCounts[n.id] ? `(${commentCounts[n.id]})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Add comment form (always visible) */}
      <NewCommentForm
        data={data}
        authorName={authorName}
        onAddComment={onAddComment}
        onSetAuthorName={onSetAuthorName}
        lang={lang}
      />

      {/* Tab content */}
      <div className="mt-5">
        {activeTab === "feed" ? (
          /* ── Feed view ── */
          filtered.length === 0 ? (
            <div className="text-center py-10 text-[#bbb] text-sm">
              <i className="fas fa-inbox text-2xl mb-2 block" />
              {t("activity.noActivity", lang)}
            </div>
          ) : (
            <div className="divide-y divide-[#f0f0f0]">
              {filtered.map((entry) =>
                entry.kind === "edit" ? (
                  <EditEntry key={entry.id} entry={entry} data={data} onSelectNode={onSelectNode} />
                ) : (
                  <CommentEntry
                    key={entry.id}
                    comment={entry}
                    data={data}
                    onSelectNode={onSelectNode}
                    onDelete={onDeleteComment}
                  />
                ),
              )}
            </div>
          )
        ) : (
          /* ── Priority Board view ── */
          <PriorityBoard
            comments={comments}
            data={data}
            onSetPriority={onSetCommentPriority}
            onDeleteComment={onDeleteComment}
            onSelectNode={onSelectNode}
          />
        )}
      </div>
    </div>
  );
}
