import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  Button,
  Image,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import Toast from "react-native-toast-message";

interface Banner {
  id: number;
  name: string;
  image: string;
}

const BannerManagement = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [newBanner, setNewBanner] = useState<Banner>({
    id: 0,
    name: "",
    image: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Yêu cầu quyền truy cập vào thư viện ảnh
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Cần có quyền truy cập thư viện phương tiện!");
    }
  };

  useEffect(() => {
    requestPermission();
    fetchBanners();
  }, []);

  // Lấy danh sách banner từ backend
  const fetchBanners = async () => {
    try {
      const response = await axios.get("http://172.20.10.2:8900/api/banners");
      setBanners(
        response.data.sort(
          (a: { id: number }, b: { id: number }) => b.id - a.id
        )
      );
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Xin lỗi",
        text2: "Lỗi khi lấy danh sách banner!",
        position: "top",
        visibilityTime: 1000,
      });
      // console.error('Lỗi khi lấy danh sách banner', error);
    }
  };

  // Xử lý chọn ảnh từ thiết bị
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Đảm bảo rằng bạn đang sử dụng đúng MediaTypeOptions
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri); // Lưu URI ảnh được chọn
      setNewBanner({ ...newBanner, image: result.assets[0].uri }); // Cập nhật banner với ảnh mới
    }
  };

  // Xử lý upload ảnh lên server
  const uploadImage = async (
    imageUri: string,
    name: string
  ): Promise<string | null> => {
    const formData = new FormData();
    const fileExtension = imageUri.split(".").pop();
    const fileName = imageUri.split("/").pop();

    // Thêm tham số 'name' vào formData
    formData.append("name", name); // Thêm tham số 'name' vào formData
    formData.append("file", {
      uri: imageUri,
      name: fileName,
      type: `image/${fileExtension}`,
    } as any);

    try {
      const response = await axios.post(
        "http://172.20.10.2:8900/api/banners",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      Toast.show({
        type: "success",
        text1: "Thêm vào giỏ hàng",
        text2: "Upload hình thành công!",
        position: "top",
        visibilityTime: 1000,
      });
      setNewBanner({ id: 0, name: "", image: "" });
      setSelectedImage(null);
      fetchBanners();
      return response.data.image;
    } catch (error) {
      return null;
    }
  };

  // Xử lý thêm banner
  const handleAddBanner = async () => {
    try {
      const uploadedImageUrl = selectedImage
        ? await uploadImage(selectedImage, newBanner.name)
        : null;

      const newBannerData = { ...newBanner, image: uploadedImageUrl };

      await axios.post("http://172.20.10.2:8900/api/banners", newBannerData);

      setNewBanner({ id: 0, name: "", image: "" });
      setSelectedImage(null);
      fetchBanners();
    } catch (error) {}
  };

  // Xử lý xóa banner
  const handleDeleteBanner = async (id: number) => {
    try {
      await axios.delete(`http://172.20.10.2:8900/api/banners/${id}`);
      fetchBanners();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Xin lỗi",
        text2: "Lỗi khi xóa banner!",
        position: "top",
        visibilityTime: 1000,
      });
      // console.error('Lỗi khi xóa banner', error);
    }
  };

  const renderItem = ({ item }: { item: Banner }) => (
    <View style={styles.bannerItem}>
      <Image
        source={{ uri: `http://172.20.10.2:8900/${item.image}` }}
        style={styles.bannerImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.bannerName}>{item.name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteBanner(item.id)}
        >
          <Text style={styles.buttonText}>Xóa</Text>
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

      <Text style={styles.title}>Quản lý Banner</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Form để thêm banner */}
        <TextInput
          style={styles.input}
          placeholder="Tên Banner"
          value={newBanner.name}
          onChangeText={(text) => setNewBanner({ ...newBanner, name: text })}
        />
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>Chọn ảnh</Text>
        </TouchableOpacity>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        )}
        <TouchableOpacity style={styles.button} onPress={handleAddBanner}>
          <Text style={styles.buttonText}>Thêm Banner</Text>
        </TouchableOpacity>
        <FlatList
          data={banners}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : `defaultKey-${index}`
          }
          scrollEnabled={false}
        />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
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
  bannerItem: {
    flexDirection: "row",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  bannerImage: { width: 150, height: 60, marginRight: 10 },
  textContainer: { flex: 1 },
  bannerName: { fontSize: 12 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 30,
  },
  headerText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  button: {
    backgroundColor: "#007BFF", // Màu nền
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 16 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "red", // Màu đỏ cho nút xóa
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
});

export default BannerManagement;
