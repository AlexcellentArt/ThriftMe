require("dotenv").config().env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require("../../prisma");
const { token } = require("morgan");
const {genericMissingDataError} = require('./gen_errors')
const JWT = process.env.JWT || 'shhh'
const isLoggedIn = async(req, res, next)=>{
  try {
    console.log(req.headers.authorization)
    req.user = await findUserWithToken(req.headers.Authorization)
    if (!req.user){throw new Error("NOT LOGGED IN")}
    next()
  } catch (error) {
    return next(error)
  }
}
const isAdmin = async(req, res, next)=>{
  try {
    console.log(req.headers)
    // req.user = await findUserWithToken(req.headers.isAdmin)
    const token = await decodeToken(req.headers.Authorization)
    if(!token.isAdmin){throw new Error("NOT ADMIN")}
    next()
  } catch (error) {
    return next(error)
  }
}
// const convertTokenToUserID
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
  const token = jwt.sign({userId: user.id,isAdmin:user.is_admin},JWT)
  console.log(token)
  res.json({user,token})
};

const findUserWithToken = async (token) => {
  let userId;
  if (!token){return}
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
  return user;
  }
  catch (error) {
    // both possible errors are 401, so setting it here before throwing upward
    console.log("SETTING ERROR")
    error.status = 401
    throw error
  }
};
const decodeToken = async(token)=>{
  if (!token){return next(genericMissingDataError("Authorization"),"header")}
  const payload = await jwt.verify(token.split(" ").pop(), JWT);
  return payload;
}
// const decodeGeneral = async(string)=>{return jwt.verify(string, JWT)}
module.exports = {
  authenticate,
  findUserWithToken,
  isLoggedIn,
  isAdmin,
  decodeToken,
  // decodeGeneral
};