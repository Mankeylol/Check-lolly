import { ImageResponse, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';

dotenv.config();

const mongoURI = process.env.MONGO_URI || '';

async function fetchData(fid: any) {
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();
    console.log('MongoDB connected');
    const db = client.db('Lollypop');
    const collection = db.collection('users');

    const result = await collection.findOne({ fid: fid });
    console.log('MongoDB Result:', result);

    return result;
  } finally {
    client.close();
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get('fid');
  console.log('Received fid:', fid);

  try {
    const client = new MongoClient(mongoURI);
    await client.connect();

    const db = client.db('Lollypop');
    const collection = db.collection('users');

    const url: string = 'http://localhost:3001/getPoints';

    const data: { fid: string } = {
      fid: fid!,
      // Add other properties if needed
    };

    console.log('Sending POST request to:', url);
    console.log('Request Data:', data);

    const response: AxiosResponse = await axios.post(url, data);
    const result: any = response.data; // Adjust the type as needed
    console.log('Response from local server:', result);

    if (!result) {
      console.log('not found');
    }

    const point = result;

    // Return an ImageResponse with the retrieved point
    client.close();
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            color: 'black',
            background: '#f6f6f6',
            width: '100%',
            height: '100%',
            paddingTop: 50,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            width="256"
            height="256"
            src={`${NEXT_PUBLIC_URL}/park-1.png`}
            style={{
              borderRadius: 128,
            }}
          />
          <p>{point}</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.error();
  }
}
