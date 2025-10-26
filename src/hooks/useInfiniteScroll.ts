import { useEffect } from "react";

export const useInfiniteScroll = (
  loadMoreStories: (page: number) => void,
  isLoadingRef: React.MutableRefObject<boolean>,
  pageRef: React.MutableRefObject<number>,
  threshold = 300, // trigger when 300px from bottom
  debounceMs = 200 // debounce scroll events
) => {
  useEffect(() => {
    let timeoutId: number | null = null;
    let lastScrollHeight = 0;

    const nearBottom = () => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;

      // Prevent repeated triggers if scrollHeight hasn't increased
      if (pageHeight === lastScrollHeight) return false;

      if (windowHeight + scrollY >= pageHeight - threshold) {
        lastScrollHeight = pageHeight; // update only when fetching
        return true;
      }
      return false;
    };

    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        if (!isLoadingRef.current && nearBottom()) {
          // Load next page
          loadMoreStories(pageRef.current);
          pageRef.current += 1;
        }
      }, debounceMs);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadMoreStories, isLoadingRef, pageRef, threshold, debounceMs]);
};
