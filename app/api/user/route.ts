import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET), // Private secret
};

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token not found in cookies" }, { status: 401 });
  }

  try {
    const decoded = await jose.jwtVerify(token.value, jwtConfig.secret);
    return NextResponse.json({ payload: decoded.payload });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}