const express = require('express');
const NotesService = require('./notes-service');
const path = require('path');


const notesRouter = express.Router();
const jsonParser = express.json();

notesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        NotesService.getAllNotes(knexInstance)
            .then(notes => res.json(notes))
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const { note_name, content, folder_id } = req.body;
        const newNote = { note_name, folder_id, content };

        if (!note_name) {
            return res.status(400).json({ error: { message: 'Note name required' } })
        }
        if (!folder_id) {
            return res.status(400).json({ error: { message: 'Folder required' } })
        }
        NotesService.insertNote(knexInstance, newNote)
            .then(note => res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${note.id}`))
                .json(note))
            .catch(next);
    });

notesRouter
    .route('/:id')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db');
        const { id } = req.params;
        NotesService.getNoteById(knexInstance, id)
            .then(note => {
                if (!note) {
                    return res.status(404).json({ error: { message: 'Note does not exist' } })
                }
                res.note = note
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.note)
    })
    .delete((req, res, next) => {
        const knexInstance = req.app.get('db');
        const { id } = req.params;
        NotesService.deleteNote(knexInstance, id)
            .then(numNotesAffected => res.status(204).end())
            .catch(next)
    })

module.exports = notesRouter;