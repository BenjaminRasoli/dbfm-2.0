import { JSX } from "react";
import clsx from "clsx";
import {
  PageSelectorTypes,
  RenderButtonsTypes,
} from "@/app/Types/PageSelectorTypes";

function PageSelector({
  currentPage,
  totalPages,
  onPageChange,
}: PageSelectorTypes) {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      window.scroll(0, 0);
      onPageChange(page);
    }
  };

  const renderButton = ({
    label,
    page,
    isDisabled,
  }: RenderButtonsTypes): JSX.Element => (
    <button
      onClick={() => handlePageChange(page)}
      disabled={isDisabled}
      className={clsx(
        "px-2 lg:px-6 py-1 lg:py-3 bg-blue text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:bg-blue-hover ring-2 ring-white ring-opacity-50", // white outline
        {
          "cursor-not-allowed bg-red hover:bg-red ring-0 ": isDisabled,
          "bg-blue hover:bg-blue-hover cursor-pointer hover:scale-105":
            !isDisabled,
        }
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="flex justify-center space-x-2 mt-4">
      {renderButton({ label: "First", page: 1, isDisabled: currentPage === 1 })}
      {renderButton({
        label: "Prev",
        page: currentPage - 1,
        isDisabled: currentPage === 1,
      })}
      <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
      {renderButton({
        label: "Next",
        page: currentPage + 1,
        isDisabled: currentPage === totalPages,
      })}
      {renderButton({
        label: "Last",
        page: totalPages,
        isDisabled: currentPage === totalPages,
      })}
    </div>
  );
}

export default PageSelector;
