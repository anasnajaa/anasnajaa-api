exports.up = function(knex) {
    return knex.schema
    .createTable('logs', (table)=>{
        table.increments().primary();
        table.string('entry', 5000);
        table.string('token', 250);
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('logs');
};