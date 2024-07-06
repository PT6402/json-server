const { fakerVI } = require('@faker-js/faker');
const fs = require('fs');

const randomCategoriesList = (numCategories) => {
  if (numCategories <= 0) return [];

  const categoryList = [];
  Array.from(new Array(numCategories)).forEach(() => {
    const category = {
      id: fakerVI.string.uuid(),
      name: fakerVI.commerce.department(),
      thumbnail: fakerVI.image.urlPicsumPhotos(),
      description: fakerVI.commerce.productDescription(),
    };
    categoryList.push(category);
  });

  return categoryList;
};

const randomBooksList = (numBooks, categories) => {
  if (numBooks <= 0) return [];

  const bookList = [];
  Array.from(new Array(numBooks)).forEach(() => {
    const numBookCategories = fakerVI.number.int({ min: 2, max: 3 });
    const bookCategories = fakerVI.helpers
      .arrayElements(categories, numBookCategories)
      .map((category) => ({
        id: category.id,
        name: category.name,
      }));

    const book = {
      bookId: fakerVI.string.uuid(),
      nameBook: fakerVI.commerce.productName(),
      price: Number.parseInt(
        fakerVI.commerce.price({
          min: 100,
          max: 1000,
          dec: 0,
        }),
      ),
      pageQuantity: fakerVI.number.int({ min: 50, max: 1000 }),
      rating: fakerVI.number.float({ min: 0, max: 5, multipleOf: 0.1 }),
      ratingQuantity: fakerVI.number.int({ min: 0, max: 5000 }),
      description: fakerVI.commerce.productDescription(),
      edition: fakerVI.date.anytime().getFullYear(),
      authors: Array.from({ length: fakerVI.number.int({ min: 1, max: 3 }) }).map(() => ({
        authorId: fakerVI.string.uuid(),
        authorName: fakerVI.person.fullName(),
      })),
      images: fakerVI.image.urlPicsumPhotos(),
      categories: bookCategories,
      page: fakerVI.number.int({ min: 0, max: 5000 }),
      isBestSeller: fakerVI.datatype.boolean(),
      reviews: Array.from({ length: fakerVI.number.int({ min: 0, max: 10 }) }).map(() => ({
        userId: fakerVI.string.uuid(),
        content: fakerVI.lorem.sentence(),
        rating: fakerVI.number.int({ min: 0, max: 5 }),
        userName: fakerVI.person.fullName(),
        dateReview: fakerVI.date.anytime(),
      })),
    };
    bookList.push(book);
  });

  return bookList;
};

!(() => {
  const categories = randomCategoriesList(8); // Change the number of categories as needed
  const books = randomBooksList(10, categories); // Change the number of books as needed
  const db = {
    categories,
    books,
    profile: [],
  };
  // Write db object to db.json
  fs.writeFile('db.json', JSON.stringify(db, null, 2), (err) => {
    if (err) throw err;
    console.log('Generate data success');
  });
})();
