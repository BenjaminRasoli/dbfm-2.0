import { useEffect } from "react";
import clsx from "clsx";
import { PageSelectorTypes } from "@/app/Types/PageSelectorTypes";

function PageSelector({
  currentPage,
  totalPages,
  onPageChange,
}: PageSelectorTypes) {
  const MAX_PAGES = 500;
  const finalTotalPages = Math.min(totalPages, MAX_PAGES);

  useEffect(() => {
    if (currentPage > 500 || currentPage <= 0) {
      onPageChange(1);
    }
  }, [currentPage, finalTotalPages, onPageChange]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > finalTotalPages) page = 1;
    window.scroll(0, 0);
    onPageChange(page);
  };

  const renderPageButton = (page: number) => (
    <button
      key={page}
      onClick={() => handlePageChange(page)}
      disabled={page === currentPage}
      className={clsx(
        "px-4 lg:px-6 py-2 lg:py-3 font-semibold rounded-lg transition-all duration-300 ease-in-out transform",
        page === currentPage
          ? "bg-gray-300 text-white cursor-not-allowed opacity-50"
          : "bg-blue text-white hover:bg-blue-hover cursor-pointer"
      )}
    >
      {page}
    </button>
  );

  const generatePageButtons = () => {
    const range = 2;
    const buttons = [];

    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={clsx(
          "text-white hidden md:block px-2 lg:px-6 py-1 lg:py-3 font-semibold rounded-lg",
          currentPage === 1
            ? "cursor-not-allowed bg-red opacity-50"
            : "bg-blue  hover:bg-blue-hover cursor-pointer"
        )}
      >
        Prev
      </button>
    );

    buttons.push(renderPageButton(1));

    for (
      let i = Math.max(2, currentPage - range);
      i <= Math.min(finalTotalPages, currentPage + range);
      i++
    ) {
      buttons.push(renderPageButton(i));
    }

    if (currentPage + range < finalTotalPages - 1) {
      buttons.push(
        <span key="next-dots" className="px-2 py-2 text-gray-400">
          ...
        </span>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === finalTotalPages}
        className={clsx(
          "text-white hidden md:block px-2 lg:px-6 py-1 lg:py-3 font-semibold rounded-lg",
          currentPage === finalTotalPages
            ? "cursor-not-allowed bg-red opacity-50"
            : "bg-blue  hover:bg-blue-hover cursor-pointer"
        )}
      >
        Next
      </button>
    );

    return buttons;
  };

  return (
    <div className="flex justify-center space-x-2 mt-10">
      {generatePageButtons()}
    </div>
  );
}

export default PageSelector;
