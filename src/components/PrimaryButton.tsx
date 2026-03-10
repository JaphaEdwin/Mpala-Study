import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { tokens } from "@theme/tokens";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

const PrimaryButton: React.FC<Props> = ({ title, onPress, disabled, style }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.gold,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: tokens.color.gold2
  },
  disabled: {
    opacity: 0.6
  },
  text: {
    color: "#0A0A0A",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.4
  }
});

export default PrimaryButton;

