# Çankırı Gazozu — Kurumsal Tanıtım Sitesi

Çankırı'nın Orta ilçesindeki gazoz fabrikası için iki dilli (TR/EN) marka ve
tanıtım sitesi. Video intro, üç ürünlü vitrin, bayilik başvuru formu ve
yerel SEO odaklı içerik yapısı.

**Durum:** kod tarafı tamam — lint, tip kontrolü, test ve build temiz.
Yayını bekleyen engeller kod değil: müşteriden gelecek doğrulanmış bilgiler,
üretimde kalıcı başvuru deposu, yasal metinlerin hukukçu onayı ve intro
videosunun yeniden sıkıştırılması → [`DEVIR-NOTU.txt`](./DEVIR-NOTU.txt) § 2

---

## Kurulum

```bash
npm install
cp .env.example .env.local   # değerleri doldurun
npm run dev                  # http://localhost:3000
```

```bash
npm run lint     # ESLint
npm test         # vitest (11 test)
npm run build    # üretim derlemesi (31 sayfa statik üretilir)
```

### Ortam değişkenleri

Tamamı açıklamalarıyla [`.env.example`](./.env.example) dosyasında:

| Değişken | İşlevi |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | canonical, sitemap, robots ve Open Graph adreslerinin kaynağı |
| `RESEND_API_KEY` | bayilik bildirim e-postası |
| `DEALER_MAIL_TO` / `DEALER_MAIL_FROM` | alıcı ve gönderen adresleri |
| `DEALER_STORE_DIR` | başvuru JSONL deposunun dizini |
| `SITE_INDEXABLE` | `robots.txt`'yi doğrudan belirler (`1`/`0`) |

> ⚠️ Başvurular **önce kalıcı olarak kaydedilir, sonra** e-posta gönderilir;
> e-posta servisi çökse bile başvuru kaybolmaz. Üretimde ne depo ne e-posta
> yapılandırılmışsa kullanıcıya **sahte başarı gösterilmez**, hata döner.
> Dosya tabanlı depo serverless ortamda kalıcı değildir: `DEVIR-NOTU.txt` § 2.2

---

## Teknoloji

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Dil | TypeScript |
| UI | React 19, Tailwind CSS 4 |
| Animasyon | motion (framer-motion) |
| Çoklu dil | next-intl |
| E-posta | Resend (HTTP API) |
| Test | Vitest |

---

## Sayfalar

| Türkçe | İngilizce | |
|---|---|---|
| `/` | `/en` | Ana sayfa |
| `/urunler` | `/en/products` | Ürün kategorisi |
| `/urunler/[slug]` | `/en/products/[slug]` | Ürün detayı |
| `/hakkimizda` | `/en/about` | Fabrikamız |
| `/hikayemiz` | `/en/our-story` | Hikâyemiz |
| `/bayilik` | `/en/dealership` | Bayilik + başvuru formu |
| `/sss` | `/en/faq` | S.S.S. (FAQPage şeması) |
| `/iletisim` | `/en/contact` | İletişim |
| `/gizlilik` | `/en/privacy` | Gizlilik ve çerez politikası (noindex) |
| `/kvkk` | `/en/data-protection` | KVKK aydınlatma metni (noindex) |

Türkçe kökte, İngilizce `/en` altında. Yol adları da çevrilir
(`src/i18n/routing.ts` → `pathnames`).

---

## Klasör yapısı

```
src/
├── app/
│   ├── icon.png           32x32 favicon (dosya konvansiyonu)
│   ├── apple-icon.png     180x180 apple touch icon
│   ├── manifest.ts        PWA manifest
│   ├── robots.ts          SITE_INDEXABLE ile yönetilir
│   ├── sitemap.ts
│   └── [locale]/          Sayfalar (tr/en ortak)
│       ├── page.tsx       Ana sayfa — hero + vitrin + cam şişe + fabrika
│       ├── urunler/       Ürün kategorisi ve detay sayfaları
│       ├── hakkimizda/    Fabrika sayfası
│       ├── hikayemiz/     Marka hikâyesi + zaman çizelgesi
│       ├── bayilik/       Başvuru formu + server action
│       ├── sss/           S.S.S. + FAQPage şeması
│       ├── iletisim/
│       ├── gizlilik/      Gizlilik ve çerez politikası
│       └── kvkk/          KVKK aydınlatma metni
├── components/
│   ├── hero/              Video intro, hero, fabrika arka planı
│   ├── products/          Ürün kartları, şişe görselleri
│   ├── forms/             Bayilik formu
│   ├── layout/            Header, footer, dil değiştirici
│   └── seo/               JSON-LD şemaları
├── data/                  ⚠️ İÇERİK KAYNAĞI — aşağıya bakın
│   ├── products.ts        Ürünler
│   ├── site.ts            Firma künyesi
│   └── types.ts           Şemalar
├── i18n/                  next-intl yapılandırması (rota tablosu dahil)
├── lib/
│   ├── dealer.ts          Bayilik başvurusu (tek giriş kapısı)
│   ├── rate-limit.ts      In-memory sliding window
│   └── seo.ts             Canonical / hreflang / breadcrumb üretimi
└── hooks/                 usePrefersReducedMotion, useFocusTrap

messages/                  tr.json · en.json — tüm arayüz metinleri
docs/                      SEO metinleri, görsel paketi notları
public/                    Görseller ve intro videoları
```

---

## Bozulmaması gereken kurallar

### 1. Veri katmanı — admin paneli hazırlığı

Admin paneli sonradan eklenecek. Bunun mümkün olması için içerik yalnızca şu
fonksiyonlardan okunur:

```ts
// src/data/products.ts
getProducts()          // async — DB'ye geçişte imza değişmesin diye
getProductBySlug(slug)

// src/lib/dealer.ts
submitDealerApplication(application)
```

Veritabanına geçildiğinde **sadece bu fonksiyonların gövdesi** değişir,
sayfalara dokunulmaz. Bir sayfa bunları atlayıp veriye doğrudan erişirse
admin paneli baştan yazım demektir.

### 2. Canonical'ı layout'a koymayın

Her sayfa kendi canonical'ını `src/lib/seo.ts → buildAlternates()` ile üretir.
Next.js'te layout metadata'sındaki `alternates` alt sayfalara **miras kalır**;
tanımlamayan her sayfa kendini ana sayfanın kopyası ilan eder ve indekslenmez.
Bu hata bir kez yapıldı ve düzeltildi.

### 3. Doğrulanmamış bilgi yayınlanmaz

Telefon, sosyal medya hesapları, şişe hacmi, sertifikalar ve besin değerleri
teyit edilene kadar `src/data/site.ts` ve `products.ts` içinde **boş/null**
durur ve arayüzde **koşullu** render edilir. Boş bırakmak güvenlidir —
uydurma değer koymayın.

### 4. Yeni rota eklerken

`src/i18n/routing.ts`'e eklenen her yol için `src/app/[locale]` altında gerçek
bir sayfa dosyası olmak zorunda. Rotası tanımlı ama sayfası olmayan yol 404 verir.

---

## Ürünler

| Ürün | Slug | Görsel dosyası |
|---|---|---|
| Kızılcık Gazozu | `kizilcik-gazozu` | `kizilcikli-gazoz.png` |
| Klasik Gazoz | `klasik-gazoz` | `sade-gazoz.png` |
| Portakal Gazozu | `portakal-gazozu` | `portakalli-gazoz.png` |

> Dosya adı `sade-gazoz.png` olsa da ürün kullanıcıya her yerde
> **"Klasik Gazoz"** olarak gösterilir.

Şişe hacmi, koli adedi, raf ömrü, içindekiler ve besin değeri bilgileri
**ambalajdan doğrulanmadığı için yayınlanmıyor** — kodda `TODO` olarak duruyor.

---

## SEO

Hazır olanlar: sayfa başına canonical + `hreflang`, `sitemap.xml`, `robots.txt`,
Organization/LocalBusiness şeması, ürün sayfalarında Product şeması,
yerelleştirilmiş meta alanları, her sayfada tek `<h1>`.

`Product` şemasına `offers` **bilerek eklenmedi** — fiyat ve stok netleşmeden
eklenirse Search Console hata üretir.

Anahtar kelime haritası, sayfa sayfa hazır metinler ve teknik SEO kontrol
listesi: [`docs/SEO-Metinleri.md`](./docs/SEO-Metinleri.md)

---

## Görseller

Kaynaklar, boyutlar ve **telif durumu**: [`docs/GORSEL-PAKETI.txt`](./docs/GORSEL-PAKETI.txt)

Özetle dikkat edilmesi gerekenler:

- Fabrika görseli resmî Instagram videosundan alınmış gerçek drone karesi —
  yayın için hak sahibinden izin teyit edilmeli.
- Uydu katmanları Esri World Imagery kaynaklı (atıf gerekir); dünya görseli
  NASA (kamu malı).
- Üç ürün PNG'si, resmî ürün fotoğrafı referans alınarak hazırlanmış
  **AI destekli ayrıştırma taslağıdır**. Etiket yazıları birebir baskı dosyası
  değildir; ticari yayın öncesi gerçek stüdyo çekimleriyle değiştirilmelidir.

---

## Dokümanlar

| Dosya | İçerik |
|---|---|
| [`DEVIR-NOTU.txt`](./DEVIR-NOTU.txt) | Mimari kararlar, yayın öncesi kritik eksikler, önerilen çalışma sırası |
| [`docs/SEO-Metinleri.md`](./docs/SEO-Metinleri.md) | Sayfa metinleri, anahtar kelime haritası, JSON-LD, marka hikâyesi |
| [`docs/GORSEL-PAKETI.txt`](./docs/GORSEL-PAKETI.txt) | Görsel envanteri, boyutlar, kaynaklar, telif notları |
