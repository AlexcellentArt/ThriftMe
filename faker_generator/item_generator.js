//to generate data run: "node generate_mock_data.js" in terminal
/// Hi Andre, can you see me
const { faker } = require('@faker-js/faker');
const custom_helpers = require("./custom_helpers");

function generateMockProductData(users = [{ id: 1 }, { id: 2 }, { id: 3 }]) {
  const products = [];
  let sellerId = 1; // Start with seller_id = 1
  // Predefined products with incremental seller_id
  const product1 = {
    seller_id: users[0].id,
    // sellerId++, // seller_id = 1
    name: "Tulum Dress",
    price: 5,
    description: "Perfect 2 piece dress for Tulum",
    default_photo:
      "https://shopannalaura.com/cdn/shop/products/paradisemaxidress2.jpg?v=1628458759&width=1445",
    additional_photos: [],
    tags: ["tulum", "summer", "dress", "women's fashion"]
  };
  const product2 = {
    seller_id: users[1].id, // seller_id = 2
    name: "Hawaii Shirt",
    price: 10,
    description: "Cute hawaii shirt for your travels",
    default_photo:
      "https://m.media-amazon.com/images/I/71-I7jCRn8L._AC_SX679_.jpg",
    additional_photos: [
      "https://m.media-amazon.com/images/I/912tgDq6kfL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/81zJrANFdAL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/8119kZidhTL._AC_SX679_.jpg",
    ],
    tags: [
      "shirt",
      "hawaii",
      "travel",
      "women's activewear",
      "men's activewear",
    ],
  };
  faker.helpers;

  const item_base = [
    "Shirt",
    "Skirt",
    "Dress",
    "Polo Shirt",
    "Dress Shirt",
    "Collar Shirt",
    "Midi Dress",
    "Long Dress",
    "Blouse",
    "Sweater",
    "Jacket",
    "Short",
    "Pant",
    "Jean",
    "Purse",
    "Chinos",
    "Romper",
    "Trouser",
    "Jumpsuit",
    "Suit Jacket",
    "Suit",
    "High Waisted Jeans",
  ];
  const materials = ["Cotton"
    ,"Silk"
    ,"Polyester"
    ,"Denim"
    ,"Wool"
    ,"Satin"
    ,"Leather"
    ,"Velvet"]
//   .forEach((word) => {
//     console.log(`,"${toTitleCase(word)}"`);
 const colors = ["Red","Blue","Green"]
  //   const item_prefix_material = ["Rubber","Satin","Cotton"]
  // Add the predefined products to the list
  products.push(product1, product2);
  // Generate additional products with unique, incrementing seller_ids
  for (let i = 0; i < users.length; i++) {
    // faker.helpers.rangeToNumber()
    let createHowMany = custom_helpers.randDigit(0, 5);
    for (let qty = 0; qty < createHowMany; qty++) {
    const material = custom_helpers.randFromArray(materials)
      const adjectives = [
        faker.commerce.productAdjective(),
        faker.commerce.productAdjective(),
        faker.commerce.productAdjective(),
      ];
      const color = custom_helpers.randFromArray(colors)
      const base = custom_helpers.randFromArray(item_base);
      const price = faker.commerce.price({ min: 5, max: 200 })
    //   const photo = await getLoremFlicker([base,material,color])
      const product = {
        seller_id: users[i].id,
        //   sellerId++, // Increment seller_id by 1 for each new product
        name: custom_helpers.combineToString([
          custom_helpers.randFromArray(adjectives),color,material,
          base,
        ]),
        price: price,
        //   description: faker.lorem.sentence(),
        description: faker.commerce.productDescription(), // 'Andy shoes are designed to keeping...'
        //   default_photo: faker.image.imageUrl(),
        default_photo:
        "https://picsum.photos/200/300",
        additional_photos: [
          "https://picsum.photos/200/300",
          "https://picsum.photos/200/300",
          "https://picsum.photos/200/300",
        ],
        tags: [...adjectives,color,material, base],
      };
    //   faker.image
      //   faker.commerce.productAdjective(), faker.commerce.productAdjective(), faker.random.word()
      products.push(product);
    //   createHowMany -= 1;
    }
  }
  return products;
}
const mockData = generateMockProductData();
console.log(mockData);
console.log(`Made ${mockData.length} products.`);
console.log()