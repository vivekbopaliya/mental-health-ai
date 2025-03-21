import { cookies } from 'next/headers'; 
import { NextResponse } from 'next/server';
import * as jose from 'jose'

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET),
}

export const tokenAuthMiddleware = async(req: any) => {
  
  const response = NextResponse.next()
  const cookieStore = cookies(); 
  const token = cookieStore.get('token');
  if (!token) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }
     
  const decoded = await jose.jwtVerify(token.value, jwtConfig.secret)

  if (!decoded) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }
 

  req.user = decoded.payload;

  return response
};

export const config = {
    matcher: ['/', '/chatbot'],
};

export default tokenAuthMiddleware;