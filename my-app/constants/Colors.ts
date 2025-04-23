/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0066FF';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    inputBackground: '#f2f2f2', // Màu nền của TextInput trong light mode
    placeholder: '#aaa', // Màu của placeholder trong light mode
    buttonBackground: '#007bff', // Màu nền của nút bấm trong light mode
    link: '#2e78b7',
    lightText: '#333',        // Already defined
    lightBackground: '#f0f0f0', // Add this line for lightBackground
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    inputBackground: '#333', // Màu nền của TextInput trong dark mode
    placeholder: '#555', // Màu của placeholder trong dark mode
    buttonBackground: '#007bff', // Màu nền của nút bấm trong dark mode
    link: '#2e78b7',
    darkText: '#fff',        // Add this line for darkText
    darkBackground: '#111',  // Already defined (if needed)
  },
};
