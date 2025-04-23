import React, { useState } from "react";
import {
  StyleSheet,
  Modal,
  TextInput,
  Platform,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Linking,
  Image,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "../(auth)/UserContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme, ColorSchemeName } from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";

type UserInfo = {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  address?: string;
  role?: string;
};

export default function TabThreeScreen() {
  const router = useRouter();
  const { userInfo, setUserInfo } = useUser();
  const colorScheme: ColorSchemeName = useColorScheme() || "light";
  const [expanded, setExpanded] = useState(false);

  // const [modalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  const [actionType, setActionType] = useState<"logout" | "delete" | null>(
    null
  );
  const [tempUserInfo, setTempUserInfo] = useState<UserInfo | null>(userInfo); // Dữ liệu tạm cho modal

  const handleLogin = () => {
    router.push("/login");
  };
  const handlePress = () => {
    setExpanded(!expanded);
  };

  const handleLogout = () => {
    setUserInfo(null);
    Toast.show({
      type: "success",
      text1: "Thành công",
      text2: `Bạn đã đăng xuất khỏi tài khoản.`,
      position: "top",
      visibilityTime: 1000,
    });
    router.push("/");
  };

  const handleUpdateInfo = async () => {
    if (tempUserInfo && tempUserInfo.id) {
      try {
        const response = await fetch(
          `http://172.20.10.2:8900/api/users/${tempUserInfo.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(tempUserInfo),
          }
        );

        if (response.ok) {
          const updatedUser = await response.json();
          setUserInfo(updatedUser);
          setTempUserInfo(updatedUser);
          setIsUpdateModalVisible(false);

          const fetchUpdatedUserInfo = async () => {
            const fetchResponse = await fetch(
              `http://172.20.10.2:8900/api/users/${updatedUser.id}`
            );
            if (fetchResponse.ok) {
              const data = await fetchResponse.json();
              setUserInfo(data);
            } else {
              throw new Error("Không thể lấy thông tin người dùng");
            }
          };
          await fetchUpdatedUserInfo();

          Toast.show({
            type: "success",
            text1: "Thành công",
            text2: `Thông tin đã được cập nhật.`,
            position: "top",
            visibilityTime: 1000,
          });
        } else {
          throw new Error("Không thể cập nhật thông tin");
        }
      } catch (err) {
        const error = err as Error;
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: error.message,
          position: "top",
          visibilityTime: 1000,
        });
      }
    }
  };
  const handleDeleteUser = async () => {
    if (userInfo && userInfo.id) {
      try {
        const response = await fetch(
          `http://172.20.10.2:8900/api/users/${userInfo.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setUserInfo(null); // Xóa thông tin người dùng khỏi ứng dụng
          Toast.show({
            type: "success",
            text1: "Thành công",
            text2: "Tài khoản của bạn đã được xóa.",
            position: "top",
            visibilityTime: 1000,
          });
          router.push("/"); // Chuyển hướng về trang chính
        } else {
          throw new Error("Không thể xóa tài khoản");
        }
      } catch (err) {
        const error = err as Error;
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: error.message,
          position: "top",
          visibilityTime: 1000,
        });
      }
    }
  };
  const handleConfirmAction = () => {
    if (actionType === "logout") {
      handleLogout();
    } else if (actionType === "delete") {
      handleDeleteUser();
    }
    setIsActionModalVisible(false);
    setActionType(null); // Reset action type after confirmation
  };

  const handleCancelAction = () => {
    setIsActionModalVisible(false);
    setActionType(null); // Reset action type if user cancels
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "rgba(0, 123, 255, 0.15)" }}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].background },
        ]}
      >
        {userInfo ? (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Ionicons
                name="person-circle-outline"
                size={100}
                color={Colors[colorScheme].tint}
              />
              <Text style={[styles.title, { color: Colors[colorScheme].tint }]}>
                Thông tin cá nhân
              </Text>
            </View>

            <View
              style={[
                styles.welcomeContainer,
                { backgroundColor: Colors[colorScheme].inputBackground },
              ]}
            >
              <Text
                style={[
                  styles.welcomeText,
                  { color: Colors[colorScheme].text },
                ]}
              >
                {userInfo?.gender === "Nữ"
                  ? `Chào mừng chị ${userInfo?.name} đã trở lại, hãy đồng hành cùng với chúng tôi nhé!`
                  : `Chào mừng anh ${userInfo?.name} đã trở lại, hãy đồng hành cùng với chúng tôi nhé!`}
              </Text>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text
                  style={[styles.label, { color: Colors[colorScheme].text }]}
                >
                  Họ và tên:
                </Text>
                <Text
                  style={[styles.info, { color: Colors[colorScheme].text }]}
                >
                  {userInfo?.name}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text
                  style={[styles.label, { color: Colors[colorScheme].text }]}
                >
                  Giới tính:
                </Text>
                <Text
                  style={[styles.info, { color: Colors[colorScheme].text }]}
                >
                  {userInfo?.gender}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text
                  style={[styles.label, { color: Colors[colorScheme].text }]}
                >
                  Email:
                </Text>
                <Text
                  style={[styles.info, { color: Colors[colorScheme].text }]}
                >
                  {userInfo?.email}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text
                  style={[styles.label, { color: Colors[colorScheme].text }]}
                >
                  Số điện thoại:
                </Text>
                <Text
                  style={[styles.info, { color: Colors[colorScheme].text }]}
                >
                  {userInfo?.phone}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text
                  style={[styles.label, { color: Colors[colorScheme].text }]}
                >
                  Địa chỉ:
                </Text>
                <Text
                  style={[
                    styles.info,
                    {
                      color: Colors[colorScheme].text,
                      flexWrap: "wrap",
                      width: "70%",
                    },
                  ]}
                >
                  {userInfo?.address}
                </Text>
              </View>
              {userInfo?.role === "admin" && (
                <View>
                  <View style={styles.infoRow}>
                    <Text
                      style={[
                        styles.label,
                        { color: Colors[colorScheme].text },
                      ]}
                    >
                      Vai trò:
                    </Text>
                    <Text
                      style={[styles.info, { color: Colors[colorScheme].text }]}
                    >
                      Quản trị viên
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.dashboardButton,
                      { backgroundColor: Colors[colorScheme].buttonBackground },
                    ]}
                    onPress={() => router.push("/(dashboard)/Home")}
                  >
                    <Text style={styles.logoutText}>Trang quản lý</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: -20,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.updateButton,
                  {
                    backgroundColor: Colors[colorScheme].buttonBackground,
                    flex: 1,
                    marginRight: 5,
                  },
                ]}
                onPress={() => setIsUpdateModalVisible(true)}
              >
                <Text style={styles.logoutText}>Cập nhật thông tin</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dashboardButton,
                  { backgroundColor: Colors[colorScheme].buttonBackground },
                ]}
                onPress={() => {
                  setActionType("delete");
                  setIsActionModalVisible(true);
                }}
              >
                <Text style={styles.logoutText}>Xoá tài khoản</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.logoutButton,
                  {
                    backgroundColor: Colors[colorScheme].buttonBackground,
                    flex: 1,
                    marginLeft: 5,
                  },
                ]}
                onPress={handleLogout}
              >
                <Text style={styles.logoutText}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <>
            <View style={styles.header}>
              <Ionicons
                name="person-circle-outline"
                size={100}
                color={Colors[colorScheme].tint}
              />
              <Text style={[styles.title, { color: Colors[colorScheme].tint }]}>
                Chào bạn!
              </Text>
            </View>

            <View
              style={[
                styles.loginPromptContainer,
                { backgroundColor: Colors[colorScheme].inputBackground },
              ]}
            >
              <Text
                style={[
                  styles.loginPromptText,
                  { color: Colors[colorScheme].text },
                ]}
              >
                Hãy đăng nhập để nhận thông báo mới nhất kèm với những ưu đãi
                hấp dẫn nhất từ chúng tôi!
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: Colors[colorScheme].buttonBackground },
              ]}
              onPress={handleLogin}
            >
              <Text style={styles.loginText}>Đăng nhập</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Modal visible={isUpdateModalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            style={styles.modalContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View
              style={[
                styles.modalContent,
                { backgroundColor: Colors[colorScheme].inputBackground },
              ]}
            >
              <Text
                style={[styles.modalTitle, { color: Colors[colorScheme].text }]}
              >
                Cập nhật thông tin
              </Text>

              <ScrollView>
                {["name", "gender", "email", "phone", "address"].map(
                  (field) => (
                    <TextInput
                      key={field}
                      style={[
                        styles.input,
                        { color: Colors[colorScheme].text },
                      ]}
                      placeholder={field}
                      placeholderTextColor={Colors[colorScheme].text}
                      value={
                        tempUserInfo?.[field as keyof UserInfo]?.toString() ||
                        ""
                      }
                      onChangeText={(text) =>
                        setTempUserInfo((prev) =>
                          prev ? { ...prev, [field]: text } : prev
                        )
                      }
                    />
                  )
                )}
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: Colors[colorScheme].buttonBackground },
                  ]}
                  onPress={() => setIsUpdateModalVisible(false)}
                >
                  <Text style={styles.logoutText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: Colors[colorScheme].buttonBackground },
                  ]}
                  onPress={handleUpdateInfo}
                >
                  <Text style={styles.logoutText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
      <Modal visible={isActionModalVisible} animationType="slide" transparent>
        <View style={styles.actionOverlay}>
          <View
            style={[
              styles.actionModalContainer,
              { backgroundColor: Colors[colorScheme].background },
            ]}
          >
            <Text
              style={[
                styles.actionModalTitle,
                { color: Colors[colorScheme].text },
              ]}
            >
              Bạn chắc chắn muốn{" "}
              {actionType === "logout" ? "đăng xuất" : "xóa tài khoản"}?
            </Text>
            <View style={styles.actionModalButtons}>
              <TouchableOpacity
                style={[
                  styles.actionModalButton,
                  { backgroundColor: Colors[colorScheme].buttonBackground },
                ]}
                onPress={handleCancelAction}
              >
                <Text style={styles.actionModalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionModalButton,
                  { backgroundColor: Colors[colorScheme].buttonBackground },
                ]}
                onPress={handleConfirmAction}
              >
                <Text style={styles.actionModalButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.containerchat}>
        {expanded && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.zaloButton]}
              onPress={() => Linking.openURL("https://zalo.me/0345510330")}
            >
              <Image
                source={require("@/assets/images/zalo.jpeg")}
                resizeMode="contain"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Linking.openURL("https://m.me/quan.224227");
              }}
            >
              <Image
                source={require("@/assets/images/message.jpg")}
                resizeMode="contain"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Linking.openURL("tel:0345510330");
              }}
            >
              <Icon name="phone" size={24} color="green" />
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={[styles.button, styles.expandButton]}
          onPress={handlePress}
        >
          {expanded ? (
            <Icon name="close" size={24} color="#FFF" />
          ) : (
            <View style={styles.iconContainer}>
              {[...Array(3).keys()].map((index) => (
                <MotiView
                  from={{ opacity: 0.7, scale: 1 }}
                  animate={{ opacity: 0, scale: 4 }}
                  transition={{
                    type: "timing",
                    duration: 2000,
                    easing: Easing.out(Easing.ease),
                    delay: index * 400,
                    loop: true,
                    repeatReverse: false,
                  }}
                  key={index}
                  style={[StyleSheet.absoluteFillObject, styles.circleEffect]}
                />
              ))}
              <Icon name="chat" size={24} color="#FFF" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  welcomeContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoContainer: {
    padding: 20,
    borderRadius: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  info: {
    fontSize: 16,
    textAlign: "right",
  },
  logoutButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  dashboardButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loginPromptContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  loginPromptText: {
    fontSize: 18,
    textAlign: "center",
  },
  loginButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
  },
  updateButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: "45%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Lớp phủ mờ ngoài modal
  },
  actionOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Tạo nền mờ cho modal
  },
  actionModalContainer: {
    width: "80%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  actionModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  actionModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionModalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  actionModalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  containerchat: {
    position: "absolute",
    right: 15,
    top: 270,
    alignItems: "flex-end",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    marginVertical: 5,
    borderRadius: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  expandButton: {
    backgroundColor: "#d70018",
  },
  icon: {
    width: 28,
    height: 28,
  },
  optionsContainer: {
    position: "absolute",
    bottom: 60,
    right: 0,
    alignItems: "center",
  },
  zaloButton: {
    backgroundColor: "#FFF",
  },
  circleEffect: {
    borderRadius: 40,
    backgroundColor: "#d70018",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
