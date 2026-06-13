import { Component, type ReactNode } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  reset = () => this.setState({ hasError: false })

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <View style={styles.container}>
          <Text style={styles.emoji}>⚠️</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>An unexpected error occurred.</Text>
          <TouchableOpacity style={styles.btn} onPress={this.reset}>
            <Text style={styles.btnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12, backgroundColor: '#FAFAFA' },
  emoji: { fontSize: 48, marginBottom: 4 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827', textAlign: 'center' },
  message: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 },
  btn: { marginTop: 8, backgroundColor: '#FACC15', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 },
  btnText: { fontWeight: '700', fontSize: 15, color: '#111827' },
})
