import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { Link, router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";

interface Category {
  id: number;
  name: string;
  image: string;
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<Category>({
    id: 0,
    name: "",
    image: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null); // Category đang được chỉnh sửa
  const [editingImage, setEditingImage] = useState<string | null>(null); // Ảnh mới nếu có

  useEffect(() => {
    fetchCategories();
    fetchCategories();
  }, []);

  // Lấy danh sách category từ backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://172.20.10.2:8900/api/categories"
      );
      setCategories(
        response.data.sort(
          (a: { id: number }, b: { id: number }) => b.id - a.id
        )
      );
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Xin lỗi",
        text2: "Lỗi khi lấy danh sách category!",
        position: "top",
        visibilityTime: 1000,
      });
      // console.error("Lỗi khi lấy danh sách category", error);
    }
  };

  // Xử lý chọn ảnh từ thiết bị
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      if (editingCategory) {
        setEditingImage(result.assets[0].uri); // Lưu ảnh mới vào trạng thái chỉnh sửa
      } else {
        setSelectedImage(result.assets[0].uri); // Lưu ảnh vào trạng thái thêm mới
        setNewCategory({ ...newCategory, image: result.assets[0].uri });
      }
    }
  };

  // Xử lý thêm Category
  const handleAddCategory = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newCategory.name);

      if (selectedImage) {
        const fileExtension = selectedImage.split(".").pop();
        const fileName = selectedImage.split("/").pop();
        formData.append("file", {
          uri: selectedImage,
          name: fileName,
          type: `image/${fileExtension}`,
        } as any);
      }

      await axios.post("http://172.20.10.2:8900/api/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Toast.show({
        type: "success",
        text1: "Thêm Category",
        text2: "Thành công!",
        position: "top",
        visibilityTime: 1000,
      });

      setNewCategory({ id: 0, name: "", image: "" });
      setSelectedImage(null);
      fetchCategories();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Xin lỗi",
        text2: "Lỗi khi thêm Category!",
        position: "top",
        visibilityTime: 1000,
      });
      // console.error("Lỗi khi thêm Category", error);
    }
  };
  const handleEditCategory = async () => {
    if (!editingCategory) return;

    try {
      const formData = new FormData();
      formData.append("name", editingCategory.name);

      if (editingImage) {
        const fileExtension = editingImage.split(".").pop();
        const fileName = editingImage.split("/").pop();
        formData.append("file", {
          uri: editingImage,
          name: fileName,
          type: `image/${fileExtension}`,
        } as any);
      }

      await axios.put(
        `http://172.20.10.2:8900/api/categories/${editingCategory.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      Toast.show({
        type: "success",
        text1: "Cập nhật Category",
        text2: "Thành công!",
        visibilityTime: 1000,
      });

      setEditingCategory(null);
      setEditingImage(null);
      fetchCategories(); // Cập nhật danh sách brand
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi cập nhật",
        text2: "Vui lòng điền đầy đủ thông tin!",
        visibilityTime: 1000,
      });
    }
  };
  const handleDeleteCategory = async (id: number) => {
    try {
      await axios.delete(`http://172.20.10.2:8900/api/categories/${id}`);
      fetchCategories();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Xin lỗi",
        text2: "Lỗi khi xoá Category!",
        position: "top",
        visibilityTime: 1000,
      });
      // console.error("Lỗi khi xóa category", error);
    }
  };

  const renderItem = ({ item }: { item: Category }) => (
    <View style={styles.categoryItem}>
      <Image
        source={{ uri: `http://172.20.10.2:8900/${item.image}` }}
        style={styles.categoryImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setEditingCategory(item); // Lưu brand được chọn vào trạng thái chỉnh sửa
            setEditingImage(null); // Đặt lại ảnh ban đầu
            setNewCategory({ id: 0, name: "", image: "" }); // Đặt lại form thêm
            setSelectedImage(null); // Đặt lại ảnh được chọn
          }}
        >
          <Text style={styles.buttonText}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteCategory(item.id)}
        >
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.vieww}>
        <View style={styles.headerContainer}>
          <Link href="/(dashboard)/Home">
            <Text style={styles.headerText}>
              <Text style={{ fontSize: 20 }}>{"⟨ "}</Text> Quay lại
            </Text>
          </Link>
        </View>

        <Text style={styles.title}>Quản lý danh mục</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {!editingCategory && (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Tên Category"
                value={newCategory.name}
                onChangeText={(text) =>
                  setNewCategory({ ...newCategory, name: text })
                }
              />
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadButtonText}>Chọn ảnh</Text>
              </TouchableOpacity>
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.previewImage}
                />
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={handleAddCategory}
              >
                <Text style={styles.buttonText}>Thêm danh mục</Text>
              </TouchableOpacity>
            </View>
          )}

          {editingCategory && (
            <View style={styles.editForm}>
              <Text style={styles.title}>Chỉnh sửa danh mục</Text>
              <TextInput
                style={styles.input}
                placeholder="Tên Category"
                value={editingCategory.name}
                onChangeText={(text) =>
                  setEditingCategory({ ...editingCategory, name: text })
                }
              />
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadButtonText}>Chọn hình</Text>
              </TouchableOpacity>
              {editingImage && (
                <Image
                  source={{ uri: editingImage }}
                  style={styles.previewImage}
                />
              )}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEditCategory}
                >
                  <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => setEditingCategory(null)}
                >
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <FlatList
            data={categories}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </ScrollView>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  vieww: { top: 30 },
  viewe: { marginBottom: 500 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#aaa",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  picker: {
    height: 40,
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 8,
    marginBottom: 50,
  },
  uploadButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  uploadButtonText: { color: "#fff", fontSize: 16 },
  previewImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
    alignSelf: "center",
  },
  categoryItem: {
    flexDirection: "row",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
  },
  categoryImage: { width: 110, height: 60, marginRight: 10 },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 16 },
  categoryName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#FFA500", // Màu cam cho nút sửa
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "red", // Màu đỏ cho nút xóa
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  editForm: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 10,
  },
  headerText: { fontSize: 16, fontWeight: "bold", color: "#333" },
});

export default CategoryManagement;
