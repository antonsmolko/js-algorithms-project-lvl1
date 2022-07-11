import _ from 'lodash';

const searchEngine = (docs) => {
  const getRegexp = (term) => new RegExp(`\\b${term}\\b`, 'gi');

  return {
    search: (query) => _.chain(docs)
      .map(({ id, text }) => {
        const tokens = query.split(' ');
        const terms = tokens.flatMap((token) => token.match(/\w+/g));
        const matches = _.chain(terms)
          .map((term) => text.match(getRegexp(term)))
          .compact()
          .value();

        const matchesSetCount = matches.length
        const totalMatchesCount = matches.flat().length

        return { id, matchesSetCount, totalMatchesCount }
      })
      .filter('matchesSetCount')
      .orderBy(['matchesSetCount', 'totalMatchesCount'], ['desc', 'desc'])
      .map(({ id }) => id)
      .value()
  }
};

export default searchEngine;
