import { View, ScrollView, StyleSheet } from 'react-native'

export function ProfileScreen() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.placeholder} />
      {/* Day 17: ProfileHeader + PostGrid */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { paddingBottom: 80 },
  placeholder: { height: 200, backgroundColor: '#F3F4F6' },
})
