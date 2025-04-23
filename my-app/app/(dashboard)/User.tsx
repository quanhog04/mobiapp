import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import Toast from "react-native-toast-message";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";

interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  gender: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<Partial<User>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://172.20.10.2:8900/api/users");
      setUsers(
        response.data.sort(
          (a: { id: number }, b: { id: number }) => b.id - a.id
        )
      );

      // Hiển thị thông báo
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Danh sách người dùng đã được tải.",
      });
    } catch (error) {
      // console.error('Lỗi khi lấy danh sách User', error);

      // Hiển thị thông báo lỗi
      Toast.show({
        type: "error",
        text1: "Xin lỗi",
        text2: "Không thể tải danh sách người dùng.",
      });
    }
  };

  // Hàm xóa người dùng
  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`http://172.20.10.2:8900/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));

      // Hiển thị thông báo
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: `Người dùng với ID ${id} đã được xóa.`,
      });
    } catch (error) {
      // console.error('Lỗi khi xóa người dùng', error);

      // Hiển thị thông báo lỗi
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể xóa người dùng.",
      });
    }
  };

  const openUpdateModal = (user: User) => {
    setSelectedUser(user);
    setForm({ ...user });
    setModalVisible(true);
  };

  // Hàm cập nhật người dùng
  const handleUpdate = async () => {
    if (!selectedUser) return;

    try {
      const response = await axios.put(
        `http://172.20.10.2:8900/api/users/${selectedUser.id}`,
        form
      );
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? response.data : user
        )
      );
      setModalVisible(false);

      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Người dùng đã được cập nhật.",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể cập nhật người dùng.",
      });
    }
  };

  // Render từng người dùng
  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <Text style={styles.userText}>Họ tên: {item.name}</Text>
      <Text style={styles.userText}>Email: {item.email}</Text>
      <Text style={styles.userText}>Số điện thoại: {item.phone}</Text>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          onPress={() => deleteUser(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.actionText}>Xóa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openUpdateModal(item)}
          style={styles.updateButton}
        >
          <Text style={styles.actionText}>Cập nhật</Text>
        </TouchableOpacity>
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
      <Text style={styles.title}>Quản lý người dùng</Text>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật thông tin</Text>
            <TextInput
              style={styles.input}
              placeholder="Họ tên"
              value={form.name || ""}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={form.email || ""}
              onChangeText={(text) => setForm({ ...form, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={form.phone || ""}
              onChangeText={(text) => setForm({ ...form, phone: text })}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.deleteButton}
              >
                <Text style={styles.actionText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdate}
                style={styles.updateButton}
              >
                <Text style={styles.actionText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Toast />
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
  userItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  userText: { fontSize: 16, marginBottom: 4 },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  deleteButton: {
    flex: 1, // Chia đều không gian với detailButton
    marginRight: 5, // Tạo khoảng cách với detailButton
    backgroundColor: "#ff4d4f",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  updateButton: {
    flex: 1, // Chia đều không gian với deleteButton
    marginLeft: 5, // Tạo khoảng cách với deleteButton
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  actionText: { color: "#fff", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default UserManagement;
