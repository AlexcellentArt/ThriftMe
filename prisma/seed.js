const prisma = require("../prisma");
const bcrypt = require("bcrypt");
const { itemGenerator, userGenerator } = require("../faker_generator/index");

// ### HELPER FUNCTIONS ###
const randNumString = (length, digitMin = 0) => {
  const arr = [];
  while (length > 0) {
    arr.push(randDigit(digitMin, 9));
    length -= 1;
  }
  return arr.join("");
};
const randDigit = (min, max) => {
  return Math.max(min, Math.floor(Math.random() * (max + 1)));
};
const padZerosToLength = (input, length) => {
  if (`${input}`.length > length) {
    return `${input}`;
  }
  const arr = [input];
  while (length !== 0) {
    arr.unshift(0);
    length -= 1;
  }
  return arr.join("");
};
const mmyy = () => {
  return [
    padZerosToLength(randDigit(1, 9), 1),
    padZerosToLength(randDigit(1, 12), 1),
  ].join("/");
};
const GenTemplate = (base, suffix, prefix) => {
  const comp = [];
  if (prefix) {
    comp.push(prefix[randDigit(0, prefix.length - 1)]);
  }
  comp.push(base[randDigit(0, base.length - 1)]);
  if (suffix) {
    comp.push(suffix[randDigit(0, suffix.length - 1)]);
  }
  return comp.join(" ").trim();
};

const seed = async () => {
  // ### SALT ###
  const salt = await bcrypt.genSalt(13);
  const createUsers = async () => {
    let users = [
      //Larry, Susan, and Julio simulate users who have sold and bought
      { name: "Larry", email: "larry@Larrybird.com", password: "wordTheB1rd" },
      { name: "Susan", email: "susan@gmail.com", password: "suzieQ" },
      { name: "Julio", email: "jFine@gmail", password: "huD1sGuy" },
      //Laura Piglet simulates someone who's only sold
      {
        name: "Laura Piglet",
        email: "lauP@piggemail",
        password: "3LilPiggies",
      },
      //Melissa Cat simulates someone who's only favorite'd
      { name: "Melissa Cat", email: "mcat@meowmail", password: "lemeow" },
      //Roger Rabbit and below simulates someone who's only bought
      { name: "Roger Rabbit", email: "rrabit@toonmail", password: "jessica" },
      { name: "Jessica Rabbit", email: "jrabit@toonmail", password: "r0g3r" },
      { name: "Clara", email: "clara@gmail.com", password: "h1" },
      {
        name: "Barry B Benson",
        email: "bbenson@gmail.com",
        password: "beemoviescript",
      },
      { name: "Doom Guy", email: "dGuy@hellmail.arrgh", password: "RIPdaisy" },
      { name: "Isabelle", email: "isabelle@nookazon", password: "Helpb3ll" },
      // L is made so sparse to make logging in and out for testing purposes as easy and fast as possible. Making an admin for ease of testing those as well.
      { name: "L", email: "l@l", password: "l", is_admin: true },
      { name: "K", email: "k@k", password: "k", is_admin: true },
      { name: "A", email: "a@a", password: "a", is_admin: true },
      { name: "S", email: "s@s", password: "s", is_admin: true },
    ];
    const generated = userGenerator.generateManyMockUserData(50);
    users = [...users, ...generated];
    // console.log(users)
    // encrypt passwords
    for (let index = 0; index < users.length; index++) {
      users[index].password = await bcrypt.hash(users[index].password, salt);
    }
    const made = await prisma.user.createMany({ data: users });
    // prisma.user.g
    return await prisma.user.findMany({ where: {} });
  };
  const createTransactions = async () => {
    const valid_transactions = [
      {
        seller_id: 3,
        item_dict: { 1: 1 },
        total_cost: 40,
        tags: ["dressy", "red", "nightout", "men's fashion"],
      },
      {
        seller_id: 1,
        item_dict: { 1: 3 },
        total_cost: 15,
        tags: ["tulum", "summer", "dress", "women's fashion"],
      },
      {
        seller_id: 2,
        item_dict: { 1: 1 },
        total_cost: 5,
        tags: [
          "shirt",
          "hawaii",
          "travel",
          "women's activewear",
          "men's activeware",
        ],
      },
      {
        seller_id: 1,
        item_dict: { 4: 1 },
        total_cost: 100,
        tags: ["men's suits", "women's suits"],
      },
      {
        seller_id: 3,
        item_dict: { 1: 1 },
        total_cost: 20,
        tags: ["dressy", "red", "nightout", "men's fashion"],
      },
      {
        seller_id: 1,
        item_dict: { 4: 1 },
        total_cost: 100,
        tags: ["men's suits", "women's suits"],
      },
    ];
    const formatAddress = (obj) => {
      return (
        obj.street + ` ${obj.apartment && obj.apartment} ` + obj.city + ` ${obj.zip}`
      );
    }
    const formatCreditCard = (obj) => {
      return `${obj.pin} ${obj.exp_date}`;
    }
    const generated_transactions = [];
    // get users with items
    const sellers = await prisma.user.findMany({
      where: {
        items: {
          some: {},
        },
      },
      include: {
        items: true,
      },
    });
    // get users with addresses and credit cards
    const buyers = await prisma.user.findMany({
      where: {
        addresses: {
          some: {},
        },
        credit_cards: {
          some: {},
        },
      },
      include: {
        addresses: true,
        credit_cards: true,
      },
    });
    let needed = buyers.length - 1;
    while (needed != 0) {
      const buyer = buyers[needed];
      let howManyTransactions = randDigit(1, 3);
      {
        let seller = undefined;
        while (seller === undefined) {
          // pick seller who is not user
          const pickedSeller = sellers[randDigit(0, sellers.length - 1)];
          if (buyer.id !== pickedSeller.id) {
            seller = pickedSeller;
          }
        }
        // make base and pick random credit card and address from buyer
        const base = {
          seller_id: seller.id,
          buyer_id: buyer.id,
          shipping_address:
          formatAddress(buyer.addresses[randDigit(0, buyer.addresses.length - 1)]),
          paying_card:
            formatCreditCard(buyer.credit_cards[randDigit(0, buyer.credit_cards.length - 1)]),
          item_dict: {},
          total_cost: 0,
          tags: [],
        };
        // decide amount of items in cart
        let qty = randDigit(1, 3);
        const pickedSoFar = [];
        while (qty > 0) {
          // get item
          let picked = undefined;
          let pickloopLimit = 2
          while (picked === undefined) {
            // only set picked if not already in pickedSoFar
            const pick = seller.items[randDigit(0, seller.items.length - 1)];
            if (!pickedSoFar.includes(pick.id)) {
              picked = pick;
              break;
            }
            pickloopLimit -= 1
            // if gone over limit then default to one transaction that works
            if(pickloopLimit === 0){break;}
          }
          if (pickloopLimit === 0){
            // forcibly make transaction a valid one
            const validParts = valid_transactions[randDigit(0,valid_transactions.length-1)]
            base.item_dict = validParts.item_dict
            base.seller_id = validParts.seller_id
            base.tags = validParts.tags
            base.total_cost = validParts.total_cost
            qty -= 1
            break
          }
          // add item to pickedSoFar
          pickedSoFar.push(picked.id);
          // get random amount
          const amount = randDigit(1, 10);
          // set id as key with value as amount
          base.item_dict[picked.id] = amount;
          // add to total
          base.total_cost += picked.price * amount;
          // add to tags
          picked.tags.forEach((tag) => {
            if (!base.tags.includes(tag)) {
              base.tags.push(tag);
            }
          });
          qty -= 1;
        }
        // now that all the same processes as cart have been run through, make transaction
        generated_transactions.push(base);
        needed -= 1;
      }
    }
    await prisma.past_Transactions.createMany({ data: generated_transactions });
  };
  const CreateItem = async (users) => {
    const item = [
      {
        seller_id: 1,
        name: "Tulum Dress",
        price: 5,
        description: "Perfect 2 piece dress for Tulum",
        default_photo:
          "https://shopannalaura.com/cdn/shop/products/paradisemaxidress2.jpg?v=1628458759&width=1445",
        additional_photos: [""],
        tags: ["tulum", "summer", "dress", "women's fashion"],
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
        tags: [
          "shirt",
          "hawaii",
          "travel",
          "women's activewear",
          "men's activeware",
        ],
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
        tags: ["dressy", "red", "nightout", "men's fashion"],
      },
      {
        seller_id: 4,
        name: "Cool Suit",
        price: 100,
        description: "Perfect suit",
        default_photo:
          "https://i5.walmartimages.com/seo/Wehilion-Mens-Suits-Set-Slim-Fit-Men-3-Piece-Dress-Suit-Prom-Blazer-Wedding-Formal-Jacket-Vest-Pants-Navy-Blue-XL_ce590b9b-405f-4948-af6a-a817cd66f9cd.4e404934c089dc5fabeb4616f32245e6.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
        additional_photos: [""],
        tags: ["men's suits", "women's suits"],
      },
      {
        seller_id: 4,
        name: "Cooler Suit",
        price: 200,
        description: "Sequin suit",
        default_photo:
          "https://i.ebayimg.com/images/g/neAAAOSwRq9dXg6w/s-l1000.jpg",
        additional_photos: [""],
        tags: ["men's suits", "women's suits", "sequins"],
      },
    ];
    const generatedItems = await itemGenerator.generateMockProductData(users);
    await prisma.item.createMany({ data: [...item, ...generatedItems] });
    return await prisma.item.findMany({ where: {} });
  };
  // We are Creating Shopping Cart, Checkout Page, Browsing History
  const CreateShoppingCart = async (users, items) => {
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
    // const shopping_cart = [
    //   {
    //     // id: 1,
    //     user_id: 1, // User Larry
    //     item_dict: { 3: 2, 1: 2 }, // $20 Roger Rabbit Shirt x 3 , $5 Tulum Dress x 2
    //     total_cost: 50,
    //   },

    //   {
    //     // id: 2,
    //     user_id: 2, // User Susan
    //     item_dict: { 1: 2, 2: 2 }, // $5 Tulum Dress x 2, $10 Hawaii Shirt x 2
    //     total_cost: 30,
    //   },

    //   {
    //     // id: 3,
    //     user_id: 3, // User Julio
    //     item_dict: { 1: 2, 3: 4 }, // $5 Tulum Dress x 2, $20 Roger Rabbit Shirt x 4
    //     total_cost: 100,
    //   },

    //   {
    //     // id: 4,
    //     user_id: 4, // User Laura Piglet
    //     item_dict: { 4: 3 }, // $100 Cool Suit x 3
    //     total_cost: 300,
    //   },

    //   {
    //     // id: 5,
    //     user_id: 5, // User Melissa Cat
    //     item_dict: { 2: 10 }, // $10 Hawaii Shirt x 10
    //     total_cost: 200,
    //   },
    //   {
    //     // id: 6,
    //     user_id: 6, // User Roger Rabbit
    //     item_dict: { 3: 5, 4: 3 }, // $20 Roger Rabbit Shirt x 5, $100 Cool Suit x 3
    //     total_cost: 400,
    //   },
    //   {
    //     // id: 7,
    //     user_id: 7,
    //     item_dict: { 3: 4, 1: 2 }, // $20 Roger Rabbit Shirt x 4, $10 Hawaii Shirt x 2
    //     total_cost: 90,
    //   },
    //   {
    //     // id: 8,
    //     user_id: 8,
    //     item_dict: { 2: 10 }, // $10 Hawaii Shirt x 10
    //     total_cost: 100,
    //   },
    //   {
    //     // id: 9,
    //     user_id: 9,
    //     item_dict: { 2: 30 }, // $10 Hawaii Shirt x 30
    //     total_cost: 300,
    //   },
    //   {
    //     // id: 10,
    //     user_id: 10,
    //     item_dict: { 4: 4 }, // $100 Cool Suit x 4
    //     total_cost: 400,
    //   },
    //   {
    //     // id: 11,
    //     user_id: 11,
    //     item_dict: { 4: 5 }, // $100 Cool Suit x 5
    //     total_cost: 500,
    //   },
    //   {
    //     // id: 12,
    //     user_id: 12,
    //     item_dict: { 4: 2 }, // $100 Cool Suit x 2
    //     total_cost: 200,
    //   },
    //   {
    //     // id: 13,
    //     item_dict: { 4: 2 }, // $100 Cool Suit x 2
    //     total_cost: 200,
    //   },
    // ];
    const shopping_cart = [];
    let user_id = users.length-1;
    while (user_id != 0) {
      // amount of items in cart
      const base = {user_id:user_id, item_dict: {}, total_cost: 0 };
      let qty = randDigit(1, 3);
      const pickedSoFar = [];
      while (qty > 0) {
        // get item
        let picked = undefined;
        while (picked === undefined) {
          // only set picked if not already in pickedSoFar
          const pick = items[randDigit(0, items.length - 1)];
          if (!pickedSoFar.includes(pick.id)) {
            picked = pick;
          }
        }
        // add item to pickedSoFar
        pickedSoFar.push(picked.id);
        // get random amount
        const amount = randDigit(1, 10);
        // set id as key with value as amount
        base.item_dict[picked.id] = amount;
        // add to total
        base.total_cost += picked.price * amount;
        qty -= 1;
      }
      shopping_cart.push(base);
      user_id -= 1;
      // console.log(user_id, qty);
    }
    await prisma.shopping_Cart.createMany({ data: shopping_cart });
    return await prisma.shopping_Cart.findMany({ where: {} });
  };

  const CreateBrowsingHistory = async () => {
    // const browsing_history = [
    //   {
    //     // id: 1,
    //     user_id: 1, // Larry
    //     looked_at_tags: ["women's fashion"],
    //   },

    //   {
    //     // id: 2,
    //     user_id: 2, // Susan
    //     looked_at_tags: ["women's activewear", "nightlife"],
    //   },

    //   {
    //     // id: 3,
    //     user_id: 3, // Julio
    //     looked_at_tags: ["men's fashion"],
    //   },

    //   {
    //     // id: 4,
    //     user_id: 4, // Laura Piglet
    //     looked_at_tags: ["men's activeware"],
    //   },

    //   {
    //     // id: 5,
    //     user_id: 5, // Melissa Cat
    //     looked_at_tags: ["men's suits", "men's activeware"],
    //   },
    //   {
    //     // id: 6,
    //     user_id: 6, // Roger Rabbit
    //     looked_at_tags: ["women's suits"],
    //   },
    //   {
    //     // id: 7,
    //     user_id: 7,
    //     looked_at_tags: ["women's fashion"],
    //   },

    //   {
    //     // id: 8,
    //     user_id: 8,
    //     looked_at_tags: ["women's activewear", "nightlife"],
    //   },

    //   {
    //     // id: 9,
    //     user_id: 9,
    //     looked_at_tags: ["men's fashion"],
    //   },

    //   {
    //     // id: 10,
    //     user_id: 10,
    //     looked_at_tags: ["men's activeware"],
    //   },

    //   {
    //     // id: 11,
    //     user_id: 11,
    //     looked_at_tags: ["men's suits", "men's activeware"],
    //   },
    //   {
    //     // id: 12,
    //     user_id: 12,
    //     looked_at_tags: ["women's suits"],
    //   },
    // ];

    // get all users and their shopping cart and transactions they were the buyer in
    const users = await prisma.user.findMany({
      where: {},
      include: { shopping_cart: true, past_transactions_buyer: true },
    });
    // make empty browsing history array
    const browsing_history = [];
    // compile tags
    let idx = users.length - 1;
    while (idx != 0) {
      const user = users[idx];
      const tags = []
      user.past_transactions_buyer.length > 0 && user.past_transactions_buyer.forEach((trans) => {
        trans.tags.forEach((tag) => {
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        });
      });
      browsing_history.push({ user_id: user.id, looked_at_tags: tags });
      idx -= 1;
    }
    // const browsing_history = carts.map((cart) => {
    //   return cart.tags;
    // });

    await prisma.browsing_History.createMany({ data: browsing_history });
  };
  const CreateCreditCards = async (users) => {
    const cards = [];
    let user_id = users.length-1;
    while (user_id != 0) {
      // below 4, then plus one to ensure no blanks
      let qty = randDigit(1, 3);
      while (qty > 0) {
        const card = {
          user_id: user_id,
          pin: randNumString(16),
          // cvc: randNumString(3),
          exp_date: mmyy(),
        };
        // if last generated, make default
        if (qty - 1 === 0) {
          card["is_default"] = true;
        }
        cards.push(card);
        qty -= 1;
      }
      user_id -= 1;
      // console.log(user_id, qty);
    }
    /// Now Salting Cards
    for (let index = 0; index < cards.length; index++) {
      cards[index].pin = await bcrypt.hash(cards[index].pin, salt);
    }
    await prisma.credit_Card.createMany({ data: cards });
  };
  const CreateAddresses = async (users) => {
    const name = [
      "Oak",
      "Pine",
      "Beach",
      "Turtle",
      "Rocky",
      "Shire",
      "Bear",
      "Domino",
    ];
    const suffix = [
      "Drive",
      "Lane",
      "Parkway",
      "Corner",
      "Ave",
      "Street",
      "Circle",
      "Place",
      "Gully",
    ];
    const prefix = ["", "", "", "", "", "North", "East", "West", "South"];
    const city_base = [
      "Pelican",
      "Lark",
      "Chicken",
      "Nightingale",
      "Swan",
      "Penguin",
      "Seagull",
      "Fried",
      "Finch",
    ];
    const city_suffix = [
      "City",
      "Town",
      "Ville",
      "Village",
      "Port",
      "Island",
      "Isle",
      "Hamlet",
    ];
    const state = ["GA", "LA", "CA", "TN"];
    // used a bunch of "" in prefix to simulate a 50% chance of not getting one. Not gonna spend time programming in percentage based randomization as I don't want to confuse anyone.
    const addresses = [];
    let user_id = users.length-1;
    while (user_id != 0) {
      // below 4, then plus one to ensure no blanks
      let qty = randDigit(1, 3);
      while (qty > 0) {
        const address = {
          user_id: user_id,
          zip: Number(randNumString(5, 0)),
          city: GenTemplate(city_base, city_suffix),
          state: state[randDigit(0, state.length - 1)],
          street: GenTemplate(name, suffix, prefix),
        };
        // 50 / 50 on if apt num is generated and added
        if (randDigit(0, 1) > 0) {
          address["apartment"] = randNumString(3, 0);
        }
        // if last generated, make default
        if (qty - 1 === 0) {
          address["is_default"] = true;
        }
        addresses.push(address);
        qty -= 1;
      }
      user_id -= 1;
      // console.log(user_id, qty);
    }
    // console.log(addresses);
    await prisma.address.createMany({ data: addresses });
  };
  // all tables are created
  console.log("making users...")
  const users = await createUsers();
  console.log("making items...")
  const items = await CreateItem(users);
  console.log("making carts...")
  const carts = await CreateShoppingCart(users, items);
  console.log("making credit cards...")
  await CreateCreditCards(users);
  console.log("making addresses...")
  await CreateAddresses(users);
  console.log("making transactions...")
  await createTransactions();
  console.log("making browsing history...")
  await CreateBrowsingHistory();

  // final step is adding favorites. For now, the first 5 items in seed are added to Melissa Cat as favorites. She is the only one who starts out with them so testing can be isolated.
  // Might need to make an explicit many to many model for this, but Alex can handle it and it is unlikely to effect operations as of now.
  // prisma.user.update({ where: { id: 5 }, data: { favorite: [1] } });
  // prisma.item.update({ where: { id: 1 }, data: { favorite: [5] } });
  // prisma.user.update({ where: { id: 12 }, data: { favorite: [2, 3] } });
  // prisma.item.update({ where: { id: 2 }, data: { favorite: [12] } });
  // prisma.item.update({ where: { id: 3 }, data: { favorite: [12] } });
};
seed()
  .then(async () => await prisma.$disconnect)
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect;
    process.exit(1);
  });
