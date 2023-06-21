import { faker } from '@faker-js/faker';

const TagsSeed = [];

for (let id = 1; id <= 5; id++) {
  TagsSeed.push({
    id,
    name: faker.lorem.word(),
    created_at: () => 'NOW()',
    updated_at: () => 'NOW()'
  });
}

export default TagsSeed;
