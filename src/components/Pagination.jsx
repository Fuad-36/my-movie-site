import React from "react";

const Pagination = ({
  page = 1,
  totalItems = 0,
  totalPages = 1,
  perPage = 20,
  onPageChange = () => {},
}) => {
  const safeTotalPages = Math.max(1, totalPages);

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalItems);

  const pages = [];
  for (let i = 1; i <= safeTotalPages; i++) {
    if (i <= 2 || i > safeTotalPages - 2 || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const go = (p) => {
    if (p === "..." || p < 1 || p > safeTotalPages || p === page) return;
    onPageChange(p);
  };

  return (
    <div className="pagination">
      <div className="mobile-controls">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            go(page - 1);
          }}
          className="page-btn"
        >
          Previous
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            go(page + 1);
          }}
          className="page-btn"
        >
          Next
        </a>
      </div>

      <div className="desktop-controls">
        <div className="page-info">
          <p className="text-sm text-gray-300">
            Showing <span className="font-medium">{start}</span> to{" "}
            <span className="font-medium">{end}</span> of{" "}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>

        <div className='sm:mt-0 mt-5'>
          <nav aria-label="Pagination" className="page-nav">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                go(page - 1);
              }}
              className="page-btn page-btn--icon"
              aria-label="Previous"
            >
              {/* left chevron */}
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="size-5"
              >
                <path
                  d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                />
              </svg>
            </a>

            {pages.map((p, i) =>
              p === "..." ? (
                <span key={`e-${i}`} className="page-ellipsis">
                  …
                </span>
              ) : (
                <a
                  key={p}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    go(p);
                  }}
                  className={
                    p === page ? "page-btn page-btn--current" : "page-btn"
                  }
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </a>
              ),
            )}

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                go(page + 1);
              }}
              className="page-btn page-btn--icon"
              aria-label="Next"
            >
              {/* right chevron */}
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="size-5"
              >
                <path
                  d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
