import Knex from 'knex'

export async function up (knex: Knex) : Promise<void> {
  return knex.schema.createTable('product_images', async table => {
    table.increments('id').primary()
    table.integer('product_id').references('id').inTable('products').notNullable()
    table.string('link').notNullable()
  })
}

export async function down (knex: Knex) : Promise<void> {
  return knex.schema.dropTable('product_images')
}
