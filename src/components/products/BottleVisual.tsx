import Image from 'next/image';
import type {Product} from '@/data/types';
import type {Locale} from '@/i18n/routing';
import {pick} from '@/data/types';

/**
 * Ürün görseli. Gerçek şişe fotoğrafı tanımlıysa onu, değilse ürünün tema
 * rengiyle çizilmiş cam şişe placeholder'ını basar.
 *
 * Fotoğraflar geldiğinde products.ts'teki `image` alanını doldurmak yeterli;
 * burada hiçbir şey değişmez.
 */
export default function BottleVisual({
  product,
  locale,
  priority
}: {
  product: Product;
  locale: Locale;
  priority?: boolean;
}) {
  if (product.image) {
    return (
      <Image
        src={product.image}
        alt={pick(product.imageAlt, locale)}
        title={pick(product.imageTitle, locale)}
        // Doğal ölçü 1000x2400 — oranı birebir vermek CLS'i sıfırlar
        width={1000}
        height={2400}
        priority={priority}
        sizes="(max-width: 768px) 45vw, 320px"
        className="h-full w-auto object-contain drop-shadow-2xl"
      />
    );
  }

  const {base, accent} = product.theme;
  const gradientId = `bottle-${product.slug}`;
  const glassId = `glass-${product.slug}`;

  return (
    <svg
      viewBox="0 0 200 520"
      className="h-full w-auto drop-shadow-2xl"
      role="img"
      aria-label={pick(product.imageAlt, locale)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={base} stopOpacity="0.95" />
          <stop offset="35%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={base} stopOpacity="1" />
        </linearGradient>
        <linearGradient id={glassId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="20%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* şişe gövdesi */}
      <path
        d="M78 40h44v46c0 18 34 40 34 84v276c0 24-14 40-38 40H82c-24 0-38-16-38-40V170c0-44 34-66 34-84z"
        fill={`url(#${gradientId})`}
      />
      {/* kapak */}
      <rect x="72" y="16" width="56" height="30" rx="7" fill="#c9ab5f" />
      <rect x="72" y="16" width="56" height="9" rx="4" fill="#e6cf8f" />
      {/* etiket */}
      <rect
        x="44"
        y="270"
        width="112"
        height="130"
        rx="8"
        fill="#fbf6ec"
        opacity="0.95"
      />
      <text
        x="100"
        y="318"
        textAnchor="middle"
        fill={base}
        fontSize="19"
        fontWeight="700"
        fontFamily="Georgia, serif"
      >
        ÇANKIRI
      </text>
      <text
        x="100"
        y="342"
        textAnchor="middle"
        fill="#3c3227"
        fontSize="13"
        letterSpacing="2"
        fontFamily="Georgia, serif"
      >
        GAZOZU
      </text>
      <line x1="62" y1="356" x2="138" y2="356" stroke={base} strokeWidth="2" />
      <text
        x="100"
        y="380"
        textAnchor="middle"
        fill={base}
        fontSize="14"
        fontWeight="600"
        fontFamily="Georgia, serif"
      >
        {pick(product.flavor, locale).toLocaleUpperCase(locale)}
      </text>

      {/* cam parlaması */}
      <path
        d="M78 40h44v46c0 18 34 40 34 84v276c0 24-14 40-38 40H82c-24 0-38-16-38-40V170c0-44 34-66 34-84z"
        fill={`url(#${glassId})`}
      />
      {/* kabarcıklar */}
      <g fill="#ffffff" opacity="0.55">
        <circle cx="72" cy="210" r="4" />
        <circle cx="118" cy="180" r="3" />
        <circle cx="95" cy="240" r="2.5" />
        <circle cx="128" cy="235" r="3.5" />
        <circle cx="80" cy="440" r="3" />
        <circle cx="120" cy="470" r="2.5" />
      </g>
    </svg>
  );
}
