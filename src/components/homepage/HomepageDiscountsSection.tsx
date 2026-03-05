/* eslint-disable @next/next/no-img-element */

function slugifyAffiliateName(name: string) {
  return (name || "")
    .toLowerCase()
    .trim()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function HomepageDiscountsSection() {
  const cards = [
    { name: "Bangtae Makguksu", img: "/imgs/discount-1.png" },
    { name: "Ganga", img: "/imgs/discount-2.png" },
    { name: "Haus", img: "/imgs/discount-3.png" },
    { name: "Gwangho", img: "/imgs/discount-4.png" },
    { name: "Kansong Museum", img: "/imgs/discount-5.png" },
    { name: "Mom's Touch", img: "/imgs/discount-6.png" },
    { name: "ZAMSHH", img: "/imgs/discount-7.png" },
    { name: "Gwanghwamun Hansang", img: "/imgs/discount-8.png" },
  ];

  return (
    <>
      <section className="py-20 px-10 max-md:py-10 max-md:px-5 xl:px-[10%] 2xl:px-[15%] min-[2000px]:px-[20%] bg-brand-cream">
        <div className="max-w-[1200px] mx-auto">
        <h2 className="font-sans-semibold text-[32px] mb-10 text-text-dark">
          Discounts
        </h2>
        <div className="grid grid-cols-4 gap-5 max-md:grid-cols-2 max-md:gap-[15px]">
          {cards.map((card) => {
            const affiliate = slugifyAffiliateName(card.name);
            return (
              <a
                key={card.name}
                className="relative rounded-xl overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] block"
                href={`/discounts?affiliate=${encodeURIComponent(affiliate)}`}
              >
                <div className="relative">
                  <img
                    src={card.img}
                    alt={card.name}
                    className="w-full aspect-square object-cover"
                  />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white/90 text-xs font-mono px-2 py-0.5 rounded pointer-events-none z-10 select-none">300×300px</span>
                </div>
                <div className="p-[15px] flex justify-between items-start gap-2.5 max-md:p-3">
                  <div className="min-w-0 flex flex-col gap-1">
                    <h3 className="text-base text-text-dark m-0 max-md:text-sm">
                      {card.name}
                    </h3>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
        </div>
      </section>
    </>
  );
}
