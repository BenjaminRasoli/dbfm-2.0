import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function QueryParams() {
  const [page, setPage] = useState<number>(1);
  const [sortOption, setSortOption] = useState<string>("standard");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchWord, setSearchWord] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchWordParam = searchParams.get("query");

  useEffect(() => {
    if (pathname === "/" || pathname === "/favorites") {
      const currentType = searchParams.get("type") || "all";
      setActiveFilter(currentType);
      setSearchWord("");
    } else if (pathname.startsWith("/search")) {
      const currentType = searchParams.get("type") || "multi";
      setActiveFilter(currentType);
      const queryWord = searchParams.get("query") || "";
      setSearchWord(queryWord);
    } else if (pathname.startsWith("/genres")) {
      setActiveFilter("");
      setSearchWord("");
    }

    if (pathname !== "/favorites") {
      const currentPage = parseInt(searchParams.get("page") || "1", 10);
      setPage(currentPage);
    }

    const currentSortOption = searchParams.get("sort") || "standard";
    setSortOption(currentSortOption);
  }, [pathname, searchParams, searchWordParam]);

  useEffect(() => {
    const query = new URLSearchParams();

    if (pathname.startsWith("/search")) {
      if (searchWord !== "") query.set("query", searchWord);
      if (activeFilter !== "") query.set("type", activeFilter);
    } else if (pathname === "/" || pathname === "/favorites") {
      if (activeFilter !== "") query.set("type", activeFilter);
    }

    if (pathname !== "/favorites") {
      query.set("page", page.toString());
    }
    query.set("sort", sortOption);

    router.replace(`?${query.toString()}`);
  }, [sortOption, page, router, activeFilter, searchWord, pathname]);

  return {
    page,
    sortOption,
    activeFilter,
    searchWord,
    setPage,
    setSortOption,
    setActiveFilter,
    setSearchWord,
  };
}

export default QueryParams;
