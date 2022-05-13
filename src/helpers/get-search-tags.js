const getSearchTags = () => JSON.parse(localStorage.getItem('search-tags') || '[]');
export default getSearchTags;
