const searchEngine = (docs) => {
  const getRegexp = (query) => new RegExp(`\\b${query}\\b`, 'g');

  return {
    search: (query) => docs.filter(({ text }) => getRegexp(query).test(text)).map(({ id }) => id),
  };
};

export default searchEngine;
