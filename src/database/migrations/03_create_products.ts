import Knex from 'knex'

export async function up (knex: Knex) : Promise<void> {
  return knex.schema.createTable('products', table => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.decimal('price').notNullable()
    table.string('description').notNullable()
    table.decimal('splited_price').notNullable()
    table.integer('quantity').notNullable()
    table.string('category_id').references('category').inTable('category')
  })
}

export async function down (knex: Knex) : Promise<void> {
  return knex.schema.dropTable('products')
}
