const getSearchTags = (): string[] => JSON.parse(
  localStorage.getItem('search-tags') || '[]'
);

export default getSearchTags;