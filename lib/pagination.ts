/** Shared validation for database-backed list pagination. */
export function parsePagination(url: URL) {
  const rawPage = Number(url.searchParams.get('page') || 1);
  const rawSize = Number(url.searchParams.get('pageSize') || 25);
  const page = Number.isSafeInteger(rawPage) && rawPage >= 1 ? Math.min(rawPage, 1000000) : 1;
  const pageSize = [10, 25, 50, 100].includes(rawSize) ? rawSize : 25;
  return {page, pageSize, offset: (page - 1) * pageSize};
}
export function pageResult<T>(rows: T[], total: number, page: number, pageSize: number) {
  return {rows, total, page, pageSize, totalPages: Math.ceil(total / pageSize)};
}
