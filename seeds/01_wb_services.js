
exports.seed = function(knex) {
  return knex('wb_service').del()
    .then(function () {
      return knex('wb_service').insert([
        {
          id: 1, 
          name: 'General IT Support', 
          description: " "
        },
        {
          id: 2, 
          name: 'Learning Programming',
          description: " "
        },
        {
          id: 3, 
          name: 'Web / App Development',
          description: " "}
      ]);
    });
};
