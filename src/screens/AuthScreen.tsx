import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import BrandLogo from "@components/BrandLogo";
import PrimaryButton from "@components/PrimaryButton";
import TextField from "@components/TextField";
import { useAuth } from "@hooks/useAuth";
import { tokens } from "@theme/tokens";
import { apiClient } from "@api/client";

type AuthMode = "login" | "register";

const AuthScreen: React.FC = () => {
  const { login, isAuthenticating } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Registration fields
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Consent checkboxes
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedAge, setAcceptedAge] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setUniversity("");
    setYearOfStudy("");
    setConfirmPassword("");
    setAcceptedTerms(false);
    setAcceptedPrivacy(false);
    setAcceptedAge(false);
  };

  const handleLogin = async () => {
    setIsSubmitting(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Login failed. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateRegistration = (): string | null => {
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!email.includes("@")) return "Please enter a valid email";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
    if (!/\d/.test(password)) return "Password must contain a digit";
    if (password !== confirmPassword) return "Passwords do not match";
    if (!university.trim()) return "Please enter your university";
    if (!yearOfStudy.trim()) return "Please enter your year of study";
    if (!acceptedAge) return "You must confirm you are at least 16 years old";
    if (!acceptedTerms) return "You must accept the Terms of Service";
    if (!acceptedPrivacy) return "You must accept the Privacy Policy";
    return null;
  };

  const handleRegister = async () => {
    const error = validateRegistration();
    if (error) {
      Alert.alert("Validation Error", error);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        university: university.trim(),
        year_of_study: yearOfStudy.trim(),
      });

      Alert.alert("Success", "Account created! Please sign in.", [
        {
          text: "OK",
          onPress: () => {
            setMode("login");
            setPassword("");
            setConfirmPassword("");
          },
        },
      ]);
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Registration failed. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoginValid = email.trim().length > 0 && password.length > 0;
  const isRegisterValid =
    name.trim().length >= 2 &&
    email.includes("@") &&
    password.length >= 8 &&
    password === confirmPassword &&
    university.trim().length > 0 &&
    yearOfStudy.trim().length > 0 &&
    acceptedAge &&
    acceptedTerms &&
    acceptedPrivacy;

  const Checkbox: React.FC<{
    checked: boolean;
    onPress: () => void;
    children: React.ReactNode;
  }> = ({ checked, onPress, children }) => (
    <TouchableOpacity style={styles.checkboxRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={14} color="#000" />}
      </View>
      <Text style={styles.checkboxLabel}>{children}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <BrandLogo size={mode === "login" ? 100 : 70} />
            <Text style={styles.title}>Mpala Study</Text>
            {mode === "login" && (
              <Text style={styles.subtitle}>
                Premium study planning, risk rescue, and coaching.
              </Text>
            )}
          </View>

          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, mode === "login" && styles.tabActive]}
              onPress={() => {
                setMode("login");
                resetForm();
              }}
            >
              <Text style={[styles.tabText, mode === "login" && styles.tabTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === "register" && styles.tabActive]}
              onPress={() => {
                setMode("register");
                resetForm();
              }}
            >
              <Text style={[styles.tabText, mode === "register" && styles.tabTextActive]}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {mode === "register" && (
              <TextField
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            )}

            <TextField
              label="Email"
              placeholder="you@university.edu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {mode === "register" && (
              <>
                <TextField
                  label="University"
                  placeholder="Makerere University"
                  value={university}
                  onChangeText={setUniversity}
                />
                <TextField
                  label="Year of Study"
                  placeholder="Year 2"
                  value={yearOfStudy}
                  onChangeText={setYearOfStudy}
                />
              </>
            )}

            <TextField
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            {mode === "register" && (
              <>
                <TextField
                  label="Confirm Password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />

                <View style={styles.consentSection}>
                  <Text style={styles.consentTitle}>Consent & Agreement</Text>

                  <Checkbox checked={acceptedAge} onPress={() => setAcceptedAge(!acceptedAge)}>
                    I confirm I am at least 16 years old
                  </Checkbox>

                  <Checkbox
                    checked={acceptedTerms}
                    onPress={() => setAcceptedTerms(!acceptedTerms)}
                  >
                    I have read and agree to the{" "}
                    <Text
                      style={styles.link}
                      onPress={() =>
                        Linking.openURL("https://mpalastudy.com/terms")
                      }
                    >
                      Terms of Service
                    </Text>
                  </Checkbox>

                  <Checkbox
                    checked={acceptedPrivacy}
                    onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
                  >
                    I have read and agree to the{" "}
                    <Text
                      style={styles.link}
                      onPress={() =>
                        Linking.openURL("https://mpalastudy.com/privacy")
                      }
                    >
                      Privacy Policy
                    </Text>
                  </Checkbox>
                </View>
              </>
            )}

            <PrimaryButton
              title={
                isSubmitting
                  ? mode === "login"
                    ? "Signing in..."
                    : "Creating account..."
                  : mode === "login"
                  ? "Sign In"
                  : "Create Account"
              }
              onPress={mode === "login" ? handleLogin : handleRegister}
              disabled={
                isSubmitting ||
                isAuthenticating ||
                (mode === "login" ? !isLoginValid : !isRegisterValid)
              }
              style={{ marginTop: tokens.space.md }}
            />
          </View>

          <Text style={styles.footnote}>
            {mode === "login"
              ? "By signing in, you agree to our Terms of Service and Privacy Policy."
              : "Your data is protected with industry-standard encryption."}
          </Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  hero: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    marginTop: 10,
    color: tokens.color.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: tokens.color.textMuted,
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 18,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: tokens.color.surface,
    borderRadius: tokens.radius.md,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: tokens.radius.sm,
  },
  tabActive: {
    backgroundColor: tokens.color.gold,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.textMuted,
  },
  tabTextActive: {
    color: "#000",
  },
  card: {
    backgroundColor: tokens.color.surface2,
    borderColor: tokens.color.border,
    borderWidth: 1,
    borderRadius: tokens.radius.lg,
    padding: 16,
  },
  consentSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  consentTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.text,
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: tokens.color.gold,
    borderColor: tokens.color.gold,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: tokens.color.textMuted,
    lineHeight: 20,
  },
  link: {
    color: tokens.color.gold,
    textDecorationLine: "underline",
  },
  footnote: {
    marginTop: 14,
    textAlign: "center",
    color: "rgba(167,176,192,0.75)",
    fontSize: 12,
    lineHeight: 18,
  },
});

export default AuthScreen;
    fontWeight: "900",
    marginTop: 14,
    color: tokens.color.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: tokens.color.textMuted,
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 20,
  },
  card: {
    backgroundColor: tokens.color.surface2,
    borderColor: tokens.color.border,
    borderWidth: 1,
    borderRadius: tokens.radius.lg,
    padding: 16,
  },
  footnote: {
    marginTop: 14,
    textAlign: "center",
    color: "rgba(167,176,192,0.75)",
    fontSize: 12,
    lineHeight: 18,
  },
});

export default AuthScreen;

