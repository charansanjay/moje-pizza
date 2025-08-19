export const calculatePaginatedItems = <T>(
  currentPage: number,
  itemsPerPage: number,
  filteredItems: T[]
) => {
  const startIndex = Math.max(0, (currentPage - 1) * itemsPerPage);
  const endIndex = Math.min(startIndex + itemsPerPage, filteredItems.length);
  return filteredItems.slice(startIndex, endIndex);
};
