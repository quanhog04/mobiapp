import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import { useUser } from "../(auth)/UserContext";
import Toast from "react-native-toast-message";
import { ThemedView } from "@/components/ThemedView";

const { width } = Dimensions.get("window");

interface Product {
  id: number;
  productName: string;
  price: string;
  salePrice?: string;
  selectedImagePath: string;
  selectedColor: string;
  quantity: number;
  stock: number;
  promotions: string[]; // Thêm trường cho khuyến mãi
}

export default function CartScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPromotions, setSelectedPromotions] = useState<{
    [key: number]: string[];
  }>({});
  const router = useRouter();
  const { userInfo } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const promotion1 = "Giảm giá 10% cho đơn hàng từ 500k";
  const promotion2 = "Miễn phí vận chuyển cho đơn hàng đầu tiên";
  const promotion3 = "Giảm giá 5% cho lần mua tiếp theo";
  const promotion4 = "Mua 1 tặng 1 sản phẩm cùng loại";
  const promotion5 = "Giảm thêm 15% cho khách hàng thân thiết";
  const promotion6 = "Bảo hành mở rộng 24 tháng";
  const promotion7 = "Giảm 50k khi thanh toán online";
  const promotionsArray = [
    promotion1,
    promotion2,
    promotion3,
    promotion4,
    promotion5,
    promotion6,
    promotion7,
  ];

  const getRandomPromotions = (promotions: string[], count: number) => {
    const shuffled = [...promotions]; // Tạo một bản sao mảng
    let i = shuffled.length,
      temp,
      randomIndex;

    // Xáo trộn mảng bằng thuật toán Fisher-Yates
    while (i) {
      randomIndex = Math.floor(Math.random() * i--);
      temp = shuffled[i];
      shuffled[i] = shuffled[randomIndex];
      shuffled[randomIndex] = temp;
    }

    return shuffled.slice(0, count); // Lấy count phần tử đầu tiên
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      if (userInfo) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `http://172.20.10.2:8900/api/cart/${userInfo.id}`
          );

          const productsWithDefaultPromotions = response.data.map(
            (product: any) => ({
              ...product,
              promotions: product.promotions || [], // Default to empty array if undefined
            })
          );

          // Gán khuyến mãi ngẫu nhiên cho sản phẩm
          const productsWithPromotions = productsWithDefaultPromotions.map(
            (product: any) => {
              const randomPromotions = getRandomPromotions(promotionsArray, 2); // Lấy 2 khuyến mãi ngẫu nhiên
              return { ...product, promotions: randomPromotions }; // Gán khuyến mãi vào sản phẩm
            }
          );

          setProducts(productsWithPromotions);
        } catch (error) {
          // console.error("Error fetching cart items:", error);
          // Có thể thêm thông báo lỗi cho người dùng ở đây (ví dụ: thông báo cho người dùng có lỗi xảy ra)
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCartItems();
  }, [userInfo]);

  const handleCheckout = () => {
    if (products.length === 0) {
      Toast.show({
        type: "error",
        text1: "Giỏ hàng trống",
        text2: "Bạn cần thêm sản phẩm vào giỏ hàng để tiếp tục.",
        position: "top",
        visibilityTime: 1000,
      });
    } else if (!userInfo) {
      Toast.show({
        type: "error",
        text1: "Chưa đăng nhập",
        text2: "Bạn cần đăng nhập để thực hiện thanh toán!",
        position: "top",
        visibilityTime: 1000,
      });
    } else {
      router.push("./pay"); // Điều hướng đến trang thanh toán
    }
  };

  const handlePromotionSelect = (id: number, promotion: string) => {
    setSelectedPromotions((prevSelected) => {
      const currentPromotions = prevSelected[id] || [];
      if (currentPromotions.includes(promotion)) {
        return {
          ...prevSelected,
          [id]: currentPromotions.filter((p) => p !== promotion),
        };
      } else {
        return {
          ...prevSelected,
          [id]: [...currentPromotions, promotion],
        };
      }
    });
  };

  const increaseQuantity = (id: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === id) {
          // Kiểm tra nếu số lượng hiện tại đã đạt giới hạn trong kho
          if (product.quantity === product.stock) {
            // Hiển thị thông báo lỗi
            Toast.show({
              type: "error",
              text1: "Hết hàng",
              text2: `Số lượng sản phẩm "${product.productName}" đã đạt giới hạn trong kho.`,
              position: "top",
              visibilityTime: 1000,
            });
            return product; // Không thay đổi số lượng
          }

          // Tăng số lượng sản phẩm
          const newQuantity = product.quantity + 1;

          // Gửi yêu cầu cập nhật số lượng sản phẩm trên backend
          updateProductQuantity(id, newQuantity);

          // Trả về sản phẩm với số lượng mới
          return { ...product, quantity: newQuantity };
        }
        return product; // Giữ nguyên các sản phẩm khác
      })
    );
  };

  const decreaseQuantity = (id: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === id && product.quantity > 1) {
          const newQuantity = product.quantity - 1;
          updateProductQuantity(id, newQuantity);
          return { ...product, quantity: newQuantity };
        }
        return product;
      })
    );
  };

  const removeProduct = (productId: number) => {
    if (userInfo) {
      axios
        .delete(
          `http://172.20.10.2:8900/api/cart/remove/${userInfo.id}/${productId}`
        )
        .then(() => {
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== productId)
          );
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            text1: "Xin lỗi",
            text2: "Lỗi xoá sản phẩm!",
            position: "top",
            visibilityTime: 1000,
          });
          // console.log('Error removing product:', error);
        });
    } else {
      // console.log('User is not logged in');
    }
  };

  const updateProductQuantity = async (id: number, newQuantity: number) => {
    try {
      if (userInfo) {
        if (newQuantity > 0) {
          // Kiểm tra số lượng phải lớn hơn 0 trước khi gửi yêu cầu
          await axios.put(
            `http://172.20.10.2:8900/api/cart/update/${userInfo.id}/${id}`,
            { quantity: newQuantity }
          );
        }
      }
    } catch (error) {
      // console.error(`Error updating product ${id} quantity:`, error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  const renderProduct = ({ item }: { item: Product }) => {
    const total = item.salePrice
      ? Number(item.salePrice)
      : Number(item.price) * item.quantity;
    return (
      <View style={styles.productContainer}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeProduct(item.id)}
        >
          <FontAwesome name="times" size={24} color="#e74c3c" />
        </TouchableOpacity>
        <View style={styles.productInnerContainer}>
          <Image
            source={{
              uri: `http://172.20.10.2:8900/${item.selectedImagePath}`,
            }}
            style={styles.productImage}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.productPrice}>
              Giá: {parseInt(item.price).toLocaleString("vi-VN")}
            </Text>

            <View style={styles.promotionContainer}>
              <Text style={styles.promotionText}>Chọn khuyến mãi:</Text>
              {item.promotions &&
                item.promotions.map((promotion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.promotionCheckbox}
                    onPress={() => handlePromotionSelect(item.id, promotion)}
                  >
                    <FontAwesome
                      name={
                        selectedPromotions[item.id]?.includes(promotion)
                          ? "check-square"
                          : "square-o"
                      }
                      size={20}
                      color="#000"
                    />
                    <Text style={styles.promotionLabel}>{promotion}</Text>
                  </TouchableOpacity>
                ))}
            </View>

            <View style={styles.colorContainer}>
              <Text style={styles.colorLabel}>Màu:</Text>
              <Text style={styles.colorText}>{item.selectedColor}</Text>
            </View>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => decreaseQuantity(item.id)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityNumber}>{item.quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() => increaseQuantity(item.id)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "rgba(0, 123, 255, 0.15)" }}
    >
      <View style={styles.headerContainer}>
        <Link href="/">
          <Text style={styles.headerText}>
            <Text style={{ fontSize: 20 }}>{"⟨ "}</Text> Mua thêm sản phẩm khác
          </Text>
        </Link>
      </View>
      <ScrollView style={styles.container}>
        {products.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>Giỏ hàng trống</Text>
            <Text style={styles.emptyCartSubText}>
              Bạn hãy tham gia mua sắm cùng chúng tôi.
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={products}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.productList}
              scrollEnabled={false}
            />
          </>
        )}
      </ScrollView>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Tạm tính ({products.length} sản phẩm):
        </Text>
        <Text style={styles.summaryPrice}>
          {products
            .reduce((total, product) => {
              const price = product.price
                ? parseFloat(String(product.price).replace(/\./g, ""))
                : 0;
              return total + price * (product.quantity || 1);
            }, 0)
            .toLocaleString("vi-VN")}{" "}
          VND
        </Text>
      </View>

      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutText}>Đặt hàng</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
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
  productList: {
    paddingBottom: 20,
  },
  productContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: "relative", // Để căn chỉnh nút xóa
  },
  productInnerContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center", // Căn giữa theo chiều dọc
  },
  productImage: {
    width: 100, // Điều chỉnh kích thước hình ảnh nếu cần
    height: 100,
    borderRadius: 10,
    marginRight: 15, // Khoảng cách giữa hình ảnh và thông tin sản phẩm
  },
  productInfo: {
    flex: 1, // Làm cho phần thông tin sản phẩm chiếm hết không gian còn lại
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "#e74c3c",
    marginBottom: 5,
  },
  productDiscountPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    color: "#999",
    marginBottom: 10,
  },
  promotionContainer: {
    marginBottom: 10,
  },
  promotionText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  promotionCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  promotionLabel: {
    marginLeft: 5,
  },
  morePromotions: {
    color: "#3498db",
    fontSize: 12,
  },
  colorContainer: {
    marginBottom: 10,
  },
  colorLabel: {
    fontWeight: "bold",
  },
  colorText: {
    borderColor: "#999",
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityDisplay: {
    borderColor: "#999",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },
  quantityNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  checkoutButton: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyCartText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyCartSubText: {
    fontSize: 16,
    color: "#555",
  },
  summaryContainer: { padding: 14, backgroundColor: "#FFE1FF" },
  summaryText: { fontSize: 16 },
  summaryPrice: { fontSize: 20, fontWeight: "bold", color: "green" },
});
