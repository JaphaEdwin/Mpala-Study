import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { tokens } from "@theme/tokens";
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from "../legal";

export type LegalScreenParams = {
  Legal: { type: "privacy" | "terms" };
};

type Props = NativeStackScreenProps<LegalScreenParams, "Legal">;

const LegalScreen: React.FC<Props> = ({ route, navigation }) => {
  const { type } = route.params;

  const content = type === "privacy" ? PRIVACY_POLICY : TERMS_OF_SERVICE;
  const title = type === "privacy" ? "Privacy Policy" : "Terms of Service";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={tokens.color.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.legalText}>{content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: tokens.color.text,
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  legalText: {
    fontSize: 14,
    lineHeight: 22,
    color: tokens.color.textMuted,
  },
});

export default LegalScreen;
