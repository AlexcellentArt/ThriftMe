const { faker } = require("@faker-js/faker");

function generateMockUserData() {

    const firstName = faker.person.firstName();

    return {
        name: firstName,
        email: faker.internet.email({ firstName: firstName }),
        password: faker.internet.password(10),
    };
}

function generateManyMockUserData(amount) {
    const users = []
    while(amount != 0)
    {
        users.push(generateMockUserData())
        amount -= 1;
    }
    console.log(`Made ${users.length} users.`);
    return users
}
module.exports = {
    generateManyMockUserData,
    generateMockUserData,
  };