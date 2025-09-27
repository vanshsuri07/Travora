interface PaginationProps {
  totalRecordsCount: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const CustomPagination = ({
  totalRecordsCount,
  pageSize,
  currentPage,
  onPageChange,
  className = ""
}: PaginationProps) => {
  const totalPages = Math.ceil(totalRecordsCount / pageSize);
  
  // Don't render if there's only one page or no records
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show around current page
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Add ellipsis if gap between 1 and current page range
    if (currentPage - delta > 2) {
      pages.push('...');
    }
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i);
    }
    
    // Add ellipsis if gap between current page range and last page
    if (currentPage + delta < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center gap-2 mb-4 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors"
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'text-white bg-blue-600 hover:bg-blue-700' 
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors"
      >
        Next
      </button>

      {/* Page Info */}
      <div className="ml-4 text-sm text-gray-600">
        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalRecordsCount)} of {totalRecordsCount} results
      </div>
    </div>
  );
};

export default CustomPagination;