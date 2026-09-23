import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors, font, space, radius, MIN_TOUCH } from '../../theme';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear?: () => void;
  placeholder?: string;
  accessibilityLabel?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder,
  accessibilityLabel,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Search size={20} color={colors.muted} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder || 'Search by brand or generic name...'}
          placeholderTextColor={colors.muted}
          value={value}
          onChangeText={onChange}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          clearButtonMode="never"
          accessibilityLabel={accessibilityLabel || 'Search'}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={onClear || (() => onChange(''))}
            style={styles.clearBtn}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={18} color={colors.muted} />
          </TouchableOpacity>
        )}
      </View>
      {value.length > 0 && (
        <Text style={styles.hint}>Tip: press Search, or results update as you type</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: space.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: space.md,
    minHeight: MIN_TOUCH + 4,
  },
  icon: {
    marginRight: space.sm,
  },
  input: {
    flex: 1,
    height: MIN_TOUCH,
    fontSize: font.md,
    color: colors.ink,
  },
  clearBtn: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    marginTop: space.sm,
    fontSize: font.xs,
    color: colors.muted,
  },
});
