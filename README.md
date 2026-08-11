# Çankırı Gazozu — Kurumsal Tanıtım Sitesi

Çankırı'nın Orta ilçesindeki gazoz fabrikası için iki dilli (TR/EN) marka ve
tanıtım sitesi. Video intro, üç ürünlü vitrin, bayilik başvuru formu ve
yerel SEO odaklı içerik yapısı.

**Durum:** geliştirme sürüyor — yayına hazır değil.
Yayın öncesi kritik eksikler için → [`DEVIR-NOTU.txt`](./DEVIR-NOTU.txt)

---

## Kurulum

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run lint     # ESLint
npm run build    # üretim derlemesi (19 sayfa statik üretilir)
```

### Ortam değişkenleri

`.env.local` dosyası oluşturun:

```bash
RESEND_API_KEY=...            # yoksa bayilik başvurusu yalnızca log'a yazılır
DEALER_MAIL_TO=...            # başvuruların düşeceği e-posta
DEALER_MAIL_FROM=...          # gönderen adresi
```

> ⚠️ `RESEND_API_KEY` tanımlı değilken form kullanıcıya başarı mesajı gösterir
> ama başvuru hiçbir yere kaydedilmez. Ayrıntı: `DEVIR-NOTU.txt` § 2.1

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

---

## Sayfalar

| Türkçe | İngilizce |
|---|---|
| `/` | `/en` |
| `/urunler` | `/en/products` |
| `/urunler/[slug]` | `/en/products/[slug]` |
| `/hakkimizda` | `/en/about` |
| `/bayilik` | `/en/dealership` |

Türkçe kökte, İngilizce `/en` altında. Yol adları da çevrilir
(`src/i18n/routing.ts` → `pathnames`).

---

## Klasör yapısı

```
src/
├── app/[locale]/          Sayfalar (tr/en ortak)
│   ├── page.tsx           Ana sayfa — hero + ürün vitrini
│   ├── urunler/           Ürün kategorisi ve detay sayfaları
│   ├── hakkimizda/        Fabrika sayfası
│   └── bayilik/           Başvuru formu + server action
├── components/
│   ├── hero/              Video intro ve hero
│   ├── products/          Ürün kartları, şişe görselleri
│   ├── forms/             Bayilik formu
│   ├── layout/            Header, footer, dil değiştirici
│   └── seo/               JSON-LD şemaları
├── data/                  ⚠️ İÇERİK KAYNAĞI — aşağıya bakın
│   ├── products.ts        Ürünler
│   ├── site.ts            Firma künyesi
│   ├── hero.ts            Hero katmanları
│   └── types.ts           Şemalar
├── i18n/                  next-intl yapılandırması
├── lib/
│   ├── dealer.ts          Bayilik başvurusu (tek giriş kapısı)
│   └── seo.ts             Canonical / hreflang üretimi
└── hooks/

messages/                  tr.json · en.json — tüm arayüz metinleri
docs/                      SEO metinleri, görsel paketi notları
public/                    Görseller ve intro videoları
```

---

## Bozulmaması gereken iki kural

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
