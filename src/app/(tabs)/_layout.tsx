import { Tabs } from 'expo-router'
import { SymbolView, type SymbolViewProps } from 'expo-symbols'
import { TL } from '@/constants/tl-theme'

type SymbolName = SymbolViewProps['name']

function icon(name: SymbolName, size = 24) {
  return ({ color }: { color: string }) => <SymbolView name={name} tintColor={color} size={size} />
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: TL.amber,
        tabBarInactiveTintColor: TL.muted,
        tabBarStyle: {
          backgroundColor: TL.bg,
          borderTopWidth: 1,
          borderTopColor: TL.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: icon('house.fill') }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover', tabBarIcon: icon('books.vertical.fill') }} />
      <Tabs.Screen name="notifications" options={{ title: 'Community', tabBarIcon: icon('bubble.left.fill') }} />
      <Tabs.Screen name="profile" options={{ title: 'You', tabBarIcon: icon('person.fill') }} />
      <Tabs.Screen name="create" options={{ href: null }} />
    </Tabs>
  )
}
