const Jimp = require("jimp");

const createThumbnail = async (path, size = 235, border = 5) => {
  const background = new Jimp(size, size, 0xffffff);
  const image = await Jimp.read(path);

  await image.resize(size - border * 2, size - border * 2);
  await background.composite(image, border, border);

  return background;
};

const writeScore = async ({ place, image, name }, output, x, y) => {
  const number = await Jimp.read(`./leaderboard/number-${place}.png`);
  const thumbnail = await createThumbnail(image);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

  const numberY = y + thumbnail.bitmap.height / 2 - number.bitmap.height / 2;
  const thumbnailX = x + 100;
  const fontX = thumbnailX + thumbnail.bitmap.width + 50;
  const fontWidth = output.bitmap.width - fontX - 40;
  const fontHeight = Jimp.measureTextHeight(font, name, fontWidth);
  const fontY = y + thumbnail.bitmap.height / 2 - fontHeight / 2;

  await output.composite(number, x, numberY);
  await output.composite(thumbnail, thumbnailX, y);
  await output.print(font, fontX, fontY, name, fontWidth);

  return y + thumbnail.bitmap.height;
};

module.exports = async (
  scores,
  filename,
  { padding = 40, spacing = 20 } = {}
) => {
  const background = await Jimp.read(scores[0].image);
  await background.blur(10);
  await background.color([{ apply: "darken", params: [10] }]);

  const header = await Jimp.read("./leaderboard/header.png");
  await background.composite(
    header,
    background.bitmap.width / 2 - header.bitmap.width / 2,
    padding
  );

  const footer = await Jimp.read("./leaderboard/footer.png");
  await background.composite(
    footer,
    background.bitmap.width / 2 - footer.bitmap.width / 2,
    background.bitmap.height - footer.bitmap.height - padding
  );

  let currentY = header.bitmap.height + padding * 2;
  for (const score of scores) {
    currentY = await writeScore(score, background, padding, currentY);
    currentY += spacing;
  }

  await background.write(filename);

  return filename;
};
