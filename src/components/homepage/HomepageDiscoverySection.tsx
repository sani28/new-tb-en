/* eslint-disable @next/next/no-img-element */

export default function HomepageDiscoverySection() {
  return (
    <section className="discovery">
      <div className="discovery-content">
        <h2>Discovery</h2>
        <div className="discovery-grid">
          <div className="discovery-card">
            <img src="/imgs/blogimg-1.png" alt="5 Must Visit Restaurants" />
            <h3>5 Must Visit Restaurants</h3>
            <p>
              Lorem ipsum simply dummy text of the printing and typesetting
              industry. Lorem ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled...
            </p>
            <a href="#" className="read-more">
              Read More
            </a>
          </div>
          <div className="discovery-card">
            <img src="/imgs/blogimg-2.png" alt="Hidden Gems Locals Love" />
            <h3>Hidden Gems Locals Love</h3>
            <p>
              Lorem ipsum simply dummy text of the printing and typesetting
              industry. Lorem ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled...
            </p>
            <a href="#" className="read-more">
              Read More
            </a>
          </div>
          <div className="discovery-card">
            <img src="/imgs/blogimg-3.png" alt="Best Korean Side Dishes" />
            <h3>Best Korean Side Dishes</h3>
            <p>
              Lorem ipsum simply dummy text of the printing and typesetting
              industry. Lorem ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled...
            </p>
            <a href="#" className="read-more">
              Read More
            </a>
          </div>
        </div>

        {/* Mobile Carousel Navigation */}
        <div className="carousel-nav mobile-only">
          <button className="carousel-arrow prev">←</button>
          <button className="carousel-arrow next">→</button>
        </div>
        <div className="view-all">
          <a href="#" className="view-all-link">
            View All
          </a>
        </div>
      </div>
    </section>
  );
}
