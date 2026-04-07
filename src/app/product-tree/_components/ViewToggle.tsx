"use client";

import { t, type Lang } from "../_lib/i18n";

interface Props {
  activeView: "diagram" | "table";
  onSwitch: (view: "diagram" | "table") => void;
  lang: Lang;
}

export default function ViewToggle({ activeView, onSwitch, lang }: Props) {
  const base = "pb-2.5 px-4 text-sm font-semibold cursor-pointer transition-colors bg-transparent border-none";
  const active = `${base} text-[#E31E24] border-b-[3px] border-[#E31E24]`;
  const inactive = `${base} text-[#666] hover:text-[#E31E24] border-b-[3px] border-transparent`;

  return (
    <div className="flex justify-center gap-2.5 mb-[30px] border-b border-[#e5e5e5] pb-0">
      <button className={activeView === "diagram" ? active : inactive} onClick={() => onSwitch("diagram")}>
        <i className="fas fa-project-diagram mr-1.5" /> {t("view.diagram", lang)}
      </button>
      <button className={activeView === "table" ? active : inactive} onClick={() => onSwitch("table")}>
        <i className="fas fa-table mr-1.5" /> {t("view.table", lang)}
      </button>
    </div>
  );
}
