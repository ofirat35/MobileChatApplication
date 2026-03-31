import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { useAuth } from "../helpers/contexts/AuthContext";
import { CustomActivityIndicator } from "../components/shared/CustomActivityIndicator";
import { Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useTranslation } from "react-i18next";

export function LoginScreen() {
  const { navigate } = useAppNavigation();
  const { login, isLoading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const { t } = useTranslation();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () =>
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 100,
    }).start();

  const handlePressOut = () =>
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
    }).start();

  return (
    <View style={styles.container}>
      {isLoading && <CustomActivityIndicator visible={true} />}
      <StatusBar style="light" />

      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoRing}>
            <View style={styles.logoInner} />
          </View>
          <Text style={styles.brandTagline}>
            {" "}
            {t("Connect")} · {t("Discover")} · {t("Share")}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.headlineContainer}>
          <Text style={styles.headline}>{t("Welcome Back")}</Text>
          <Text style={styles.subheadline}>
            {t("Sign in to continue your journey")}
          </Text>
        </View>

        <Animated.View
          style={{ transform: [{ scale: buttonScale }], width: "100%" }}
        >
          <Pressable
            onPress={login}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>{t("Login")}</Text>
            <Text style={styles.loginButtonArrow}>→</Text>
          </Pressable>
        </Animated.View>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>
            {t("Don't have an account?")}{" "}
          </Text>
          <TouchableOpacity onPress={() => navigate("RegisterScreen")}>
            <Text style={styles.registerLink}>{t("Register")}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    justifyContent: "center",
    alignItems: "center",
  },
  orb1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(37, 99, 235, 0.12)",
    top: "10%",
    left: -80,
  },
  orb2: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(79, 142, 247, 0.08)",
    bottom: "15%",
    right: -60,
  },
  content: {
    width: "100%",
    paddingHorizontal: 36,
    alignItems: "center",
    gap: 24,
  },
  logoContainer: {
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  logoRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: "rgba(79, 142, 247, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  logoInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(37, 99, 235, 0.6)",
  },
  brandName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#4f8ef7",
    letterSpacing: 8,
  },
  brandTagline: {
    fontSize: 11,
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 2,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: "rgba(79, 142, 247, 0.3)",
  },
  headlineContainer: {
    alignItems: "center",
    gap: 8,
  },
  headline: {
    fontSize: 48,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 54,
    letterSpacing: -1,
  },
  subheadline: {
    fontSize: 15,
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  loginButton: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 10,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  loginButtonArrow: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 18,
  },
  registerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  registerText: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 14,
  },
  registerLink: {
    color: "#4f8ef7",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 40,
  },
  footerText: {
    color: "rgba(255,255,255,0.18)",
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
