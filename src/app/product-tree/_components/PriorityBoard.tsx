"use client";

import { useState, useRef } from "react";
import { NODE_COLORS } from "../_lib/colors";
import type { Comment, Priority, ProductTreeData } from "../_lib/types";

interface Props {
  comments: Comment[];
  data: ProductTreeData;
  onSetPriority: (commentId: string, priority: Priority) => void;
  onDeleteComment: (commentId: string) => void;
  onSelectNode: (id: string) => void;
}

const LANES: { key: Priority; label: string; color: string; bg: string; border: string; icon: string }[] = [
  { key: "low", label: "Low Priority", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", icon: "fa-arrow-down" },
  { key: "medium", label: "Medium Priority", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", icon: "fa-minus" },
  { key: "high", label: "High Priority", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", icon: "fa-arrow-up" },
];

function getNodeColor(nodeId: string, data: ProductTreeData) {
  const tour = data.tours.find((t) => t.id === nodeId);
  if (tour) return NODE_COLORS.tour;
  const excl = data.exclusives.find((e) => e.id === nodeId);
  if (excl) return NODE_COLORS.exclusive;
  const addon = data.addons.find((a) => a.id === nodeId);
  if (addon?.type && addon.type in NODE_COLORS) return NODE_COLORS[addon.type as keyof typeof NODE_COLORS];
  return NODE_COLORS.tour;
}

function authorColor(name: string): string {
  const colors = ["#E20021", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#14B8A6", "#F97316"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function initials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Draggable Card ──

function KanbanCard({
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
  const nodeColor = getNodeColor(comment.nodeId, data);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", comment.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className="bg-white rounded-lg border border-[#e5e5e5] p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow group relative"
    >
      {/* Delete */}
      <button
        onClick={() => onDelete(comment.id)}
        className="absolute top-2 right-2 text-[10px] text-[#ccc] hover:text-rose-500 cursor-pointer bg-transparent border-none opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete"
      >
        <i className="fas fa-times" />
      </button>

      {/* Product badge */}
      <button
        onClick={() => onSelectNode(comment.nodeId)}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity mb-1.5"
        style={{ background: nodeColor.bg, color: nodeColor.text }}
      >
        {comment.nodeName}
      </button>

      {/* Comment text */}
      <p className="text-xs text-[#333] leading-relaxed m-0 mb-2 line-clamp-3">{comment.text}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0"
            style={{ background: authorColor(comment.author) }}
          >
            {initials(comment.author)}
          </div>
          <span className="text-[10px] text-[#888]">{comment.author}</span>
        </div>
        <span className="text-[9px] text-[#bbb]">{timeAgo(comment.timestamp)}</span>
      </div>
    </div>
  );
}

// ── Unsorted pool (comments with priority "none") ──

function UnsortedPool({
  comments,
  data,
  onSelectNode,
  onDelete,
}: {
  comments: Comment[];
  data: ProductTreeData;
  onSelectNode: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (comments.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <i className="fas fa-inbox text-[#999] text-sm" />
        <h3 className="text-sm font-semibold text-[#666] m-0">
          Unsorted
        </h3>
        <span className="text-[10px] text-[#bbb] bg-[#f0f0f0] px-1.5 py-0.5 rounded-full">{comments.length}</span>
      </div>
      <p className="text-[11px] text-[#aaa] mb-3 m-0">Drag these cards into a priority lane below</p>
      <div className="flex flex-wrap gap-2">
        {comments.map((c) => (
          <div key={c.id} className="w-[220px]">
            <KanbanCard comment={c} data={data} onSelectNode={onSelectNode} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Lane ──

function KanbanLane({
  lane,
  comments,
  data,
  dragOverLane,
  onDragOver,
  onDragLeave,
  onDrop,
  onSelectNode,
  onDelete,
}: {
  lane: (typeof LANES)[number];
  comments: Comment[];
  data: ProductTreeData;
  dragOverLane: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onSelectNode: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex-1 min-w-[250px] rounded-xl border-2 transition-colors ${
        dragOverLane ? "border-dashed" : "border-solid"
      }`}
      style={{
        borderColor: dragOverLane ? lane.color : lane.border,
        background: dragOverLane ? lane.bg : "#fafafa",
      }}
    >
      {/* Lane header */}
      <div
        className="px-4 py-3 rounded-t-[10px] flex items-center justify-between"
        style={{ background: lane.bg }}
      >
        <div className="flex items-center gap-2">
          <i className={`fas ${lane.icon} text-xs`} style={{ color: lane.color }} />
          <h3 className="text-sm font-semibold m-0" style={{ color: lane.color }}>
            {lane.label}
          </h3>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: lane.border, color: lane.color }}
        >
          {comments.length}
        </span>
      </div>

      {/* Cards */}
      <div className="p-3 flex flex-col gap-2 min-h-[120px]">
        {comments.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-8">
            <p className="text-xs text-[#ccc] text-center m-0">
              <i className="fas fa-hand-pointer block text-lg mb-1" />
              Drop items here
            </p>
          </div>
        ) : (
          comments.map((c) => (
            <KanbanCard key={c.id} comment={c} data={data} onSelectNode={onSelectNode} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}

// ── Main Board ──

export default function PriorityBoard({ comments, data, onSetPriority, onDeleteComment, onSelectNode }: Props) {
  const [dragOverLane, setDragOverLane] = useState<Priority | null>(null);

  const unsorted = comments.filter((c) => c.priority === "none");
  const byPriority = (p: Priority) => comments.filter((c) => c.priority === p);

  const handleDrop = (priority: Priority) => (e: React.DragEvent) => {
    e.preventDefault();
    const commentId = e.dataTransfer.getData("text/plain");
    if (commentId) onSetPriority(commentId, priority);
    setDragOverLane(null);
  };

  const handleDragOver = (priority: Priority) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverLane(priority);
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-10 text-[#bbb] text-sm">
        <i className="fas fa-clipboard-list text-2xl mb-2 block" />
        No comments yet. Add a comment in the Feed tab to start prioritizing.
      </div>
    );
  }

  return (
    <div>
      {/* Unsorted pool */}
      <UnsortedPool comments={unsorted} data={data} onSelectNode={onSelectNode} onDelete={onDeleteComment} />

      {/* Kanban lanes */}
      <div className="flex gap-4 max-md:flex-col">
        {LANES.map((lane) => (
          <KanbanLane
            key={lane.key}
            lane={lane}
            comments={byPriority(lane.key)}
            data={data}
            dragOverLane={dragOverLane === lane.key}
            onDragOver={handleDragOver(lane.key)}
            onDragLeave={() => setDragOverLane(null)}
            onDrop={handleDrop(lane.key)}
            onSelectNode={onSelectNode}
            onDelete={onDeleteComment}
          />
        ))}
      </div>
    </div>
  );
}
