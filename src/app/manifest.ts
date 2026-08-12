import type {MetadataRoute} from 'next';
import {site} from '@/data/site';

/**
 * Web App Manifest — Android'de "ana ekrana ekle" ikonu ve tarayıcı tema rengi.
 *
 * DİKKAT: manifest yalnızca app kökünde tanımlanabilir, yani dile duyarlı
 * değil. Bu yüzden metinler varsayılan dilde (Türkçe) sabit; çeviri
 * anahtarlarına bağlanamaz.
 *
 * Renkler src/app/globals.css'ten birebir alındı:
 *   background_color → --color-paper (#fbf6ec)
 *   theme_color      → --color-cornel (#b31f2e), markanın kızılcık kırmızısı
 * globals.css'teki değerler değişirse burası da elle güncellenmeli.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Cam Şişede Yerli Gazoz`,
    short_name: site.name,
    description:
      "Çankırı'nın yerli gazoz markası. Kızılcık, klasik ve portakal aromalarıyla, cam şişede.",
    start_url: '/',
    display: 'standalone',
    background_color: '#fbf6ec',
    theme_color: '#b31f2e',
    lang: 'tr',
    dir: 'ltr',
    icons: [
      {src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
      {src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'}
    ]
  };
}
