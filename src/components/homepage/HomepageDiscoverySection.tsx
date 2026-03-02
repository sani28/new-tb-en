/* eslint-disable @next/next/no-img-element */

export default function HomepageDiscoverySection() {
  return (
    <section className="discovery relative py-10 px-5 md:py-20 md:px-10 bg-brand-red text-white">
      <div className="discovery-content relative max-w-[1200px] mx-auto px-5">
        <h2 className="font-sans-semibold text-[32px] mb-10 text-white">
          Discovery
        </h2>
        <div className="discovery-grid grid grid-cols-3 gap-[30px] mb-10 max-md:flex max-md:w-full max-md:translate-x-0 max-md:transition-transform max-md:duration-300 max-md:ease-in-out max-md:gap-0 max-md:p-0">
          <div className="discovery-card flex flex-col gap-[15px] max-md:flex-none max-md:w-full max-md:items-center max-md:text-center">
            <img
              src="/imgs/blogimg-1.png"
              alt="5 Must Visit Restaurants"
              className="w-full aspect-video object-cover rounded-xl max-md:h-[300px] max-md:aspect-square max-md:rounded-none"
            />
            <h3 className="font-sans-semibold text-2xl text-white mt-[5px] max-md:text-xl max-md:mt-0 max-md:px-5">
              5 Must Visit Restaurants
            </h3>
            <p className="font-sans-regular text-base leading-relaxed text-white/90 mb-2.5 max-md:text-sm max-md:mb-0 max-md:px-5 max-md:max-w-[280px]">
              Lorem ipsum simply dummy text of the printing and typesetting
              industry. Lorem ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled...
            </p>
            <a
              href="#"
              className="text-white no-underline text-base max-md:bg-white max-md:text-brand-red max-md:px-5 max-md:py-2 max-md:rounded-[20px] max-md:text-sm max-md:my-2.5"
            >
              Read More
            </a>
          </div>
          <div className="discovery-card flex flex-col gap-[15px] max-md:flex-none max-md:w-full max-md:items-center max-md:text-center">
            <img
              src="/imgs/blogimg-2.png"
              alt="Hidden Gems Locals Love"
              className="w-full aspect-video object-cover rounded-xl max-md:h-[300px] max-md:aspect-square max-md:rounded-none"
            />
            <h3 className="font-sans-semibold text-2xl text-white mt-[5px] max-md:text-xl max-md:mt-0 max-md:px-5">
              Hidden Gems Locals Love
            </h3>
            <p className="font-sans-regular text-base leading-relaxed text-white/90 mb-2.5 max-md:text-sm max-md:mb-0 max-md:px-5 max-md:max-w-[280px]">
              Lorem ipsum simply dummy text of the printing and typesetting
              industry. Lorem ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled...
            </p>
            <a
              href="#"
              className="text-white no-underline text-base max-md:bg-white max-md:text-brand-red max-md:px-5 max-md:py-2 max-md:rounded-[20px] max-md:text-sm max-md:my-2.5"
            >
              Read More
            </a>
          </div>
          <div className="discovery-card flex flex-col gap-[15px] max-md:flex-none max-md:w-full max-md:items-center max-md:text-center">
            <img
              src="/imgs/blogimg-3.png"
              alt="Best Korean Side Dishes"
              className="w-full aspect-video object-cover rounded-xl max-md:h-[300px] max-md:aspect-square max-md:rounded-none"
            />
            <h3 className="font-sans-semibold text-2xl text-white mt-[5px] max-md:text-xl max-md:mt-0 max-md:px-5">
              Best Korean Side Dishes
            </h3>
            <p className="font-sans-regular text-base leading-relaxed text-white/90 mb-2.5 max-md:text-sm max-md:mb-0 max-md:px-5 max-md:max-w-[280px]">
              Lorem ipsum simply dummy text of the printing and typesetting
              industry. Lorem ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled...
            </p>
            <a
              href="#"
              className="text-white no-underline text-base max-md:bg-white max-md:text-brand-red max-md:px-5 max-md:py-2 max-md:rounded-[20px] max-md:text-sm max-md:my-2.5"
            >
              Read More
            </a>
          </div>
        </div>

        {/* Mobile Carousel Navigation */}
        <div className="carousel-nav mobile-only hidden max-md:!flex absolute top-1/2 left-0 right-0 -translate-y-1/2 w-full px-2.5 z-5 justify-between pointer-events-none bg-transparent">
          <button className="carousel-arrow prev pointer-events-auto w-8 h-8 bg-white border-none rounded-full flex items-center justify-center text-base text-brand-red cursor-pointer shadow-md">
            &larr;
          </button>
          <button className="carousel-arrow next pointer-events-auto w-8 h-8 bg-white border-none rounded-full flex items-center justify-center text-base text-brand-red cursor-pointer shadow-md">
            &rarr;
          </button>
        </div>
        <div className="text-center mt-10">
          <a
            href="#"
            className="font-sans-medium text-white no-underline text-lg py-3 px-6 border border-white/30 rounded-full transition-all duration-300 ease-in-out hover:bg-white/10 inline-block"
          >
            View All
          </a>
        </div>
      </div>
    </section>
  );
}
