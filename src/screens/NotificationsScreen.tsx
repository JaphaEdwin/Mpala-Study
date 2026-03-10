import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { apiClient } from "@api/client";
import { tokens } from "@theme/tokens";

type Notification = {
  id: number;
  title: string;
  body: string;
  created_at: string;
  is_read: boolean;
};

type NotificationListResponse = {
  notifications: Notification[];
};

const NotificationsScreen: React.FC = () => {
  const [items, setItems] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await apiClient.get<NotificationListResponse>("/notifications");
      setItems(res.data.notifications);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleMarkRead = async (id: number) => {
    try {
      await apiClient.post(`/notifications/${id}/mark-read`);
      load();
    } catch (e) {
      console.error("Failed to mark notification as read:", e);
    }
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
      <Text style={styles.title}>Notifications</Text>

      {items.map((n) => (
        <TouchableOpacity
          key={n.id}
          style={[styles.card, n.is_read && styles.cardRead]}
          onPress={() => handleMarkRead(n.id)}
        >
          <Text style={styles.cardTitle}>{n.title}</Text>
          <Text style={styles.cardBody}>{n.body}</Text>
          <Text style={styles.cardMeta}>{new Date(n.created_at).toLocaleString()}</Text>
        </TouchableOpacity>
      )) || <Text style={styles.cardBody}>You have no notifications yet.</Text>}
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
  cardRead: {
    opacity: 0.6
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: tokens.color.text,
    marginBottom: 4
  },
  cardBody: {
    color: tokens.color.textMuted,
    fontSize: 14
  },
  cardMeta: {
    marginTop: 6,
    fontSize: 12,
    color: "rgba(167,176,192,0.75)"
  }
});

export default NotificationsScreen;

