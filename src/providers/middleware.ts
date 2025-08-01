import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt_decode from "jwt-decode";
import { cookiesToObjects } from '../common/Utils';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    console.log({ cookies: request.cookies });

    const cookies = cookiesToObjects(String(request.cookies));
    if(!cookies || !cookies['auth']) return NextResponse.redirect(new URL('/login', request.url))
    
    // Abaixo funcionando, por equanto sem necessidade

    // const decoded = jwt_decode(cookies['auth']);
    // console.log({ decoded });
    // return NextResponse.redirect(new URL('/', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/users/:path*'],
}

