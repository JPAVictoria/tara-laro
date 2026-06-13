import Svg, {
  Circle,
  Path,
  Rect,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Ellipse,
} from 'react-native-svg'

export function GamerIllustration({ size = 160 }: { size?: number }) {
  const h = Math.round(size * 0.875)
  return (
    <Svg width={size} height={h} viewBox="0 0 160 140">
      <Defs>
        <LinearGradient id="gi_body" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F0A91A" />
          <Stop offset="1" stopColor="#9A6C00" />
        </LinearGradient>
        <LinearGradient id="gi_ctrl" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#2A2218" />
          <Stop offset="1" stopColor="#1A1510" />
        </LinearGradient>
        <RadialGradient id="gi_glow" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor="#F0A91A" stopOpacity="0.3" />
          <Stop offset="1" stopColor="#F0A91A" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Soft ambient glow from screen */}
      <Ellipse cx="80" cy="108" rx="54" ry="26" fill="url(#gi_glow)" />

      {/* ── BODY / HOODIE ── */}
      <Path
        d="M 56 76 Q 53 70 60 66 Q 68 62 80 62 Q 92 62 100 66 Q 107 70 104 76 L 106 120 Q 106 128 80 128 Q 54 128 54 120 Z"
        fill="url(#gi_body)"
      />
      {/* Pocket */}
      <Path d="M 66 102 Q 80 108 94 102 L 92 118 Q 80 122 68 118 Z" fill="#9A6C00" opacity="0.4" />
      {/* Hoodie draw-string dots */}
      <Circle cx="75" cy="73" r="2" fill="#9A6C00" opacity="0.5" />
      <Circle cx="85" cy="73" r="2" fill="#9A6C00" opacity="0.5" />

      {/* ── LEFT ARM ── */}
      <Path d="M 56 78 Q 42 90 44 108" stroke="#F0A91A" strokeWidth="18" strokeLinecap="round" fill="none" />
      <Path d="M 56 78 Q 42 90 44 108" stroke="#7A5200" strokeWidth="18" strokeLinecap="round" fill="none" strokeOpacity="0.35" />
      <Path d="M 44 104 L 58 112" stroke="#E8C49A" strokeWidth="13" strokeLinecap="round" fill="none" />

      {/* ── RIGHT ARM ── */}
      <Path d="M 104 78 Q 118 90 116 108" stroke="#F0A91A" strokeWidth="18" strokeLinecap="round" fill="none" />
      <Path d="M 104 78 Q 118 90 116 108" stroke="#7A5200" strokeWidth="18" strokeLinecap="round" fill="none" strokeOpacity="0.35" />
      <Path d="M 116 104 L 102 112" stroke="#E8C49A" strokeWidth="13" strokeLinecap="round" fill="none" />

      {/* ── CONTROLLER ── */}
      <Path
        d="M 56 106 C 53 106 48 109 48 116 C 48 124 52 129 60 129 L 64 129 C 67 129 69 127 71 124 L 89 124 C 91 127 93 129 96 129 L 100 129 C 108 129 112 124 112 116 C 112 109 107 106 104 106 Z"
        fill="url(#gi_ctrl)"
      />
      {/* Left extended grip */}
      <Path d="M 48 116 C 46 117 44 119 44 122 C 44 127 47 131 53 131 L 61 131 C 56 131 51 129 50 124 Z" fill="#1A1510" />
      {/* Right extended grip */}
      <Path d="M 112 116 C 114 117 116 119 116 122 C 116 127 113 131 107 131 L 99 131 C 104 131 109 129 110 124 Z" fill="#1A1510" />
      {/* Screen glow */}
      <Rect x="73" y="111" width="14" height="7" rx="2" fill="#F0A91A" opacity="0.22" />
      {/* D-pad */}
      <Rect x="62" y="113" width="3.5" height="9" rx="1.5" fill="#5A4E36" />
      <Rect x="58" y="116" width="11" height="3.5" rx="1.5" fill="#5A4E36" />
      {/* ABXY buttons */}
      <Circle cx="97" cy="112" r="3" fill="#F0A91A" />
      <Circle cx="103" cy="117" r="3" fill="#FFCB1F" />
      <Circle cx="91" cy="117" r="3" fill="#A88E62" />
      <Circle cx="97" cy="122" r="3" fill="#E3D4AA" opacity="0.45" />
      {/* Start / Select */}
      <Rect x="75" y="114" width="5" height="3" rx="1.5" fill="#5A4E36" />
      <Rect x="82" y="114" width="5" height="3" rx="1.5" fill="#5A4E36" />

      {/* ── NECK ── */}
      <Rect x="72" y="58" width="16" height="10" rx="4" fill="#E8C49A" />

      {/* ── HEAD ── */}
      <Circle cx="80" cy="44" r="24" fill="#E8C49A" />

      {/* ── HAIR ── */}
      <Path d="M 57 42 Q 59 19 80 17 Q 101 19 103 42 Q 99 27 80 25 Q 61 27 57 42 Z" fill="#1E1208" />
      <Path d="M 57 42 Q 54 49 56 56 Q 57 43 63 38 Z" fill="#1E1208" />
      <Path d="M 103 42 Q 106 49 104 56 Q 103 43 97 38 Z" fill="#1E1208" />

      {/* ── EARS ── */}
      <Ellipse cx="56" cy="48" rx="4" ry="5" fill="#E8C49A" />
      <Ellipse cx="104" cy="48" rx="4" ry="5" fill="#E8C49A" />

      {/* ── EYES ── */}
      <Circle cx="72" cy="47" r="5" fill="#1E1208" />
      <Circle cx="88" cy="47" r="5" fill="#1E1208" />
      {/* Amber screen reflection in eyes */}
      <Circle cx="73.5" cy="45.5" r="2.3" fill="#F0A91A" opacity="0.38" />
      <Circle cx="89.5" cy="45.5" r="2.3" fill="#F0A91A" opacity="0.38" />
      {/* Shine dots */}
      <Circle cx="73" cy="45" r="1.3" fill="white" opacity="0.9" />
      <Circle cx="89" cy="45" r="1.3" fill="white" opacity="0.9" />

      {/* ── EYEBROWS (focused) ── */}
      <Path d="M 66 39 Q 71 37 77 39" stroke="#1E1208" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M 83 39 Q 89 37 94 39" stroke="#1E1208" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* ── MOUTH (slight smile) ── */}
      <Path d="M 74 57 Q 80 61 86 57" stroke="#C4A070" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Subtle screen light on face */}
      <Ellipse cx="80" cy="60" rx="14" ry="9" fill="#F0A91A" opacity="0.07" />
    </Svg>
  )
}
