/* eslint-disable @next/next/no-img-element */

export default function Footer() {
  return (
    <footer className="bg-brand-cream pt-15 max-md:pt-10 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-10 grid grid-cols-[1fr_auto_1fr] gap-15 items-start max-md:grid-cols-1 max-md:gap-[30px] max-md:px-5 max-md:text-center">
        {/* Left Footer Section */}
        <div className="max-w-[460px] max-md:text-center max-md:mx-auto">
          <div className="mb-[30px] max-md:flex max-md:justify-center max-md:mb-5">
            <img
              src="/imgs/redlogo-tigerbus.png"
              alt="Tiger Bus Logo"
              className="h-[50px] w-auto"
            />
          </div>
          <div className="text-white/70 text-sm leading-relaxed text-left max-md:text-center">
            <p>
              302, 135-7, Sejong-daero, Jung-gu, Seoul
              <br />
              Jinyong Kil, CEO of Seoul City Tour Bus Co., Ltd.
            </p>
            <p>Business registration number 104-81-27542</p>
            <p>
              Telecommunication sales report number 2005-Jung-gu, Seoul-03675
            </p>
          </div>
        </div>

        {/* Middle Footer Section */}
        <div className="max-md:text-center">
          <ul className="list-none p-0 m-0 flex flex-col gap-5 max-md:items-center">
            <li>
              <a
                href="/privacy-policy"
                className="text-brand-maroon text-xl font-sans-medium font-light max-md:text-lg max-md:leading-tight"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/contact-us"
                className="text-brand-maroon text-xl font-sans-medium font-light max-md:text-lg max-md:leading-tight"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="/about-us"
                className="text-brand-maroon text-xl font-sans-medium font-light max-md:text-lg max-md:leading-tight"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/business-inquiry"
                className="text-brand-maroon text-xl font-sans-medium font-light max-md:text-lg max-md:leading-tight"
              >
                Business Inquiry
              </a>
            </li>
          </ul>
        </div>

        {/* Right Footer Section */}
        <div className="text-right ml-auto max-md:text-center max-md:order-3 max-md:mx-auto">
          <div className="flex gap-[15px] justify-end mb-[30px] max-md:justify-center max-md:my-[30px]">
            <a
              href="#"
              className="w-[45px] h-[45px] flex items-center justify-center max-md:w-10 max-md:h-10"
            >
              <img
                src="/imgs/footericon-1.png"
                alt="Instagram"
                className="w-full h-full object-contain"
              />
            </a>
            <a
              href="#"
              className="w-[45px] h-[45px] flex items-center justify-center max-md:w-10 max-md:h-10"
            >
              <img
                src="/imgs/footericon-2.png"
                alt="Visit Seoul"
                className="w-full h-full object-contain"
              />
            </a>
            <a
              href="#"
              className="w-[45px] h-[45px] flex items-center justify-center max-md:w-10 max-md:h-10"
            >
              <img
                src="/imgs/footericon-3.png"
                alt="Blog"
                className="w-full h-full object-contain"
              />
            </a>
          </div>
          <div className="text-right max-md:text-center">
            <p className="text-text-gray text-base mb-[5px] max-md:text-lg">
              Gwanghwamun Main Office Customer Inquiries
            </p>
            <p className="text-[32px] text-text-dark font-semibold max-md:text-[32px]">
              02-777-6090
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end max-w-[1400px] mx-auto mt-10 px-10 max-md:text-center max-md:p-5">
        <div className="footer-info">{/* Empty in current version */}</div>
        <div className="flex-[0_0_50%] text-right ml-auto max-md:w-full max-md:mt-5 max-md:mx-auto">
          <img
            src="/imgs/footerimg.png"
            alt="Seoul City Illustration"
            className="w-full max-w-[700px] h-auto block ml-auto max-md:mx-auto max-md:max-w-full"
          />
        </div>
      </div>
    </footer>
  );
}
