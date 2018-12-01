const puppeteer = require("puppeteer");
const devices = require("puppeteer/DeviceDescriptors");

const login = async (page, username, password) => {
  await page.goto("https://www.instagram.com/accounts/login/");

  await page.waitFor("input[name=username]", { visible: true });
  await page.type("input[name=username]", username, {
    delay: 20
  });

  await page.waitFor(520);
  await page.type("input[name=password]", password, { delay: 30 });

  await page.waitFor('//button[contains(.,"Log in")]');
  const [submit] = await page.$x('//button[contains(.,"Log in")]');
  await submit.click();

  await page.waitForNavigation();
};

const upload = async (page, image, caption) => {
  await page.emulate(devices["iPhone 8"]);

  await page.evaluate(
    `document.querySelector('[aria-label="New Post"]').click();`
  );
  const file = await page.$("input[type=file]");
  await file.uploadFile(image);

  await page.waitFor('//button[contains(.,"Next")]');
  const [next] = await page.$x('//button[contains(.,"Next")]');
  next.click();

  await page.waitFor('textarea[aria-label="Write a caption…"]');
  await page.type('textarea[aria-label="Write a caption…"]', caption, {
    delay: 1
  });
};

module.exports = async ({ username, password }, { image, caption }) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  await login(page, username, password);

  await upload(page, image, caption);

  await page.screenshot({ path: "screenshot.png" });

  await page.close();
  await browser.close();
};
