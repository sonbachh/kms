import React from "react";

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxPageButtons = 5; // Số trang tối đa sẽ hiển thị (bao gồm các trang ở đầu, cuối và trang hiện tại)
    const pageNumbers = [];

    // Nếu chỉ có 1 trang, không hiển thị gì cả
    if (totalPages <= 1) {
        return null;
    }
    
    // Tạo logic hiển thị trang
    if (totalPages <= maxPageButtons) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        // Luôn hiển thị trang đầu, cuối và các trang xung quanh trang hiện tại
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        pageNumbers.push(1); // Trang đầu

        if (startPage > 2) {
            pageNumbers.push("...");
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (endPage < totalPages - 1) {
            pageNumbers.push("...");
        }

        pageNumbers.push(totalPages); // Trang cuối
    }

    return (
        <nav>
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        className="page-link"
                    >
                        Previous
                    </button>
                </li>
                {pageNumbers.map((number, index) => (
                    <li
                        key={index}
                        className={`page-item ${currentPage === number ? "active" : ""}`}
                    >
                        {number === "..." ? (
                            <span className="page-link">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(number)}
                                className="page-link"
                            >
                                {number}
                            </button>
                        )}
                    </li>
                ))}
                <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                >
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        className="page-link"
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
