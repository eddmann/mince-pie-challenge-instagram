const isPie = post => post.caption.match(/#MincePie\b/i);

const parseName = caption =>
  caption
    .split("-")[0]
    .replace(/#[a-z0-9]+/gi, "")
    .replace(/[^\@\w\s]/gi, "")
    .trim();

const parseScore = score => Math.min(Math.max(parseFloat(score), 0), 10);

const parseRating = comment => {
  try {
    const pastry = parseScore(comment.match(/\bP[^\d]*([\d\.]+)/i)[1]);
    const filling = parseScore(comment.match(/\bF[^\d]*([\d\.]+)/i)[1]);
    const look = parseScore(comment.match(/\bL[^\d]*([\d\.]+)/i)[1]);
    const value = parseScore(comment.match(/\bV[^\d]*([\d\.]+)/i)[1]);
    const score = pastry + filling + look + value;

    return { pastry, filling, look, value, score };
  } catch (err) {
    return undefined;
  }
};

module.exports = post => {
  if (!isPie(post)) {
    return;
  }

  return {
    shortcode: post.shortcode,
    name: parseName(post.caption),
    image: post.image,
    ratings: post.comments.map(parseRating).filter(Boolean)
  };
};
