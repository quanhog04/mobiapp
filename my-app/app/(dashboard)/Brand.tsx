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
import RNPickerSelect from "react-native-picker-select";
import Toast from "react-native-toast-message";
import { Link, router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";

interface Brand {
  id: number;
  name: string;
  image: string;
  categoryId: string;
}

interface Category {
  id: number;
  name: string;
  image: string;
}

const BrandManagement = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newBrand, setNewBrand] = useState<Brand>({
    id: 0,
    name: "",
    image: "",
    categoryId: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null); // Brand đang được chỉnh sửa
  const [editingImage, setEditingImage] = useState<string | null>(null); // Ảnh mới nếu có

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  // Lấy danh sách brand từ backend
  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://172.20.10.2:8900/api/brands");
      setBrands(
        response.data.sort(
          (a: { id: number }, b: { id: number }) => b.id - a.id
        )
      );
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Xin lỗi",
        text2: "Lỗi khi lấy danh sách brand!",
        position: "top",
        visibilityTime: 1000,
      });
      // console.error("Lỗi khi lấy danh sách brand", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://172.20.10.2:8900/api/categories"
      );

      setCategories(response.data);
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
      if (editingBrand) {
        setEditingImage(result.assets[0].uri); // Lưu ảnh mới vào trạng thái chỉnh sửa
      } else {
        setSelectedImage(result.assets[0].uri); // Lưu ảnh vào trạng thái thêm mới
        setNewBrand({ ...newBrand, image: result.assets[0].uri });
      }
    }
  };

  // Xử lý thêm brand
  const handleAddBrand = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newBrand.name);
      formData.append("categoryId", newBrand.categoryId);

      if (selectedImage) {
        const fileExtension = selectedImage.split(".").pop();
        const fileName = selectedImage.split("/").pop();
        formData.append("file", {
          uri: selectedImage,
          name: fileName,
          type: `image/${fileExtension}`,
        } as any);
      }

      await axios.post("http://172.20.10.2:8900/api/brands", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Toast.show({
        type: "success",
        text1: "Thêm Brand",
        text2: "Thành công!",
        position: "top",
        visibilityTime: 1000,
      });
      setNewBrand({ ...newBrand, name: "", image: "", categoryId: "" });
      setSelectedImage(null);
      fetchBrands();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Xin lỗi",
        text2: "Lỗi khi thêm brand!",
        position: "top",
        visibilityTime: 1000,
      });
      // console.error("Lỗi khi thêm brand", error);
    }
  };
  const handleEditBrand = async () => {
    if (!editingBrand) return;

    try {
      const formData = new FormData();
      formData.append("name", editingBrand.name);
      formData.append("categoryId", editingBrand.categoryId);

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
        `http://172.20.10.2:8900/api/brands/${editingBrand.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      Toast.show({
        type: "success",
        text1: "Cập nhật Brand",
        text2: "Thành công!",
        visibilityTime: 1000,
      });

      setEditingBrand(null);
      setEditingImage(null);
      fetchBrands(); // Cập nhật danh sách brand
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi cập nhật",
        text2: "Vui lòng điền đầy đủ thông tin!",
        visibilityTime: 1000,
      });
    }
  };

  const renderItem = ({ item }: { item: Brand }) => (
    <View style={styles.brandItem}>
      <Image
        source={{ uri: `http://172.20.10.2:8900/${item.image}` }}
        style={styles.brandImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.brandName}>{item.name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setEditingBrand(item); // Lưu brand được chọn vào trạng thái chỉnh sửa
            setEditingImage(null); // Đặt lại ảnh ban đầu
            setNewBrand({ id: 0, name: "", image: "", categoryId: "" }); // Đặt lại form thêm
            setSelectedImage(null); // Đặt lại ảnh được chọn
          }}
        >
          <Text style={styles.buttonText}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteBrand(item.id)}
        >
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleDeleteBrand = async (id: number) => {
    try {
      await axios.delete(`http://172.20.10.2:8900/api/brands/${id}`);
      fetchBrands();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Xin lỗi",
        text2: "Lỗi khi xoá brand!",
        position: "top",
        visibilityTime: 1000,
      });
      // console.error("Lỗi khi xóa brand", error);
    }
  };

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

        <Text style={styles.title}>Quản lý nhà cung cấp</Text>
        {editingBrand && (
          <View style={styles.editForm}>
            <Text style={styles.title}>Chỉnh sửa nhà cung cấp</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên Brand"
              value={editingBrand.name}
              onChangeText={(text) =>
                setEditingBrand({ ...editingBrand, name: text })
              }
            />
            <RNPickerSelect
              onValueChange={(value) =>
                setEditingBrand({ ...editingBrand, categoryId: value })
              }
              items={categories.map((category) => ({
                label: category.name,
                value: category.id.toString(),
              }))}
              placeholder={{
                label:
                  categories.find(
                    (cat) => cat.id.toString() === editingBrand?.categoryId
                  )?.name || "Chọn danh mục",
              }}
              value={editingBrand.categoryId}
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
                style={styles.editButtonn}
                onPress={handleEditBrand}
              >
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButtonn}
                onPress={() => setEditingBrand(null)}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 400 }}
        >
          {!editingBrand && (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Tên Brand"
                value={newBrand.name}
                onChangeText={(text) =>
                  setNewBrand({ ...newBrand, name: text })
                }
              />
              <RNPickerSelect
                onValueChange={(value) =>
                  setNewBrand({ ...newBrand, categoryId: value })
                }
                value={newBrand.categoryId}
                items={categories.map((category) => ({
                  label: category.name,
                  value: category.id.toString(),
                }))}
                placeholder={{ label: "Chọn danh mục", value: null }}
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
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadButtonText}>Chọn ảnh</Text>
              </TouchableOpacity>
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.previewImage}
                />
              )}
              <TouchableOpacity style={styles.button} onPress={handleAddBrand}>
                <Text style={styles.buttonText}>Thêm nhà cung cấp</Text>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={brands}
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
  viewe: {},
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
    marginTop: 10,
  },
  uploadButtonText: { color: "#fff", fontSize: 16 },
  previewImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
    alignSelf: "center",
  },
  brandItem: {
    flexDirection: "row",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
  },
  brandImage: { width: 110, height: 60, marginRight: 10 },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 16 },
  brandName: {
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
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 10,
  },
  headerText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  editButtonn: {
    backgroundColor: "#FFA500", // Màu cam cho nút sửa
    flex: 1, // Chia đều không gian với detailButton
    marginRight: 5, // Tạo khoảng cách với detailButton
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonn: {
    backgroundColor: "red", // Màu đỏ cho nút xóa
    flex: 1, // Chia đều không gian với deleteButton
    marginLeft: 5, // Tạo khoảng cách với deleteButton
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default BrandManagement;
