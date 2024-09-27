import { i18nRouter } from 'next-i18n-router';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const i18n = {
    locales: ['en-US', 'de'],
    defaultLocale: 'en-US',
  };

  const resp = i18nRouter(request, i18n);
  return resp;
}

// only applies this middleware to files in the app directory
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
