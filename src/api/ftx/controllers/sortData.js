function sortData(data, initialCompare, compare) {
  const initialSortedData = [...data].sort(initialCompare);

  return compare == null ? initialSortedData : initialSortedData.sort(compare);
}

export { sortData };
