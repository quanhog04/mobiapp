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
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Checkbox } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { ThemedView } from "@/components/ThemedView";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import { useUser } from "../(auth)/UserContext";
import { KeyboardAvoidingView, Platform } from "react-native";

const { width } = Dimensions.get("window");

interface Product {
  id: number;
  productName: string;
  price: string;
  salePrice?: string;
  selectedImagePath: string;
  selectedColor: string;
  quantity: number;
  promotions: string[]; // Thêm trường cho khuyến mãi
}

// Dữ liệu thành phố, quận và cửa hàng
type LocationData = {
  [city: string]: {
    districts: {
      [district: string]: string[];
    };
  };
};

const locationData: LocationData = {
  "Hồ Chí Minh": {
    districts: {
      "TP Thủ Đức": ["Cửa hàng A", "Cửa hàng B"],
      "Quận 1": ["Cửa hàng C12", "Cửa hàng D54"],
      "Quận 2": ["Cửa hàng E1", "Cửa hàng D9"],
      "Quận 3": ["Cửa hàng K5", "Cửa hàng M8"],
      "Quận 4": ["Cửa hàng H6Q", "Cửa hàng N8F"],
      "Quận 5": ["Cửa hàng P1", "Cửa hàng P2"],
      "Quận 6": ["Cửa hàng P3", "Cửa hàng P4"],
      "Quận 7": ["Cửa hàng P5", "Cửa hàng P6"],
      "Quận 8": ["Cửa hàng P7", "Cửa hàng P8"],
      "Quận 9": ["Cửa hàng P9", "Cửa hàng P10"],
      "Quận 10": ["Cửa hàng P11", "Cửa hàng P12"],
      "Quận 11": ["Cửa hàng P13", "Cửa hàng P14"],
      "Quận 12": ["Cửa hàng P15", "Cửa hàng P16"],
      "Huyện Nhà Bè": ["Cửa hàng P17", "Cửa hàng P18"],
      "Huyện Bình Chánh": ["Cửa hàng P19", "Cửa hàng P20"],
      "Huyện Cần Giờ": ["Cửa hàng P21", "Cửa hàng P22"],
      "Huyện Hóc Môn": ["Cửa hàng P23", "Cửa hàng P24"],
      "Huyện Bình Tân": ["Cửa hàng P25", "Cửa hàng P26"],
    },
  },
  "Hà Nội": {
    districts: {
      "Quận Hoàn Kiếm": ["Cửa hàng E2G", "Cửa hàng FM7"],
      "Quận Ba Đình": ["Cửa hàng HR5", "Cửa hàng NO9"],
      "Quận Đống Đa": ["Cửa hàng HR6", "Cửa hàng NO10"],
      "Quận Hai Bà Trưng": ["Cửa hàng HR7", "Cửa hàng NO11"],
      "Quận Hoàng Mai": ["Cửa hàng HR8", "Cửa hàng NO12"],
      "Quận Thanh Xuân": ["Cửa hàng HR9", "Cửa hàng NO13"],
      "Quận Tây Hồ": ["Cửa hàng HR10", "Cửa hàng NO14"],
      "Quận Cầu Giấy": ["Cửa hàng HR11", "Cửa hàng NO15"],
      "Quận Long Biên": ["Cửa hàng HR12", "Cửa hàng NO16"],
      "Quận Bắc Từ Liêm": ["Cửa hàng HR13", "Cửa hàng NO17"],
      "Quận Nam Từ Liêm": ["Cửa hàng HR14", "Cửa hàng NO18"],
    },
  },
  "Đà Nẵng": {
    districts: {
      "Quận Hải Châu": ["Cửa hàng DO9", "Cửa hàng QP"],
      "Quận Thanh Khê": ["Cửa hàng VS", "Cửa hàng BR"],
      "Quận Sơn Trà": ["Cửa hàng MMS", "Cửa hàng COF"],
      "Quận Ngũ Hành Sơn": ["Cửa hàng MHT", "Cửa hàng NGI"],
      "Quận Liên Chiểu": ["Cửa hàng DO10", "Cửa hàng QP2"],
      "Huyện Hoà Vang": ["Cửa hàng VS2", "Cửa hàng BR2"],
    },
  },
  "Hải Phòng": {
    districts: {
      "Quận Lê Chân": ["Cửa hàng HP1", "Cửa hàng HP2"],
      "Quận Hải An": ["Cửa hàng HP3", "Cửa hàng HP4"],
      "Quận Ngô Quyền": ["Cửa hàng HP5", "Cửa hàng HP6"],
      "Quận Đồ Sơn": ["Cửa hàng HP7", "Cửa hàng HP8"],
      "Quận Kiến An": ["Cửa hàng HP9", "Cửa hàng HP10"],
    },
  },
  "Cần Thơ": {
    districts: {
      "Quận Ninh Kiều": ["Cửa hàng CT1", "Cửa hàng CT2"],
      "Quận Cái Răng": ["Cửa hàng CT3", "Cửa hàng CT4"],
      "Quận Bình Thủy": ["Cửa hàng CT5", "Cửa hàng CT6"],
      "Quận Ô Môn": ["Cửa hàng CT7", "Cửa hàng CT8"],
      "Huyện Phong Điền": ["Cửa hàng CT9", "Cửa hàng CT10"],
      "Huyện Thốt Nốt": ["Cửa hàng CT11", "Cửa hàng CT12"],
    },
  },
  "Nha Trang": {
    districts: {
      "Quận Ninh Hải": ["Cửa hàng NH1", "Cửa hàng NH2"],
      "Quận Vĩnh Hải": ["Cửa hàng NH3", "Cửa hàng NH4"],
      "Quận Vĩnh Nguyên": ["Cửa hàng NH5", "Cửa hàng NH6"],
      "Quận Phước Long": ["Cửa hàng NH7", "Cửa hàng NH8"],
    },
  },
  "Vũng Tàu": {
    districts: {
      "TP Vũng Tàu": ["Cửa hàng VT1", "Cửa hàng VT2"],
      "Huyện Long Điền": ["Cửa hàng VT3", "Cửa hàng VT4"],
      "Huyện Đất Đỏ": ["Cửa hàng VT5", "Cửa hàng VT6"],
      "Huyện Xuyên Mộc": ["Cửa hàng VT7", "Cửa hàng VT8"],
    },
  },
};

export default function CheckoutScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [city, setCity] = useState("Hồ Chí Minh");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [additionalRequest, setAdditionalRequest] = useState("");
  const [storeList, setStoreList] = useState<string[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const { userInfo, setUserInfo } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userInfo && userInfo.id) {
      // Kiểm tra nếu userInfo và userInfo.id tồn tại
      setIsLoading(true);
      axios
        .get(`http://172.20.10.2:8900/api/cart/${userInfo.id}`)
        .then((response) => {
          const productsWithDefaultPromotions = response.data.map(
            (product: any) => ({
              ...product,
              promotions: product.promotions || [], // Đảm bảo rằng promotions không bị undefined
            })
          );
          setProducts(productsWithDefaultPromotions);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false); // Đảm bảo là khi không có userInfo thì cũng tắt loading
    }
  }, [userInfo]); // Chỉ phụ thuộc vào userInfo

  const updateDistrictsAndStores = (selectedCity: string) => {
    setCity(selectedCity);
    const districts = Object.keys(locationData[selectedCity]?.districts || {});
    if (districts.length > 0) {
      setDistrict(districts[0]); // Chọn quận đầu tiên mặc định
      setStoreList(locationData[selectedCity].districts[districts[0]]);
    } else {
      setDistrict("");
      setStoreList([]);
    }
  };

  const handleDistrictChange = (selectedDistrict: string) => {
    setDistrict(selectedDistrict);
    setStoreList(locationData[city].districts[selectedDistrict]);
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
    return (
      <View style={styles.productContainer}>
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
              Giá: {parseInt(item.price).toLocaleString("vi-VN")} VND
            </Text>
            <View style={styles.colorContainer}>
              <Text style={styles.colorLabel}>Màu:</Text>
              <Text style={styles.colorText}>{item.selectedColor}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Số lượng:</Text>
              <Text style={styles.quantityNumber}>{item.quantity}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const toggleStoreSelection = (store: string) => {
    setSelectedStores((prevSelectedStores) =>
      prevSelectedStores.includes(store)
        ? prevSelectedStores.filter((s) => s !== store)
        : [...prevSelectedStores, store]
    );
  };
  const totalAmount =
    deliveryMethod === "home"
      ? (() => {
          let shippingFee = 0;
          if (products.length >= 1 && products.length <= 3) {
            shippingFee = 750;
          } else if (products.length >= 4 && products.length <= 10) {
            shippingFee = 500;
          } else if (products.length > 10) {
            shippingFee = 0;
          }
          const subtotal = products.reduce((total, product) => {
            const price = product.price
              ? parseFloat(String(product.price).replace(/\./g, ""))
              : 0;
            return total + price * (product.quantity || 1);
          }, 0);
          return subtotal + shippingFee;
        })()
      : products.reduce((total, product) => {
          const price = product.price
            ? parseFloat(String(product.price).replace(/\./g, ""))
            : 0;
          return total + price * (product.quantity || 1);
        }, 0);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "rgba(0, 123, 255, 0.15)" }}
      >
        <View style={styles.headerContainer}>
          <Link href="/">
            <Text style={styles.headerText}>
              <Text style={{ fontSize: 20 }}>{"⟨ "}</Text> Mua thêm sản phẩm
            </Text>
          </Link>
        </View>
        <ScrollView style={styles.container}>
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.productList}
            scrollEnabled={false}
          />

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              Tạm tính ({products.length} sản phẩm):
            </Text>

            {/* Kiểm tra nếu chọn "Nhận tại nhà" */}
            {deliveryMethod === "home" ? (
              (() => {
                let shippingFee = 0;
                if (products.length >= 1 && products.length <= 3) {
                  shippingFee = 750;
                } else if (products.length >= 4 && products.length <= 10) {
                  shippingFee = 500;
                } else if (products.length > 10) {
                  shippingFee = 0;
                }

                // Tổng tiền sản phẩm
                const subtotal = products.reduce((total, product) => {
                  const price = product.price
                    ? parseFloat(String(product.price).replace(/\./g, ""))
                    : 0;
                  return total + price * (product.quantity || 1);
                }, 0);

                // Tổng cộng (bao gồm phí vận chuyển)
                const total = subtotal + shippingFee;

                return (
                  <>
                    <Text style={styles.money}>
                      Phí vận chuyển:{" "}
                      {shippingFee > 0
                        ? `${shippingFee.toLocaleString("vi-VN")}đ`
                        : "Miễn phí"}
                    </Text>
                    <Text style={styles.summaryPrice}>
                      Tổng: {total.toLocaleString("vi-VN")} VND
                    </Text>
                  </>
                );
              })()
            ) : (
              <Text style={styles.summaryPrice}>
                Tổng:{" "}
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
            )}
          </View>

          <View style={styles.customerInfoContainer}>
            <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
            <TouchableOpacity
              style={styles.next}
              onPress={() => router.push(`/profile`)}
            >
              <Text style={styles.nextText}>Thay đổi thông tin</Text>
            </TouchableOpacity>

            {/* Thay thế TextInput bằng Text chỉ hiển thị */}
            <Text style={styles.input}>Họ và tên: {userInfo?.name}</Text>
            <Text style={styles.input}>Giới tính: {userInfo?.gender}</Text>
            <Text style={styles.input}>Số điện thoại: {userInfo?.phone}</Text>
            <Text style={styles.input}>Email: {userInfo?.email}</Text>
            <Text style={[styles.input, { width: "100%", flexWrap: "wrap" }]}>
              Địa chỉ: {userInfo?.address}
            </Text>
          </View>

          <View style={styles.deliveryMethodContainer}>
            <Text style={styles.sectionTitle}>Chọn phương thức nhận hàng</Text>
            <View style={styles.checkButton}>
              <Checkbox
                status={deliveryMethod === "home" ? "checked" : "unchecked"}
                onPress={() => setDeliveryMethod("home")}
              />
              <Text>Nhận tại nhà</Text>
            </View>
            <View style={styles.checkButton}>
              <Checkbox
                status={deliveryMethod === "store" ? "checked" : "unchecked"}
                onPress={() => setDeliveryMethod("store")}
              />
              <Text>Nhận tại cửa hàng</Text>
            </View>
          </View>

          {deliveryMethod === "home" && (
            <View style={styles.addressInfoContainer}>
              <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
              <Text style={styles.input}>{userInfo?.address}</Text>
              <TextInput
                style={styles.input}
                placeholder="Yêu cầu khác (không bắt buộc)"
                value={additionalRequest}
                onChangeText={setAdditionalRequest}
              />
            </View>
          )}

          {deliveryMethod === "store" && (
            <View style={styles.storeInfoContainer}>
              <Text style={styles.sectionTitle}>Chọn thành phố:</Text>
              <Picker
                selectedValue={city}
                onValueChange={(itemValue) =>
                  updateDistrictsAndStores(itemValue)
                }
                style={styles.picker}
              >
                {Object.keys(locationData).map((city) => (
                  <Picker.Item key={city} label={city} value={city} />
                ))}
              </Picker>
              <Text style={styles.sectionTitle}>Chọn quận:</Text>
              <Picker
                selectedValue={district}
                onValueChange={handleDistrictChange}
                style={styles.picker1}
                enabled={
                  Object.keys(locationData[city]?.districts || {}).length > 0
                } // Vô hiệu hóa nếu không có quận
              >
                {Object.keys(locationData[city]?.districts || {}).map(
                  (district) => (
                    <Picker.Item
                      key={district}
                      label={district}
                      value={district}
                    />
                  )
                )}
              </Picker>
              <View>
                <Text style={styles.storeListTitle}>Chọn cửa hàng:</Text>
                {storeList.map((store) => (
                  <TouchableOpacity
                    key={store}
                    onPress={() => toggleStoreSelection(store)}
                  >
                    <View style={styles.storeItem}>
                      <Checkbox
                        status={
                          selectedStores.includes(store)
                            ? "checked"
                            : "unchecked"
                        }
                      />
                      <Text>{store}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() =>
            router.push({
              pathname: "./payment",
              params: { totalAmount: totalAmount.toString() }, // Chuyển tổng tiền sang dạng chuỗi
            })
          }
        >
          <Text style={styles.checkoutText}>Thanh toán</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 10,
  },
  headerText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  productList: { paddingVertical: 16 },
  productContainer: { marginBottom: 16 },
  productInnerContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  productImage: { width: 100, height: 100, borderRadius: 8 },
  productInfo: { flex: 1, padding: 8 },
  productName: { fontSize: 16, fontWeight: "bold" },
  productPrice: { fontSize: 14, color: "green" },
  productDiscountPrice: {
    fontSize: 14,
    color: "red",
    textDecorationLine: "line-through",
  },
  colorContainer: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  colorLabel: { fontWeight: "bold" },
  colorText: { marginLeft: 4 },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  quantityLabel: { fontWeight: "bold" },
  quantityNumber: { marginLeft: 4 },
  summaryContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  summaryText: { fontSize: 16 },
  summaryPrice: { fontSize: 20, fontWeight: "bold", color: "green" },
  customerInfoContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  checkButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1, // Thêm border
    borderColor: "#ccc", // Màu viền
    borderRadius: 5, // Làm mềm các góc
    backgroundColor: "#f9f9f9",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  deliveryMethodContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  addressInfoContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 30,
  },
  storeInfoContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 30,
  },
  picker: { height: 40, width: "80%", marginBottom: 180 },
  picker1: { height: 40, width: "80%", marginBottom: 250 },
  picker2: { height: 40, width: "80%", marginBottom: 180 },
  picker3: { height: 40, width: "80%", marginBottom: 250 },
  storeListTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  storeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1, // Thêm border
    borderColor: "#ccc", // Màu viền
    borderRadius: 5, // Làm mềm các góc
    backgroundColor: "#f9f9f9",
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
  next: { right: -210, top: -10 },
  nextText: { fontSize: 12, color: "red" },
  money: { textAlign: "left", marginTop: 10 },
});
