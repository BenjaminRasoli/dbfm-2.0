import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function QueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchWordParam = searchParams.get("query") || "";

  const [page, setPage] = useState<number>(1);
  const [sortOption, setSortOption] = useState<string>("standard");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchWord, setSearchWord] = useState<string>(searchWordParam);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (
      pathname === "/" ||
      pathname === "/favorites" ||
      pathname === "/watched"
    ) {
      const currentType = searchParams.get("type") || "all";
      setActiveFilter(currentType);
      setSearchWord("");
    } else if (pathname.startsWith("/search")) {
      const currentType = searchParams.get("type") || "multi";
      setActiveFilter(currentType);
      setSearchWord(searchWordParam);
    } else if (pathname.startsWith("/genres")) {
      setActiveFilter("");
      setSearchWord("");
    }

    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    setPage(currentPage);

    const currentSortOption = searchParams.get("sort") || "standard";
    setSortOption(currentSortOption);

    setInitialized(true);
  }, [pathname, searchParams, searchWordParam]);

  useEffect(() => {
    if (!initialized) return;

    const query = new URLSearchParams();

    if (pathname.startsWith("/search")) {
      if (searchWord) query.set("query", searchWord);
      if (activeFilter) query.set("type", activeFilter);
    } else if (
      pathname === "/" ||
      pathname === "/favorites" ||
      pathname === "/watched"
    ) {
      if (activeFilter) query.set("type", activeFilter);
    }

    query.set("page", page.toString());
    query.set("sort", sortOption);

    router.replace(`?${query.toString()}`);
  }, [
    initialized,
    sortOption,
    page,
    activeFilter,
    searchWord,
    pathname,
    router,
  ]);

  return {
    page,
    sortOption,
    activeFilter,
    searchWord,
    setPage,
    setSortOption,
    setActiveFilter,
    setSearchWord,
    initialized,
  };
}

export default QueryParams;
