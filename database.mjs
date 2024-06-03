// Mock database connections
// Hint: There are no deliberate vulnerabilities in this file

import path from 'path';
const __dirname = path.resolve();

// Make some mock data
const playerCustomFields = [
  {
    userId: 1,
    customFields: {
      nickname: 'Mockbeth', health: 80, sanity: -4,
      items: { sword: { sharpness: 5 }, potion: { quantity: 2, description: 'Double doubled, toil and troubled' } },
      buff: 'Cannot die to a man born of a woman'
    }
  },
  {
    userId: 2,
    customFields: {
      nickname: 'Mockey Mouse', likes: 'mockaroni and cheese',
      friends: { pluto: { age: 4, notes: 'The planet, not the dog' }, goofy: { height: '6ft' } }
    }
  },
]

const userLastSavedFileEntries = [
  { userId: 1, filePath: '5a1bad9a-2516-4f2a-a793-e289bdb48b9f.txt' },
  { userId: 2, filePath: 'e01decd7-8a65-46ef-a0cd-0483d4304581.txt' },
];

export function dbConnect() {
  // Loaded from .env file
  const dbUser = process.env.DATABASE_USER;
  const dbPassword = process.env.DATABASE_PASSWORD;

  // TODO: Implement the following
  // connectToMyDatabase(dbUser, dbPassword);
}

export async function dbGetCurrentUser() {
  return 1;
}

export async function dbGetPlayerCustomFields(userId) {
  const player = playerCustomFields.find((entry) => entry.userId === userId);
  return player?.customFields;
}

export async function dbUpdatePlayerCustomFields(userId, customFields) {
  const index = playerCustomFields.findIndex((entry) => entry.userId === userId);
  
  if (index >= 0) {
    playerCustomFields[index].customFields = customFields;
  } else {
    throw new Error(`Failed to update player custom fields. Cannot find player for userId ${userId}`);
  }
}

export async function dbGetUserLastSavedFileEntry(userId) {
  return userLastSavedFileEntries.find((entry) => entry.userId === userId);
}

export async function dbUpdateUserLastSavedFileEntry(userId, entryData) {
  const index = userLastSavedFileEntries.findIndex((entry) => entry.userId === userId);
  
  if (index >= 0) {
    userLastSavedFileEntries[index] = entryData;
  } else {
    userLastSavedFileEntries.push(entryData);
  }
}