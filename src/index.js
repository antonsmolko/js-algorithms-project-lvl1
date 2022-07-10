const searchEngine = (docs) => {
  const getRegexp = (query) => new RegExp(`\\b${query.toLowerCase()}\\b`, 'g');

  return {
    search: (token) => docs.filter(({ text }) => {
      console.log(text)
      const term = token.match(/\w+/g);
      return term.some((query) => getRegexp(query).test(text.toLowerCase()))
    }).map(({ id }) => id),
  };
};

export default searchEngine;
