import * as fs from 'fs/promises';
import path from 'path';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { 
  dbGetPlayerCustomFields, dbUpdatePlayerCustomFields,
  dbGetUserLastSavedFileEntry, dbUpdateUserLastSavedFileEntry, 
  dbGetCurrentUser
} from './database.mjs';

const __dirname = path.resolve();

const router = express.Router();

// ------------------------------ ENDPOINTS ------------------------------

router.get('/getPlayerCustomFields', async (req, res, next) => {
  try {
    await getPlayerCustomFields(req, res);
  } catch (e) {
    next(e);
  }
});

router.post('/updatePlayerCustomFields', async (req, res, next) => {
  try {
    await updatePlayerCustomFields(req, res);
  } catch (e) {
    next(e);
  }
});

router.get('/getLastSavedTimestamp', async (req, res, next) => {
  try {
    await getLastSavedTimestamp(req, res);
  } catch (e) {
    next(e);
  }
});

router.post('/deletePlayerTimestamp', async (req, res, next) => {
  try {
    await deletePlayerTimestamp(req, res);
  } catch (e) {
    next(e);
  }
});

export default function usePlayerRouter(app) {
  app.use('/', router);
}

// ------------------------------ ENDPOINT IMPLEMENTATIONS ------------------------------

async function getPlayerCustomFields(req, res) {
  const userId = getUserIdFromRequest(req);
  const requestedCustomField = req.query.requestedCustomField;

  const playerCustomFields = await dbGetPlayerCustomFields(userId);
  if (!playerCustomFields) {
    throw new Error(`Failed to get player custom fields. Cannot find player for userId ${userId}`);
  }

  const outputField = requestedCustomField ? playerCustomFields[requestedCustomField] : playerCustomFields;

  res.send(JSON.stringify({
    customFieldValue: outputField
  }));
}

async function updatePlayerCustomFields(req, res) {
  const userId = await dbGetCurrentUser();
  const newCustomFields = getCustomFieldsFromBody(req);

  const playerCustomFields = await dbGetPlayerCustomFields(userId);
  if (!playerCustomFields) {
    throw new Error(`Failed to get player custom fields. Cannot find player for userId ${userId}`);
  }

  merge(playerCustomFields, newCustomFields);
  await dbUpdatePlayerCustomFields(userId, playerCustomFields);

  res.send('Done updating player custom fields');
}

async function getLastSavedTimestamp(req, res) {
  const tempDir = path.join(__dirname, `temp${process.env.PORT}/`);

  const userId = await dbGetCurrentUser();

  const fileEntry = await dbGetUserLastSavedFileEntry(userId) || {};

  if (!fileEntry.filePath) {
    fileEntry.userId = userId;
    fileEntry.filePath = `${uuidv4()}.txt`;

    await fs.mkdir(tempDir, { recursive: true });
    await fs.writeFile(path.join(tempDir, fileEntry.filePath), Date.now().toString());
    await dbUpdateUserLastSavedFileEntry(userId, fileEntry);

    console.log(`userId ${userId} created ${fileEntry.filePath}`);
  }

  const contents = await fs.readFile(path.join(__dirname, `temp${process.env.PORT}`, fileEntry.filePath), 'utf8');

  res.send(contents);
}

async function deletePlayerTimestamp(req, res) {
  const tempDir = path.join(__dirname, `temp${process.env.PORT}/`);

  const userId = await dbGetCurrentUser();
  const fileEntry = await dbGetUserLastSavedFileEntry(userId);

  if (fileEntry.filePath) {
    const absolutePath = path.resolve(path.join(tempDir, fileEntry.filePath));

    if (!absolutePath.startsWith(tempDir)) {
      throw new Error(`Can't delete file outside temp/ directory`);
    }

    try {
      await fs.unlink(absolutePath);
    } catch(err) {
      if (err?.message?.startsWith('ENOENT')) {
        throw new Error(`Can't delete ${fileEntry.filePath}, no such file!`);
      } else {
        throw new Error(`Not allowed to delete file ${fileEntry.filePath}`);
      }
    }
  }

  delete fileEntry.filePath;
  await dbUpdateUserLastSavedFileEntry(userId, fileEntry);

  res.send(`Done deleting timestamp`);
}

// ------------------------------ HELPER FUNCTIONS ------------------------------

function merge(target, source) {
  for (const attr in source) {
    if (typeof target[attr] === 'object' && typeof source[attr] === 'object') {
      merge(target[attr], source[attr]);
    } else {
      target[attr] = source[attr];
    }
  }
}

function getUserIdFromRequest(req) {
  return parseUserId(req.query?.userId);
}

function parseUserId(userIdInput) {
  if (!userIdInput) throw new Error('Missing query parameter userId. userId must be a number');
  const userId = parseInt(userIdInput, 10);
  if (isNaN(userId) || userId < 1) throw new Error(`userId ${userIdInput} must be a positive number`)
  return userId;
}

function getCustomFieldsFromBody(req) {
  return parseCustomFields(req.body.customFieldsJson);
}

function parseCustomFields(customFieldsJson) {
  if (!customFieldsJson) throw new Error('Missing query parameter customFieldsJson. customFieldsJson must be a valid JSON string');
  try {
    return JSON.parse(customFieldsJson);
  } catch (e) {
    throw new Error(`customFieldsJson must be a valid JSON string`);
  }
}

