const AdminsSeed = [
  {
    id: 1,
    name: 'Nikolay Shamayko',
    username: 'ns16',
    password: '123456',
    email: 'nikolay.shamayko@gmail.com',
    created_at: () => 'NOW()',
    updated_at: () => 'NOW()'
  }
];

export default AdminsSeed;
