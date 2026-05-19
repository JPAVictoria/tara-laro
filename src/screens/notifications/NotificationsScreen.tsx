import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native'

export function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.heading}>Notifications</Text>
      </View>
      <FlatList
        data={[]}
        keyExtractor={(item) => item}
        renderItem={() => null}
        /* Day 23: NotificationItem + mark-read */
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB' },
  heading: { fontSize: 20, fontWeight: '700', color: '#111827' },
})
