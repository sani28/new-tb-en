"use client";

import { useState } from "react";
import { useProductTreeStore } from "./_lib/useProductTreeStore";
import { t, currencyForLang, type Lang } from "./_lib/i18n";
import ViewToggle from "./_components/ViewToggle";
import DiagramView from "./_components/DiagramView";
import TableView from "./_components/TableView";
import ProductDetailModal from "./_components/ProductDetailModal";
import ChangelogPanel from "./_components/ChangelogPanel";
import ActivityFeed from "./_components/ActivityFeed";

export default function ProductTreeClient() {
  const store = useProductTreeStore();
  const [activeView, setActiveView] = useState<"diagram" | "table">("diagram");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  const currency = currencyForLang(lang);
  const selectedNode = selectedNodeId ? store.getNode(selectedNodeId) : null;

  return (
    <main className="px-10 pb-[60px] max-md:px-5 max-md:pt-[80px]">
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-10 mx-auto max-w-[1400px] min-h-[500px] mt-[80px] max-md:p-5 max-md:mt-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 max-md:flex-col max-md:items-start max-md:gap-3">
          <div>
            <h1 className="text-[28px] font-bold text-[#111] m-0">{t("header.title", lang)}</h1>
            <p className="text-sm text-[#888] mt-1 m-0">
              {t("header.subtitle", lang)} — {store.data.tours.length} {t("header.tours", lang)}, {store.data.exclusives.length} {t("header.exclusive", lang)}, {store.data.addons.length} {t("header.addons", lang)}, {store.data.products.length} {t("header.products", lang)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex rounded-lg border border-[#ddd] overflow-hidden text-xs font-medium">
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 cursor-pointer border-none transition-colors ${lang === "en" ? "bg-[#111] text-white" : "bg-white text-[#666] hover:bg-[#f5f5f5]"}`}
              >
                ENG
              </button>
              <button
                onClick={() => setLang("ko")}
                className={`px-3 py-1.5 cursor-pointer border-none border-l border-l-[#ddd] transition-colors ${lang === "ko" ? "bg-[#111] text-white" : "bg-white text-[#666] hover:bg-[#f5f5f5]"}`}
              >
                한국어
              </button>
            </div>

            {store.changelog.length > 0 && (
              <button
                onClick={() => setChangelogOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-300 rounded-lg text-amber-800 text-sm font-medium hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <i className="fas fa-clock-rotate-left" />
                {store.changelog.length} {store.changelog.length !== 1 ? t("header.changes", lang) : t("header.change", lang)}
              </button>
            )}
          </div>
        </div>

        <ViewToggle activeView={activeView} onSwitch={setActiveView} lang={lang} />

        {activeView === "diagram" ? (
          <DiagramView
            data={store.data}
            onSelectNode={setSelectedNodeId}
            hasOverride={store.hasOverride}
            currency={currency}
            lang={lang}
          />
        ) : (
          <TableView
            data={store.data}
            getNode={store.getNode}
            onSelectNode={setSelectedNodeId}
            onEdit={store.applyEdit}
            onAddNode={store.addNode}
            onRemoveNode={store.removeNode}
            hasOverride={store.hasOverride}
            currency={currency}
            lang={lang}
          />
        )}

        {/* Team Activity Feed */}
        <ActivityFeed
          activity={store.activity}
          comments={store.comments}
          data={store.data}
          authorName={store.authorName}
          commentCounts={store.commentCounts}
          onAddComment={store.addComment}
          onDeleteComment={store.deleteComment}
          onSetCommentPriority={store.setCommentPriority}
          onSetAuthorName={store.setAuthorName}
          onSelectNode={setSelectedNodeId}
          lang={lang}
        />
      </div>

      {/* Detail Modal */}
      {selectedNode && (
        <ProductDetailModal
          node={selectedNode}
          onClose={() => setSelectedNodeId(null)}
          onEdit={store.applyEdit}
          onResetField={store.resetField}
          onDelete={store.removeNode}
          hasOverride={store.hasOverride}
          currency={currency}
          lang={lang}
        />
      )}

      {/* Changelog Panel */}
      {changelogOpen && (
        <ChangelogPanel
          changelog={store.changelog}
          onClose={() => setChangelogOpen(false)}
          onExport={store.exportChangesAsJson}
          onClear={store.clearChanges}
          lang={lang}
        />
      )}
    </main>
  );
}
