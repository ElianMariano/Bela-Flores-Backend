import Knex from 'knex'
import argon2 from 'argon2'

export async function seed (knex: Knex) : Promise<void> {
  const hash = await argon2.hash('password')
    .catch(Error)

  await knex('users').insert({
    name: 'admin',
    phone: '(28) 99999-9999',
    email: 'email@gmail.com',
    is_logged_in: false,
    auth: '',
    is_admin: true,
    password: hash
  })
}
