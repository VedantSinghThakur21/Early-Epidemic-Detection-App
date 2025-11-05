
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { Brain, Mail, Lock, AlertCircle, Monitor, Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "../contexts/AuthContext";

interface LoginScreenProps {
  onNavigateToRegister?: () => void;
}

export default function LoginScreen({ onNavigateToRegister }: LoginScreenProps) {
  const { login, loading, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    // Clear previous errors
    setError("");
    clearError();
    
    // Validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Attempt login
    const result = await login({ email, password });
    
    if (!result.success) {
      setError(result.message);
    }
    // If successful, AuthContext will update isAuthenticated and App will re-render
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          {/* Logo and Title */}
          <View style={styles.titleContainer}>
            <View style={styles.logoBackground}>
              <Brain size={32} color="white" />
            </View>
            <View>
              <Text style={styles.title}>Sentinel AI</Text>
              <Text style={styles.subtitle}>Advanced Epidemic Intelligence System</Text>
            </View>
          </View>

          {/* Important Info Banner */}
          <View style={styles.infoBanner}>
            <View style={styles.infoBannerContent}>
              <View style={styles.infoIconContainer}>
                <Monitor size={16} color="#60a5fa" />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.infoBannerTitle}>React Web Application</Text>
                <Text style={styles.infoBannerText}>
                  Mobile-optimized web app (393×852px) for browser viewing. See <Text style={{fontWeight: '500', color: '#60a5fa'}}>Profile → Help & Support</Text> for setup tutorials and video guides.
                </Text>
              </View>
            </View>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In to Dashboard</Text>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <Mail style={styles.inputIcon} size={16} color="#94a3b8" />
                  <TextInput
                    placeholder="health.official@gov.in"
                    placeholderTextColor="#64748b"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Lock style={styles.inputIcon} size={16} color="#94a3b8" />
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#64748b"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? (
                      <EyeOff size={16} color="#94a3b8" />
                    ) : (
                      <Eye size={16} color="#94a3b8" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {(error || authError) && (
                <View style={styles.errorContainer}>
                  <AlertCircle size={16} color="#f87171" />
                  <Text style={styles.errorText}>{error || authError}</Text>
                </View>
              )}

              <TouchableOpacity 
                onPress={handleLogin}
                disabled={loading}
                style={[styles.button, loading && styles.buttonDisabled]}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 16, alignItems: 'center'}}>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Demo Credentials Info */}
          <View style={styles.demoInfoCard}>
            <Text style={styles.demoInfoTitle}>Demo Access</Text>
            <Text style={styles.demoInfoText}>
              Email: kavita@health.gov.in{'\n'}
              Password: any password (min 6 characters)
            </Text>
          </View>

          {/* Register Link */}
          {onNavigateToRegister && (
            <TouchableOpacity
              style={styles.registerLink}
              onPress={onNavigateToRegister}
            >
              <Text style={styles.registerText}>
                Don't have an account? <Text style={styles.registerLinkText}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Secured by Government Health Network</Text>
            <Text style={[styles.footerText, {color: '#475569'}]}>Project Phase 1 Evaluation Build</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 384,
    gap: 16,
  },
  titleContainer: {
    alignItems: 'center',
    gap: 12,
  },
  logoBackground: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#2563eb', // Simplified gradient
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#eff6ff', // Simplified gradient
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  infoBanner: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)', // Simplified gradient & opacity
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  infoBannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoBannerTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dbeafe',
    marginBottom: 4,
  },
  infoBannerText: {
    fontSize: 11,
    color: '#bfdbfe',
    lineHeight: 16,
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderColor: '#475569',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#e2e8f0',
    marginBottom: 16,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderColor: 'rgba(71, 85, 105, 0.5)',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 40,
    paddingRight: 40,
    color: '#e2e8f0',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#f87171',
  },
  button: {
    backgroundColor: '#2563eb', // Simplified gradient
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#60a5fa',
  },
  demoInfoCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    borderColor: 'rgba(71, 85, 105, 0.3)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  demoInfoTitle: {
    color: '#e2e8f0',
    fontWeight: '500',
    marginBottom: 4,
  },
  demoInfoText: {
    fontSize: 11,
    color: '#94a3b8',
    lineHeight: 16,
    textAlign: 'center',
  },
  registerLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  registerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  registerLinkText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  footer: {
    marginTop: 16,
    gap: 4,
  },
  footerText: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
});
