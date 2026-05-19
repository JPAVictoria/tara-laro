import { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { LogoIcon } from '@/components/logo'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  runOnJS,
  Easing,
  type SharedValue,
} from 'react-native-reanimated'

export function SplashScreen() {
  const [visible, setVisible] = useState(true)

  const bgOpacity = useSharedValue(1)
  const logoScale = useSharedValue(0.3)
  const logoOpacity = useSharedValue(0)
  const taglineOpacity = useSharedValue(0)
  const taglineY = useSharedValue(20)
  const iconScale = useSharedValue(0)
  const dot1 = useSharedValue(0.3)
  const dot2 = useSharedValue(0.3)
  const dot3 = useSharedValue(0.3)

  useEffect(() => {
    // Icon bounces in
    iconScale.value = withSpring(1, { damping: 8, stiffness: 120 })

    // Logo scales in with spring
    logoScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 90 }))
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 400 }))

    // Tagline slides up
    taglineOpacity.value = withDelay(550, withTiming(1, { duration: 450 }))
    taglineY.value = withDelay(550, withSpring(0, { damping: 14, stiffness: 100 }))

    // Dots pulse one by one
    const pulse = (sv: SharedValue<number>, delay: number) => {
      sv.value = withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 220 }),
          withTiming(0.25, { duration: 220 }),
          withTiming(1, { duration: 220 }),
          withTiming(0.25, { duration: 220 }),
        ),
      )
    }
    pulse(dot1, 1000)
    pulse(dot2, 1200)
    pulse(dot3, 1400)

    // Fade everything out
    bgOpacity.value = withDelay(
      2500,
      withTiming(0, { duration: 450, easing: Easing.ease }, (finished) => {
        if (finished) runOnJS(setVisible)(false)
      }),
    )
  }, [])

  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }))
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: iconScale.value }] }))
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }))
  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }))
  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1.value }))
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2.value }))
  const dot3Style = useAnimatedStyle(() => ({ opacity: dot3.value }))

  if (!visible) return null

  return (
    <Animated.View style={[styles.container, bgStyle]}>
      <View style={styles.content}>
        <Animated.View style={iconStyle}>
          <LogoIcon size={96} />
        </Animated.View>

        <Animated.View style={[logoStyle, styles.wordmarkRow]}>
          <Text style={styles.logo}>tara-laro</Text>
        </Animated.View>

        <Animated.View style={taglineStyle}>
          <Text style={styles.tagline}>your gaming world.</Text>
        </Animated.View>

        <View style={styles.dots}>
          <Animated.View style={[styles.dot, dot1Style]} />
          <Animated.View style={[styles.dot, dot2Style]} />
          <Animated.View style={[styles.dot, dot3Style]} />
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FACC15',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 8,
  },
  wordmarkRow: {
    marginTop: 4,
  },
  logo: {
    fontSize: 42,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '500',
    color: '#78350F',
    letterSpacing: 0.3,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#111827',
  },
})
