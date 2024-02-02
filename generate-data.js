const { fakerVI } = require('@faker-js/faker');
const fs = require('fs');

const randomCategoriesList = (n) => {
  if (n >= 0) {
    const categoryList = [];
    Array.from(new Array(n)).forEach(() => {
      const category = {
        id: fakerVI.string.uuid(),
        name: fakerVI.commerce.department(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      categoryList.push(category);
    });
    return categoryList;
  }
};

const randomProductsList = (categoryList, numberProduct) => {
  if (numberProduct <= 0) return [];

  const productList = [];
  for (let cate of categoryList) {
    Array.from(new Array(numberProduct)).forEach(() => {
      const product = {
        id: fakerVI.string.uuid(),
        price: Number.parseInt(
          fakerVI.commerce.price({
            min: 100,
            max: 200,
            dec: 0,
            // symbol: "$",
          }),
        ),
        categoryId: cate.id,
        color: fakerVI.color.human(),
        // color: fakerVI.color.rgb({
        //   format: "hex",
        //   casing: "lower",
        // }),
        name: fakerVI.commerce.productName(),
        desciption: fakerVI.commerce.productDescription(),
        createAt: Date.now(),
        updateAt: fakerVI.date.anytime(),
        image: fakerVI.image.urlPicsumPhotos(),
      };
      productList.push(product);
    });
  }

  return productList;
};
!(() => {
  const categories = randomCategoriesList(2);
  const products = randomProductsList(categories, 2);
  const db = {
    categories,
    products,
    profile: [],
  };
  //write db object to db.json
  fs.writeFile('db.json', JSON.stringify(db), () => {
    console.log('Generate data success');
  });
})();
