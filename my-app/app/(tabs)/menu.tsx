import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
  StyleSheet,
  ColorSchemeName,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors"; // Import màu sắc theo theme
import Toast from "react-native-toast-message";
import { router } from "expo-router";

interface ItemCategory {
  id: number;
  name: string;
}
interface ItemBrand {
  id: number;
  name: string;
  categoryId: number;
  image: string;
}
export default function TabTwoScreen() {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [selectedBrand, setSelectedBrand] = useState<number>(1);
  const [dataCategory, setDataCategory] = useState<ItemCategory[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<ItemBrand[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const colorScheme: ColorSchemeName = useColorScheme() || "light";

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true); // Bắt đầu trạng thái tải
      try {
        const response = await axios.get<ItemCategory[]>(
          "http://172.20.10.2:8900/api/categories"
        );
        if (response.data && response.data.length > 0) {
          setDataCategory(response.data);
        } else {
          Toast.show({
            type: "error",
            text1: "Có lỗi xảy ra",
            text2: "Không có dữ liệu Category.",
            position: "top",
            visibilityTime: 1000,
          });
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Có lỗi xảy ra",
          text2: "Có lỗi xảy ra khi lấy dữ liệu Category.",
          position: "top",
          visibilityTime: 1000,
        });
      } finally {
        setIsLoading(false); // Kết thúc trạng thái tải
      }
    };

    fetchCategories();
  }, []);

  // Gọi API để lấy thương hiệu theo danh mục được chọn
  useEffect(() => {
    const fetchBrands = async () => {
      if (dataCategory.length > 0) {
        // Kiểm tra danh mục đã có dữ liệu
        try {
          const response = await axios.get<ItemBrand[]>(
            `http://172.20.10.2:8900/api/brands/category/${selectedCategory}`
          );
          if (response.data && response.data.length > 0) {
            setFilteredBrands(response.data);
          } else {
            setFilteredBrands([]);
          }
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Có lỗi xảy ra",
            text2: "Có lỗi xảy ra khi lấy dữ liệu Brand.",
            position: "top",
            visibilityTime: 1000,
          });
        }
      }
    };

    fetchBrands();
  }, [selectedCategory, dataCategory]);

  const renderCategoryItem = ({ item }: { item: ItemCategory }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderBrandItem = ({ item }: { item: ItemBrand }) => (
    <TouchableOpacity
      style={[
        styles.brandItem,
        selectedBrand === item.id && styles.selectedBrand,
      ]}
      onPress={() => {
        setSelectedBrand(item.id);
        router.push(`/?id=${item.id}`);
      }}
    >
      <Text style={styles.brandText}>{item.name}</Text>
      <Image
        source={{
          uri: item.image
            ? `http://172.20.10.2:8900/${item.image}`
            : "https://via.placeholder.com/50",
        }}
        style={{ width: 190, height: 90, marginTop: 8 }}
      />
    </TouchableOpacity>
  );

  // Kiểm tra trạng thái đang tải
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "rgba(0, 123, 255, 0.15)" }}
    >
      <View style={styles.container}>
        {/* Phần danh mục bên trái */}

        <View
          style={[
            styles.categoryContainer,
            { backgroundColor: Colors[colorScheme].background },
          ]}
        >
          <Text style={styles.textCategory}>Danh mục</Text>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <FlatList
              data={dataCategory}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </ScrollView>
        </View>

        {/* Phần danh sách brand bên phải */}
        <View
          style={[
            styles.brandContainer,
            { backgroundColor: Colors[colorScheme].background },
          ]}
        >
          <Text style={styles.textBrand}>Thương hiệu</Text>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <FlatList
              data={filteredBrands}
              renderItem={renderBrandItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 10,
    borderRadius: 10, // Thêm bo cong cho các góc
    backgroundColor: "white", // Thêm màu nền để dễ thấy hiệu ứng bo cong
    overflow: "hidden", // Đảm bảo nội dung không vượt quá góc bo
  },
  categoryContainer: {
    flex: 1, // 1/5 của màn hình
    padding: 10,
  },
  brandContainer: {
    flex: 2, // 4/5 của màn hình
    padding: 10,
  },
  categoryItem: {
    padding: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginTop: 10,
  },
  selectedCategory: {
    backgroundColor: "#007bff",
  },
  selectedBrand: {
    backgroundColor: "#007bff",
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  brandItem: {
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    marginTop: 10,
  },
  brandText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  textBrand: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
  },
  textCategory: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
  },
});
