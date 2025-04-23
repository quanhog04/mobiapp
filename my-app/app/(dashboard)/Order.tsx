import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import Toast from "react-native-toast-message";

interface Order {
  id: number;
  updatedAt: string;
  totalAmount: string;
  status: string;
  address: string;
  orderCode: string;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusOptions] = useState([
    { label: "Đang chờ xác nhận", value: "PENDING_CONFIRMATION" },
    { label: "Đã xác nhận", value: "CONFIRMED" },
    { label: "Đang chuẩn bị hàng", value: "PREPARING" },
    { label: "Lên đơn hàng thành công", value: "ORDER_SUCCESS" },
    { label: "Đang vận chuyển", value: "SHIPPING" },
    { label: "Giao hàng thành công", value: "DELIVERED_SUCCESSFULLY" },
    { label: "Giao thất bại", value: "DELIVERY_FAILED" },
  ]);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  // Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://172.20.10.2:8900/api/orders/excluding-status"
      );
      setOrders(
        response.data.sort(
          (a: { id: number }, b: { id: number }) => b.id - a.id
        )
      );
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Xin lỗi",
        text2: "Lỗi khi lấy danh sách Order!",
        position: "top",
        visibilityTime: 1000,
      });
      // console.error('Lỗi khi lấy danh sách Order', error);
    }
  };

  // Cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      // Cấu hình timeout là 10 giây (10000 ms)
      const response = await axios.put(
        `http://172.20.10.2:8900/api/orders/${orderId}/status?status=${status}`,
        { timeout: 10000 } // Thêm thời gian chờ ở đây (10 giây)
      );
      fetchOrders(); // Làm mới danh sách sau khi cập nhật
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          Toast.show({
            type: "error",
            text1: "Xin lỗi",
            text2: "Quá thời gian chờ khi cập nhật trạng thái!",
            position: "top",
            visibilityTime: 1000,
          });
          // console.error(`Lỗi: Quá thời gian chờ khi cập nhật trạng thái cho đơn hàng ${orderId}`);
        } else {
          Toast.show({
            type: "error",
            text1: "Xin lỗi",
            text2: "Lỗi khi cập nhật trạng thái!",
            position: "top",
            visibilityTime: 1000,
          });
          // console.error(`Lỗi khi cập nhật trạng thái cho đơn hàng ${orderId}`, error);
        }
      }
    }
  };

  // Render từng đơn hàng
  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderItem}>
      <View style={styles.textContainer}>
        <Text style={styles.orderText}>Mã đơn: {item.orderCode}</Text>
        <Text style={styles.orderText}>
          Ngày cập nhật: {formatDate(item.updatedAt)}
        </Text>
        <Text style={styles.orderText}>
          Tổng tiền: {parseInt(item.totalAmount).toLocaleString("vi-VN")} VND
        </Text>
        <Text style={styles.orderText}>Địa chỉ: {item.address}</Text>
        <Text
          style={[
            styles.orderText,
            item.status === "PENDING_CONFIRMATION" && { color: "#FFA500" }, // Màu cam
            item.status === "CONFIRMED" && { color: "#28A745" }, // Màu cam
            item.status === "PREPARING" && { color: "#007BFF" }, // Màu xanh dương
            item.status === "ORDER_SUCCESS" && { color: "#28A745" }, // Màu xanh lá
            item.status === "SHIPPING" && { color: "#17A2B8" }, // Màu xanh biển
            item.status === "DELIVERED_SUCCESSFULLY" && { color: "#6C757D" }, // Màu xám
            item.status === "DELIVERY_FAILED" && { color: "#DC3545" }, // Màu đỏ
          ]}
        >
          Trạng thái:{" "}
          {item.status === "PENDING_CONFIRMATION" && "Đang chờ xác nhận"}
          {item.status === "CONFIRMED" && "Đã xác nhận"}
          {item.status === "PREPARING" && "Đang chuẩn bị hàng"}
          {item.status === "ORDER_SUCCESS" && "Lên đơn hàng thành công"}
          {item.status === "SHIPPING" && "Đang vận chuyển"}
          {item.status === "DELIVERED_SUCCESSFULLY" && "Giao hàng thành công"}
          {item.status === "DELIVERY_FAILED" && "Giao thất bại"}
        </Text>
      </View>
      <View style={{ borderWidth: 1, borderColor: "blue", margin: 10 }}>
        <RNPickerSelect
          onValueChange={(value) => {
            if (value) {
              updateOrderStatus(item.id, value); // Gửi trạng thái mới về backend
            }
          }}
          items={statusOptions}
          value={item.status} // Hiển thị trạng thái hiện tại
          placeholder={{}} // Xóa placeholder, chỉ hiển thị trạng thái
          style={{
            inputAndroid: {
              textAlign: "left", // Căn giữa chữ trong khung
              height: 40,
              backgroundColor: "#007BFF", // Nền xanh
              color: "#fff", // Chữ màu trắng
              paddingVertical: 10,
              paddingHorizontal: 20,
            },
            inputIOS: {
              textAlign: "left", // Căn giữa chữ trong khung
              height: 40,
              backgroundColor: "#007BFF", // Nền xanh
              color: "#fff", // Chữ màu trắng
              paddingVertical: 10,
              paddingHorizontal: 20,
            },
            iconContainer: {
              top: 12, // Vị trí icon dropdown
              right: 12,
            },
          }}
          Icon={() => {
            return (
              <Text style={{ color: "#FFFF33", fontSize: 16 }}>
                {" "}
                Cập nhật ▼
              </Text> // Icon mũi tên trắng
            );
          }}
        />
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <Link href="/(dashboard)/Home">
          <Text style={styles.headerText}>
            <Text style={{ fontSize: 20 }}>{"⟨ "}</Text> Quay lại
          </Text>
        </Link>
      </View>
      <Text style={styles.title}>Quản lý Đơn Hàng</Text>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  headerText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  listContainer: { paddingBottom: 16 },
  orderItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  textContainer: { marginBottom: 8 },
  orderText: { fontSize: 16, marginBottom: 4 },
  picker: {
    height: 40,
    borderWidth: 1,
    borderColor: "red",
    padding: 8,
    marginBottom: 50,
    backgroundColor: "green",
  },
});

export default OrderManagement;
