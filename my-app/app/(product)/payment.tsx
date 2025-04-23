import axios, { AxiosResponse } from "axios";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useUser } from "../(auth)/UserContext";
import Toast from "react-native-toast-message";
import { useSearchParams } from "expo-router/build/hooks";

interface Product {
  id: number;
  productName: string;
  price: string;
  selectedImagePath: string;
  selectedColor: string;
  productId: number;
  quantity: number;
  promotions: string[];
}

export default function PaymentScreen() {
  const [isQRCODEModalVisible, setIsQRCODEModalVisible] = useState(false);
  const [isCashModalVisible, setIsCashModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { userInfo } = useUser();
  const searchParams = useSearchParams();
  const totalAmount = parseFloat(searchParams.get("totalAmount") || "0");
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [orderCode, setOrderCode] = useState(null);

  useEffect(() => {
    if (userInfo) {
      axios
        .get(`http://172.20.10.2:8900/api/cart/${userInfo.id}`)
        .then((response) => {
          const productsWithDefaultPromotions = response.data.map(
            (product: any) => ({
              ...product,
              promotions: product.promotions || [],
            })
          );
          setProducts(productsWithDefaultPromotions);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userInfo]);

  const fetchQRCode = async (orderRequest: { totalAmount: number }) => {
    try {
      const response = await axios.post(
        "http://172.20.10.2:8900/api/orders/payment",
        orderRequest
      );
      return response.data; // Kết quả trả về từ backend
    } catch (error) {
      console.error("Lỗi khi tạo mã QR: ", error);
      return null;
    }
  };
  const handleCreateQRCode = async () => {
    const orderRequest = {
      totalAmount: totalAmount, // Ví dụ số tiền
    };

    const data = await fetchQRCode(orderRequest);
    if (data) {
      setQrCodeUrl(data.qrCodeUrl);
      setOrderCode(data.orderCode);
    }
  };
  useEffect(() => {
    handleCreateQRCode();
  }, []);

  const updateProductStock = (productId: number, quantity: number) => {
    return axios
      .put(`http://172.20.10.2:8900/api/product/${productId}/update-stock`, {
        quantity: quantity,
      })
      .catch((error) => {
        console.log("Cập nhật số lượng sản phẩm thất bại", error);
      });
  };

  const handlePaymentSuccess = () => {
    setIsQRCODEModalVisible(false);
    setIsLoading(true);

    // Cập nhật số lượng sản phẩm trong kho
    const updateStockPromises = products.map((product) => {
      if (product.quantity > 0) {
        return updateProductStock(product.productId, product.quantity);
      }
      return Promise.resolve(); // Nếu không cần cập nhật, trả về một Promise hoàn thành
    });

    // Chờ tất cả các yêu cầu cập nhật kho hoàn tất
    Promise.all(updateStockPromises)
      .then(() => {
        // Tạo đơn hàng
        const orderRequest = {
          userId: userInfo?.id,
          address: userInfo?.address,
          totalAmount: totalAmount,
          orderCode: orderCode,
          orderItems: products.map((product) => ({
            productId: product.productId,
            productName: product.productName,
            price: parseFloat(product.price),
            quantity: product.quantity,
          })),
        };

        return axios.post(
          "http://172.20.10.2:8900/api/orders/create",
          orderRequest,
          {
            timeout: 20000,
          }
        );
      })
      .then(() => {
        if (!userInfo) {
          // Nếu người dùng chưa đăng nhập, trả về Promise với đối tượng trống
          return Promise.resolve({} as AxiosResponse<any, any>);
        }
        // Sau khi tạo đơn hàng thành công, xóa giỏ hàng
        return axios.delete(
          `http://172.20.10.2:8900/api/cart/delete/${userInfo.id}`
        );
      })
      .then(() => {
        // Gửi email xác nhận đơn hàng
        const emailRequest = {
          userEmail: userInfo?.email,
          orderCode: orderCode,
          total: totalAmount,
          customerName: userInfo?.name,
          customerAddress: userInfo?.address,
          customerPhone: userInfo?.phone,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
          orderDetailRequests: products.map((product) => ({
            productId: product.productId,
            productName: product.productName,
            quantity: product.quantity,
            price: parseFloat(product.price),
          })),
        };

        return axios.post(
          "http://172.20.10.2:8900/api/email-order/success",
          emailRequest,
          {
            timeout: 20000,
          }
        );
      })
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Thanh toán thành công! Đơn hàng đã được tạo.",
          position: "top",
          visibilityTime: 1000,
        });
        console.log("Gửi email thành công");
        router.push("/"); // Chuyển hướng đến trang đơn hàng
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2:
            "Đã xảy ra sự cố trong quá trình thanh toán. Vui lòng thử lại.",
          position: "top",
          visibilityTime: 1000,
        });
        console.log("Có lỗi xảy ra:", error);
      })
      .finally(() => {
        // Kết thúc loading dù thành công hay thất bại
        setIsLoading(false);
      });
  };

  const handlePaymentCashSuccess = () => {
    setIsCashModalVisible(false);
    // Cập nhật số lượng sản phẩm trong kho
    const updateStockPromises = products.map((product) => {
      if (product.quantity > 0) {
        return updateProductStock(product.productId, product.quantity);
      }
      return Promise.resolve();
    });

    // Chờ tất cả các yêu cầu cập nhật kho hoàn tất
    Promise.all(updateStockPromises)
      .then(() => {
        const orderCode = "ORD" + Date.now(); // Tạo mã đơn hàng
        // Tạo đơn hàng
        const orderRequest = {
          userId: userInfo?.id,
          address: userInfo?.address,
          totalAmount: totalAmount, // ID người dùng
          orderCode: orderCode,
          orderItems: products.map((product) => ({
            productId: product.productId,
            productName: product.productName,
            price: parseFloat(product.price),
            quantity: product.quantity,
            selectedColor: product.selectedColor,
          })),
        };

        // Gửi yêu cầu tạo đơn hàng tới backend
        axios
          .post(
            "http://172.20.10.2:8900/api/orders/create-cash",
            orderRequest,
            { timeout: 10000 }
          )
          .then(() => {
            if (!userInfo) {
              // Nếu người dùng chưa đăng nhập, dừng thực hiện
              return;
            }
            // Sau khi tạo đơn hàng thành công, xóa giỏ hàng
            axios
              .delete(`http://172.20.10.2:8900/api/cart/delete/${userInfo.id}`)
              .then(() => {
                Toast.show({
                  type: "success",
                  text1: "Thêm vào giỏ hàng",
                  text2: "Thanh toán thành công! Đơn hàng đã được tạo.",
                  position: "top",
                  visibilityTime: 1000,
                });
                router.push("/"); // Chuyển hướng đến trang đơn hàng
              })
              .catch((error) => {
                console.log("Xóa giỏ hàng thất bại", error);
              });
          });
      })
      .catch((error) => {
        console.log("Có lỗi xảy ra khi cập nhật số lượng sản phẩm", error);
      });
  };
  const handleCancel = () => {
    // Reset dữ liệu mã QR khi huỷ
    setQrCodeUrl(null);
    setOrderCode(null);
    setIsQRCODEModalVisible(false);
    handleCreateQRCode();
  };
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Hệ thống đang xử lý...</Text>
      </View>
    );
  }

  const renderPaymentModal = (
    isVisible: boolean | undefined,
    onClose: () => void
  ) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsQRCODEModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Quét mã QR để thanh toán</Text>

            {qrCodeUrl ? (
              <View style={styles.qrCodeContainer}>
                <Image
                  source={{ uri: qrCodeUrl }} // Hiển thị ảnh QR từ URL
                  style={styles.qrCodeImage}
                />
                <Text style={styles.modalText}>Mã đơn hàng: {orderCode}</Text>
                <Text style={styles.note}>
                  Chú ý! Nếu bạn đã thanh toán thành công nhưng hệ thống chưa
                  xác nhận đơn hàng, xin vui lòng xác nhận lại.
                </Text>
              </View>
            ) : (
              <Text style={styles.modalText}>Đang tạo mã QR...</Text>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
              <Text style={styles.closeButtonText}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handlePaymentSuccess}
            >
              <Text style={styles.closeButtonText}>Xác nhận thanh toán</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  const renderCashPaymentModal = (
    isVisible: boolean | undefined,
    onClose: () => void
  ) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Thanh toán sau khi nhận hàng</Text>
            <Text style={styles.modalText}>Tổng tiền: {totalAmount} VND</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handlePaymentCashSuccess}
            >
              <Text style={styles.closeButtonText}>Đặt hàng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "rgba(0, 123, 255, 0.15)" }}
    >
      <View style={styles.headerContainer}>
        <Link href="/">
          <Text style={styles.headerText}>
            <Text style={{ fontSize: 20 }}>{"⟨ "}</Text> Trang chủ
          </Text>
        </Link>
      </View>
      <View style={styles.container}>
        <Text style={styles.header}>Phương thức thanh toán</Text>

        {/* Thanh toán VNPAY */}
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => setIsQRCODEModalVisible(true)}
        >
          <Image
            source={require("@/assets/images/vnpay.png")}
            style={styles.paymentLogo}
          />
          <Text style={styles.paymentText}>Cổng thanh toán QR CODE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => setIsCashModalVisible(true)}
        >
          <Image
            source={require("@/assets/images/casg.png")}
            style={styles.paymentLogo}
          />
          <Text style={styles.paymentText}>Thanh toán bằng tiền mặt</Text>
        </TouchableOpacity>

        {/* Modal chi tiết thanh toán VNPAY */}
        {renderPaymentModal(isQRCODEModalVisible, () =>
          setIsQRCODEModalVisible(false)
        )}
        {renderCashPaymentModal(isCashModalVisible, () =>
          setIsCashModalVisible(false)
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
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
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  paymentLogo: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  paymentText: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  qrCodeContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 10,
    width: "80%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  qrCodeImage: {
    width: 250,
    height: 300,
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
  note: {
    fontSize: 10,
    color: "red",
    marginTop: 10,
  },
});
