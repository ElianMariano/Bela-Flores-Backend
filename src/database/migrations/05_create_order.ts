import Knex from 'knex'

export async function up (knex: Knex) : Promise<void> {
  return knex.schema.createTable('order', table => {
    table.increments('id').primary()
    table.integer('user_id').references('id').inTable('users')
    table.integer('product_id').references('id').inTable('products')
    table.integer('address_id').references('nickname').inTable('address')
    table.string('status').notNullable()
    table.integer('quantity').notNullable()
    table.integer('division_quantity').notNullable()
    table.boolean('is_gift').notNullable()
    table.string('message')
  })
}

export async function down (knex: Knex) : Promise<void> {
  return knex.schema.dropTable('order')
}
