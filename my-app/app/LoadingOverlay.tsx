import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useLoading } from './LoadingContext'; // Import LoadingContext

const LoadingOverlay = () => {
  const { isLoading } = useLoading();
  
  // Tạo Animated.Value cho mỗi dấu chấm
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  // Hàm tạo hiệu ứng nhảy lên nhảy xuống
  const animateDot = (dotAnim: Animated.Value, delay: number) => {
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotAnim, {
            toValue: -10, // Nhảy lên cao
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim, {
            toValue: 0, // Quay lại vị trí ban đầu
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, delay); // Độ trễ trước khi bắt đầu hiệu ứng
  };

  useEffect(() => {
    if (isLoading) {
      animateDot(dot1Anim, 0);  // Bắt đầu ngay
      animateDot(dot2Anim, 150); // Bắt đầu sau 150ms
      animateDot(dot3Anim, 300); // Bắt đầu sau 300ms
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot1Anim }], backgroundColor: '#FF0000' }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot2Anim }], backgroundColor: '#00FF00' }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot3Anim }], backgroundColor: '#0000FF' }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginHorizontal: 5,
  },
});

export default LoadingOverlay;
