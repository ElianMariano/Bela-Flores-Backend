import Knex from 'knex'

export async function up (knex: Knex) : Promise<void> {
  return knex.schema.createTable('images', table => {
    table.increments('id').primary()
    table.string('link').notNullable()
    table.string('description').notNullable()
    table.boolean('is_slide').notNullable()
    table.integer('user_id').references('id').inTable('products')
  })
}

export async function down (knex: Knex) : Promise<void> {
  return knex.schema.dropTable('images')
}
