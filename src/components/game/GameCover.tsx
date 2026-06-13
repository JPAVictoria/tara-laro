import React from 'react'
import { View, Text } from 'react-native'
import { Image } from 'expo-image'
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  Path,
  Polygon,
  Line,
  Ellipse,
} from 'react-native-svg'
import { TL } from '@/constants/tl-theme'

// ─── CoverTitle helper ─────────────────────────────────────────────────────

function CoverTitle({
  title,
  sub,
  textColor = '#fff',
  small = false,
}: {
  title: string
  sub: string
  textColor?: string
  small?: boolean
}) {
  return (
    <View style={{ position: 'absolute', left: 8, right: 8, bottom: 6 }}>
      <Text
        style={{
          fontSize: small ? 9 : 11,
          color: textColor,
          fontWeight: '700',
          opacity: 0.85,
          letterSpacing: 1,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: small ? 13 : 18,
          color: textColor,
          fontWeight: '800',
          lineHeight: 18,
        }}
      >
        {sub}
      </Text>
    </View>
  )
}

// ─── Individual cover renderers ────────────────────────────────────────────

function LumenCover({ w, h, small }: { w: number; h: number; small: boolean }) {
  return (
    <>
      <Svg width={w} height={h}>
        <Defs>
          <LinearGradient id="lg_lumen" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#2a1e58" />
            <Stop offset="0.55" stopColor="#7c3a8b" />
            <Stop offset="1" stopColor="#f5a25a" />
          </LinearGradient>
        </Defs>
        <Rect width={w} height={h} fill="url(#lg_lumen)" />
        {/* Sun arch */}
        <Path
          d={`M ${w * 0.2} ${h * 0.55} A ${w * 0.3} ${w * 0.3} 0 0 1 ${w * 0.8} ${h * 0.55}`}
          fill="#f5c842"
          opacity={0.9}
        />
        <Ellipse
          cx={w / 2}
          cy={h * 0.52}
          rx={w * 0.22}
          ry={w * 0.22}
          fill="#f5e86a"
          opacity={0.85}
        />
      </Svg>
      <CoverTitle title="LUMEN /" sub="DRIFT" textColor="#fff" small={small} />
    </>
  )
}

function HollowCover({ w, h, small }: { w: number; h: number; small: boolean }) {
  const cx = w / 2
  const cy = h * 0.42
  return (
    <>
      <Svg width={w} height={h}>
        <Defs>
          <LinearGradient id="lg_hollow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#0c1116" />
            <Stop offset="0.6" stopColor="#1f2a36" />
            <Stop offset="1" stopColor="#3a1f24" />
          </LinearGradient>
        </Defs>
        <Rect width={w} height={h} fill="url(#lg_hollow)" />
        {/* Diamond */}
        <Polygon
          points={`${cx},${cy - h * 0.2} ${cx + w * 0.22},${cy} ${cx},${cy + h * 0.2} ${cx - w * 0.22},${cy}`}
          fill="#0a0d12"
          stroke="#e54a5e"
          strokeWidth={1}
          opacity={0.8}
        />
        {/* Red circle */}
        <Circle cx={cx} cy={cy} r={w * 0.12} fill="#e54a5e" opacity={0.85} />
        <Circle cx={cx} cy={cy} r={w * 0.04} fill="#fff" />
      </Svg>
      <CoverTitle title="HOLLOW /" sub="ECHO" textColor="#fff" small={small} />
    </>
  )
}

function HoneyCover({ w, h, small }: { w: number; h: number; small: boolean }) {
  // Draw a simple hexagon grid using polygon
  const hexPoints = (cx: number, cy: number, r: number) => {
    const pts = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`)
    }
    return pts.join(' ')
  }
  const r = w * 0.18
  const dx = r * 1.73
  const dy = r * 1.5
  const hexes: { cx: number; cy: number }[] = []
  for (let row = -1; row <= 3; row++) {
    for (let col = -1; col <= 3; col++) {
      const cx = col * dx + (row % 2 === 0 ? 0 : dx / 2)
      const cy = row * dy
      hexes.push({ cx, cy })
    }
  }
  return (
    <>
      <Svg width={w} height={h}>
        <Defs>
          <LinearGradient id="lg_honey" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFCB1F" />
            <Stop offset="1" stopColor="#FF7A1A" />
          </LinearGradient>
        </Defs>
        <Rect width={w} height={h} fill="url(#lg_honey)" />
        {hexes.map((hex, i) => (
          <Polygon
            key={i}
            points={hexPoints(hex.cx, hex.cy, r)}
            fill="none"
            stroke="#2A1303"
            strokeWidth={1}
            opacity={0.3}
          />
        ))}
      </Svg>
      <CoverTitle title="HONEY /" sub="COMB" textColor="#2A1303" small={small} />
    </>
  )
}

function SaltCover({ w, h, small }: { w: number; h: number; small: boolean }) {
  return (
    <>
      <Svg width={w} height={h}>
        <Defs>
          <LinearGradient id="lg_salt" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#7ec5dd" />
            <Stop offset="0.55" stopColor="#cfead6" />
            <Stop offset="1" stopColor="#f4ecc4" />
          </LinearGradient>
        </Defs>
        <Rect width={w} height={h} fill="url(#lg_salt)" />
        {/* Horizon line */}
        <Line
          x1={0}
          y1={h * 0.6}
          x2={w}
          y2={h * 0.6}
          stroke="#465a64"
          strokeWidth={1}
          opacity={0.5}
        />
        {/* Mountain silhouette */}
        <Path
          d={`M 0 ${h * 0.6} L ${w * 0.15} ${h * 0.35} L ${w * 0.32} ${h * 0.5} L ${w * 0.5} ${h * 0.25} L ${w * 0.68} ${h * 0.42} L ${w * 0.85} ${h * 0.32} L ${w} ${h * 0.52} L ${w} ${h * 0.6} Z`}
          fill="#465a64"
          opacity={0.85}
        />
        {/* Water */}
        <Rect x={0} y={h * 0.6} width={w} height={h * 0.4} fill="#b8d8e8" opacity={0.45} />
      </Svg>
      <CoverTitle title="TIDE OF /" sub="SALT" textColor="#1a2a32" small={small} />
    </>
  )
}

function NeonCover({ w, h, small }: { w: number; h: number; small: boolean }) {
  return (
    <>
      <Svg width={w} height={h}>
        <Defs>
          <LinearGradient id="lg_neon" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#0c1a16" />
            <Stop offset="1" stopColor="#193d2e" />
          </LinearGradient>
        </Defs>
        <Rect width={w} height={h} fill="url(#lg_neon)" />
        {/* Vertical lines */}
        {[0.2, 0.4, 0.6, 0.8].map((x, i) => (
          <Line
            key={i}
            x1={w * x}
            y1={0}
            x2={w * x}
            y2={h}
            stroke="#1FA66B"
            strokeWidth={0.5}
            opacity={0.2}
          />
        ))}
        {/* Three neon circles */}
        <Circle cx={w * 0.5} cy={h * 0.35} r={w * 0.22} fill="none" stroke="#1FA66B" strokeWidth={2} />
        <Circle cx={w * 0.35} cy={h * 0.45} r={w * 0.16} fill="none" stroke="#FF69B4" strokeWidth={1.5} />
        <Circle cx={w * 0.65} cy={h * 0.42} r={w * 0.12} fill="none" stroke="#FFCB1F" strokeWidth={1.5} />
        {/* Vertical center lines down from circles */}
        <Line x1={w * 0.5} y1={h * 0.57} x2={w * 0.5} y2={h * 0.85} stroke="#1FA66B" strokeWidth={1} opacity={0.6} />
        <Line x1={w * 0.35} y1={h * 0.61} x2={w * 0.35} y2={h * 0.85} stroke="#FF69B4" strokeWidth={1} opacity={0.6} />
        <Line x1={w * 0.65} y1={h * 0.54} x2={w * 0.65} y2={h * 0.85} stroke="#FFCB1F" strokeWidth={1} opacity={0.6} />
      </Svg>
      <CoverTitle title="NEON /" sub="GARDEN" textColor="#fff" small={small} />
    </>
  )
}

function PixelCover({ w, h, small }: { w: number; h: number; small: boolean }) {
  const brickSize = w * 0.08
  return (
    <>
      <Svg width={w} height={h}>
        <Rect width={w} height={h} fill="#FCE2A6" />
        {/* Background building pixels */}
        {[0, 1, 2, 3, 4, 5].map((col) =>
          [0, 1, 2, 3, 4].map((row) => (
            <Rect
              key={`${col}-${row}`}
              x={w * 0.1 + col * brickSize * 1.2}
              y={h * 0.25 + row * brickSize * 0.9}
              width={brickSize}
              height={brickSize * 0.8}
              fill={row % 2 === 0 && col % 2 === 0 ? '#D4880A' : '#E8A820'}
              opacity={0.7}
            />
          ))
        )}
        {/* Main building silhouette */}
        <Rect x={w * 0.15} y={h * 0.3} width={w * 0.28} height={h * 0.42} fill="#C47A0A" />
        <Rect x={w * 0.5} y={h * 0.38} width={w * 0.32} height={h * 0.34} fill="#B86A08" />
        {/* Windows */}
        <Rect x={w * 0.2} y={h * 0.38} width={w * 0.08} height={w * 0.08} fill="#FCE2A6" />
        <Rect x={w * 0.3} y={h * 0.38} width={w * 0.08} height={w * 0.08} fill="#FCE2A6" />
        <Rect x={w * 0.2} y={h * 0.5} width={w * 0.08} height={w * 0.08} fill="#FCE2A6" />
        <Rect x={w * 0.57} y={h * 0.44} width={w * 0.07} height={w * 0.07} fill="#FCE2A6" />
        <Rect x={w * 0.67} y={h * 0.44} width={w * 0.07} height={w * 0.07} fill="#FCE2A6" />
        {/* Ground */}
        <Rect x={0} y={h * 0.72} width={w} height={h * 0.28} fill="#A85C04" opacity={0.4} />
      </Svg>
      <CoverTitle title="PIXEL /" sub="BAKERY" textColor="#2A1303" small={small} />
    </>
  )
}

function StardustCover({ w, h, small }: { w: number; h: number; small: boolean }) {
  const stars = [
    [0.1, 0.1], [0.3, 0.05], [0.7, 0.08], [0.9, 0.12],
    [0.15, 0.22], [0.5, 0.18], [0.8, 0.25], [0.25, 0.3],
    [0.65, 0.32], [0.42, 0.08], [0.88, 0.35], [0.05, 0.4],
  ]
  return (
    <>
      <Svg width={w} height={h}>
        <Defs>
          <LinearGradient id="lg_stardust" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#1a1438" />
            <Stop offset="0.55" stopColor="#3a2670" />
            <Stop offset="1" stopColor="#7548a8" />
          </LinearGradient>
        </Defs>
        <Rect width={w} height={h} fill="url(#lg_stardust)" />
        {stars.map(([sx, sy], i) => (
          <Circle key={i} cx={w * sx} cy={h * sy} r={1} fill="#fff" opacity={0.6 + (i % 3) * 0.15} />
        ))}
        {/* Tavern building */}
        <Rect x={w * 0.25} y={h * 0.52} width={w * 0.5} height={h * 0.28} fill="#2a1c50" />
        {/* Roof */}
        <Polygon
          points={`${w * 0.18},${h * 0.52} ${w / 2},${h * 0.36} ${w * 0.82},${h * 0.52}`}
          fill="#3d2a70"
        />
        {/* Door */}
        <Rect x={w * 0.44} y={h * 0.64} width={w * 0.12} height={h * 0.16} fill="#F0C040" />
        {/* Windows */}
        <Rect x={w * 0.3} y={h * 0.57} width={w * 0.1} height={w * 0.08} fill="#F0C040" opacity={0.7} />
        <Rect x={w * 0.6} y={h * 0.57} width={w * 0.1} height={w * 0.08} fill="#F0C040" opacity={0.7} />
      </Svg>
      <CoverTitle title="STARDUST /" sub="TAVERN" textColor="#fff" small={small} />
    </>
  )
}

function WraithCover({ w, h, small }: { w: number; h: number; small: boolean }) {
  return (
    <>
      <Svg width={w} height={h}>
        <Defs>
          <LinearGradient id="lg_wraith" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#1a0a0a" />
            <Stop offset="1" stopColor="#3a1010" />
          </LinearGradient>
        </Defs>
        <Rect width={w} height={h} fill="url(#lg_wraith)" />
        {/* Ghost head */}
        <Circle cx={w / 2} cy={h * 0.32} r={w * 0.2} fill="#E8DECB" opacity={0.85} />
        {/* Ghost body */}
        <Path
          d={`M ${w * 0.3} ${h * 0.32} C ${w * 0.28} ${h * 0.55}, ${w * 0.25} ${h * 0.65}, ${w * 0.3} ${h * 0.72}
              C ${w * 0.35} ${h * 0.68}, ${w * 0.4} ${h * 0.75}, ${w * 0.5} ${h * 0.72}
              C ${w * 0.6} ${h * 0.75}, ${w * 0.65} ${h * 0.68}, ${w * 0.7} ${h * 0.72}
              C ${w * 0.75} ${h * 0.65}, ${w * 0.72} ${h * 0.55}, ${w * 0.7} ${h * 0.32} Z`}
          fill="#E8DECB"
          opacity={0.82}
        />
        {/* Eyes */}
        <Circle cx={w * 0.43} cy={h * 0.31} r={w * 0.04} fill="#1a0a0a" />
        <Circle cx={w * 0.57} cy={h * 0.31} r={w * 0.04} fill="#1a0a0a" />
      </Svg>
      <CoverTitle title="WRAITH /" sub="MILE" textColor="#fff" small={small} />
    </>
  )
}

function CobaltCover({ w, h, small }: { w: number; h: number; small: boolean }) {
  const barWidth = w * 0.1
  const barPositions = [0.12, 0.28, 0.44, 0.6, 0.76]
  return (
    <>
      <Svg width={w} height={h}>
        <Defs>
          <LinearGradient id="lg_cobalt" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#0a1538" />
            <Stop offset="0.55" stopColor="#1f3a8a" />
            <Stop offset="1" stopColor="#5ba0e5" />
          </LinearGradient>
        </Defs>
        <Rect width={w} height={h} fill="url(#lg_cobalt)" />
        {/* 5 vertical yellow bars */}
        {barPositions.map((x, i) => (
          <Rect
            key={i}
            x={w * x}
            y={h * 0.15}
            width={barWidth}
            height={h * 0.55}
            fill="#FFCB1F"
            opacity={0.85}
          />
        ))}
        {/* Horizontal baseline */}
        <Line
          x1={w * 0.08}
          y1={h * 0.7}
          x2={w * 0.92}
          y2={h * 0.7}
          stroke="#FFCB1F"
          strokeWidth={2}
        />
      </Svg>
      <CoverTitle title="COBALT /" sub="CHOIR" textColor="#fff" small={small} />
    </>
  )
}

function PaperCover({ w, h, small }: { w: number; h: number; small: boolean }) {
  // Three triangle knights
  const knights: { cx: number }[] = [{ cx: 0.25 }, { cx: 0.5 }, { cx: 0.75 }]
  return (
    <>
      <Svg width={w} height={h}>
        <Rect width={w} height={h} fill="#FBF3E1" />
        {knights.map((k, i) => {
          const cx = w * k.cx
          const topY = h * 0.25
          const botY = h * 0.62
          const halfBase = w * 0.1
          return (
            <React.Fragment key={i}>
              {/* Body triangle */}
              <Polygon
                points={`${cx},${topY} ${cx - halfBase},${botY} ${cx + halfBase},${botY}`}
                fill={i === 1 ? '#C47A0A' : '#8B6914'}
                opacity={0.85}
              />
              {/* Head circle */}
              <Circle cx={cx} cy={topY - w * 0.06} r={w * 0.06} fill={i === 1 ? '#C47A0A' : '#8B6914'} opacity={0.85} />
              {/* Lance */}
              <Line
                x1={cx + halfBase}
                y1={topY + h * 0.04}
                x2={cx + halfBase + w * 0.12}
                y2={topY - h * 0.06}
                stroke="#8B6914"
                strokeWidth={1.5}
                opacity={0.7}
              />
            </React.Fragment>
          )
        })}
        {/* Ground line */}
        <Line x1={0} y1={h * 0.62} x2={w} y2={h * 0.62} stroke="#8B6914" strokeWidth={1} opacity={0.3} />
      </Svg>
      <CoverTitle title="PAPER /" sub="KNIGHTS" textColor="#2A1303" small={small} />
    </>
  )
}

// ─── Fallback cover ────────────────────────────────────────────────────────

function FallbackCover({ w, h }: { w: number; h: number }) {
  return (
    <View
      style={{
        width: w,
        height: h,
        backgroundColor: TL.amberSoft,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: TL.muted, fontWeight: '700', fontSize: 10 }}>?</Text>
    </View>
  )
}

// ─── Main GameCover component ──────────────────────────────────────────────

const COVER_MAP: Record<
  string,
  (props: { w: number; h: number; small: boolean }) => React.ReactElement
> = {
  lumen: LumenCover,
  hollow: HollowCover,
  honey: HoneyCover,
  salt: SaltCover,
  neon: NeonCover,
  pixel: PixelCover,
  stardust: StardustCover,
  wraith: WraithCover,
  cobalt: CobaltCover,
  paper: PaperCover,
}

export function GameCover({
  id,
  coverUrl,
  w = 120,
  h = 160,
  radius = TL.radiusSm,
  flat = false,
}: {
  id: string
  coverUrl?: string | null
  w?: number | string
  h?: number | string
  radius?: number
  flat?: boolean
}) {
  const numW = typeof w === 'string' ? 0 : w
  const numH = typeof h === 'string' ? 0 : h
  const small = numW < 70

  const sharedStyle = {
    width: w as `${number}%` | number,
    height: numH || 180,
    borderRadius: flat ? 0 : radius,
    overflow: 'hidden' as const,
  }

  if (coverUrl) {
    return (
      <Image
        source={{ uri: coverUrl }}
        style={sharedStyle}
        contentFit="cover"
        placeholder={{ blurhash: 'LGF5?xYk^6#M@-5c,1J5@[or[Q6.' }}
        transition={200}
      />
    )
  }

  const CoverRenderer = COVER_MAP[id]

  if (typeof w === 'string' || typeof h === 'string') {
    return (
      <View style={{ ...sharedStyle, backgroundColor: TL.surface2 }}>
        <View style={{ flex: 1, position: 'relative' }}>
          {CoverRenderer ? (
            <View style={{ flex: 1 }}>
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                <CoverRenderer w={300} h={numH || 180} small={false} />
              </View>
            </View>
          ) : (
            <FallbackCover w={300} h={numH || 180} />
          )}
        </View>
      </View>
    )
  }

  return (
    <View
      style={{
        width: numW,
        height: numH,
        borderRadius: flat ? 0 : radius,
        overflow: 'hidden',
        backgroundColor: TL.surface2,
        position: 'relative',
      }}
    >
      {CoverRenderer ? (
        <CoverRenderer w={numW} h={numH} small={small} />
      ) : (
        <FallbackCover w={numW} h={numH} />
      )}
    </View>
  )
}
