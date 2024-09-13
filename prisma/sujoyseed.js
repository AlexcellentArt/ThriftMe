const prisma = require(".");
const seed = async () => {
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
  await CreateShoppingCart();
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

await CreateBrowsingHistory();
await CreateShoppingCart();
await CreateCheckoutPage();

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
