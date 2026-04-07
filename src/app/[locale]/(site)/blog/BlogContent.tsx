/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

/* ── Data ─────────────────────────────────────────────────────────────────── */

type BlogPost = {
  id: number;
  image: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
};

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    image: "/imgs/blog/blog1.jpg",
    title: "Title",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    category: "Category",
    date: "Date",
  },
  {
    id: 2,
    image: "/imgs/blog/blog2.jpg",
    title: "Title",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    category: "Category",
    date: "Date",
  },
  {
    id: 3,
    image: "/imgs/blog/blog3.jpg",
    title: "Title",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    category: "Category",
    date: "Date",
  },
  {
    id: 4,
    image: "/imgs/blog/blog4.jpg",
    title: "Title",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    category: "Category",
    date: "Date",
  },
  {
    id: 5,
    image: "/imgs/blog/blog5.jpg",
    title: "Title",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    category: "Category",
    date: "Date",
  },
  {
    id: 6,
    image: "/imgs/blog/blog6.jpg",
    title: "Title",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    category: "Category",
    date: "Date",
  },
];

const TOTAL_PAGES = 5;

/* ── Component ────────────────────────────────────────────────────────────── */

export default function BlogContent() {
  const [page, setPage] = useState(1);

  return (
    <>
      {/* Header */}
      <div className="mb-10 max-md:mb-[30px]">
        <h1 className="text-[32px] text-[#333] m-0 max-md:text-[28px]">Discover</h1>
      </div>

      {/* Blog grid — 3 cols desktop, 2 cols tablet, 1 col mobile */}
      <div className="grid grid-cols-3 gap-[30px] mb-[60px] max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-5">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-[5px] group"
          >
            {/* Image */}
            <div className="w-full h-[200px] overflow-hidden max-md:h-[180px]">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-5 max-md:p-[15px]">
              <h2 className="text-[20px] text-[#333] m-0 mb-[10px] max-md:text-[18px]">
                {post.title}
              </h2>
              <p className="text-[14px] text-[#666] mb-[15px] leading-[1.5] line-clamp-3 max-md:text-[13px] max-md:mb-3">
                {post.excerpt}
              </p>
              <div className="flex justify-between items-center mb-[15px] text-[12px] text-[#999]">
                <span>{post.category}</span>
                <span>{post.date}</span>
              </div>
              <a
                href={`/blog/${post.id}`}
                className="inline-block text-[#E20021] no-underline text-[14px] font-semibold transition-colors hover:text-[#A50000]"
              >
                Read More
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-5 mt-[60px]">
        <button
          className="w-10 h-10 border-none bg-[#f8f8f8] rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-[#e5e5e5] disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <i className="fas fa-chevron-left" />
        </button>

        <div className="flex gap-[10px]">
          {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={
                "w-10 h-10 flex items-center justify-center rounded-full text-[16px] border-none cursor-pointer transition-all " +
                (n === page
                  ? "bg-[#E20021] text-white"
                  : "bg-transparent text-[#666] hover:bg-[#f8f8f8]")
              }
              onClick={() => setPage(n)}
              aria-label={`Page ${n}`}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </button>
          ))}
        </div>

        <button
          className="w-10 h-10 border-none bg-[#f8f8f8] rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-[#e5e5e5] disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
          disabled={page === TOTAL_PAGES}
          aria-label="Next page"
        >
          <i className="fas fa-chevron-right" />
        </button>
      </div>
    </>
  );
}
