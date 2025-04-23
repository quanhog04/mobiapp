import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { RouteProp, useRoute } from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-toast-message"; // Import thư viện Toast
import { useUser } from "../(auth)/UserContext";

interface ProductDetail {
  id: number;
  name: string;
  screen: string;
  display: string;
  price: string;
  salePrice?: string;
  description: string;
  stock: number;
  screenTechnology: string;
  screenResolution: string;
  mainCamera: string;
  frontCamera: string;
  chipset: string;
  ram: string;
  internalMemory: string;
  operatingSystem: string;
  battery: string;
  weight: string;
  colors: string[];
  imagePaths: any[];
  quantity?: number;
}
type ProductDetailRouteParams = {
  id: string;
};
const promotions = [
  { id: 1, description: "Giảm 10% khi mua kèm phụ kiện" },
  { id: 2, description: "Bảo hành 2 năm miễn phí" },
];

const getLuminance = (color: string) => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
};
const getCheckmarkColor = (color: string) => {
  const luminance = getLuminance(color);
  return luminance > 186 ? "black" : "white";
};

export default function ProductDetailScreen() {
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(
    null
  );
  const route =
    useRoute<RouteProp<{ params: ProductDetailRouteParams }, "params">>();
  const { id } = route.params;
  const { userInfo } = useUser();
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [cart, setCart] = useState<ProductDetail[]>([]);
  const [quantity, setQuantity] = useState(1);
  const handleAddToCart = async (product: ProductDetail) => {
    try {
      // Lấy màu đã chọn
      const selectedColorIndex = selectedColors[product.id] || 0;
      const selectedColor = product.colors[selectedColorIndex];
      const selectedImagePath = product.imagePaths[selectedColorIndex];

      // Kiểm tra số lượng trong kho
      if (product.stock === 0) {
        Toast.show({
          type: "error",
          text1: "Sản phẩm hết hàng",
          text2: `Sản phẩm ${product.name} hiện không còn trong kho.`,
          position: "top",
          visibilityTime: 1000,
        });
        return;
      }

      if (quantity > product.stock) {
        Toast.show({
          type: "error",
          text1: "Số lượng vượt quá tồn kho",
          text2: `Chỉ còn ${product.stock} sản phẩm ${product.name} trong kho.`,
          position: "top",
          visibilityTime: 1000,
        });
        return;
      }
      // Tạo đối tượng cartItem để gửi lên backend
      const cartItem = {
        productId: product.id,
        productName: product.name,
        price: product.salePrice || product.price,
        quantity: quantity, // Mỗi lần thêm vào giỏ hàng mặc định là 1
        selectedColor: selectedColor,
        selectedImagePath: selectedImagePath,
      };

      // Gửi yêu cầu thêm sản phẩm vào giỏ hàng
      const response = await axios.post(
        `http://172.20.10.2:8900/api/cart/add/${userInfo?.id}`,
        cartItem
      );

      // Hiện thông báo thành công
      Toast.show({
        type: "success",
        text1: "Thêm vào giỏ hàng",
        text2: `${product.name} đã được thêm vào giỏ hàng!`,
        position: "top",
        visibilityTime: 1000,
      });
    } catch (error) {
      // console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      Toast.show({
        type: "error",
        text1: "Có lỗi xảy ra",
        text2: "Không thể thêm sản phẩm vào giỏ hàng.",
        position: "top",
        visibilityTime: 1000,
      });
    }
  };

  const productSpecifications = [
    { key: "Kích thước màn hình: ", value: productDetail?.screen || "N/A" },
    {
      key: "Công nghệ màn hình: ",
      value: productDetail?.screenTechnology || "N/A",
    },
    {
      key: "Độ phân giải màn hình: ",
      value: productDetail?.screenResolution || "N/A",
    },
    { key: "Camera chính: ", value: productDetail?.mainCamera || "N/A" },
    { key: "Camera trước: ", value: productDetail?.frontCamera || "N/A" },
    { key: "Chipset: ", value: productDetail?.chipset || "N/A" },
    { key: "RAM:", value: productDetail?.ram || "N/A" },
    { key: "Bộ nhớ trong:", value: productDetail?.internalMemory || "N/A" },
    { key: "Hệ điều hành", value: productDetail?.operatingSystem || "N/A" },
    { key: "Pin:", value: productDetail?.battery || "N/A" },
    { key: "Trọng lượng:", value: productDetail?.weight || "N/A" },
    { key: "Màu sắc:", value: productDetail?.colors.join(", ") || "N/A" },
  ];

  const toggleDetails = () => setShowAllDetails(!showAllDetails);

  const totalPrice =
    productDetail && Number(productDetail.salePrice) > 0
      ? Number(productDetail.salePrice)
      : Number(productDetail?.price);

  const visibleDetails = showAllDetails
    ? productSpecifications
    : productSpecifications.slice(0, 5);

  const isColorDark = (colorCode: string) => {
    const hex = colorCode.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 255000;
    return brightness < 0.5;
  };

  const [selectedColors, setSelectedColors] = useState<{
    [key: number]: number;
  }>({});

  useEffect(() => {
    if (id) {
      axios
        .get<ProductDetail>(`http://172.20.10.2:8900/api/product/${id}`)
        .then((response) => setProductDetail(response.data))
        .catch((error) =>
          console.error("Lỗi khi lấy dữ liệu chi tiết sản phẩm:", error)
        );
    }
  }, [id]);

  if (!productDetail) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }
  const renderProduct = ({ item }: { item: ProductDetail }) => {
    const selectedColorIndex = selectedColors[item.id] || 0;

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Image
          source={{
            uri: `http://172.20.10.2:8900/${productDetail.imagePaths[selectedColorIndex]}`,
          }}
          style={styles.productImage}
          resizeMode="contain"
        />

        <View style={styles.optionContainer}>
          {productDetail.colors.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                selectedColorIndex === index && styles.selectedColorButton,
              ]}
              onPress={() =>
                setSelectedColors((prev) => ({ ...prev, [item.id]: index }))
              }
            >
              {selectedColorIndex === index && (
                <Text
                  style={[
                    styles.checkmark,
                    { color: getCheckmarkColor(color) },
                  ]}
                >
                  ✓
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.productTitle}>{productDetail.name}</Text>
        <Text style={styles.priceText}>
          Giá: {totalPrice.toLocaleString("vi-VN")}
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={styles.quantityButton}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Khuyến mãi</Text>
        <FlatList
          data={promotions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.promotionItem}>
              <Text>{item.description}</Text>
            </View>
          )}
        />

        <Text style={styles.stock}>
          Sản phẩm còn lại: {productDetail.stock}
        </Text>

        <View style={styles.promotionItem}>
          <Text>{item.description}</Text>
        </View>

        <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
        {visibleDetails.map((detail, index) => (
          <View key={index} style={styles.detailContainer}>
            <Text style={styles.detailKey}>{detail.key}</Text>
            <Text style={styles.detailValue}>{detail.value}</Text>
          </View>
        ))}
        <TouchableOpacity onPress={toggleDetails}>
          <Text style={styles.showMore}>
            {showAllDetails ? "Ẩn bớt" : "Xem thêm"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "rgba(0, 123, 255, 0.15)" }}
    >
      <View style={styles.headerContainer}>
        <Link href="/">
          <Text style={styles.headerText}>
            <Text style={{ fontSize: 20 }}>{"⟨ "}</Text> Xem thêm sản phẩm
          </Text>
        </Link>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={[productDetail]}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <TouchableOpacity
        style={styles.buyNowButton}
        onPress={() => handleAddToCart(productDetail)}
      >
        <Text style={styles.buyNowText}>Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#B5B5B5",
  },
  modelContainer: {
    marginBottom: 16,
  },
  modelButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  selectedButton: {
    backgroundColor: "#e74c3c",
  },
  modelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  productImage: {
    width: "100%",
    height: 300,
    marginBottom: 16,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  selectedColorButton: {
    borderColor: "#000",
    borderWidth: 3,
  },
  optionButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  optionText: {
    fontWeight: "bold",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
    color: "#FF3B30",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  storeItem: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  promotionItem: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  checkmark: {
    fontSize: 20,
    color: "#fff",
  },
  detailItem: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  detailKey: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailValue: {
    textAlign: "right",
  },
  toggleButton: {
    alignItems: "center",
    marginVertical: 10,
  },
  toggleButtonText: {
    marginBottom: 60,
    fontSize: 16,
    color: "#3498db",
    fontWeight: "bold",
  },
  headerContainer: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  buyNowButton: {
    backgroundColor: "#ff3e00",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  buyNowText: {
    color: "#fff",
    fontWeight: "bold",
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF3B30",
    marginBottom: 10,
  },
  stock: {
    fontSize: 16,
    color: "#1C1C1C",
    marginBottom: 20,
  },
  showMore: {
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 20,
  },
  detailContainer: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Căn giữa theo chiều ngang
    marginBottom: 20,
    flex: 1, // Đảm bảo container chiếm toàn bộ chiều cao của cha
  },
  quantityButton: {
    fontSize: 15,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  quantityText: {
    color: "black",
    fontSize: 20,
    marginHorizontal: 20,
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
});
