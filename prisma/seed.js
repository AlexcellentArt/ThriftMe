const prisma = require("../prisma");
const bcrypt = require('bcrypt');
const seed = async () => {
  const createUsers = async () => {
    const users = [
      //Larry, Susan, and Julio simulate users who have sold and bought
        {name:"Larry",email:"larry@Larrybird.com",password:"wordTheB1rd"},
        {name:"Susan",email:"susan@gmail.com",password:"suzieQ"},
        {name:"Julio",email:"jFine@gmail",password:"huD1sGuy"},
        //Laura Piglet simulates someone who's only sold
        {name:"Laura Piglet",email:"lauP@piggemail",password:"3LilPiggies"},
        //Melissa Cat simulates someone who's only favorite'd
        {name:"Melissa Cat",email:"mcat@meowmail",password:"lemeow"},
        //Roger Rabbit and below simulates someone who's only bought
        {name:"Roger Rabbit",email:"rrabit@toonmail",password:"jessica"},
        {name:"Jessica Rabbit",email:"jrabit@toonmail",password:"r0g3r"},
        {name:"Clara",email:"clara@gmail.com",password:"h1"},
        {name:"Barry B Benson",email:"bbenson@gmail.com",password:"beemoviescript"},
        {name:"Doom Guy",email:"dGuy@hellmail.arrgh",password:"RIPdaisy"},
        {name:"Isabelle",email:"isabelle@nookazon",password:"Helpb3ll"},
        // L is made so sparse to make logging in and out for testing purposes as easy and fast as possible. Making an admin for ease of testing those as well.
        {name:"L",email:"l@l",password:"l",is_admin:true},
    ];
    // encrypt passwords
    const salt = await bcrypt.genSalt(13);
    for (let index = 0; index < users.length; index++)
    {users[index].password = await bcrypt.hash(users[index].password, salt);}
    await prisma.user.createMany({ data: users });
  };
  const createTransactions = async () => {
    const transactions = [
        {seller_id:3,buyer_id:2,item_dict:{1:1},total_cost:40,tags:["dressy", "red", "nightout","men's fashion"]},
        {seller_id:1,buyer_id:2,item_dict:{1:3},total_cost:15,tags:["tulum", "summer", "dress","women's fashion"]},
        {seller_id:2,buyer_id:3,item_dict:{1:1},total_cost:5,tags:["shirt", "hawaii", "travel","women's activewear","men's activeware"]},
        {seller_id:1,buyer_id:6,item_dict:{4:1},total_cost:100,tags:["men's suits", "women's suits"]},
        {seller_id:3,buyer_id:6,item_dict:{1:1},total_cost:20,tags:["dressy", "red", "nightout","men's fashion"]},
        {seller_id:1,buyer_id:5,item_dict:{4:1},total_cost:100,tags:["men's suits", "women's suits"]}
    ];
    await prisma.past_Transactions.createMany({ data: transactions });
  };
  const CreateItem = async () => {
    const item = [
      {
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
        seller_id: 4,
        name: "Cool Suit",
        price: 100,
        description: "Perfect suit",
        default_photo:
          "https://i5.walmartimages.com/seo/Wehilion-Mens-Suits-Set-Slim-Fit-Men-3-Piece-Dress-Suit-Prom-Blazer-Wedding-Formal-Jacket-Vest-Pants-Navy-Blue-XL_ce590b9b-405f-4948-af6a-a817cd66f9cd.4e404934c089dc5fabeb4616f32245e6.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
        additional_photos: [""],
        tags: ["men's suits", "women's suits"]
      },
      {
        seller_id: 4,
        name: "Cooler Suit",
        price: 200,
        description: "Sequin suit",
        default_photo:
          "https://i.ebayimg.com/images/g/neAAAOSwRq9dXg6w/s-l1000.jpg",
        additional_photos: [""],
        tags: ["men's suits", "women's suits","sequins"]
      }
    ];
    await prisma.item.createMany({ data: item });
  };
  // We are Creating Shopping Cart, Checkout Page, Browsing History
  const CreateShoppingCart = async () => {
    //======================
    // shopping_cart id's 1-6 simulate users with accounts.
    // keys in item_dict are the id of an item.
    // In the seed they are limited to:
    // ======================
    // 1: Tulum Dress
    // 2: Hawaiian Shirt
    // 3: Roger Rabbit Shirt
    // 4: Cool Suit
    // ======================
    const shopping_cart = [
      {
        id: 1,
        user_id: 1, // User Larry
        item_dict:{3:2,1:2}, // $20 Roger Rabbit Shirt x 3 , $5 Tulum Dress x 2
        total_cost: 50,
      },

      {
        id: 2,
        user_id: 2, // User Susan
        item_dict:{1:2,2:2}, // $5 Tulum Dress x 2, $10 Hawaii Shirt x 2
        total_cost: 30,
      },

      {
        id: 3,
        user_id: 3, // User Julio
        item_dict:{1:2,3:4},// $5 Tulum Dress x 2, $20 Roger Rabbit Shirt x 4
        total_cost: 100,
      },

      {
        id: 4,
        user_id: 4, // User Laura Piglet
        item_dict:{4:3}, // $100 Cool Suit x 3
        total_cost: 300,
      },

      {
        id: 5,
        user_id: 5, // User Melissa Cat
        item_dict:{2:10}, // $10 Hawaii Shirt x 10
        total_cost: 200,
      },
      {
        id: 6,
        user_id: 6, // User Roger Rabbit
        item_dict:{3:5,4:3}, // $20 Roger Rabbit Shirt x 5, $100 Cool Suit x 3
        total_cost: 400,
      },
      {
        id: 7,
        user_id:7,
        item_dict:{3:4,1:2}, // $20 Roger Rabbit Shirt x 4, $10 Hawaii Shirt x 2
        total_cost: 90,
      },
      {
        id: 8,
        user_id:8,
        item_dict:{2:10}, // $10 Hawaii Shirt x 10
        total_cost: 100,
      },
      {
        id: 9,
        user_id:9,
        item_dict:{2:30}, // $10 Hawaii Shirt x 30
        total_cost: 300,
      },
      {
        id: 10,
        user_id:10,
        item_dict:{4:4}, // $100 Cool Suit x 4
        total_cost: 400,
      },
      {
        id: 11,
        user_id:11,
        item_dict:{4:5}, // $100 Cool Suit x 5
        total_cost: 500,
      },
      {
        id: 12,
        user_id:12,
        item_dict:{4:2}, // $100 Cool Suit x 2
        total_cost: 200,
      },
      {
        id: 13,
        item_dict:{4:2}, // $100 Cool Suit x 2
        total_cost: 200,
      }
    ];

    await prisma.shopping_Cart.createMany({ data: shopping_cart });
  };

const CreateBrowsingHistory = async () => {
  const browsing_history = [
    {
      id: 1,
      user_id: 1, // Larry
      looked_at_tags: ["women's fashion"],
    },

    {
      id: 2,
      user_id: 2, // Susan
      looked_at_tags: ["women's activewear","nightlife"],
    },

    {
      id: 3,
      user_id: 3, // Julio
      looked_at_tags: ["men's fashion"],
    },

    {
      id: 4,
      user_id: 4, // Laura Piglet
      looked_at_tags: ["men's activeware"],
    },

    {
      id: 5,
      user_id: 5, // Melissa Cat
      looked_at_tags: ["men's suits","men's activeware"],
    },
    {
      id: 6,
      user_id: 6, // Roger Rabbit
      looked_at_tags: ["women's suits"],
    },
  ];
  await prisma.browsing_History.createMany({ data: browsing_history });
};
const CreateCreditCards = async () => {
  const cards = [
    {
      // id:1,
      user_id: 12,
      pin:4000000000000002,
      cvc:111,
      exp_date: new Date("2019-01-16")
    },
    {
      // id:2,
      user_id: 12,
      pin:4000100100000001,
      cvc:212,
      exp_date: new Date("2029-02-12")
    }]
    await prisma.credit_Card.createMany({data:cards})
  }
  const CreateAddresses = async () => {
    const addresses = [
      {
        user_id:12,
        zip : 41867,
        street:"Domino Drive",
        apartment:"Turtle 204"
      },
      {
        user_id:12,
        zip : 73041,
        street:"Hurricane Lane"
      }]
      await prisma.address.createMany({data:addresses})
  }
// all tables are created
await createUsers();
await CreateItem();
await CreateBrowsingHistory();
await CreateShoppingCart();
await createTransactions();
await CreateCreditCards();
await CreateAddresses();
// final step is adding favorites. For now, the first 5 items in seed are added to Melissa Cat as favorites. She is the only one who starts out with them so testing can be isolated.
// Might need to make an explicit many to many model for this, but Alex can handle it and it is unlikely to effect operations as of now.
prisma.user.update({where:{id:5},data:{favorite:[1]}})
prisma.item.update({where:{id:1},data:{favorite:[5]}})
prisma.user.update({where:{id:12},data:{favorite:[2,3]}})
prisma.item.update({where:{id:2},data:{favorite:[12]}})
prisma.item.update({where:{id:3},data:{favorite:[12]}})
};
seed()
  .then(async () => await prisma.$disconnect)
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect;
    process.exit(1);
  });