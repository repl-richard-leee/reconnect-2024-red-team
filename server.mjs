import * as fs from 'fs/promises';
import express from 'express';
import path from 'path';
import usePlayerRouter from './playerRouter.mjs';
import errorHandlerMiddleware from './errorHandlerMiddleware.mjs';
import 'dotenv/config';

const __dirname = path.resolve();

const app = express();

// Make mock data to match mock database entries
async function setup() {
  const tempDir = path.join(__dirname, `temp${process.env.PORT}/`);
  await fs.mkdir(tempDir, { recursive: true });
  await fs.writeFile(path.join(tempDir, '5a1bad9a-2516-4f2a-a793-e289bdb48b9f.txt'), Date.now().toString());
  await fs.writeFile(path.join(tempDir, 'e01decd7-8a65-46ef-a0cd-0483d4304581.txt'), Date.now().toString());
}

app.use(express.json());
app.use(express.static('public'));
usePlayerRouter(app);
app.use(errorHandlerMiddleware);

await setup();

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
