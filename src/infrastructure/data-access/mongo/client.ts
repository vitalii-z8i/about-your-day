import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client: MongoClient = new MongoClient(uri);

export default client;
