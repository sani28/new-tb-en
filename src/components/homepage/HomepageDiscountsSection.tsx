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
      <section className="discounts">
        <h2>Discounts</h2>
        <div className="discounts-grid">

          {cards.map((card) => {
            const affiliate = slugifyAffiliateName(card.name);
            return (
              <a
                key={card.name}
                className="discount-card"
                href={`/discounts?affiliate=${encodeURIComponent(affiliate)}`}
              >
                <img src={card.img} alt={card.name} />
                <div className="card-content">
                  <div className="card-text">
                    <h3>{card.name}</h3>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
