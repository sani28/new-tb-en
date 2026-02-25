/* eslint-disable @next/next/no-img-element */

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left Footer ection */}
        <div className="footer-left">
          <div className="footer-logo">
            <img src="/imgs/redlogo-tigerbus.png" alt="Tiger Bus Logo" />
          </div>
          <div className="footer-info">
            <p>
	              302, 135-7, Sejong-daero, Jung-gu, Seoul
	              <br />
	              Jinyong Kil, CEO of Seoul City Tour Bus Co., Ltd.
            </p>
            <p>Business registration number 104-81-27542</p>
            <p>Telecommunication sales report number 2005-Jung-gu, Seoul-03675</p>
          </div>
        </div>

        {/* Middle Footer Section */}
	        <div className="footer-nav">
	          <ul>
	            <li>
	              <a href="/privacy-policy">Privacy Policy</a>
	            </li>
	            <li>
	              <a href="/contact-us">Contact Us</a>
	            </li>
	            <li>
	              <a href="/about-us">About Us</a>
	            </li>
	            <li>
	              <a href="/business-inquiry">Business Inquiry</a>
	            </li>
	          </ul>
	        </div>

        {/* Right Footer Section */}
        <div className="footer-right">
          <div className="social-links">
            <a href="#" className="social-icon">
              <img src="/imgs/footericon-1.png" alt="Instagram" />
            </a>
            <a href="#" className="social-icon">
              <img src="/imgs/footericon-2.png" alt="Visit Seoul" />
            </a>
            <a href="#" className="social-icon">
              <img src="/imgs/footericon-3.png" alt="Blog" />
            </a>
          </div>
          <div className="contact-info">
            <p className="footer-contact-label">
              Gwanghwamun Main Office Customer Inquiries
            </p>
            <p className="footer-phone-number">02-777-6090</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-info">{/* Empty in current version */}</div>
        <div className="footer-illustration">
          <img src="/imgs/footerimg.png" alt="Seoul City Illustration" />
        </div>
      </div>
    </footer>
  );
}
