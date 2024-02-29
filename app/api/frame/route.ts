import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import dotenv from 'dotenv';




dotenv.config()

const neynarApi = process.env.NEYNAR_KEY;
const mongoURI = process.env.MONGO_URI;

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: neynarApi });
  console.log(message)

  let fid = message?.interactor.fid
  

  return new NextResponse(
    getFrameHtmlResponse({
      image: {
        src: `${NEXT_PUBLIC_URL}/api/og?fid=${fid}`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
