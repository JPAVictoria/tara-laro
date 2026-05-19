import { Tabs } from 'expo-router'
import { SymbolView, type SymbolViewProps } from 'expo-symbols'
import { Colors } from '@/constants/theme'

type SymbolName = SymbolViewProps['name']

function icon(name: SymbolName, size = 24) {
  return ({ color }: { color: string }) => <SymbolView name={name} tintColor={color} size={size} />
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text2,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.muted,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('house.fill') }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover', tabBarIcon: icon('safari.fill') }} />
      <Tabs.Screen name="create" options={{ title: '', tabBarIcon: icon('plus.circle.fill', 30) }} />
      <Tabs.Screen name="notifications" options={{ title: 'Activity', tabBarIcon: icon('bell.fill') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('person.fill') }} />
    </Tabs>
  )
}
