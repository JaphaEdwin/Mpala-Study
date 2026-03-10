import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { apiClient } from "@api/client";
import { tokens } from "@theme/tokens";

type WeeklyConsistencySummary = {
  week_start: string;
  week_end: string;
  planned_sessions: number;
  completed_sessions: number;
  completion_rate: number;
};

type StudyDashboardSummary = {
  weekly_consistency: WeeklyConsistencySummary[];
};

const DashboardScreen: React.FC = () => {
  const [summary, setSummary] = useState<StudyDashboardSummary | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await apiClient.get<StudyDashboardSummary>("/study/dashboard");
      setSummary(res.data);
    } catch {
      setSummary(null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tokens.color.gold} />
        }
      >
      <Text style={styles.title}>Study Dashboard</Text>

      {summary?.weekly_consistency?.length ? (
        summary.weekly_consistency.map((week) => (
          <View key={week.week_start} style={styles.card}>
            <Text style={styles.cardTitle}>
              Week {week.week_start} – {week.week_end}
            </Text>
            <View style={styles.row}>
              <View style={styles.pill}>
                <Text style={styles.pillLabel}>Planned</Text>
                <Text style={styles.pillValue}>{week.planned_sessions}</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillLabel}>Completed</Text>
                <Text style={styles.pillValue}>{week.completed_sessions}</Text>
              </View>
              <View style={[styles.pill, styles.pillAccent]}>
                <Text style={[styles.pillLabel, styles.pillLabelDark]}>Rate</Text>
                <Text style={[styles.pillValue, styles.pillValueDark]}>
                  {week.completion_rate.toFixed(0)}%
                </Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No study activity yet</Text>
          <Text style={styles.emptyText}>
            Create a study plan and start completing sessions to unlock your dashboard insights.
          </Text>
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  container: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  content: {
    padding: 16
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: tokens.color.text,
    marginBottom: 16
  },
  card: {
    backgroundColor: tokens.color.surface2,
    borderColor: tokens.color.border,
    borderWidth: 1,
    borderRadius: tokens.radius.lg,
    padding: 16,
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: tokens.color.text,
    marginBottom: 10
  },
  row: {
    flexDirection: "row",
    gap: 10
  },
  pill: {
    flex: 1,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: tokens.color.surface
  },
  pillAccent: {
    backgroundColor: tokens.color.gold,
    borderColor: "rgba(0,0,0,0.12)"
  },
  pillLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
    color: tokens.color.textMuted
  },
  pillValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "900",
    color: tokens.color.text
  },
  pillLabelDark: {
    color: "rgba(0,0,0,0.70)"
  },
  pillValueDark: {
    color: "rgba(0,0,0,0.90)"
  },
  emptyCard: {
    backgroundColor: tokens.color.surface2,
    borderColor: tokens.color.border,
    borderWidth: 1,
    borderRadius: tokens.radius.lg,
    padding: 18
  },
  emptyTitle: {
    color: tokens.color.text,
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 6
  },
  emptyText: {
    color: tokens.color.textMuted,
    fontSize: 13,
    lineHeight: 18
  }
});

export default DashboardScreen;

