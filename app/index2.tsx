import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f8f9ff', '#f0f2ff', '#e8ebff']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.illustrationContainer}>
            <View style={styles.moneyBag}>
              <LinearGradient
                colors={['#8b5cf6', '#7c3aed', '#6d28d9']}
                style={styles.bagGradient}
              >
                <Text style={styles.dollarSign}>$</Text>
              </LinearGradient>
              <View style={styles.billsContainer}>
                <View style={[styles.bill, styles.bill1]}>
                  <View style={styles.billInner} />
                </View>
                <View style={[styles.bill, styles.bill2]}>
                  <View style={styles.billInner} />
                </View>
                <View style={[styles.bill, styles.bill3]}>
                  <View style={styles.billInner} />
                </View>
              </View>
              <View style={[styles.coin, styles.coin1]}>
                <Text style={styles.coinText}>$</Text>
              </View>
              <View style={[styles.coin, styles.coin2]}>
                <Text style={styles.coinText}>$</Text>
              </View>
              <View style={[styles.coin, styles.coin3]}>
                <Text style={styles.coinText}>$</Text>
              </View>
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Redefining{'\n'}Finance</Text>
            <Text style={styles.subtitle}>
              An A.I. buddy that does the heavy{'\n'}lifting for you
            </Text>
          </View>

          <View style={styles.pageIndicators}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.getStartedButton, { backgroundColor: 'red' }]}
            onPress={() => {
              console.log('Navigating to Signup');
              router.push('/signup');
            }}
          >
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.buttonGradient}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              console.log('Navigating to Login');
              router.push('/login');
            }}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 10, alignItems: 'flex-end' },
  closeButton: { padding: 8 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  illustrationContainer: {
    height: 200,
    width: 200,
    marginBottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moneyBag: {
    width: 120,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bagGradient: {
    width: 120,
    height: 100,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dollarSign: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  billsContainer: {
    position: 'absolute',
    top: -20,
    width: 80,
    height: 40,
  },
  bill: {
    position: 'absolute',
    width: 35,
    height: 20,
    borderRadius: 4,
  },
  bill1: {
    backgroundColor: '#10b981',
    left: 0,
    top: 0,
    transform: [{ rotate: '-15deg' }],
  },
  bill2: {
    backgroundColor: '#22c55e',
    left: 15,
    top: -5,
    transform: [{ rotate: '5deg' }],
  },
  bill3: {
    backgroundColor: '#16a34a',
    left: 30,
    top: 2,
    transform: [{ rotate: '20deg' }],
  },
  billInner: {
    flex: 1,
    margin: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  coin: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  coin1: {
    top: 20,
    left: -30,
  },
  coin2: {
    top: 60,
    right: -35,
  },
  coin3: {
    bottom: 10,
    left: -20,
  },
  coinText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400e',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  pageIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
  },
  activeDot: {
    backgroundColor: '#8b5cf6',
    width: 24,
  },
  bottomContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
    gap: 16,
    zIndex: 10,
  },
  getStartedButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});