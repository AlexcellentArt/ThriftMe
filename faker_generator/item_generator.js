//to generate data run: "node generate_mock_data.js" in terminal
/// Hi Andre, can you see me
const { faker } = require("@faker-js/faker");
const custom_helpers = require("./custom_helpers");
const dimensions = 800; // bump down to 640 later if not enough hits are getting found for images of those dimensions.
function getImages(tags=[], additional=0){
  const imgs = [];
  const search = custom_helpers.combineToString(tags,",").replace(/ /g, '-');
  console.log(search)
  let qty = 1 + additional;
  while (qty > 0)
  {
    imgs.push(faker.image.urlLoremFlickr({width:800,height:800,category:search }))
    qty -= 1
  }
  console.log(imgs
  )
  return imgs
}
function generateMockProductData(users = []) {
  console.log(users)
  const products = [];
  // let sellerId = 1; // Start with seller_id = 1
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
    tags: ["tulum", "summer", "dress", "women's fashion"],
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
  // faker.helpers;

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
  const materials = [
    "Cotton",
    "Silk",
    "Polyester",
    "Denim",
    "Wool",
    "Satin",
    "Leather",
    "Velvet",
  ];
  //   .forEach((word) => {
  //     console.log(`,"${toTitleCase(word)}"`);
  const colors = ["Red", "Blue", "Green"];
  //   const item_prefix_material = ["Rubber","Satin","Cotton"]
  // Add the predefined products to the list
  products.push(product1, product2);
  // Generate additional products with unique, incrementing seller_ids
  for (let i = 0; i < users.length; i++) {
    // faker.helpers.rangeToNumber()
    let createHowMany = faker.helpers.rangeToNumber({ min: 0, max: 5 });
    for (let qty = 0; qty < createHowMany; qty++) {
      const material = faker.helpers.arrayElement(materials);
      const adjectives = [
        faker.commerce.productAdjective(),
        faker.commerce.productAdjective(),
        faker.commerce.productAdjective(),
      ];
      const color = faker.color.human();
      const base = faker.helpers.arrayElement(item_base);
      const price = Number(faker.commerce.price({ min: 5, max: 200 }));
      //   const photo = await getLoremFlicker([base,material,color])
      const tags = [base, color, material, ...adjectives, ].map((str)=>{return str.toLowerCase()});
      const imgs = getImages([base,color])
      const product = {
        seller_id: users[i].id,
        //   sellerId++, // Increment seller_id by 1 for each new product
        name: custom_helpers.toTitleCase(custom_helpers.combineToString([
          faker.helpers.arrayElement(adjectives),
          color,
          material,
          base,
        ])),
        price: price,
        //   description: faker.lorem.sentence(),
        description: faker.commerce.productDescription(), // 'Andy shoes are designed to keeping...'
        //   default_photo: faker.image.imageUrl(),
        default_photo: imgs.pop(0),
        additional_photos: imgs,
        tags: tags,
      };
      //   faker.image
      //   faker.commerce.productAdjective(), faker.commerce.productAdjective(), faker.random.word()
      products.push(product);
      //   createHowMany -= 1;
    }
  }
  console.log(`Made ${products.length} products.`);
  return products;
}
// const mockData = generateMockProductData();
// console.log(mockData);
// console.log(`Made ${mockData.length} products.`);
// console.log();

module.exports ={
  generateMockProductData
}