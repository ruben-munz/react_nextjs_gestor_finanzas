import { NextRequest, NextResponse } from 'next/server';
import { clearSessionUsername } from '../../infrastructure/auth/session';

export async function GET(request: NextRequest) {
  await clearSessionUsername();
  return NextResponse.redirect(new URL('/login', request.url));
}

export async function POST(request: NextRequest) {
  await clearSessionUsername();
  return NextResponse.redirect(new URL('/login', request.url));
}
