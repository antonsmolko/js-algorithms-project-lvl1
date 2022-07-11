import _ from 'lodash';

const searchEngine = (docs) => {
  const getRegexp = (query) => new RegExp(`\\b${query}\\b`, 'gi');

  return {
    search: (token) => _.chain(docs)
      .map(({ id, text }) => {
        const [term] = token.match(/\w+/g);
        const matches = text.match(getRegexp(term))

        return { id, matches: _.get(matches, 'length', null) }
      })
      .filter('matches')
      .orderBy(['matches'], ['desc'])
      .map(({ id }) => id)
      .value()
  }
};

export default searchEngine;
