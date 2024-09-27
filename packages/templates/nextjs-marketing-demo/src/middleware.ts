import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const i18n = {
    locales: ['en-US', 'de'],
    defaultLocale: 'en-US',
  };

  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const segments = pathname.split('/');
  const locale = segments[1];

  if (i18n.locales.includes(locale)) {
    const newPathname = `/${segments.slice(2).join('/')}`;
    url.pathname = newPathname;
    return NextResponse.rewrite(new URL(`/${locale}${newPathname}`, request.url));
  }

  return NextResponse.redirect(new URL(`/${i18n.defaultLocale}${pathname}`, request.url));
}

// only applies this middleware to files in the app directory
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
