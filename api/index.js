const router = require("express").Router();
module.exports = router;
const {
  isLoggedIn,
  decodeToken,
  findUserWithToken,
} = require("./helpers/auth.js");

const fs = require("fs");
const auth = require("./helpers/auth");
// massive check
const api_list = [
  "user",
  "item",
  "checkout",
  "shopping_cart",
  "past_transactions",
  "browsing_history",
  "stripe",
  "addresses",
  "credit_cards",
];

function doFilesExist(fileList) {
  const table = { yes: [], no: [] };
  for (let index = 0; index < fileList.length; index++) {
    const file = fileList[index];
    if (fs.existsSync(file)) {
      table.yes.push(file);
    } else {
      table.no.push(file);
    }
  }
  return table;
}
function mapToPath(arr, path = "api", fileType = "js") {
  return arr.map((file) => `${path}/${file}.${fileType}`);
}
function mapToBaseNames(path) {
  return path.split("/").pop().split(".").shift();
}
async function requireExistingAPI(arr) {
  const table = { found: [], broken: [], missing: [] };
  const errors = [];
  const doExist = doFilesExist(mapToPath(api_list));
  table.missing = doExist.no.map(mapToBaseNames);
  doExist.yes.map(mapToBaseNames).forEach((found) => {
    try {
      router.use(`/${found}`, require(`./${found}`));
      table.found.push(found);
    } catch (error) {
      errors.push(error);
      table.broken.push(found);
    }
  });
  console.log("\u001b[1;96m==================");
  console.log("\u001b[1;95mAPI Status\u001b[0m");
  if (table.found.length) {
    console.log("\u001b[1;97m------------------\u001b");
    console.log("\u001b[1;92m✓ Found ✓ \u001b[0m");
    table.found.forEach((api) =>
      console.log(`\u001b[1;32m ✓ ${api} \u001b[0m`)
    );
  }
  if (table.missing.length) {
    console.log("\u001b[1;97m------------------\u001b");
    console.log("\u001b[1;91m✖ Missing ✖ \u001b[0m");
    table.missing.forEach((api) => console.error(`✖ ${api}\u001b[0m`));
  }
  if (table.broken.length) {
    console.log("\u001b[1;97m------------------\u001b[0m");
    console.log("\u001b[1;93m? Broken ?\u001b[0m");
    table.broken.forEach((api) => console.log(`\u001b[1;93m? ${api}\u001b[0m`));
  }
  console.log("\u001b[1;97m------------------\u001b[0m");
  if (errors.length) {
    console.log("\u001b[1;95m ? ERRORS ? \u001b[0m");
    errors.map(console.error);
  }
  console.log("\u001b[1;96m==================\u001b[0m");
}
// function makeTable(table,columnStyling)
// {
//     // will go back at some point in the future to make this generic
// }
requireExistingAPI(api_list);
