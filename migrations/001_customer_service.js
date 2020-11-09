exports.up = function(knex) {
    return knex.schema
    .createTable('wb_customer', (table) => {
        table.increments().primary();

        // basic info
        table.string('mobile', 20).notNullable();
        table.string('first_name', 20);
        table.string('last_name', 20);
        table.string('email', 50);

        // if true user will be taken directly to his dashboard upon mobile login
        table.boolean('is_profile_complete').notNullable().defaultTo(false);

        // used as a password replacement which is sent to user mobile
        table.string('auth_code', 100);

        // optional flags, enabled to control accounts and joined mailing for mailing lists
        table.boolean('is_enabled').notNullable().defaultTo(true);
        table.boolean('is_joined_mailing').notNullable().defaultTo(false);
        
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('wb_service', (table)=>{
        table.increments().primary();
        // basic info
        table.string('name', 30).notNullable();
        table.string('description', 250).notNullable();
    })
    .createTable('wb_case', (table)=>{
        table.increments().primary();

        // foreign keys
        table.integer('user_id').references('id').inTable('wb_customer').notNullable();
        table.integer('service_id').references('id').inTable('wb_service').notNullable();

        // service description
        table.string('description', 500).notNullable();

        // ticket details
        table.timestamp('responded_at');
        table.boolean('is_fulfiled').notNullable().defaultTo(false);
        table.timestamp('fulfiled_at');
        table.boolean('is_closed').notNullable().defaultTo(false);
        table.string('resolution', 500);
        
        // user feedback
        table.integer('rating');
        table.string('testimonial', 500);
        table.string('is_testimonial_published', 500);

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('wb_logs', (table)=>{
        table.increments().primary();
        table.string('entry', 500);
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable('wb_case').
    dropTable('wb_service').
    dropTable('wb_customer').
    dropTable('wb_logs');
};