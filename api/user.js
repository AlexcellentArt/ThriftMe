const router = require("express").Router();
module.exports = router;
const { compareSync } = require("bcrypt");
const prisma = require("../prisma");
const {
  isLoggedIn,
  decodeToken,
  findUserWithToken,
  // decodeGeneral
} = require("./helpers/auth.js");
const gen_errors = require("./helpers/gen_errors.js");
require("dotenv").config().env;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";

// ### GET ###

// Gets all user
router.get("/api/user", async (req, res, next) => {
  console.log("AAAAAAAAAa")
  const users = await prisma.user.findMany({ where: {},include:{items:true,past_transactions_seller:true,past_transactions_buyer:true,credit_cards:true,addresses:true,browsing_history:true,shopping_cart:true} });
  console.log(users)
  res.json(users);
  // const decode = await decodeToken(req.headers.authorization)
  // if(decode.message){return next(decode)}
  // if (!decode.userId){return gen_errors.genericMissingDataError("userId","token")}
  // console.log("vvvvvvvvvvvvvvvvvvv")

  // try {
  //   const user = await prisma.user.findMany({ where: { id:id },include:{favorites:true,items:true,past_transactions_seller:true,past_transactions_buyer:true,credit_cards:true,addresses:true,browsing_history:true,shopping_cart:true} });
  //   res.json(user);
  // } catch (error) {
  //   next(error);
  // }
});
// const validateInputs = async (inputs) => {
//   const inputs = { name, email, password } = await req.body;
//   console.log(inputs)
//   const missing = gen_errors.hasMissingInputs(inputs,["name", "email", "password"],"user")
//   if (missing){
//       return next(missing)
//   }
//   // const lengthViolations = gen_errors.hasLengthViolations()
//   // if (lengthViolations){}
//   // const notUnique = await gen_errors.isNotUnique("user","email",email);
//   // if (notUnique) {next(notUnique)}
//   return null
// }

router.post("/api/user/other", async (req, res, next) => {
  const {id , getItems} = await req.body()
  if (!id){gen_errors.genericMissingDataError(["id"],"public_info request")}
  const user = await prisma.user.findMany({ where: {id},include:{items:true}});
  const info = {"name":user.name}
  if (getItems){info["items"] = user.items}
  res.json({"name":user.name});
})

router.post("/api/user/login", async (req, res, next) => {
  try {
    const { email, password } = await req.body;
    const user = await prisma.user.findUnique({ where: { email },include:{shopping_cart:true} });
    if (!user) {
      return next(gen_errors.genericNotFoundError("user", "email", email));
    }
    if (!compareSync(password, user.password)) {
      return next(
        gen_errors.genericViolationDataError("input", "password", "wrong")
      );
    }
    const token = jwt.sign({ userId: user.id }, JWT);
    console.log(token);
    res.json({ user, token, shopping_cart:user.shopping_cart,is_admin:user.is_admin });
  } catch (error) {
    next(error);
  }
});
router.post("/api/user/register", async (req, res, next) => {
  try {
    const inputs = await req.body;
    console.log("trying to register...");
    const exists = await prisma.user.findUnique({
      where: { email: inputs.email },
    });
    if (exists) {
      console.log("EXISTS");
      return next(
        gen_errors.genericViolationDataError(
          "user",
          "email",
          "already in usage"
        )
      );
    }
    // encrypt password
    const salt = await bcrypt.genSalt(13);
    inputs["password"] = await bcrypt.hash(inputs["password"], salt);
    // validateInputs
    const user = await prisma.user.create({ data: inputs});
    // automatically make cart and browsing history
    await prisma.browsing_History.create({data: { user_id:user.id,looked_at_tags:[] }});
    await prisma.shopping_Cart.create({ data: { user_id:user.id, item_dict:{}, total_cost:0 }  });
    const token = jwt.sign({ userId: user.id }, JWT);
    console.log(token);
    res.json({ user: user, token:token });
  } catch (error) {
    next(error);
  }
});
// router.get("/favorite", async (req, res, next) => {
//   const { id, item_id } = await req.body;
//   const user = await prisma.user.findUnique({ where: { id: id } });
//   if (!user) {
//     return next(gen_errors.genericNotFoundError("user", "id", id));
//   }
//   console.log("EXISTS");
//   user.favorites.findUnique({ where: { id: item_id } });
//   res.json(user)
// });

router.get("/api/user/me", async (req, res, next) => {
  try {
      const decode = await decodeToken(req.headers.token)
      if(decode.message){return next(decode)}
      if (!decode.userId){return gen_errors.genericMissingDataError("userId","token")}
    const id = decode.userId
    const user = await prisma.user.findUnique({ where: { id:id },include:{items:true,past_transactions_seller:true,past_transactions_buyer:true,addresses:true,credit_cards:true,browsing_history:true,shopping_cart:true} });
    //redit_cards:true --- need to replace BigInt with something else
    console.log("user:",user)
    // const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      return next(gen_errors.genericNotFoundError("user", "id", id));
    }
    // decode credit cards pin first
    // user.credit_cards = user.credit_cards.map((card)=>{
    //   card.pin = decodeGeneral(card.pin)
    //   return card
    // })
    res.json(user);
  } catch (error) {
    next(error);
  }
});
// router.get("/favorite/:id", async (req, res, next) => {
//   console.log("FAVORITE")
//   // const payload = await jwt.verify(req.headers.token, JWT);
//   const id = +req.params.id;
//   // const user = await prisma.user.findUnique({ where: { id: token } });
//   // const user = await findUserWithToken(req.headers.token)
//   const decode = await decodeToken(req.headers.token)
//   try {
//     if(decode.message){return next(decode)}
//     if (!decode.userId){return gen_errors.genericMissingDataError("userId","token")}
  
//     const user = await prisma.user.findUnique({ where: { id:decode.userId },include:{favorites:true} });
//     if (!user) {
//       return next(gen_errors.genericNotFoundError("user", "id", id));
//     }
//     const inFavorites = user.favorites.includes(id)
//     // user.favorites.findUnique({ where: { id: id } });
//     res.json({"is_favorite":inFavorites})
//   } catch (error) {
//     return next(error)
//   }
// })
// Returns user matching id
router.get("/api/user/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return next(gen_errors.genericNotFoundError("user", "id", id));
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});
router.post("/api/user/shop/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    console.log(id)
    if (!id){return next(gen_errors.genericMissingDataError(["id"],"shop request"))}
    const user = await prisma.user.findUnique({ where: { id:id },include:{items:true} });
    console.log(user)
    res.json({items:user.items,shop_name:`${user.name}'s Shop`,username:user.name,shop_tagline:"Trending Now",id:id});
  } catch (error) {
    next(error);
  }
});
// ### POST ###
router.post("/api/user", async (req, res, next) => {
  try {
    const inputs = ({ name, email, password } = await req.body);
    console.log(inputs);
    const missing = gen_errors.hasMissingInputs(
      inputs,
      ["name", "email", "password"],
      "user"
    );
    if (missing) {
      next(missing);
    }
    const user = await prisma.user.create({ data: inputs});
    // automatically make cart and browsing history
    const browsing_History = await prisma.browsing_History.create({data: { user_id:user.id,looked_at_tags:[] }});
    const shopping_cart = await prisma.shopping_Cart.create({ data: { user_id:user.id, item_dict:{}, total_cost:0 }  });

    res.json(user);
  } catch (error) {
    next(error);
  }
});
// ### PUT ###
// updates favorite
// router.put("/favorite", async (req, res, next) => {
//   console.log("FAVORITE")
//   try {
//     const decode = await decodeToken(req.headers.token)
//     if(decode.message){return next(decode)}
//     if (!decode.userId){return gen_errors.genericMissingDataError("userId","token")}
//   const id = decode.userId

//   const user = await prisma.user.findUnique({ where: { id:id },include:{favorites:true,browsing_history:true,} });
//   console.log("user:",user)
//   const { item_id } = await req.body;
//   // const user = await prisma.user.findUnique({ where: { id: id } });
  
//   if (!user) {
//     return next(gen_errors.genericNotFoundError("user", "id", id));
//   }
//   if (!item_id) {
//     // console.error(gen_errors.genericMissingDataError("body", "item_id", id))
//     return next(gen_errors.genericMissingDataError("item_id", "body", id));
//   }
//   console.log("EXISTS");
//   const ids = user.favorites.length > 0 ? user.favorites.map((obj)=>{return {id:obj.id}}):[]
//   const idx =  user.favorites.length > 0 ? ids.findIndex(item_id):-1
//   // /? false:user.favorites.includes(item_id)
//   // .findUnique({ where: { id: item_id } })
//   console.log(idx)
//   if (idx === -1){ids.push({id:item_id})}
//   else{ids.splice(idx,1)}
//   console.log(ids)
//   if (ids === undefined){console.log("ERRR")}
//   const data = await prisma.user.update({
//     where: {
//       id: id,
//     },
//     data: {
//       favorites: {
//         set: ids,
//       },
//     },
//     include: {
//       favorites: true,
//     },
//   });
//   return res.json(data)
//   } catch (error) {
//     return next(error)
//   }
//   // if (inFavorites === true) {
//   //   const data = await prisma.user.update({
//   //     where: {
//   //       id: id,
//   //     },
//   //     data: {
//   //       favorites: {
//   //         disconnect: [{ id: item_id }],
//   //       },
//   //     },
//   //     include: {
//   //       favorites: true,
//   //     },
//   //   });

//   //   res.json(data);
//   // } else {
//   //   const data = await prisma.user.update({
//   //     where: {
//   //       id: id,
//   //     },
//   //     data: {
//   //       favorites: {
//   //         connect: [{ id: item_id }],
//   //       },
//   //     },
//   //     include: {
//   //       favorites: true,
//   //     },
//   //   });

//   //   res.json(data);
//   // }
// });
// Updates user
router.put("/api/user/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.user.findUnique({ where: { id } });
    if (!exists) {
      return next(gen_errors.genericNotFoundError("user", "id", id));
    }
    console.log("not unique reached");
    const body = ({ name, email, password, is_admin } = await req.body);
    // checking if not already set to that.
    if (exists.name != body.name) {
      body["name"] = body.name;
    }
    if (exists.email !=  body.email) {
      if (!body.email)
      {
        body.email = exists.email
      }
      else{
        const email = body.email
        const notUnique = await prisma.user.findUnique({ where: { email } });
        if (notUnique) {
          next(gen_errors.isNotUnique("user", "email", email));
        }
      }
    }
    console.log("past uniqe checks")
    if (exists.password != body.password) {
      body["password"] =  body.password;
    }
    if (exists.is_admin != body.is_admin) {
      body["is_admin"] =  body.is_admin;
    }
    console.log("past checks")
    console.log("update",body);
    const update = await prisma.user.update({
      where: { id },
      data: body,
    });
    res.json(update);
  } catch (error) {
    next(error);
  }
});

// ### DELETE ###
// deletes user matching id
router.delete("/api/user/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return next(gen_errors.genericNotFoundError("user", "id", id));
    }
    if (user.is_admin === true){
      // get admin count
      const adminAmount = await prisma.user.count({
        select: {
          is_admin:true
          },
        },
      )
      console.log("Admins in system:"+adminAmount.is_admin)
      // if deleting , reject delete request
      if (adminAmount.is_admin - 1 <= 1)
      {
        return next({status:400,message:"There must be at least one admin in existence."})
      }
    }
    await prisma.user.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
