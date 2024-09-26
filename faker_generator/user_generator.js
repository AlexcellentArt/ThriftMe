const { faker } = require("@faker-js/faker");

function generateMockUserData() {
    return {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(10),
    };
}



const fakeUser = Array.from({ length: 10}, generateMockUserData);

console.log(fakeUser);