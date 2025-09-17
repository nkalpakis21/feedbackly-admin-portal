import { NextResponse } from 'next/server';

export function addCorsHeaders(response: NextResponse, origin?: string | null): NextResponse {
  // Allow requests from any origin for now (you can restrict this later)
  const allowedOrigins = [
    'https://www.shiplyai.com',
    'https://shiplyai.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ];

  // If origin is provided and in allowed list, use it; otherwise use wildcard
  const corsOrigin = origin && allowedOrigins.includes(origin) ? origin : '*';

  response.headers.set('Access-Control-Allow-Origin', corsOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return response;
}

export function handleCorsPreflight(): NextResponse {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}
