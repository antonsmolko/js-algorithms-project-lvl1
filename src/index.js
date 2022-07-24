import _ from 'lodash';

const wordRegexp = /[\wа-яА-Я]+/gi;
const getWordsCount = (doc) => {
  const matches = doc.match(wordRegexp);
  return _.get(matches, 'length', 0);
};

const searchEngine = (docs) => {
  const dictionary = {};
  const docsCount = docs.length;

  const docsMap = docs.map((doc) => ({ ...doc, wordsCount: getWordsCount(doc.text) }));

  const getRegexp = (term) => new RegExp(`\\b${term}\\b`, 'gi');

  const getDictionaryTerm = (term) => {
    const termRegexp = getRegexp(term);

    const { docsCountWithMatches, tfs } = docsMap.reduce((acc, { id, wordsCount, text }) => {
      const matches = text.match(termRegexp);

      if (_.isEmpty(matches)) { return acc; }

      acc.docsCountWithMatches += 1;
      acc.tfs = [...acc.tfs, { id, tf: matches.length / wordsCount }];

      return acc;
    }, { docsCountWithMatches: 0, tfs: [] });

    const idf = Math.log(docsCount / docsCountWithMatches);

    return tfs.reduce((acc, { id, tf }) => ({ ...acc, [id]: tf * idf }), {});
  };

  return {
    search: (query) => {
      const tokens = query.split(' ');
      const terms = tokens.flatMap((token) => token.match(wordRegexp));

      const tfIdfMap = terms.reduce((acc, term) => {
        if (!dictionary[term]) {
          dictionary[term] = getDictionaryTerm(term);
        }

        Object.entries(dictionary[term]).forEach(([id, tfIdf]) => {
          acc[id] = acc[id] ? acc[id] + tfIdf : tfIdf;
        });

        return acc;
      }, {});

      return _.chain(tfIdfMap)
        .entries()
        .map(([id, tfIdf]) => ({ id, tfIdf }))
        .orderBy('tfIdf', ['desc'])
        .map('id')
        .value();
    },
  };
};

export default searchEngine;
