const router = require("express").Router();
module.exports = router;
const e = require("express");
const fs = require('fs');

// massive check
const api_list = ["user","item","checkout","shopping_cart","past_transactions","browsing_history","skibidi"]
async function checkFileExists(file) {
    // return fs.access(`${file}`, fs.constants.F_OK, (err) => {if (err){console.log("ERRR");return false} return true})
  try {
    fs.access(file, fs.promises.constants.F_OK);
    // const res = fs.access(`${file}`, fs.constants.F_OK, (err) => {if (err){return false} return true});
    // console.log(res)
    // if (res){ return false}
    return true;
  } catch {
    return false
  }
}
function doFilesExist(fileList) {
    const table = {"yes":[],"no":[]}
    for (let index = 0; index < fileList.length; index++) {
        const file = fileList[index];
        if (fs.existsSync(file)){table.yes.push(file)}else{table.no.push(file)}}
    return table
}
function mapToPath(arr,path="api",fileType="js"){
    return arr.map((file)=>`${path}/${file}.${fileType}`)
}
async function requireExistingAPI(arr) {
    console.log("✓ = found || Not Found")
    const table = doFilesExist(mapToPath(api_list))
    // list.yes.forEach(router.use("/user", require("./user"));)
    
    // table.yes.forEach(router.use("/user", require("./user"));)
// api_list.forEach((api)=>{
//     if (checkFileExists(api) === undefined){table.yes.push(api)}
//     else {table.no.push(api)}
    
// })
// for await (const element of object) {
    
// }
// for (let i = 0; i < api_list.length; i++) {
//     const element = api_list[i];
//     const exists = await checkFileExists(element)
//     if (exists === undefined){table.yes.push(element)}
//     else {table.no.push(element)
    
// }
console.log("Checks completed.\u001b[0m")
console.log("\u001b[1;93m==================")
console.log("\u001b[1;92m✓ Found ✓ \u001b[0m")
table.yes.forEach((api)=>console.log(`\u001b[1;32m ✓ ${api} \u001b[0m`))
console.log("\u001b[1;93m------------------")
console.log("\u001b[1;91m✖ Missing ✖ \u001b[0m")
console.log("\u001b[1;93m------------------")
table.no.forEach((api)=>console.error(`✖ ${api}\u001b[0m`))
console.log("\u001b[1;93m==================")
console.log("Checks completed.\u001b[0m")
}
requireExistingAPI(api_list)
// console.log("✓ = found || Not Found")
// api_list.forEach((api)=>{checkFileExists(api)})
// console.log("Checks completed.\u001b[0m")
// /api
if (fs.existsSync("./user"))
{
    router.use("/user", require("./user"));
}
else {
    console.log("user does not exist")
}
if (fs.existsSync("./item"))
{
    router.use("/item", require("./item"));
}

if (fs.existsSync("./shopping_cart"))
{
    router.use("/shopping_cart", require("./shopping_cart"));
}

if (fs.existsSync("./past_transactions"))
{
    router.use("/past_transactions", require("./past_transactions"));
}

if (fs.existsSync("./checkout"))
{
    router.use("/checkout", require("./checkout"));
}
if (fs.existsSync("./credit_card"))
{
    router.use("/credit_card", require("./credit_card"));
}
if (fs.existsSync("./addresses"))
{
    router.use("/addresses", require("./addresses"));
}