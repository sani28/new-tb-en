/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import NoticesContent from "./NoticesContent";

export const metadata: Metadata = {
  title: "Notices - Seoul City Tour Tiger Bus",
};

export default function Page() {
  return (
    <main>
      {/* Template Header / Banner */}
      <header className="relative w-full mt-5 h-[400px] flex items-end max-md:mt-[45px] max-md:h-[300px]">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-full bg-cover bg-center bg-no-repeat z-[1]"
          style={{ backgroundImage: "url('/imgs/banner-inquire.png')" }}
        />
      </header>

      {/* Content container — overlaps the banner */}
      <div className="relative mt-[10px] z-[3] w-full max-md:-mt-[70px]">
        <div className="bg-white rounded-t-[20px] px-10 py-10 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] max-w-[1400px] mx-auto relative z-[3] max-md:px-5 max-md:py-5">
          <NoticesContent />
        </div>
      </div>
    </main>
  );
}
