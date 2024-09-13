const prisma = require("../prisma");
const seed = async () => {
  const CreateItem = async () => {
    const item = [
      {
        id: 1,
        seller_id: 1,
        name: "Laura Piglet",
        price: $5,
        description: "Perfect 2 piece dress for Tulum",
        default_photo:"https://shopannalaura.com/cdn/shop/products/paradisemaxidress2.jpg?v=1628458759&width=1445",
        additional_photos: [""],
        tags: ["tulum", "summer", "dress"]
      },

          {
        id: 2,
        seller_id: 2,
        name: "Melissa Cat",
        price: $10,
        description: "Cute hawaii shirt for your travels",
        default_photo:"https://m.media-amazon.com/images/I/71-I7jCRn8L._AC_SX679_.jpg",
        additional_photos: ["https://m.media-amazon.com/images/I/912tgDq6kfL._AC_SX679_.jpg","https://m.media-amazon.com/images/I/81zJrANFdAL._AC_SX679_.jpg","https://m.media-amazon.com/images/I/8119kZidhTL._AC_SX679_.jpg"],
        tags: ["shirt", "hawaii", "travel"]
      },

              {
        id: 3,
        seller_id: 3,
        name: "Roger Rabbit",
        price: $20,
        description: "Dress shirt for going out",
        default_photo:"https://www.billioncreation.com/wp-content/uploads/2017/10/HUNDREDSXRRSOUVSHIRT-PARENT__1.jpg",
        additional_photos: ["https://www.billioncreation.com/wp-content/uploads/2017/10/HUNDREDSXRRSOUVSHIRT-PARENT__2.jpg"],
        tags: ["dressy", "red", "nightout"]
      }]
      await prisma.item.createMany({ data: item });
    }
    await CreateItem();
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });