import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function QueryParams() {
  const [page, setPage] = useState<number>(1);
  const [sortOption, setSortOption] = useState<string>("standard");
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [searchWord, setSearchword] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname === "/") {
      const currentType = searchParams.get("type") || "all";
      setActiveFilter(currentType);
      setSearchword("");
    } else if (pathname.startsWith("/search")) {
      const currentType = searchParams.get("type") || "multi";
      setActiveFilter(currentType);
      const queryWord = searchParams.get("query") || "";
      setSearchword(queryWord);
    } else if (pathname.startsWith("/genres")) {
      setActiveFilter("");
      setSearchword("");
    }
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    setPage(currentPage);

    const currentSortOption = searchParams.get("sort") || "standard";
    setSortOption(currentSortOption);
  }, [searchParams, pathname]);

  useEffect(() => {
    const query = new URLSearchParams();
    if (pathname.startsWith("/search")) {
      if (searchWord !== "") query.set("query", searchWord);
      if (activeFilter !== "") query.set("type", activeFilter);
    } else if (pathname === "/") {
      if (activeFilter !== "") query.set("type", activeFilter);
    }
    query.set("page", page.toString());
    query.set("sort", sortOption);
    router.push(`?${query.toString()}`);
  }, [sortOption, page, router, activeFilter, searchWord, pathname]);

  return {
    page,
    sortOption,
    activeFilter,
    searchWord,
    setPage,
    setSortOption,
    setActiveFilter,
  };
}

export default QueryParams;
