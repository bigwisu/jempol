var faker = require('faker');

var database = { posts: []};
const images = [
    "products",
    "people",
    "person",
    "model",
    "cats",
    "food",
    "cars",
    "boats",
    "fish",
    "dogs",
    "sport",
    "racing",
    "bus",
    "truck",
    "motocycle",
    "flower"
]

images.forEach(function (item) {
    database.posts.push({
        code: faker.random.alphaNumeric(10),
        caption: faker.lorem.words(50),
        like: faker.random.number(100),
        hate: faker.random.number(10),
        id: faker.random.alphaNumeric(20),
        display_src: "https://source.unsplash.com/1080x1080/?" + item
      });
  });

console.log(JSON.stringify(database));