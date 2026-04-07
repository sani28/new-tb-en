"use client";

import { useState, useMemo } from "react";
import BodyClass from "@/components/BodyClass";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
}

const ITEMS_PER_PAGE = 6;

// Static data — replace with API call when backend endpoint is ready
const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Top 10 Hidden Gems Along the Palace Route",
    excerpt:
      "Discover secret spots and local favorites along our Downtown Palace Namsan Course that most tourists miss. From hidden temple gardens to cozy traditional tea houses.",
    category: "Travel Tips",
    date: "Mar 5, 2025",
    image: "/imgs/blogimg-1.png",
  },
  {
    id: 2,
    title: "Seoul's Best Night Photography Spots",
    excerpt:
      "Capture stunning nightscapes of Seoul from the top deck of our Night View Course. We share the best camera settings and timing for each stop along the route.",
    category: "Photography",
    date: "Feb 28, 2025",
    image: "/imgs/blogimg-2.png",
  },
  {
    id: 3,
    title: "A Foodie's Guide to Gwanghwamun Area",
    excerpt:
      "From royal court cuisine to modern Korean fusion, explore the incredible dining scene around our main departure point at Gwanghwamun Square.",
    category: "Food & Drink",
    date: "Feb 20, 2025",
    image: "/imgs/blogimg-3.png",
  },
  {
    id: 4,
    title: "Cherry Blossom Season: Your Complete Guide",
    excerpt:
      "Everything you need to know about cherry blossom season in Seoul. Best viewing times, peak bloom forecasts, and the perfect bus route to catch them all.",
    category: "Seasonal",
    date: "Feb 15, 2025",
    image: "/imgs/blogimg-1.png",
  },
  {
    id: 5,
    title: "Riding the Tiger Bus with Kids",
    excerpt:
      "Family-friendly tips for making the most of your Seoul City Tour Bus experience with little ones. Must-see stops, snack spots, and photo opportunities.",
    category: "Family",
    date: "Feb 10, 2025",
    image: "/imgs/blogimg-2.png",
  },
  {
    id: 6,
    title: "History of Namsan Tower",
    excerpt:
      "From military lookout to iconic landmark, learn the fascinating history of N Seoul Tower and why it remains one of the city's most beloved attractions.",
    category: "Culture",
    date: "Feb 5, 2025",
    image: "/imgs/blogimg-3.png",
  },
];

export default function BlogPageClient() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(BLOG_POSTS.length / ITEMS_PER_PAGE);

  const paginatedPosts = useMemo(
    () =>
      BLOG_POSTS.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [currentPage]
  );

  return (
    <main className="px-10 pb-[60px] mb-[60px] max-md:px-5 max-md:pt-[80px] max-md:pb-10 max-md:mb-10">
      <BodyClass className="template-page" />
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-10 mx-auto max-w-[1400px] min-h-[500px] mt-[80px] max-md:p-5 max-md:rounded-lg">
        {/* Banner */}
        <div className="relative rounded-xl px-[30px] py-[30px] mb-10 overflow-hidden h-[150px] max-md:h-[100px] max-md:px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/imgs/banner.png"
            alt="Discover Banner Background"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        </div>

        {/* Blog Header */}
        <div className="mb-10 max-md:mb-[30px]">
          <h1 className="text-[32px] text-[#333] m-0 max-md:text-[28px]">
            Things To Do
          </h1>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-3 gap-[30px] mb-[60px] max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-5">
          {paginatedPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-[5px]"
            >
              {/* Image */}
              <div className="w-full h-[200px] overflow-hidden max-md:h-[180px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-5 max-md:p-[15px]">
                <h2 className="text-xl text-[#333] m-0 mb-2.5 max-md:text-lg">
                  {post.title}
                </h2>
                <p className="text-sm text-[#666] mb-[15px] leading-relaxed line-clamp-3 max-md:text-[13px] max-md:mb-3">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center mb-[15px] text-xs text-[#999]">
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <a
                  href="#"
                  className="inline-block text-[#E20021] no-underline text-sm font-semibold transition-colors hover:text-[#A50000]"
                >
                  Read More
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-5 mt-[60px] max-md:mt-10">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 border-none bg-[#F8F8F8] rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed max-md:w-9 max-md:h-9"
            >
              &#8249;
            </button>

            <div className="flex gap-2.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-base border-none cursor-pointer transition-all max-md:w-9 max-md:h-9 max-md:text-sm ${
                      currentPage === page
                        ? "bg-[#E20021] text-white"
                        : "text-[#666] hover:bg-[#F8F8F8]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="w-10 h-10 border-none bg-[#F8F8F8] rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed max-md:w-9 max-md:h-9"
            >
              &#8250;
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
