// Extracting user data from cookie

import { cookies } from "next/headers";
import * as jose from 'jose'

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET),
};

export const getDataFromToken = async () => {
  'use server'

  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) {
    throw new Error('Token not found in cookies');
  }

  const decoded = await jose.jwtVerify(token.value, jwtConfig.secret);
  return decoded.payload;
};

export const dynamic = 'force-dynamic'