import { faker } from '@faker-js/faker';

const UsersSeed = [];

for (let id = 1; id <= 10; id++) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  UsersSeed.push({
    id,
    name: faker.person.fullName({ firstName, lastName }),
    username: faker.internet.userName({ firstName, lastName }),
    password: '123456',
    email: faker.internet.email({ firstName, lastName }),
    created_at: () => 'NOW()',
    updated_at: () => 'NOW()'
  });
}

export default UsersSeed;
