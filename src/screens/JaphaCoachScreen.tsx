import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { apiClient } from "@api/client";
import PrimaryButton from "@components/PrimaryButton";
import { tokens } from "@theme/tokens";

type CoachResponse = {
  message: string;
  goal: string;
};

const JaphaCoachScreen: React.FC = () => {
  const [goal, setGoal] = useState("");
  const [response, setResponse] = useState<CoachResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post<CoachResponse>("/japha-ai/coach", null, {
        params: { goal: goal.trim() },
      });
      setResponse(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Failed to get coaching advice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Japha AI Coach</Text>
          <Text style={styles.subtitle}>
            Tell Japha your study, fitness, or life goals and get personalized advice.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="What goal would you like help with today?"
            placeholderTextColor={tokens.color.textMuted}
            value={goal}
            onChangeText={setGoal}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <PrimaryButton
            title={loading ? "Thinking..." : "Ask Japha"}
            onPress={handleAsk}
            disabled={loading || !goal.trim()}
          />

          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {response && (
            <View style={styles.responseCard}>
              <Text style={styles.responseTitle}>Japha says</Text>
              <Text style={styles.responseBody}>{response.message}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: tokens.color.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.color.textMuted,
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    backgroundColor: tokens.color.surface2,
    borderColor: tokens.color.border,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    padding: 14,
    marginBottom: 16,
    color: tokens.color.text,
    fontSize: 15,
    minHeight: 100,
  },
  responseCard: {
    marginTop: 20,
    backgroundColor: tokens.color.surface2,
    borderColor: tokens.color.gold,
    borderWidth: 1,
    borderRadius: tokens.radius.lg,
    padding: 16,
  },
  responseTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: tokens.color.gold,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  responseBody: {
    color: tokens.color.text,
    fontSize: 15,
    lineHeight: 22,
  },
  errorCard: {
    marginTop: 16,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: tokens.color.danger,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    padding: 12,
  },
  errorText: {
    color: tokens.color.danger,
    fontSize: 14,
  },
});

export default JaphaCoachScreen;

