const os = require("os");
const Jimp = require("jimp");
const createLeaderboard = require("./index");

jest.setTimeout(60000);

test("generating the leaderboard", async () => {
  const image = await createLeaderboard(
    [
      {
        shortcode: "BpmS53YnS1e",
        name: "@sainsburys TTD All Butter Mince Pie",
        image: __dirname + "/__fixtures__/pie1.jpg",
        ratings: [],
        score: 33,
        place: 1
      },
      {
        shortcode: "Bpm09LkH-9z",
        name: "@aldiuk Specially Selected All Butter Mince Pie",
        image: __dirname + "/__fixtures__/pie2.jpg",
        ratings: [],
        score: 30,
        place: 2
      },
      {
        shortcode: "BpbsYz-nk-q",
        name: "@thebakehouseat124 Bear Claw Mince Pastry",
        image: __dirname + "/__fixtures__/pie3.jpg",
        ratings: [],
        score: 30,
        place: 3
      }
    ],
    os.tmpdir() + "/leaderboard.jpg"
  );

  expect(
    Jimp.compareHashes(
      (await Jimp.read(os.tmpdir() + "/leaderboard.jpg")).pHash(),
      (await Jimp.read(__dirname + `/__fixtures__/expected.jpg`)).pHash()
    )
  ).toEqual(0);
});
