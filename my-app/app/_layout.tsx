import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/useColorScheme';
// import { CartProvider } from './(product)/CartContext';
import Toast from 'react-native-toast-message';
import { UserProvider } from './(auth)/UserContext';
import { LoadingProvider } from './LoadingContext';
import LoadingOverlay from './LoadingOverlay';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <LoadingProvider>
      <UserProvider>
        {/* <CartProvider> */}
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(product)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" options={{ title: "Trang lỗi", headerShown: false }} />
              <Stack.Screen name="(product)/productDetail" options={{ title: "Chi tiết sản phẩm", headerShown: false }} />
              <Stack.Screen name="(product)/cart" options={{ title: "Giỏ hàng", headerShown: false }} />
              <Stack.Screen name="(product)/pay" options={{ title: "Thanh toán", headerShown: false }} />
              <Stack.Screen name="(product)/payment" options={{ title: "Thanh toán online", headerShown: false }} />
              <Stack.Screen name="(auth)/login" options={{ title: "Đăng nhập", headerShown: false }} />
              <Stack.Screen name="(auth)/register" options={{ title: "Đăng kí", headerShown: false }} />
              <Stack.Screen name="(dashboard)/Home" options={{ title: "Admin", headerShown: false }} />
              <Stack.Screen name="(dashboard)/Banner" options={{ title: "Banner", headerShown: false }} />
              <Stack.Screen name="(dashboard)/Brand" options={{ title: "Brand", headerShown: false }} />
              <Stack.Screen name="(dashboard)/Category" options={{ title: "Category", headerShown: false }} />
              <Stack.Screen name="(dashboard)/Order" options={{ title: "Order", headerShown: false }} />
              <Stack.Screen name="(dashboard)/ProductUpload" options={{ title: "ProductUpload", headerShown: false }} />
              <Stack.Screen name="(dashboard)/Product" options={{ title: "Product", headerShown: false }} />
              <Stack.Screen name="(dashboard)/User" options={{ title: "User", headerShown: false }} />
            </Stack>
            <Toast />
          </ThemeProvider>
          <LoadingOverlay />
        {/* </CartProvider> */}
      </UserProvider>
    </LoadingProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'blue', // Thay đổi màu chữ theo ý thích
  },
});
