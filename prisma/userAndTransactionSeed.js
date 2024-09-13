const prisma = require("../prisma");
const seed = async () => {
    const createUsers = async () => {
        const users = [
            {name:"Larry",email:"larry@Larrybird.com",password:"wordTheB1rd",favorites:[1,2],past_transactions_seller:[3],past_transactions_buyer:[2]},
            {name:"Susan",email:"susan@gmail.com",password:"suzieQ",favorites:[1,3,2],past_transactions_seller:[2],past_transactions_buyer:[1]},
            {name:"Julio",email:"jFine@gmail",password:"huD1sGuy",favorites:[3,1],past_transactions_seller:[1],past_transactions_buyer:[3]},
        ];
        await prisma.user.createMany({ data: users });
      };
      const createTransactions = async () => {
        const transactions = [
            {seller_id:3,buyer_id:2,item_dict:{1:1},total_cost:40,tags:["Blue"]},
            {seller_id:2,buyer_id:1,item_dict:{1:1},total_cost:40,tags:["Blue"]},
            {seller_id:1,buyer_id:3,item_dict:{1:1},total_cost:40,tags:["Blue"]},
            {seller_id:3,buyer_id:2,item_dict:{1:1},total_cost:40,tags:["Blue"]}
        ];
        await prisma.user.createMany({ data: transactions });
      };
      await createUsers();
      await createTransactions();
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
