import Svg, { Rect, Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg'
import { View, Text, StyleSheet } from 'react-native'

interface LogoIconProps {
  size?: number
}

// Cute game controller inside a yellow rounded badge
export function LogoIcon({ size = 80 }: LogoIconProps) {
  const s = size / 80

  return (
    <Svg width={size} height={size} viewBox='0 0 80 80'>
      <Defs>
        <LinearGradient id='bg' x1='0' y1='0' x2='0' y2='1'>
          <Stop offset='0' stopColor='#FDE047' />
          <Stop offset='1' stopColor='#FACC15' />
        </LinearGradient>
        <LinearGradient id='body' x1='0' y1='0' x2='0' y2='1'>
          <Stop offset='0' stopColor='#1F2937' />
          <Stop offset='1' stopColor='#111827' />
        </LinearGradient>
      </Defs>

      {/* Badge background */}
      <Rect x='0' y='0' width='80' height='80' rx='20' ry='20' fill='url(#bg)' />

      {/* Subtle inner shadow line */}
      <Rect x='0' y='0' width='80' height='80' rx='20' ry='20' fill='none' stroke='#CA8A04' strokeWidth='1.5' strokeOpacity='0.4' />

      {/* Controller body */}
      <Path
        d='M16 36 C16 29 22 26 30 26 L50 26 C58 26 64 29 64 36 L64 46 C64 53 60 56 54 56 L50 56 C48 56 46 54 44 52 L36 52 C34 54 32 56 30 56 L26 56 C20 56 16 53 16 46 Z'
        fill='url(#body)'
      />

      {/* Left grip */}
      <Path
        d='M16 40 C14 40 12 42 12 45 C12 50 15 54 19 54 L26 54 C22 54 18 52 17 47 Z'
        fill='#1F2937'
      />

      {/* Right grip */}
      <Path
        d='M64 40 C66 40 68 42 68 45 C68 50 65 54 61 54 L54 54 C58 54 62 52 63 47 Z'
        fill='#1F2937'
      />

      {/* D-pad vertical */}
      <Rect x='27' y='33' width='5' height='13' rx='1.5' fill='#374151' />
      {/* D-pad horizontal */}
      <Rect x='23' y='37' width='13' height='5' rx='1.5' fill='#374151' />
      {/* D-pad center dot */}
      <Circle cx='29.5' cy='39.5' r='2' fill='#4B5563' />

      {/* ABXY buttons — cute circles */}
      {/* A - right */}
      <Circle cx='56' cy='39' r='3.5' fill='#FACC15' />
      <Text style={styles.hidden}>A</Text>

      {/* B - bottom */}
      <Circle cx='52' cy='44' r='3.5' fill='#FDE047' />

      {/* X - top */}
      <Circle cx='52' cy='34' r='3.5' fill='#FEF08A' />

      {/* Y - left */}
      <Circle cx='47' cy='39' r='3.5' fill='#FEF9C3' />

      {/* Center buttons */}
      <Rect x='35' y='37' width='4' height='3' rx='1.5' fill='#374151' />
      <Rect x='41' y='37' width='4' height='3' rx='1.5' fill='#374151' />

      {/* Cute sparkles top-right */}
      <Circle cx='68' cy='12' r='2' fill='#111827' opacity='0.25' />
      <Circle cx='74' cy='18' r='1.2' fill='#111827' opacity='0.18' />
      <Circle cx='62' cy='16' r='1' fill='#111827' opacity='0.15' />
    </Svg>
  )
}

interface LogoWordmarkProps {
  iconSize?: number
  showTagline?: boolean
}

// Full logo: icon + wordmark
export function LogoWordmark({ iconSize = 64, showTagline = false }: LogoWordmarkProps) {
  return (
    <View style={styles.wrapper}>
      <LogoIcon size={iconSize} />
      <Text style={styles.wordmark}>TaraLaro</Text>
      {showTagline && <Text style={styles.tagline}>your gaming world.</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  hidden: { display: 'none' },
  wrapper: { alignItems: 'center', gap: 10 },
  wordmark: { fontSize: 36, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  tagline: { fontSize: 13, fontWeight: '500', color: '#78350F', letterSpacing: 0.3 },
})
