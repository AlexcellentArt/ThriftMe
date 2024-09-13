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
        default_photo:
          "https://shopannalaura.com/cdn/shop/products/paradisemaxidress2.jpg?v=1628458759&width=1445",
        additional_photos: [""],
        tags: ["tulum", "summer", "dress"],
      },

      {
        id: 2,
        seller_id: 2,
        name: "Melissa Cat",
        price: $10,
        description: "Cute hawaii shirt for your travels",
        default_photo:
          "https://m.media-amazon.com/images/I/71-I7jCRn8L._AC_SX679_.jpg",
        additional_photos: [
          "https://m.media-amazon.com/images/I/912tgDq6kfL._AC_SX679_.jpg",
          "https://m.media-amazon.com/images/I/81zJrANFdAL._AC_SX679_.jpg",
          "https://m.media-amazon.com/images/I/8119kZidhTL._AC_SX679_.jpg",
        ],
        tags: ["shirt", "hawaii", "travel"],
      },

      {
        id: 3,
        seller_id: 3,
        name: "Roger Rabbit",
        price: $20,
        description: "Dress shirt for going out",
        default_photo:
          "https://www.billioncreation.com/wp-content/uploads/2017/10/HUNDREDSXRRSOUVSHIRT-PARENT__1.jpg",
        additional_photos: [
          "https://www.billioncreation.com/wp-content/uploads/2017/10/HUNDREDSXRRSOUVSHIRT-PARENT__2.jpg",
        ],
        tags: ["dressy", "red", "nightout"],
      },
    ];
    await prisma.item.createMany({ data: item });
  };
  // We are Creating Shopping Cart, Checkout Page, Browsing History
  const CreateShoppingCart = async () => {
    const shoppingcart = [
      {
        id: 1,
        userID: 1,
        looked_at_tags: "Women's Activeware",
        total_cost: 50,
      },

      {
        id: 2,
        userID: 2,
        looked_at_tags: "Men's Activeware",
        total_cost: 30,
      },

      {
        id: 3,
        userID: 3,
        looked_at_tags: "Men's Fashion",
        total_cost: 100,
      },

      {
        id: 4,
        userID: 4,
        looked_at_tags: "Women's Activewear",
        total_cost: 300,
      },

      {
        id: 5,
        userID: 5,
        looked_at_tags: "Men's Suits",
        total_cost: 200,
      },
      {
        id: 6,
        userID: 6,
        looked_at_tags: "Women's Suits",
        total_cost: 400,
      },
    ];

    await prisma.shoppingcart.createMany({ data: shoppingcart });
  };
const CreateCheckoutPage = async () => {
  const checkoutpage = [
    {
      id: 1,
      userID: 1,
      looked_at_tags: "Women's Activeware",
      total_cost: 90,
    },

    {
      id: 2,
      userID: 2,
      looked_at_tags: "Men's Activeware",
      total_cost: 100,
    },

    {
      id: 3,
      userID: 3,
      looked_at_tags: "Men's Fashion",
      total_cost: 300,
    },

    {
      id: 4,
      userID: 4,
      looked_at_tags: "Women's Activewear",
      total_cost: 400,
    },

    {
      id: 5,
      userID: 5,
      looked_at_tags: "Men's Suits",
      total_cost: 500,
    },
    {
      id: 6,
      userID: 6,
      looked_at_tags: "Women's Suits",
      total_cost: 200,
    },
  ];
  await prisma.checkoutpage.createMany({ data: checkoutpage });
};
const CreateBrowsingHistory = async () => {
  const browsinghistory = [
    {
      id: 1,
      userID: 1,
      looked_at_tags: "Women's Fashion",
    },

    {
      id: 2,
      userID: 2,
      looked_at_tags: "Women's Activewear",
    },

    {
      id: 3,
      userID: 3,
      looked_at_tags: "Men's Fashion",
    },

    {
      id: 4,
      userID: 4,
      looked_at_tags: "Men's Activeware",
    },

    {
      id: 5,
      userID: 5,
      looked_at_tags: "Men's Suits",
    },
    {
      id: 6,
      userID: 6,
      looked_at_tags: "Women's Suits",
    },
  ];
  await prisma.browsinghistory.createMany({ data: browsinghistory });
};
await CreateItem();
await CreateBrowsingHistory();
await CreateShoppingCart();
await CreateCheckoutPage();
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
