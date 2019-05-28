const express = require('express');
const FoldersService = require('./folders-service');
const path = require('path');


const foldersRouter = express.Router();
const jsonParser = express.json();

foldersRouter
  .route('/')
  // .get((req, res, next) => {
  //   const knexInstance = req.app.get('db');
  //   FoldersService.getAllFolders(knexInstance)
  //     .then(folders => {
  //       res.json(folders);
  //     })
  //     .catch(next);
  // })
  .get((req, res, next) => {
    res.send('getting all folders')
  })
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { folder_name } = req.body;
    const newFolder = { folder_name };

    if (!folder_name) {
      return res.status(400).json({ error: { message: 'Folder name required' } })
    }

    FoldersService.insertFolder(knexInstance, newFolder)
      .then(folder => res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${folder.id}`))
        .json(folder))
      .catch(next);
  });

foldersRouter
  .route('/:id')
  .get((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get('db');
    FoldersService.getFolder(knexInstance, id)
      .then(folderNotes => {
        if (!folderNotes) {
          return res.status(404).json({ error: { message: 'Folder does not exist' } })
        }
        res.json(folderNotes);
      })
      .catch(next);
  })

module.exports = foldersRouter;
