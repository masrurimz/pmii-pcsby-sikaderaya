interface Pagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

export const createPagination = (page: number, per_page: number, total: number): Pagination => {
  const total_pages = Math.ceil(total / per_page);
  return {
    page,
    per_page,
    total,
    total_pages,
    next_page: page < total_pages ? page + 1 : null,
    prev_page: page > 1 ? page - 1 : null,
  };
}
