import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;

declare global {
  // eslint-disable-next-line no-var
  var __mongoClient: MongoClient | undefined;
}

const client: MongoClient =
  globalThis.__mongoClient ??
  (globalThis.__mongoClient = new MongoClient(uri));

export default client;
