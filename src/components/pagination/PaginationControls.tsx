'use client';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onNextPage,
  onPreviousPage,
  className = ''
}: PaginationControlsProps) {
  // Generate visible page numbers
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate start and end of middle section
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);
    
    // Add ellipsis if there's a gap after first page
    if (start > 2) {
      pages.push('...');
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if there's a gap before last page
    if (end < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page (if it's not the same as first page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        className={`
          px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
          ${hasPreviousPage
            ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'
            : 'bg-gray-900 text-gray-500 cursor-not-allowed border border-gray-800'
          }
        `}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isCurrentPage = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`
                px-3 py-2 rounded-lg font-medium transition-all duration-200 min-w-[40px]
                ${isCurrentPage
                  ? 'bg-dash-blue text-white border border-dash-blue'
                  : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500'
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
        onClick={onNextPage}
        disabled={!hasNextPage}
        className={`
          px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
          ${hasNextPage
            ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'
            : 'bg-gray-900 text-gray-500 cursor-not-allowed border border-gray-800'
          }
        `}
      >
        <span className="hidden sm:inline">Next</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  className?: string;
}

export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  className = ''
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={`text-sm text-gray-400 ${className}`}>
      Showing {startItem.toLocaleString()} to {endItem.toLocaleString()} of {totalItems.toLocaleString()} NFTs
      <span className="hidden sm:inline"> (Page {currentPage} of {totalPages})</span>
    </div>
  );
}

interface PageSizeSelectorProps {
  currentPageSize: number;
  onPageSizeChange: (size: number) => void;
  options?: number[];
  className?: string;
}

export function PageSizeSelector({
  currentPageSize,
  onPageSizeChange,
  options = [10, 20, 50],
  className = ''
}: PageSizeSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-400">Show:</span>
      <select
        value={currentPageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-dash-blue"
      >
        {options.map(size => (
          <option key={size} value={size}>
            {size} per page
          </option>
        ))}
      </select>
    </div>
  );
}