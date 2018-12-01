const puppeteer = require("puppeteer");
const get = require("get-from");

const scrollToBottom = async page => {
  page.evaluate("window.scrollTo(0, document.body.scrollHeight)");

  try {
    await page.waitForResponse(res => !!res.url().match(/graphql/), {
      timeout: 5000
    });
    await page.waitFor(200);
    return true;
  } catch (err) {
    return false;
  }
};

const fetchPostsForNodes = async (page, nodes) =>
  Promise.all(
    nodes.map(async node => {
      const { shortcode } = node;

      const graph = await page.evaluate(
        async id =>
          await (await fetch(
            `https://www.instagram.com/p/${id}/?__a=1`
          )).json(),
        shortcode
      );

      return {
        shortcode,
        image: get("graphql.shortcode_media.display_url", graph),
        caption: get(
          "graphql.shortcode_media.edge_media_to_caption.edges.0.node.text",
          graph
        ),
        comments: get(
          "graphql.shortcode_media.edge_media_to_comment.edges[].node.text",
          graph,
          []
        )
      };
    })
  );

const findVisiblePostsOnLoad = async page => {
  const sharedData = await page.evaluate(() => window._sharedData);
  const nodes = get(
    "entry_data.ProfilePage.0.graphql.user.edge_owner_to_timeline_media.edges[].node",
    sharedData,
    []
  );
  return fetchPostsForNodes(page, nodes);
};

const findPostsInResponse = async (page, response) => {
  if (!response.url().match(/graphql/)) return [];
  const nodes = get(
    "data.user.edge_owner_to_timeline_media.edges[].node",
    await response.json(),
    []
  );
  return fetchPostsForNodes(page, nodes);
};

const abortImageRequests = request =>
  request.resourceType() === "image" ? request.abort() : request.continue();

module.exports = async username => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", abortImageRequests);

  const posts = [];

  page.on("response", async response => {
    (await findPostsInResponse(page, response)).forEach(post => {
      posts.push(post);
    });
  });

  const response = await page.goto(`https://www.instagram.com/${username}/`, {
    waitUntil: "networkidle2"
  });

  (await findVisiblePostsOnLoad(page)).forEach(async post => {
    posts.push(post);
  });

  while (await scrollToBottom(page));

  await page.waitFor(2000);
  await page.close();
  await browser.close();

  return posts;
};
