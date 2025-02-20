export const search = (
  searchTerm: string,
  data: any,
  setSearchResults: any
) => {
  const results = !searchTerm.trim()
    ? data
    : data.filter((obj: any) =>
        Object.values(obj)
          .join(' ')
          .toLocaleLowerCase()
          .includes(searchTerm.trim().toLocaleLowerCase())
      );
  setSearchResults(results);
};
