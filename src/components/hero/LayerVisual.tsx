import Image from 'next/image';
import type {HeroLayer} from '@/data/hero';

/**
 * Bir intro sahnesinin görseli. Gerçek görsel tanımlıysa onu basar,
 * tanımlı değilse sahneye uygun prosedürel bir placeholder çizer.
 *
 * Placeholder'lar deterministik (rastgelelik yok) — aksi halde SSR/CSR
 * uyuşmazlığı çıkar.
 */
export default function LayerVisual({
  layer,
  priority
}: {
  layer: HeroLayer;
  priority?: boolean;
}) {
  if (layer.image) {
    return (
      <Image
        src={layer.image}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
    );
  }

  return <div className="absolute inset-0">{placeholders[layer.id]}</div>;
}

const STARS = [
  [8, 14, 1.2], [17, 62, 0.8], [23, 31, 1.5], [31, 78, 0.9], [38, 12, 1.1],
  [44, 47, 0.7], [52, 84, 1.3], [58, 22, 0.9], [63, 55, 1.4], [69, 9, 0.8],
  [74, 71, 1.1], [79, 37, 0.9], [84, 88, 1.2], [88, 18, 0.7], [93, 58, 1.3],
  [12, 91, 0.9], [27, 5, 1.0], [47, 66, 0.8], [56, 41, 1.1], [71, 95, 0.9],
  [3, 44, 1.0], [35, 96, 0.7], [66, 33, 0.9], [91, 76, 1.0], [20, 25, 0.8]
] as const;

const placeholders: Record<string, React.ReactNode> = {
  /* --- 1. Uzaydan dünya --- */
  world: (
    <svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <radialGradient id="space" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stopColor="#0c1424" />
          <stop offset="100%" stopColor="#020307" />
        </radialGradient>
        <radialGradient id="globe" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#4aa3d8" />
          <stop offset="55%" stopColor="#1c5f92" />
          <stop offset="100%" stopColor="#06192c" />
        </radialGradient>
        <radialGradient id="atmo" cx="50%" cy="50%" r="50%">
          <stop offset="76%" stopColor="rgba(90,180,255,0)" />
          <stop offset="92%" stopColor="rgba(90,180,255,0.35)" />
          <stop offset="100%" stopColor="rgba(90,180,255,0)" />
        </radialGradient>
      </defs>
      <rect width="1000" height="1000" fill="url(#space)" />
      {STARS.map(([x, y, r], i) => (
        <circle
          key={i}
          cx={x * 10}
          cy={y * 10}
          r={r}
          fill="#ffffff"
          opacity={0.35 + (i % 4) * 0.15}
        />
      ))}
      <circle cx="500" cy="500" r="300" fill="url(#globe)" />
      {/* kıta lekeleri */}
      <g fill="#2f7a4a" opacity="0.75">
        <path d="M400 380c40-30 90-25 120 5s10 70-30 80-90-5-105-40 5-35 15-45z" />
        <path d="M560 460c35 10 60 45 50 80s-55 55-85 35-30-70-5-95 25-25 40-20z" />
        <path d="M420 610c30-15 75-5 85 25s-25 55-60 50-55-25-55-45 15-25 30-30z" />
      </g>
      <circle cx="500" cy="500" r="300" fill="url(#atmo)" />
    </svg>
  ),

  /* --- 2. Türkiye / bölge --- */
  turkey: (
    <svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5f7a45" />
          <stop offset="50%" stopColor="#8a8a4e" />
          <stop offset="100%" stopColor="#6b5a38" />
        </linearGradient>
        <radialGradient id="vign2" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
      </defs>
      <rect width="1000" height="1000" fill="url(#land)" />
      <g opacity="0.35" fill="#2b4c63">
        <path d="M0 0h1000v170c-180 40-380 20-560 60S140 250 0 210z" />
        <path d="M0 880c220-60 460-30 700-70s220-40 300-30v220H0z" />
      </g>
      <g opacity="0.3" stroke="#f5e9cf" strokeWidth="3" fill="none">
        <path d="M-20 520C160 470 300 560 480 500s340-90 540-30" />
        <path d="M-20 640C180 610 320 680 520 620s300-60 500-10" />
      </g>
      <g opacity="0.18" fill="#ffffff">
        <ellipse cx="230" cy="300" rx="150" ry="60" />
        <ellipse cx="760" cy="720" rx="190" ry="70" />
      </g>
      <rect width="1000" height="1000" fill="url(#vign2)" />
    </svg>
  ),

  /* --- 3. Çankırı çevresi / bozkır --- */
  cankiri: (
    <svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="steppe" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#b39a63" />
          <stop offset="55%" stopColor="#9d8450" />
          <stop offset="100%" stopColor="#6f5c39" />
        </linearGradient>
      </defs>
      <rect width="1000" height="1000" fill="url(#steppe)" />
      {/* tarla parselleri */}
      <g opacity="0.45">
        {Array.from({length: 9}).map((_, i) => (
          <rect
            key={i}
            x={(i % 3) * 320 + 40}
            y={Math.floor(i / 3) * 300 + 60}
            width="270"
            height="240"
            rx="18"
            fill={i % 2 === 0 ? '#7f8f4d' : '#a8894f'}
            opacity={0.5 + (i % 3) * 0.12}
          />
        ))}
      </g>
      {/* yollar */}
      <g stroke="#efe3c8" strokeWidth="7" fill="none" opacity="0.65">
        <path d="M-20 400C220 380 380 520 620 470s280-120 420-90" />
        <path d="M300 -20C330 260 260 480 380 700s180 200 200 340" />
      </g>
      <g fill="#4d6b7d" opacity="0.5">
        <ellipse cx="800" cy="250" rx="120" ry="55" />
      </g>
    </svg>
  ),

  /* --- 4. Orta ilçesi / yerleşim --- */
  orta: (
    <svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="town" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#a89364" />
          <stop offset="100%" stopColor="#6d5c3d" />
        </linearGradient>
      </defs>
      <rect width="1000" height="1000" fill="url(#town)" />
      <g>
        {Array.from({length: 40}).map((_, i) => {
          const col = i % 8;
          const row = Math.floor(i / 8);
          const w = 60 + ((i * 17) % 40);
          const h = 50 + ((i * 29) % 45);
          return (
            <g key={i}>
              <rect
                x={col * 122 + 24}
                y={row * 190 + 40}
                width={w}
                height={h}
                rx="4"
                fill={i % 3 === 0 ? '#c9b489' : '#b09a70'}
              />
              <rect
                x={col * 122 + 24}
                y={row * 190 + 40}
                width={w}
                height={10}
                rx="3"
                fill="#8d3b2b"
                opacity="0.85"
              />
            </g>
          );
        })}
      </g>
      <g stroke="#e7dcc0" strokeWidth="14" fill="none" opacity="0.8">
        <path d="M-20 320h1040" />
        <path d="M-20 700h1040" />
        <path d="M480 -20v1040" />
      </g>
      <g fill="#3f6b3f" opacity="0.6">
        <circle cx="180" cy="640" r="26" />
        <circle cx="700" cy="240" r="30" />
        <circle cx="880" cy="820" r="24" />
      </g>
    </svg>
  ),

  /* --- 5. Fabrika --- */
  factory: (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1a2b" />
          <stop offset="55%" stopColor="#1e3550" />
          <stop offset="100%" stopColor="#4a4030" />
        </linearGradient>
        <linearGradient id="bld" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a2f" />
          <stop offset="100%" stopColor="#14141a" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#sky)" />
      <circle cx="1240" cy="240" r="70" fill="#f2c77a" opacity="0.35" />
      {/* dağ silüeti */}
      <path
        d="M0 560L220 430l180 90 200-140 220 150 240-110 260 130 280-80v430H0z"
        fill="#1b2635"
        opacity="0.9"
      />
      {/* fabrika gövdesi */}
      <g fill="url(#bld)">
        <rect x="280" y="470" width="740" height="290" rx="8" />
        <rect x="1020" y="540" width="300" height="220" rx="8" />
        <rect x="360" y="330" width="70" height="150" rx="6" />
        <rect x="470" y="380" width="52" height="100" rx="6" />
      </g>
      {/* testere çatı */}
      <g fill="#33333a">
        {Array.from({length: 7}).map((_, i) => (
          <path
            key={i}
            d={`M${300 + i * 100} 470 l50 -52 l50 52 z`}
          />
        ))}
      </g>
      {/* pencereler */}
      <g fill="#ffd98a">
        {Array.from({length: 18}).map((_, i) => (
          <rect
            key={i}
            x={320 + (i % 9) * 78}
            y={i < 9 ? 540 : 640}
            width="46"
            height="52"
            rx="4"
            opacity={i % 4 === 0 ? 0.45 : 0.9}
          />
        ))}
        <rect x="1060" y="600" width="60" height="60" rx="4" opacity="0.8" />
        <rect x="1160" y="600" width="60" height="60" rx="4" opacity="0.55" />
      </g>
      <rect y="760" width="1600" height="140" fill="#0f1116" />
    </svg>
  )
};
