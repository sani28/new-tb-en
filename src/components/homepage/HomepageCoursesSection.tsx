/* eslint-disable @next/next/no-img-element */

const DIM_LABEL_TOUR = "1200×600px";
const DIM_LABEL_CARD = "400×280px";
const DIM_LABEL_ICON = "80×80px";

const dimLabel = (text: string) => (
  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white/90 text-xs font-mono px-2 py-0.5 rounded pointer-events-none z-10 select-none">
    {text}
  </span>
);

// Shared sub-classes
// "card-more-info-btn" is a JS selector hook (promoCheckoutFlow.ts)
const addonAddToCartClass =
  "more-info card-more-info-btn ml-0 inline-flex w-full items-center justify-center rounded-md bg-[var(--color-brand-red)] px-3 py-2 text-sm font-bold text-white no-underline transition-colors hover:bg-[var(--color-brand-dark-red)] hover:text-white visited:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2";

// Tour 01 add-on cards sit on a dark background — enforce white text
const tour01AddonCardClass = "card bg-white rounded-xl overflow-hidden shadow-sm text-left";
const tour01AddonTitleClass = "card-title text-left text-[#000]";
const tour01AddonDescClass = "text-left text-[#555]";

// Card nav buttons (.card-prev / .card-next are JS selector hooks in cardCarousels.ts)
const cardNavBase =
  "card-carousel-nav absolute top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/45 border-none cursor-pointer z-[10] text-white transition-opacity max-md:w-7 max-md:h-7 max-md:bg-black/55";

// ── Pricing block ───────────────────────────────────────────────────────────
function PriceRow({
  label,
  original,
  sale,
}: {
  label: string;
  original: string;
  sale: string;
}) {
  return (
    <div className="flex justify-between items-center w-full gap-2 text-[13px] text-white">
      <span className="shrink-0">{label}</span>
      <div className="flex flex-col gap-0.5 shrink-0 text-right">
        <span className="text-[11px] text-white/60">
          <span>from </span>
          <span className="line-through">{original}</span>
        </span>
        <span className="text-[19px] text-white font-semibold flex items-center gap-1">
          <span className="bg-brand-red px-1.5 py-0.5 rounded text-sm whitespace-nowrap">{sale}</span>
        </span>
      </div>
    </div>
  );
}

function PricingBlock({
  adultOriginal,
  adultSale,
  childOriginal,
  childSale,
}: {
  adultOriginal: string;
  adultSale: string;
  childOriginal: string;
  childSale: string;
}) {
  return (
    <div className="my-1 w-full">
      <PriceRow label="Adult" original={adultOriginal} sale={adultSale} />
      <hr className="my-1.5 border-0 border-t border-white/10" />
      <PriceRow label="Children" original={childOriginal} sale={childSale} />
    </div>
  );
}

// ── Tour info item ───────────────────────────────────────────────────────────
function InfoItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3 text-[13px] text-white">
      <i className={`${icon} w-4 text-center text-[#FF6B6B] shrink-0`} />
      <span className="flex-1 leading-[1.3] text-white">{text}</span>
    </div>
  );
}

// ── Content panel (absolutely positioned on desktop, stacked on mobile/tablet) ──
function ContentPanel({
  title,
  children,
  style,
}: {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="homepage-carousel-content absolute top-5 right-5 w-[calc(35%+60px)] max-w-[380px] flex flex-col gap-3 h-fit p-5 bg-[rgba(0,28,44,0.95)] rounded-xl overflow-hidden text-left box-border max-[1199px]:relative max-[1199px]:top-auto max-[1199px]:right-auto max-[1199px]:w-full max-[1199px]:max-w-full max-[1199px]:rounded-t-none max-md:p-5 max-md:bg-[rgba(16,24,64,0.95)]"
      style={style}
    >
      <h2 className="text-2xl m-0 leading-tight text-white">{title}</h2>
      {children}
    </div>
  );
}

// ── Action buttons ───────────────────────────────────────────────────────────
function ActionButtons({
  moreInfoHref,
  bookHref,
  moreInfoClass,
  bookClass,
}: {
  moreInfoHref: string;
  bookHref: string;
  moreInfoClass?: string;
  bookClass?: string;
}) {
  return (
    <div className="mt-auto flex flex-row gap-2 w-full">
      <a
        href={moreInfoHref}
        className={`more-info-btn flex-1 flex items-center justify-center px-3 py-2 text-[12px] text-center text-white no-underline rounded-md border border-white/60 bg-white/10 whitespace-nowrap hover:bg-white/20 transition-colors ${moreInfoClass ?? ""}`}
      >
        More Info
      </a>
      <a
        href={bookHref}
        className={`book-ticket-btn flex-1 flex items-center justify-center px-3 py-2 text-[12px] text-center text-white no-underline rounded-md bg-brand-red border border-brand-red whitespace-nowrap hover:bg-brand-dark-red transition-colors ${bookClass ?? ""}`}
      >
        Book Ticket
      </a>
    </div>
  );
}

// ── Add-on card ──────────────────────────────────────────────────────────────
function AddonCard({
  productId,
  imgSrc,
  imgAlt,
  number,
  title,
  description,
  cardClass = "card bg-white rounded-xl overflow-hidden shadow-sm",
  titleClass = "card-title text-[#000] font-bold text-[15px] tracking-tight leading-tight m-0 pt-3 px-[15px]",
  descClass = "text-[#555] text-xs px-[15px] pt-1.5 pb-0",
}: {
  productId: string;
  imgSrc: string;
  imgAlt: string;
  number: number;
  title: string;
  description: string;
  cardClass?: string;
  titleClass?: string;
  descClass?: string;
}) {
  return (
    <div className={cardClass} data-product-id={productId}>
      <div className="card-image relative overflow-hidden">
        <div className="card-number absolute top-2 left-2 w-[26px] h-[26px] bg-brand-red text-white rounded-full flex items-center justify-center text-[13px] font-bold z-[2] shadow-sm leading-none">
          {number}
        </div>
        <div className="relative">
          <img src={imgSrc} alt={imgAlt} className="w-full h-auto" />
          {dimLabel(DIM_LABEL_CARD)}
        </div>
      </div>
      <h4 className={titleClass}>{title}</h4>
      <p className={descClass}>{description}</p>
      <div className="card-actions flex justify-start px-[15px] pt-2.5 pb-3.5 max-md:px-3 max-md:pt-2 max-md:pb-3">
        <a href="#" className={addonAddToCartClass}>
          Add to Cart
        </a>
      </div>
    </div>
  );
}

// ── Card carousel section ────────────────────────────────────────────────────
function CardSection({
  carouselId,
  children,
}: {
  carouselId: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-section w-[70%] max-w-[770px] mx-auto mt-[60px] pb-[40px] relative z-[5] grid grid-cols-3 gap-5 max-[1199px]:w-[90%] max-[1199px]:max-w-[900px] max-[1199px]:mt-[30px] min-[1200px]:max-[1599px]:w-[80%] min-[1200px]:max-[1599px]:max-w-[900px] min-[1200px]:max-[1599px]:mt-[40px] min-[1600px]:mt-[60px]">
      <h3 className="card-section-title col-span-3 text-white text-2xl font-semibold text-center z-[6] w-full m-0 mb-2 whitespace-nowrap max-[1199px]:text-xl max-md:text-sm max-md:font-bold max-md:py-[15px] max-md:whitespace-normal">
        Enhance your experience with...
      </h3>
      {/* Card carousel — .card-carousel-container and .card-carousel-track are JS selector hooks */}
      <div className="card-carousel-wrapper relative flex items-center w-full col-span-3 overflow-visible max-md:!p-0">
        <button
          className={`${cardNavBase} card-prev left-5 max-md:left-1`}
          data-carousel={carouselId}
        >
          <i className="fas fa-chevron-left text-white" />
        </button>
        <div className="card-carousel-container overflow-hidden w-full" id={carouselId}>
          <div className="card-carousel-track">
            {children}
          </div>
        </div>
        <button
          className={`${cardNavBase} card-next right-5 max-md:right-1`}
          data-carousel={carouselId}
        >
          <i className="fas fa-chevron-right text-white" />
        </button>
      </div>
    </div>
  );
}

export default function HomepageCoursesSection() {
  return (
    <>
      {/* ── Course Section ──
          .courses → JS hook: coursesVisibility.ts (visibility detection + out-of-view class)
          data-slide-colors → JS hook: courseCarousel.ts (sets inline backgroundColor) */}
      <section
        className="courses relative w-full p-0 z-[3] -mt-[60px] transition-colors duration-500"
        data-slide-colors='["#001C2C", "#FCD700", "#C41E3A"]'
      >
        {/* .courses-inner → JS hook: courseCarousel.ts sets inline backgroundColor */}
        <div
          className="courses-inner relative w-full mx-0 pt-[30px] pb-[40px] bg-[#001C2C] rounded-t-[30px] z-[2] transition-colors duration-500 max-[1199px]:px-4 max-[1199px]:box-border"
          data-slide-colors='["#001C2C", "#FCD700", "#C41E3A"]'
        >
          {/* .homepage-carousel wrapper */}
          <div
            className="homepage-carousel relative w-full max-w-[1200px] mx-auto rounded-xl max-md:rounded-xl"
            data-slide-colors='["#001C2C", "#FCD700", "#C41E3A"]'
          >
            {/* .homepage-carousel-container → JS hook: courseCarousel.ts */}
            <div
              className="homepage-carousel-container relative w-full max-w-full overflow-visible rounded-xl max-md:rounded-xl"
              data-slide-colors='["#001C2C", "#FCD700", "#C41E3A"]'
            >
              {/* .homepage-carousel-slides — flex container */}
              <div className="homepage-carousel-slides flex w-full">

                {/* ── Slide 1: Tour 01 Downtown Palace Course ── */}
                {/* .homepage-carousel-slide + .active → JS hook: courseCarousel.ts toggles active */}
                <div className="homepage-carousel-slide active">
                  <div className="slide-content relative">
                    {/* .tour-label-fixed → JS hook: bookingModal.ts + promoCheckoutFlow.ts */}
                    <div className="tour-label-fixed absolute top-5 left-5 px-4 py-2 bg-brand-red text-white font-semibold text-base rounded z-[10] shadow-sm">
                      TOUR 01
                    </div>
                    <div className="relative w-full">
                      <div className="relative">
                        <img src="/imgs/tour01home.png" alt="Downtown Palace Course" className="w-full h-auto object-cover max-[1199px]:rounded-t-xl" />
                        {dimLabel(DIM_LABEL_TOUR)}
                      </div>
                    </div>
                    <ContentPanel title="Hop on, Hop off anytime!">
                      <div className="flex flex-col gap-1.5 my-2">
                        <InfoItem icon="fas fa-clock" text="First Bus: 9:20AM | Last bus: 4:50pm" />
                        <InfoItem icon="fas fa-hourglass-half" text="Interval: Every 30 Minutes" />
                        <InfoItem icon="fas fa-route" text="Total Course Time: 1hr 30 min" />
                      </div>
                      <PricingBlock adultOriginal="$45.00" adultSale="$32.00" childOriginal="$32.00" childSale="$23.00" />
                      <ActionButtons moreInfoHref="/tours" bookHref="/booking?tour=tour01" />
                    </ContentPanel>
                  </div>

                  <CardSection carouselId="tour01-cards">
                    <AddonCard productId="kwangjuyo" imgSrc="/imgs/kwangjuyo.png" imgAlt="Kwangjuyo" number={1} title="Kwangjuyo" description="Experience traditional Korean ceramics at the renowned Kwangjuyo pottery studio." cardClass={tour01AddonCardClass} titleClass={tour01AddonTitleClass} descClass={tour01AddonDescClass} />
                    <AddonCard productId="museum-pass" imgSrc="/imgs/monet-addon.png" imgAlt="Museum Pass" number={2} title="Museum Pass" description="Get access to multiple museums with our exclusive museum pass package." cardClass={tour01AddonCardClass} titleClass={tour01AddonTitleClass} descClass={tour01AddonDescClass} />
                    <AddonCard productId="sejong-backstage" imgSrc="/imgs/sejong-addon.png" imgAlt="Sejong Centre Backstage Pass" number={3} title="Sejong Centre Backstage Pass" description="Go behind the scenes at the prestigious Sejong Center for the Performing Arts." cardClass={tour01AddonCardClass} titleClass={tour01AddonTitleClass} descClass={tour01AddonDescClass} />
                    <AddonCard productId="hanbok-rental" imgSrc="/imgs/hanbok-addon.png" imgAlt="Hanbok Rental" number={4} title="Hanbok Rental" description="Dress up in beautiful traditional Korean attire and explore the palaces in style." cardClass={tour01AddonCardClass} titleClass={tour01AddonTitleClass} descClass={tour01AddonDescClass} />
                  </CardSection>
                </div>

                {/* ── Slide 2: Tour 04 Night View Course ── */}
                <div className="homepage-carousel-slide">
                  <div className="slide-content relative">
                    <div className="tour-label-fixed absolute top-5 left-5 px-4 py-2 bg-brand-red text-white font-semibold text-base rounded z-[10] shadow-sm">
                      TOUR 04
                    </div>
                    <div className="relative w-full">
                      <div className="relative">
                        <img src="/imgs/tour04home.png" alt="Night View Course" className="w-full h-auto object-cover max-[1199px]:rounded-t-xl" />
                        {dimLabel(DIM_LABEL_TOUR)}
                      </div>
                    </div>
                    <ContentPanel title="Sparkling Night Views">
                      <div className="flex flex-col gap-1.5 my-2">
                        <InfoItem icon="fas fa-route" text="Non Stop Course" />
                        <InfoItem icon="fas fa-clock" text="Departure time: 7:00pm" />
                        <InfoItem icon="fas fa-camera" text="30 Min Photo Time at N Seoul Tower" />
                        <InfoItem icon="fas fa-hourglass-half" text="Total time: ~1 hour" />
                      </div>
                      <PricingBlock adultOriginal="$36.00" adultSale="$26.00" childOriginal="$22.00" childSale="$16.00" />
                      <ActionButtons moreInfoHref="/tour04" bookHref="/booking?tour=tour04" />
                    </ContentPanel>
                  </div>

                  <CardSection carouselId="tour04-cards">
                    <AddonCard productId="kwangjuyo" imgSrc="/imgs/kwangjuyo.png" imgAlt="Kwangjuyo" number={1} title="Kwangjuyo" description="Experience traditional Korean ceramics at the renowned Kwangjuyo pottery studio." />
                    <AddonCard productId="hanbok-rental" imgSrc="/imgs/hanbok-addon.png" imgAlt="Hanbok Rental" number={2} title="Hanbok Rental" description="Dress up in beautiful traditional Korean attire and explore the palaces in style." />
                  </CardSection>
                </div>

                {/* ── Slide 3: Tour 02 Panorama Course ── */}
                <div className="homepage-carousel-slide">
                  <div className="slide-content relative bg-[#C41E3A]">
                    <div className="tour-label-fixed absolute top-5 left-5 px-4 py-2 bg-brand-red text-white font-semibold text-base rounded z-[10] shadow-sm">
                      TOUR 02
                    </div>
                    <div className="relative w-full">
                      <div className="relative">
                        <img src="/imgs/panorama.png" alt="Panorama Course" className="w-full h-auto object-cover max-[1199px]:rounded-t-xl" />
                        {dimLabel(DIM_LABEL_TOUR)}
                      </div>
                    </div>
                    <ContentPanel
                      title="Panorama Course"
                      style={{ background: "rgba(226, 60, 80, 0.80)" }}
                    >
                      <div className="flex flex-col gap-1.5 my-2">
                        <InfoItem icon="fas fa-clock" text="First Bus: 10:00AM | Last bus: 5:00pm" />
                        <InfoItem icon="fas fa-hourglass-half" text="Interval: Every 45 Minutes" />
                        <InfoItem icon="fas fa-route" text="Total Course Time: 2hr 00 min" />
                      </div>
                      <PricingBlock adultOriginal="$50.00" adultSale="$38.00" childOriginal="$38.00" childSale="$28.00" />
                      <ActionButtons
                        moreInfoHref="#"
                        bookHref="/booking?tour=tour02"
                        bookClass="max-md:!bg-[#8B0000] max-md:!border-[#8B0000]"
                      />
                    </ContentPanel>
                  </div>

                  <div className="card-section bg-[#C41E3A] w-[70%] max-w-[770px] mx-auto mt-[60px] pb-[40px] relative z-[5] grid grid-cols-3 gap-5 max-[1199px]:w-[90%] max-[1199px]:mt-[30px] min-[1200px]:max-[1599px]:w-[80%] min-[1200px]:max-[1599px]:mt-[40px]">
                    <h3 className="card-section-title col-span-3 text-white text-2xl font-semibold text-center z-[6] w-full m-0 mb-2 whitespace-nowrap max-[1199px]:text-xl max-md:text-sm max-md:font-bold max-md:py-[15px] max-md:whitespace-normal">
                      Enhance your experience with...
                    </h3>
                    <div className="card-carousel-wrapper relative flex items-center w-full col-span-3 overflow-visible max-md:!p-0">
                      <button className={`${cardNavBase} card-prev left-5 max-md:left-1`} data-carousel="tour02-cards">
                        <i className="fas fa-chevron-left text-white" />
                      </button>
                      <div className="card-carousel-container overflow-hidden w-full" id="tour02-cards">
                        <div className="card-carousel-track">
                          <AddonCard productId="kwangjuyo" imgSrc="/imgs/kwangjuyo.png" imgAlt="Kwangjuyo" number={1} title="Kwangjuyo" description="Experience traditional Korean ceramics at the renowned Kwangjuyo pottery studio." />
                          <AddonCard productId="han-river-cruise" imgSrc="/imgs/daycruise.png" imgAlt="Han River Cruise" number={3} title="Han River Cruise" description="Enjoy a scenic cruise along the beautiful Han River with stunning city views." />
                          <AddonCard productId="hanbok-rental" imgSrc="/imgs/hanbok-addon.png" imgAlt="Hanbok Rental" number={4} title="Hanbok Rental" description="Dress up in beautiful traditional Korean attire and explore the palaces in style." />
                        </div>
                      </div>
                      <button className={`${cardNavBase} card-next right-5 max-md:right-1`} data-carousel="tour02-cards">
                        <i className="fas fa-chevron-right text-white" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>{/* end .homepage-carousel-slides */}
            </div>{/* end .homepage-carousel-container */}

            {/* ── Carousel navigation ──
                .carousel-nav.prev / .carousel-nav.next → JS hooks: courseCarousel.ts */}
            <button className="carousel-nav prev absolute top-[200px] -translate-y-1/2 left-5 w-10 h-10 flex items-center justify-center rounded-full bg-black/45 border-none text-white cursor-pointer z-[10] hover:bg-[rgba(58,58,58,1)] hover:scale-105 transition-all max-md:top-[25%] max-md:left-2.5 max-md:w-9 max-md:h-9">
              <i className="fas fa-chevron-left" />
            </button>
            <button className="carousel-nav next absolute top-[200px] -translate-y-1/2 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-black/45 border-none text-white cursor-pointer z-[10] hover:bg-[rgba(58,58,58,1)] hover:scale-105 transition-all max-md:top-[25%] max-md:right-2.5 max-md:w-9 max-md:h-9">
              <i className="fas fa-chevron-right" />
            </button>

            {/* ── Carousel dots ──
                .carousel-dots .dot → JS hooks: courseCarousel.ts toggles .active */}
            <div className="carousel-dots flex justify-center gap-2 my-4">
              <span className="dot active w-2 h-2 rounded-full bg-white/40 cursor-pointer transition-colors" />
              <span className="dot w-2 h-2 rounded-full bg-white/40 cursor-pointer transition-colors" />
              <span className="dot w-2 h-2 rounded-full bg-white/40 cursor-pointer transition-colors" />
            </div>

          </div>{/* end .homepage-carousel */}
        </div>{/* end .courses-inner */}
      </section>

      {/* ── Bus Features ── */}
      <div className="text-center mt-0 bg-[#FF0019] w-full py-10 px-0 max-md:py-[30px] max-md:px-[15px]">
        <div className="max-w-[1200px] mx-auto">
          <h3 className="text-[32px] mb-10 text-white max-md:text-2xl max-md:mb-5 max-md:text-left">Bus Features</h3>
          <div className="flex justify-center gap-[60px] max-md:justify-between max-md:gap-2">
            {[
              { img: "/imgs/1.png", label: "Free Audio", alt: "Free Audio Guide" },
              { img: "/imgs/2.png", label: "Free USB", alt: "Free USB Charger" },
              { img: "/imgs/3.png", label: "Double Decker", alt: "Double Decker Bus" },
              { img: "/imgs/4.png", label: "Single Decker", alt: "Single Decker Bus" },
              { img: "/imgs/5.png", label: "Free Wi-Fi", alt: "Free Wi-Fi" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-4 max-md:flex-[0_1_18%] max-md:gap-1">
                <div className="relative inline-block">
                  <img
                    src={f.img}
                    alt={f.alt}
                    className="w-20 h-20 p-4 bg-white rounded-full object-contain max-[1200px]:w-[50px] max-[1200px]:h-[50px] max-[1200px]:p-3 max-md:w-[50px] max-md:h-[50px] max-md:p-1.5"
                  />
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/60 text-white/90 text-[9px] font-mono px-1 py-0.5 rounded pointer-events-none z-10 select-none whitespace-nowrap">
                    {DIM_LABEL_ICON}
                  </span>
                </div>
                <span className="text-base whitespace-nowrap text-white max-[1200px]:text-sm max-md:text-[10px] max-md:leading-[1.2]">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
