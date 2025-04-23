import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import { Link, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import axios from "axios";

interface Order {
  id: string;
  updatedAt: string;
  totalAmount: string;
  status: string;
  address: string;
  userName: string;
}
const HorizontalBarChart = ({ chartData }: { chartData: any }) => {
  const { labels, datasets } = chartData;

  const rotatedLabels = [...labels].reverse();
  const rotatedData = [...datasets[0].data].reverse();

  return (
    <View style={styles.chartContainer}>
      <BarChart
        data={{
          labels: rotatedLabels,
          datasets: [
            {
              data: rotatedData,
            },
          ],
        }}
        width={370}
        height={450}
        yAxisLabel="vnđ"
        yAxisSuffix="tr"
        fromZero
        showValuesOnTopOfBars={true} // Hiển thị giá trị trên thanh
        chartConfig={{
          backgroundGradientFrom: "#1e2923",
          backgroundGradientTo: "#08130d",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          barPercentage: 0.5,
          propsForHorizontalLabels: {
            dx: -55,
          },
        }}
        verticalLabelRotation={90}
      />
    </View>
  );
};

const Dashboard = () => {
  const [revenue, setRevenue] = useState<number | null>(null);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalProduct, setTotalProduct] = useState<number>(0);
  const [totalProductDay, setTotalProductDay] = useState<number>(0);
  const [totalSuccessfulOrders, setTotalSuccessfulOrders] = useState<number>(0);
  const [totalUser, setTotalUser] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const today = new Date();
  const formattedDate = `${today.getDate()}/${
    today.getMonth() + 1
  }/${today.getFullYear()}`;
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { data: number[] }[];
  }>({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });
  const processWeeklyRevenueData = (data: any[]) => {
    const labels = data.map((item: { week: number }) => `Tuần ${item.week}`);
    const revenues = data.map((item: { revenue: number }) => item.revenue);

    return {
      labels,
      datasets: [
        {
          data: revenues,
        },
      ],
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const fetchRevenue = async () => {
    try {
      const response = await axios.get(
        "http://172.20.10.2:8900/api/orders/revenue"
      );
      setRevenue(response.data); // Gán giá trị doanh thu
    } catch (error) {
      console.error("Lỗi khi lấy tổng doanh thu:", error);
    }
  };

  // Fetch tổng số lượng đơn hàng
  const fetchTotalOrders = async () => {
    try {
      const response = await fetch("http://172.20.10.2:8900/api/orders/total");
      if (response.ok) {
        const data = await response.json();
        setTotalOrders(data); // Cập nhật tổng số lượng đơn hàng
      } else {
        throw new Error("Không thể lấy tổng số lượng đơn hàng");
      }
    } catch (err) {}
  };
  const fetchTotalUser = async () => {
    try {
      const response = await fetch(
        "http://172.20.10.2:8900/api/users/count-today"
      );
      if (response.ok) {
        const data = await response.json();
        setTotalUser(data); // Cập nhật tổng số lượng đơn hàng
      } else {
        throw new Error("Không thể lấy tổng số lượng user");
      }
    } catch (err) {}
  };

  // Fetch tổng số lượng đơn hàng có trạng thái DELIVERED_SUCCESSFULLY
  const fetchTotalSuccessfulOrders = async () => {
    try {
      const response = await fetch(
        "http://172.20.10.2:8900/api/orders/total-successful"
      );
      if (response.ok) {
        const data = await response.json();
        setTotalSuccessfulOrders(data); // Cập nhật tổng số lượng đơn hàng thành công
      } else {
        throw new Error("Không thể lấy tổng số lượng đơn hàng thành công");
      }
    } catch (err) {}
  };

  const fetchTotalProduct = async () => {
    try {
      const response = await fetch(
        "http://172.20.10.2:8900/api/products/count"
      );
      if (response.ok) {
        const data = await response.json();
        setTotalProduct(data); // Cập nhật tổng số lượng đơn hàng
      } else {
        throw new Error("Không thể lấy tổng số lượng sản phẩm");
      }
    } catch (err) {}
  };
  const fetchTotalProductDay = async () => {
    try {
      const response = await fetch("http://172.20.10.2:8900/api/count-today");
      if (response.ok) {
        const data = await response.json();
        setTotalProductDay(data); // Cập nhật tổng số lượng đơn hàng
      } else {
        throw new Error("Không thể lấy tổng số lượng sản phẩm");
      }
    } catch (err) {}
  };
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://172.20.10.2:8900/api/orders");
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
  const fetchWeeklyRevenue = async (year: number, month: number) => {
    try {
      const response = await axios.get(
        "http://172.20.10.2:8900/api/revenue-by-week",
        {
          params: { year, month },
        }
      );
      const processedData = processWeeklyRevenueData(response.data);
      setChartData(processedData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu doanh thu theo tuần:", error);
    }
  };

  // Sử dụng useEffect để fetch dữ liệu khi component load
  useEffect(() => {
    fetchOrders();
    fetchTotalProduct();
    fetchRevenue();
    fetchTotalOrders();
    fetchTotalSuccessfulOrders();
    fetchTotalProductDay();
    fetchTotalUser();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Lấy tháng hiện tại
    fetchWeeklyRevenue(year, month); // Gọi API khi component được load
  }, []);

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.tableRow}>
      {/* <Text style={[styles.tableCell, { flex: 1 }]}>{item.id}</Text> */}
      <Text style={[styles.tableCell, { flex: 4 }]}>{item.userName}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>
        {formatDate(item.updatedAt)}
      </Text>
      <Text style={[styles.tableCell, { flex: 3 }]}>
        {parseInt(item.totalAmount).toLocaleString("vi-VN")}
      </Text>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.next}>
        <Link href="/">
          <Text style={styles.headerText}>
            <Text style={{ fontSize: 20 }}>{"⟨ "}</Text>Quay lại
          </Text>
        </Link>
      </View>
      <Text style={styles.header}>Dashboard</Text>

      {/* Button để mở menu */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
      >
        <Ionicons name="menu-outline" size={28} color="white" />
      </TouchableOpacity>

      {/* Modal hiển thị menu */}
      <Modal visible={menuVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Menu</Text>
            <ScrollView contentContainerStyle={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.push("/(dashboard)/Product");
                  setMenuVisible(false);
                }}
              >
                <Ionicons
                  name={"cube-outline"}
                  size={24}
                  color="black"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Quản lý sản phẩm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.push("/(dashboard)/Order");
                  setMenuVisible(false);
                }}
              >
                <Ionicons
                  name={"cart-outline"}
                  size={24}
                  color="black"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Quản lý đơn hàng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.push("/(dashboard)/User");
                  setMenuVisible(false);
                }}
              >
                <Ionicons
                  name="people-outline"
                  size={24}
                  color="black"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Quản lý khách hàng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.push("/(dashboard)/Banner");
                  setMenuVisible(false);
                }}
              >
                <Ionicons
                  name="images-outline"
                  size={24}
                  color="black"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Quản lý banner</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.push("/(dashboard)/Category");
                  setMenuVisible(false);
                }}
              >
                <Ionicons
                  name="list-outline"
                  size={24}
                  color="black"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Quản lý danh mục</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.push("/(dashboard)/Brand");
                  setMenuVisible(false);
                }}
              >
                <Ionicons
                  name="business-outline"
                  size={24}
                  color="black"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Quản lý nhà cung cấp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setMenuVisible(false)}
              >
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color="black"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Cài đặt</Text>
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMenuVisible(false)}
            >
              <Ionicons name="close-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.statisticsContainer}>
          <Text style={styles.statisticsHeader}>
            Doanh thu bán hàng hôm nay ({formattedDate})
          </Text>
          <View style={styles.statisticsRow}>
            <View style={styles.statisticsCard}>
              {revenue !== null ? (
                <Text style={styles.statisticsValue}>
                  {revenue.toLocaleString()}đ
                </Text>
              ) : (
                <Text style={styles.loadingText}>Đang tải...</Text>
              )}
              <Text style={styles.statisticsLabel}>Tổng doanh thu</Text>
            </View>
            <View style={styles.statisticsCard}>
              <Text style={styles.statisticsValue}>{totalOrders}</Text>
              <Text style={styles.statisticsLabel}>Đơn hàng</Text>
            </View>
          </View>
          <View style={styles.statisticsRow}>
            <View style={styles.statisticsCard}>
              <Text style={styles.statisticsValue}>
                {totalSuccessfulOrders}
              </Text>
              <Text style={styles.statisticsLabel}>Đơn hàng hoàn thành</Text>
            </View>
            <View style={styles.statisticsCard}>
              <Text style={styles.statisticsValue}>{totalProduct}</Text>
              <Text style={styles.statisticsLabel}>
                Tổng sản phẩm trong kho
              </Text>
            </View>
          </View>
          <View style={styles.statisticsRow}>
            <View style={styles.statisticsCard}>
              <Text style={styles.statisticsValue}>{totalUser}</Text>
              <Text style={styles.statisticsLabel}>
                Khác hàng đăng kí tài khoản
              </Text>
            </View>
            <View style={styles.statisticsCard}>
              <Text style={styles.statisticsValue}>{totalProductDay}</Text>
              <Text style={styles.statisticsLabel}>Sản phẩm đã nhập</Text>
            </View>
          </View>
        </View>

        {/* Biểu đồ doanh thu */}
        <View style={styles.chartContainer}>
          <Text style={styles.statisticsHeader}>Doanh thu theo tháng</Text>
          <HorizontalBarChart chartData={chartData} />
        </View>

        <View style={styles.tableContainer}>
          <Text style={styles.tableHeader}>Thông tin đơn hàng</Text>
          <View style={styles.tableRowHeader}>
            {/* <Text style={[styles.tableCellHeader, { flex: 1 }]}>Mã</Text> */}
            <Text style={[styles.tableCellHeader, { flex: 4 }]}>
              Khách hàng
            </Text>
            <Text style={[styles.tableCellHeader, { flex: 2 }]}>Ngày</Text>
            <Text style={[styles.tableCellHeader, { flex: 3 }]}>Tổng tiền</Text>
          </View>
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  statisticsContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  statisticsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  statisticsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statisticsCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 8,
    elevation: 2,
  },
  statisticsValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  statisticsLabel: {
    fontSize: 12,
    color: "#757575",
    textAlign: "center",
  },
  menuContainer: {
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
  },
  chartContainer: {
    marginBottom: 24,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  menuButton: {
    position: "absolute",
    top: 56,
    right: 16,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#FF5252",
    padding: 10,
    borderRadius: 8,
  },
  next: { flexDirection: "row", alignItems: "center", marginTop: 30 },
  tableContainer: {
    marginTop: 24,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tableRowHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 8,
    paddingBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  tableCellHeader: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  headerText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  loadingText: {
    fontSize: 18,
    color: "gray",
  },
});

export default Dashboard;
