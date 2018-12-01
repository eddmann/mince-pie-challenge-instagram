const parse = require("./parse");

test("ignores post that is not a pie", () => {
  const pie = parse({
    shortcode: "BprpYTInNPI",
    image: "http://image.jpg",
    caption:
      "This weeks leaderboard 🏆\n#MincePieChallenge #MincePieChallenge2018",
    comments: []
  });

  expect(pie).toBeUndefined();
});

test("parses post that is a pie", () => {
  const pie = parse({
    shortcode: "BpSUCz-nKwp",
    image: "http://image.jpg",
    caption:
      "@sainsburys 'Deep Filled' Mince Pies - Bought from @coopukfood these are to die for. #MincePie #MincePieChallenge #MincePieChallenge2018",
    comments: []
  });

  expect(pie).toEqual({
    image: "http://image.jpg",
    name: "@sainsburys Deep Filled Mince Pies",
    ratings: [],
    shortcode: "BpSUCz-nKwp"
  });
});

test("parse comment ratings", () => {
  const pie = parse({
    shortcode: "BpSUCz-nKwp",
    image: "http://image.jpg",
    caption:
      "@sainsburys Deep Filled Mince Pies #MincePie #MincePieChallenge #MincePieChallenge2018",
    comments: [
      "P: 9, F: 8, L: 9, V: 8",
      "P: 9.5, F: 8.5, L: 9.5, V: 8.5",
      "Pastry 8 filling 7.5 look 7.5 (the filling had bubbled out)value 8",
      "P: 6.5, F: 7, L: 10, V: 7 - looks amazing! 😎",
      "P: 5, F: 8.5, L: 7.5, V: 7, great filling but the pastry let it down 😢",
      "Pastry: 7, filling: 7.5, look: 4.5, value: 7.5 not a bad pie for £2 for 6. @greggs_official",
      "Pastry 7 filling 7.5 look 6 value 7.5  tasty pie reasonably priced @ 6 for £2.00",
      "Pastry: 5, Filling: 7, Look: 4, Value: 8 🔥"
    ]
  });

  expect(pie).toEqual({
    image: "http://image.jpg",
    name: "@sainsburys Deep Filled Mince Pies",
    shortcode: "BpSUCz-nKwp",
    ratings: [
      { filling: 8, look: 9, pastry: 9, value: 8, score: 34 },
      { filling: 8.5, look: 9.5, pastry: 9.5, value: 8.5, score: 36 },
      { filling: 7.5, look: 7.5, pastry: 8, value: 8, score: 31 },
      { filling: 7, look: 10, pastry: 6.5, value: 7, score: 30.5 },
      { filling: 8.5, look: 7.5, pastry: 5, value: 7, score: 28 },
      { filling: 7.5, look: 4.5, pastry: 7, value: 7.5, score: 26.5 },
      { filling: 7.5, look: 6, pastry: 7, value: 7.5, score: 28 },
      { filling: 7, look: 4, pastry: 5, value: 8, score: 24 }
    ]
  });
});

test("ignore comments which are not ratings", () => {
  const pie = parse({
    shortcode: "BpSUCz-nKwp",
    image: "http://image.jpg",
    caption:
      "@sainsburys Deep Filled Mince Pies #MincePie #MincePieChallenge #MincePieChallenge2018",
    comments: ["This is not a rating", "P: 9, F: 8, L: 9 - incomplete rating"]
  });

  expect(pie).toEqual({
    image: "http://image.jpg",
    name: "@sainsburys Deep Filled Mince Pies",
    shortcode: "BpSUCz-nKwp",
    ratings: []
  });
});
