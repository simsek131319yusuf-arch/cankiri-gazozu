import path from 'node:path';
import {defineConfig} from 'vitest/config';

/**
 * Testler yalnızca sunucu tarafı yardımcıları (rate-limit, dealer store)
 * kapsıyor; bu yüzden jsdom yerine düz node ortamı yeterli.
 */
export default defineConfig({
  resolve: {
    alias: {
      // Konfig hem CJS hem ESM olarak yüklenebildiği için __dirname yerine
      // çalışma dizini kullanılıyor (vitest proje kökünden çalışır).
      '@': path.resolve(process.cwd(), 'src'),
      // `server-only` paketi react-server koşulu dışında import edilince hata
      // fırlatır. Testte paketin kendi boş sürümüne yönlendiriyoruz —
      // kaynak dosyadaki import olduğu gibi kalsın diye.
      'server-only': path.resolve(
        process.cwd(),
        'node_modules/server-only/empty.js'
      )
    }
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
});
