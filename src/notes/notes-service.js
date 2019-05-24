const NotesService = {
    getAllNotes(knex) {
        return knex.select('*').from('notes');
    },
    getNoteById(knex, id) {
        //is { id } equivalent to ('id', id)??
        return knex('notes').select('*').where({ id })
    },
    insertNote(knex, newNote) {
        return knex('notes').insert(newNote).returning('*').then(rows => rows[0]);
    },
    deleteNote(knex, id) {
        return knex('notes').where({ id }).delete()
    }
};

module.exports = NotesService;
