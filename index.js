const fetchInstagramPosts = require("./posts");
const calculateScores = require("./scores");
const createLeaderboard = require("./leaderboard");
const upload = require("./upload");

const generateCaption = scores =>
  "This weeks leaderboard 🏆\n" +
  scores
    .map(({ place, name, score }) => `${place}. ${name} (${score}/40)`)
    .join("\n");

const generateImage = async (directory, scores) => {
  const date = new Date().toJSON().slice(0, 10);
  return createLeaderboard(scores, `${directory}/${date}.jpg`);
};

(async () => {
  const username = "themincepiechallenge";

  const posts = await fetchInstagramPosts(username);
  const scores = calculateScores(posts);

  const image = await generateImage("./output", scores.slice(0, 3));
  const caption = generateCaption(scores);

  console.log(image);
  console.log(caption);
})();
