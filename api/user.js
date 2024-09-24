const router = require("express").Router();
module.exports = router;
const { compareSync } = require("bcrypt");
const prisma = require("../prisma");
const {
  isLoggedIn,
  decodeToken,
  findUserWithToken,
} = require("./helpers/auth.js");
const gen_errors = require("./helpers/gen_errors.js");
require("dotenv").config().env;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";

// ### GET ###

// Gets all user
router.get("/", async (req, res, next) => {
  try {
    const user = await prisma.user.findMany();
    res.json(user);
  } catch (error) {
    next(error);
  }
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

router.post("/login", async (req, res, next) => {
  console.log("LOPGGING IN");
  try {
    const { email, password } = await req.body;
    const salt = await bcrypt.genSalt(13);
    const user = await prisma.user.findUnique({ where: { email } });
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
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});
router.post("/register", async (req, res, next) => {
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
    const user = await prisma.user.create({ data: inputs });
    const token = jwt.sign({ userId: user.id }, JWT);
    console.log(token);
    res.json({ user: user, token });
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

router.get("/me", async (req, res, next) => {
  try {
      const decode = await decodeToken(req.headers.token)
      if(decode.message){return next(decode)}
      if (!decode.userId){return gen_errors.genericMissingDataError("userId","token")}
    const id = decode.userId
    const user = await prisma.user.findUnique({ where: { id:id },include:{favorites:true,items:true,past_transactions_seller:true,past_transactions_buyer:true,addresses:true,browsing_history:true,shopping_cart:true} });
    //redit_cards:true --- need to replace BigInt with something else
    console.log("user:",user)
    // const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      return next(gen_errors.genericNotFoundError("user", "id", id));
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});
router.get("/favorite/:id", async (req, res, next) => {
  console.log("FAVORITE")
  // const payload = await jwt.verify(req.headers.token, JWT);
  const id = +req.params.id;
  // const user = await prisma.user.findUnique({ where: { id: token } });
  // const user = await findUserWithToken(req.headers.token)
  const decode = await decodeToken(req.headers.token)
  try {
    if(decode.message){return next(decode)}
    if (!decode.userId){return gen_errors.genericMissingDataError("userId","token")}
  
    const user = await prisma.user.findUnique({ where: { id:decode.userId },include:{favorites:true} });
    if (!user) {
      return next(gen_errors.genericNotFoundError("user", "id", id));
    }
    const inFavorites = user.favorites.includes(id)
    // user.favorites.findUnique({ where: { id: id } });
    res.json({"is_favorite":inFavorites})
  } catch (error) {
    return next(error)
  }
})
// Returns user matching id
router.get("/:id", async (req, res, next) => {
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
// ### POST ###
router.post("/", async (req, res, next) => {
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
    // const lengthViolations = gen_errors.hasLengthViolations()
    // if (lengthViolations){}
    // const notUnique = await gen_errors.isNotUnique("user","email",email);
    // if (notUnique) {next(notUnique)}
    const user = await prisma.user.create({ data: inputs });
    res.json(user);
  } catch (error) {
    next(error);
  }
});
// ### PUT ###
// updates favorite
router.put("/favorite", async (req, res, next) => {
  console.log("FAVORITE")
  try {
    const decode = await decodeToken(req.headers.token)
    if(decode.message){return next(decode)}
    if (!decode.userId){return gen_errors.genericMissingDataError("userId","token")}
  const id = decode.userId

  const user = await prisma.user.findUnique({ where: { id:id },include:{favorites:true,browsing_history:true,} });
  console.log("user:",user)
  const { item_id } = await req.body;
  // const user = await prisma.user.findUnique({ where: { id: id } });
  
  if (!user) {
    return next(gen_errors.genericNotFoundError("user", "id", id));
  }
  if (!item_id) {
    // console.error(gen_errors.genericMissingDataError("body", "item_id", id))
    return next(gen_errors.genericMissingDataError("item_id", "body", id));
  }
  console.log("EXISTS");
  const ids = user.favorites.length > 0 ? user.favorites.map((obj)=>{return {id:obj.id}}):[]
  const idx =  user.favorites.length > 0 ? ids.findIndex(item_id):-1
  // /? false:user.favorites.includes(item_id)
  // .findUnique({ where: { id: item_id } })
  console.log(idx)
  if (idx === -1){ids.push({id:item_id})}
  else{ids.splice(idx,1)}
  console.log(ids)
  if (ids === undefined){console.log("ERRR")}
  const data = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      favorites: {
        set: ids,
      },
    },
    include: {
      favorites: true,
    },
  });
  return res.json(data)
  } catch (error) {
    return next(error)
  }
  // if (inFavorites === true) {
  //   const data = await prisma.user.update({
  //     where: {
  //       id: id,
  //     },
  //     data: {
  //       favorites: {
  //         disconnect: [{ id: item_id }],
  //       },
  //     },
  //     include: {
  //       favorites: true,
  //     },
  //   });

  //   res.json(data);
  // } else {
  //   const data = await prisma.user.update({
  //     where: {
  //       id: id,
  //     },
  //     data: {
  //       favorites: {
  //         connect: [{ id: item_id }],
  //       },
  //     },
  //     include: {
  //       favorites: true,
  //     },
  //   });

  //   res.json(data);
  // }
});
// Updates user
router.put("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.user.findUnique({ where: { id } });
    if (!exists) {
      return next(gen_errors.genericNotFoundError("user", "id", id));
    }
    console.log("not unique reached");
    const body = ({ name, email, password } = await req.body);
    // checking if not already set to that.
    if (user.name != name) {
      body["name"] = name;
    }
    if (user.email != email) {
      const notUnique = await gen_errors.isNotUnique("user", "email", email);
      if (notUnique) {
        next(notUnique);
      }
    }
    if (user.password != password) {
      body["password"] = password;
    }
    console.log("update");
    const user = await prisma.user.update({
      where: { id },
      data: body,
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// ### DELETE ###
// deletes user matching id
router.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const id = +req.params.id;
    const exists = await prisma.user.findUnique({ where: { id } });
    if (!exists) {
      return next(gen_errors.genericNotFoundError("user", "id", id));
    }
    await prisma.user.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
