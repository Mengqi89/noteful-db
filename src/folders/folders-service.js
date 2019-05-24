const FoldersService = {
  getAllFolders(knex) {
    return knex.select('*').from('folders');
  },
  getFolder(knex, folder_id) {
    return knex('notes').select('*').where({ folder_id })
  },
  insertFolder(knex, newFolder) {
    return knex('folders').insert(newFolder).returning('*').then(rows => rows[0]);
  }
};

module.exports = FoldersService;
