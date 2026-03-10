import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { apiClient } from "@api/client";
import { tokens } from "@theme/tokens";

type WalletTransaction = {
  id: number;
  amount: number;
  type: string;
  description: string;
  created_at: string;
};

type WalletDetail = {
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
};

const WalletScreen: React.FC = () => {
  const [wallet, setWallet] = useState<WalletDetail | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await apiClient.get<WalletDetail>("/wallet/me/detail");
      setWallet(res.data);
    } catch {
      setWallet(null);
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
      <Text style={styles.title}>Wallet</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current balance</Text>
        <Text style={styles.balanceValue}>
          {wallet?.currency || "UGX"} {wallet?.balance.toFixed(0) || "0"}
        </Text>
      </View>

      <Text style={styles.subtitle}>Recent transactions</Text>
      {wallet?.transactions.map((tx) => (
        <View key={tx.id} style={styles.txRow}>
          <View>
            <Text style={styles.txDescription}>{tx.description}</Text>
            <Text style={styles.txMeta}>{new Date(tx.created_at).toLocaleString()}</Text>
          </View>
          <Text style={styles.txAmount}>+{tx.amount.toFixed(0)}</Text>
        </View>
      )) || <Text style={styles.txMeta}>No transactions yet.</Text>}
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
  balanceCard: {
    backgroundColor: tokens.color.surface2,
    borderColor: tokens.color.border,
    borderWidth: 1,
    borderRadius: tokens.radius.lg,
    padding: 16,
    marginBottom: 16
  },
  balanceLabel: {
    fontSize: 14,
    color: tokens.color.textMuted
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: "900",
    color: tokens.color.gold,
    marginTop: 4
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "800",
    color: tokens.color.text,
    marginBottom: 8
  },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: tokens.color.border,
    borderBottomWidth: 1
  },
  txDescription: {
    color: tokens.color.text,
    fontSize: 14
  },
  txMeta: {
    color: "rgba(167,176,192,0.75)",
    fontSize: 12
  },
  txAmount: {
    color: "#22c55e",
    fontWeight: "600",
    fontSize: 14
  }
});

export default WalletScreen;

