import type { Cleanup } from "./types";

export function initCoursesScrollVisibility(): Cleanup {
  const coursesSection = document.querySelector<HTMLElement>(".courses");
  if (!coursesSection) return () => {};

  const checkSectionVisibility = () => {
    const rect = coursesSection.getBoundingClientRect();
    const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;
    coursesSection.classList.toggle("out-of-view", !isInView);
  };

  window.addEventListener("scroll", checkSectionVisibility);
  window.addEventListener("resize", checkSectionVisibility);
  checkSectionVisibility();

  return () => {
    window.removeEventListener("scroll", checkSectionVisibility);
    window.removeEventListener("resize", checkSectionVisibility);
  };
}
