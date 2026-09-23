import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, font, space, radius } from '../theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo?: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error.message, errorInfo?.componentStack || '');
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.body}>
            Parang may nag-error. Close and open the app again, or go back to the home screen.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState({ hasError: false })}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    justifyContent: 'center',
    alignItems: 'center',
    padding: space.xxxl,
  },
  title: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: space.sm,
    textAlign: 'center',
  },
  body: {
    fontSize: font.md,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: space.xl,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
    paddingHorizontal: space.xxl,
    paddingVertical: space.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: font.md,
    fontWeight: '600',
  },
});
