/* eslint-disable react/prop-types */
function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (page) => {
        onPageChange(page);
    };

    return (
        <div className="flex items-center justify-between mt-6">
            <a
                href="#"
                className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100  "
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>
                <span>Previous</span>
            </a>
            <div className="items-center hidden md:flex gap-x-3">
                {Array.from({ length: totalPages }, (_, i) => (
                    <a
                        key={i + 1}
                        href="#"
                        className={`px-2 py-1 text-sm ${currentPage === i + 1 ? 'text-blue-500' : 'text-gray-500'} rounded-md  bg-blue-100/60`}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </a>
                ))}
            </div>
            <a
                href="#"
                className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100   "
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <span>Next</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
            </a>
        </div>
    );
}

export default Pagination;
