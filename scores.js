const parsePie = require("./parse");

const hasRating = pie => pie.ratings.length > 0;

const avgScore = ratings =>
  Math.floor(
    ratings.reduce((total, rating) => total + rating.score, 0) / ratings.length
  );

module.exports = posts => {
  const pies = posts.map(parsePie).filter(Boolean);

  return pies
    .filter(hasRating)
    .map(pie => ({ ...pie, score: avgScore(pie.ratings) }))
    .sort((a, b) => b.score - a.score)
    .map((pie, idx) => ({ ...pie, place: idx + 1 }));
};
