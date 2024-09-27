const { faker } = require("@faker-js/faker");

function generateMockUserData() {

    const firstName = faker.person.firstName();

    return {
        name: firstName,
        email: faker.internet.email({ firstName: firstName }),
        password: faker.internet.password(10),
    };
}



const fakeUser = Array.from({ length: 10}, generateMockUserData);

console.log(fakeUser);