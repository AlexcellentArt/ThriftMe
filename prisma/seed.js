const prisma = require("../prisma");
const seed = async () => {
  // move Andre's names to new users Laura Piglet,Melissa Cat,Roger Rabbit
  const CreateItem = async () => {
    const item = [
      {
        id: 1,
        seller_id: 1,
        name: "Tulum Dress",
        price: 5,
        description: "Perfect 2 piece dress for Tulum",
        default_photo:
          "https://shopannalaura.com/cdn/shop/products/paradisemaxidress2.jpg?v=1628458759&width=1445",
        additional_photos: [""],
        tags: ["tulum", "summer", "dress","women's fashion"],
      },

      {
        id: 2,
        seller_id: 2,
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
        tags: ["shirt", "hawaii", "travel","women's activewear","men's activeware"],
      },

      {
        id: 3,
        seller_id: 3,
        name: "Roger Rabbit Shirt",
        price: 20,
        description: "Dress shirt for going out",
        default_photo:
          "https://www.billioncreation.com/wp-content/uploads/2017/10/HUNDREDSXRRSOUVSHIRT-PARENT__1.jpg",
        additional_photos: [
          "https://www.billioncreation.com/wp-content/uploads/2017/10/HUNDREDSXRRSOUVSHIRT-PARENT__2.jpg",
        ],
        tags: ["dressy", "red", "nightout","men's fashion"],
      },
      {
        id: 4,
        seller_id: 4,
        name: "Cool Suit",
        price: 100,
        description: "Perfect suit",
        default_photo:
          "https://i5.walmartimages.com/seo/Wehilion-Mens-Suits-Set-Slim-Fit-Men-3-Piece-Dress-Suit-Prom-Blazer-Wedding-Formal-Jacket-Vest-Pants-Navy-Blue-XL_ce590b9b-405f-4948-af6a-a817cd66f9cd.4e404934c089dc5fabeb4616f32245e6.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
        additional_photos: [""],
        tags: ["men's suits", "women's suits"],
      },
    ];
    await prisma.item.createMany({ data: item });
  };
  // We are Creating Shopping Cart, Checkout Page, Browsing History
  const CreateShoppingCart = async () => {
    const shopping_cart = [
      {
        id: 1,
        user_id: 1,
        item_dict:{3:2,1:2},
        total_cost: 50,
      },

      {
        id: 2,
        user_id: 2,
        item_dict:{1:2,2:2},
        total_cost: 30,
      },

      {
        id: 3,
        user_id: 3,
        item_dict:{1:2,3:4},
        total_cost: 100,
      },

      {
        id: 4,
        user_id: 4,
        item_dict:{},
        total_cost: 300,
      },

      {
        id: 5,
        user_id: 5,
        item_dict:{3:10},
        total_cost: 200,
      },
      {
        id: 6,
        user_id: 6,
        item_dict:{3:5,4:3},
        total_cost: 400,
      },
      {
        id: 7,

        item_dict:{3:4,1:2},
        total_cost: 90,
      },
  
      {
        id: 8,

        item_dict:{2:10},
        total_cost: 100,
      },
  
      {
        id: 9,

        item_dict:{2:30},
        total_cost: 300,
      },
  
      {
        id: 10,

        item_dict:{4:4},
        total_cost: 400,
      },
  
      {
        id: 11,

        item_dict:{4:5},
        total_cost: 500,
      },
      {
        id: 12,

        item_dict:{4:2},
        total_cost: 200,
      }
    ];

    await prisma.shopping_cart.createMany({ data: shopping_cart });
  };

const CreateBrowsingHistory = async () => {
  const browsinghistory = [
    {
      id: 1,
      user_id: 1,
      looked_at_tags: ["women's fashion"],
    },

    {
      id: 2,
      user_id: 2,
      looked_at_tags: ["women's activewear","nightlife"],
    },

    {
      id: 3,
      user_id: 3,
      looked_at_tags: ["men's fashion"],
    },

    {
      id: 4,
      user_id: 4,
      looked_at_tags: ["men's activeware"],
    },

    {
      id: 5,
      user_id: 5,
      looked_at_tags: ["men's suits","men's activeware"],
    },
    {
      id: 6,
      user_id: 6,
      looked_at_tags: ["women's suits"],
    },
  ];
  await prisma.browsing_history.createMany({ data: browsinghistory });
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
