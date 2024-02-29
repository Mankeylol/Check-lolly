import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI

let did = 305644

export async function mongoConnect(fid) {
    const client = new MongoClient(mongoURI);
  await client.connect();
  console.log('MongoDB connected');
  const db = client.db('Lollypop');
  const collection = db.collection('users');

  const result = await collection.findOne({ fid: did });
  console.log(result)
  return result;
}