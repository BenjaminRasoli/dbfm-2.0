import { PageSelectorProps } from "./PaceSelector.Types";

function PageSelector({
  currentPage,
  totalPages,
  onPageChange,
}: PageSelectorProps) {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderButton = (label: string, page: number, isDisabled: boolean) => (
    <button
      onClick={() => handlePageChange(page)}
      disabled={isDisabled}
      className="px-4 py-2 bg-blue text-white rounded cursor-pointer hover:bg-blue-hover"
    >
      {label}
    </button>
  );

  return (
    <div className="flex justify-center space-x-2 mt-4">
      {renderButton("First", 1, currentPage === 1)}
      {renderButton("Prev", currentPage - 1, currentPage === 1)}
      <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
      {renderButton("Next", currentPage + 1, currentPage === totalPages)}
      {renderButton("Last", totalPages, currentPage === totalPages)}
    </div>
  );
}

export default PageSelector;
