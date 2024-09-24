require("dotenv").config().env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require("../../prisma");
const JWT = process.env.JWT || 'shhh'
const isLoggedIn = async(req, res, next)=>{
  try {
    console.log(req.headers.token)
    req.user = await findUserWithToken(req.headers.token)
    if (!req.user){throw new Error("NOT LOGGED IN")}
    next()
  } catch (error) {
    next()
  }
}
const isAdmin = async(req, res, next)=>{
  try {
    console.log(req.headers)
    req.user = await findUserWithToken(req.headers.isAdmin)
    next()
  } catch (error) {
    next(error)
  }
}
// const findUserWithToken = ({})
const authenticate = async(req,res)=> {

  const {email,password} = await req.body
  const user = await prisma.user.findUnique({ where: {email} });
  if (!user){
    return next(gen_errors.genericNotFoundError("user","email",email))
  }
  // bcrypt.!compareSync(password,user.password)
  if(!bcrypt.compareSync(password,user.password))
  {
    // !compareSync(password,user.password)
    return next(gen_errors.genericViolationDataError("input","password","wrong"))
  }
  // res.json(authenticate(payload));
  const token = jwt.sign({userId: user.id},JWT)
  console.log(token)
  res.json({user,token})
};

const findUserWithToken = async (token) => {
  let userId;
  console.log(`made it to finding user with ${JWT}`)
  console.log("What token findUserWithToken got "+token)

  try {
      const payload = await jwt.verify(token, JWT);
      userId = payload.userId;
      console.log(payload)
    const user = await prisma.user.findUnique({ where: { id:userId } });
    if (!user) {
      return next(gen_errors.genericNotFoundError("user", "email", email));
    }
    // try {
  //     if (token === undefined)
  //     {
  //       throw Error("No Token Sent");
  //     }
  //     const payload = await jwt.verify(token, JWT);
  //     id = payload.id;
  //   } catch (error) {
  //     throw new Error("payload not received")
  //   }
  //   console.log("payload got")
  //   if (id === undefined||null)
  //   {
  //     throw new Error("user id not authorized")
  //   }
  //   console.log("AAAAAAAAAAAAA")
  // const user = await prisma.user.findUnique({ where: { id } });
  // if (!user) {
  //   throw Error("user not authorized");
  // }
  return user;
  }
  catch (error) {
    // both possible errors are 401, so setting it here before throwing upward
    console.log("SETTING ERROR")
    error.status = 401
    throw error
  }
};
module.exports = {
  authenticate,
  findUserWithToken,
  isLoggedIn
};