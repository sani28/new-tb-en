import type { Metadata } from "next";
import BlogContent from "./BlogContent";

export const metadata: Metadata = {
  title: "Discover - Seoul City Tour Tiger Bus",
};

export default function Page() {
  return (
    <main>
      {/* No banner header — blog page hides it (matches legacy) */}
      <div className="bg-white rounded-t-[20px] px-10 py-10 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] max-w-[1400px] mx-auto mt-20 max-md:px-5 max-md:py-5 max-md:mt-[45px]">
        <BlogContent />
      </div>
    </main>
  );
}
