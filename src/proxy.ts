import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Statik dosyalar ve /api dışındaki her yolu karşıla.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
};
