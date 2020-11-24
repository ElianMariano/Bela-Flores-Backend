import Knex from 'knex'

export async function seed (knex: Knex) {
  await knex('users').insert({
    name: 'admin',
    phone: '(28) 99999-9999',
    email: 'email@gmail.com',
    is_logged_in: false,
    auth: '',
    is_admin: true,
    password: 'password'
  })
}
