import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";
import Checkbox from "expo-checkbox"; // Sửa tên import nếu cần
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { ThemedView } from "@/components/ThemedView";
import { Link, router } from "expo-router";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import RNPickerSelect from "react-native-picker-select";

interface IProductForm {
  name: string;
  screen: string;
  display: string;
  price: number;
  salePrice?: number;
  totalStock: number;
  stock: number;
  description: string;
  screenTechnology: string;
  screenResolution: string;
  mainCamera: string;
  frontCamera: string;
  chipset: string;
  ram: string;
  internalMemory: string;
  operatingSystem: string;
  battery: string;
  weight: string;
  colors: string[];
  categoryId: string;
  brandId: string;
}

interface Category {
  id: number;
  name: string;
  image: string;
  brands?: Brand[];
}
interface Brand {
  id: number;
  name: string;
  image: string;
}

const CustomTextField = ({
  name,
  control,
  placeholder,
  errors,
  isRequired = false,
  isNumber = false,
}: {
  name: string;
  control: any;
  placeholder: string;
  errors: any;
  isRequired?: boolean; // Thêm tham số để kiểm tra bắt buộc
  isNumber?: boolean; // Kiểm tra nhập liệu số
}) => (
  <View style={{ marginBottom: 15 }}>
    <Controller
      name={name}
      control={control}
      defaultValue={isRequired ? "" : "Đang cập nhật"}
      rules={{
        required: isRequired ? `${placeholder} là bắt buộc` : false,
        pattern: isNumber
          ? {
              value: /^[0-9]+(\.[0-9]+)?$/, // Kiểm tra xem giá trị có phải là số hay không
              message: `${placeholder} phải là số hợp lệ`,
            }
          : undefined,
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          placeholder={placeholder}
          onBlur={onBlur}
          onChangeText={(text) =>
            onChange(text === "" ? "Đang cập nhật" : text)
          }
          value={value === "Đang cập nhật" ? "" : value}
          style={{
            borderWidth: 1,
            padding: 10,
            borderColor: errors[name] ? "red" : "#ccc", // Màu viền khi có lỗi
          }}
        />
      )}
    />
    {errors[name] && (
      <Text style={{ color: "red", marginTop: 5 }}>{errors[name].message}</Text>
    )}
  </View>
);

const ProductForm = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IProductForm>();
  const [colors, setColors] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<IProductForm>>({});
  const [imageError, setImageError] = useState<string | null>(null);

  const onSubmit = async (data: IProductForm) => {
    if (selectedImages.length === 0) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng chọn ít nhất một hình ảnh!",
        position: "top",
        visibilityTime: 1000,
      });
      return;
    }
    if (Number(data.salePrice) >= Number(data.price)) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Giá sale phải nhỏ hơn giá sản phẩm!",
        position: "top",
        visibilityTime: 1000,
      });
      return;
    }

    if (Number(data.stock) > Number(data.totalStock)) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Số lượng bán phải nhỏ hơn hoặc bằng số lượng trong kho!",
        position: "top",
        visibilityTime: 1000,
      });
      return;
    }
    const formData = new FormData();

    // Append dữ liệu sản phẩm
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof IProductForm];
      if (value !== undefined && value !== null) {
        // Chuyển đổi giá trị sang chuỗi nếu cần thiết
        if (typeof value === "number" || Array.isArray(value)) {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as string);
        }
      }
    });

    if (colors.length > 0) {
      colors.forEach((color) => {
        formData.append("colors", color);
      });
    } else {
      formData.append("colors", "");
    }
    if (newProduct.categoryId) {
      formData.append("categoryId", newProduct.categoryId);
    } else {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng chọn danh mục!",
        position: "top",
        visibilityTime: 1000,
      });
      return;
    }
    if (newProduct.brandId) {
      formData.append("brandId", newProduct.brandId);
    } else {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng chọn nhà cung cấp!",
        position: "top",
        visibilityTime: 1000,
      });
      return;
    }

    // Append hình ảnh
    selectedImages.forEach((image, index) => {
      const uriParts = image.uri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("files", {
        uri: image.uri,
        name: `image_${index}.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    });

    try {
      const response = await axios.post(
        "http://172.20.10.2:8900/api/product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Sản phẩm đã được thêm!",
        position: "top",
        visibilityTime: 1000,
      });
      router.push("/(dashboard)/Product");
      // console.log('Sản phẩm đã được thêm:', response.data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Xin lỗi",
        text2: "Lỗi khi thêm sản phẩm!",
        position: "top",
        visibilityTime: 1000,
      });
      // console.error('Lỗi khi thêm sản phẩm:', error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setSelectedImages((prev) => [...prev, ...result.assets]);
      setImageError(null); // Xóa lỗi nếu người dùng chọn hình ảnh
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
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

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <Link href="/(dashboard)/Product">
          <Text style={styles.headerText}>
            <Text style={{ fontSize: 20 }}>{"⟨ "}</Text> Quay lại
          </Text>
        </Link>
      </View>
      <Text style={styles.title}>Thêm sản phẩm</Text>
      <RNPickerSelect
        onValueChange={(value) => {
          const selectedCategory = categories.find(
            (category) => category.id.toString() === value
          );
          if (selectedCategory) {
            setFilteredBrands(selectedCategory.brands || []); // Cập nhật danh sách brands
          } else {
            setFilteredBrands([]); // Không có danh mục nào được chọn
          }
          setNewProduct((prev) => ({ ...prev, categoryId: value }));
        }}
        items={categories.map((category) => ({
          label: category.name,
          value: category.id.toString(),
        }))}
        placeholder={{ label: "Chọn danh mục" }}
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
            <Text style={{ color: "#FFFF33", fontSize: 16 }}> Cập nhật ▼</Text> // Icon mũi tên trắng
          );
        }}
      />
      <RNPickerSelect
        onValueChange={(value) =>
          setNewProduct((prev) => ({ ...prev, brandId: value }))
        }
        items={filteredBrands.map((brand) => ({
          label: brand.name,
          value: brand.id.toString(),
        }))}
        placeholder={{ label: "Chọn nhà cung cấp" }}
        style={{
          inputAndroid: {
            textAlign: "left", // Căn giữa chữ trong khung
            height: 40,
            backgroundColor: "#007BFF", // Nền xanh
            color: "#fff", // Chữ màu trắng
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginTop: 10,
          },
          inputIOS: {
            textAlign: "left", // Căn giữa chữ trong khung
            height: 40,
            backgroundColor: "#007BFF", // Nền xanh
            color: "#fff", // Chữ màu trắng
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginTop: 10,
          },
          iconContainer: {
            top: 22, // Vị trí icon dropdown
            right: 12,
          },
        }}
        Icon={() => {
          return (
            <Text style={{ color: "#FFFF33", fontSize: 16 }}> Cập nhật ▼</Text> // Icon mũi tên trắng
          );
        }}
      />
      <ScrollView
        style={{ padding: 20 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <CustomTextField
          name="name"
          control={control}
          placeholder="Tên sản phẩm (bắt buộc)"
          errors={errors}
          isRequired={true}
        />
        <CustomTextField
          name="screen"
          control={control}
          placeholder="Kích Màn hình (inch)"
          errors={errors}
        />
        <CustomTextField
          name="display"
          control={control}
          placeholder="Loại màn hình (lcd & oled)"
          errors={errors}
        />
        <CustomTextField
          name="price"
          control={control}
          placeholder="Giá sản phẩm (bắt buộc)"
          errors={errors}
          isRequired={true}
          isNumber={true}
        />
        <CustomTextField
          name="salePrice"
          control={control}
          placeholder="Giá sale sản phẩm (bắt buộc)"
          errors={errors}
          isRequired={true}
          isNumber={true}
        />
        <CustomTextField
          name="totalStock"
          control={control}
          placeholder="Số lượng sản phẩm trong kho (bắt buộc)"
          errors={errors}
          isRequired={true}
          isNumber={true}
        />
        <CustomTextField
          name="stock"
          control={control}
          placeholder="Số lượng sản phẩm bán (bắt buộc)"
          errors={errors}
          isRequired={true}
          isNumber={true}
        />
        <CustomTextField
          name="description"
          control={control}
          placeholder="Mô tả sản phẩm"
          errors={errors}
        />
        {/* Tính năng màn hình */}
        <CustomTextField
          name="screenTechnology"
          control={control}
          placeholder="Tính năng màn hình"
          errors={errors}
        />

        {/* Độ phân giải màn hình */}
        <CustomTextField
          name="screenResolution"
          control={control}
          placeholder="Độ phân giải màn hình"
          errors={errors}
        />

        {/* Camera chính */}
        <CustomTextField
          name="mainCamera"
          control={control}
          placeholder="Camera chính"
          errors={errors}
        />

        {/* Camera trước */}
        <CustomTextField
          name="frontCamera"
          control={control}
          placeholder="Camera trước"
          errors={errors}
        />
        {/* Chipset */}
        <CustomTextField
          name="chipset"
          control={control}
          placeholder="Chipset"
          errors={errors}
        />

        {/* RAM */}
        <CustomTextField
          name="ram"
          control={control}
          placeholder="RAM"
          errors={errors}
        />

        {/* Bộ nhớ trong */}
        <CustomTextField
          name="internalMemory"
          control={control}
          placeholder="Bộ nhớ trong"
          errors={errors}
        />

        {/* Hệ điều hành */}
        <CustomTextField
          name="operatingSystem"
          control={control}
          placeholder="Hệ điều hành"
          errors={errors}
        />

        {/* Dung lượng pin */}
        <CustomTextField
          name="battery"
          control={control}
          placeholder="Dung lượng pin"
          errors={errors}
        />

        {/* Trọng lượng */}
        <CustomTextField
          name="weight"
          control={control}
          placeholder="Trọng lượng"
          errors={errors}
        />
        <View style={styles.checkbox}>
          <Text style={styles.titlecheckbox}>
            Chọn ít nhất 1 màu cho sản phẩm (bắt buộc)
          </Text>
          {[
            "black",
            "white",
            "red",
            "grey",
            "purple",
            "yellow",
            "gray",
            "pink",
            "green",
            "blue",
            "silver",
            "brown",
          ].map((color) => (
            <View key={color} style={styles.checkboxContainer}>
              <Switch
                value={colors.includes(color)}
                onValueChange={() =>
                  setColors((prev) =>
                    prev.includes(color)
                      ? prev.filter((c) => c !== color)
                      : [...prev, color]
                  )
                }
                trackColor={{ true: "#007AFF", false: "#ccc" }}
                thumbColor={colors.includes(color) ? "#007AFF" : color}
              />
              <Text style={styles.colorLabel}>{color}</Text>
            </View>
          ))}
        </View>

        {/* Các trường khác tương tự */}

        <Text style={styles.titleimage}>
          Đã chọn {selectedImages.length} hình ảnh & vui lòng chọn hình ảnh theo
          thứ tự màu đã chọn
        </Text>

        <View style={styles.actionContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.updateButton}>
            <Text style={styles.actionText}>Chọn hình ảnh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.updateButton}
          >
            <Text style={styles.actionText}>Lưu sản phẩm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
  },
  errorText: {
    color: "red",
  },
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
  checkbox: {
    padding: 16,
    backgroundColor: "#fff",
  },
  actionText: { color: "#fff", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  updateButton: { backgroundColor: "#4caf50", padding: 14, borderRadius: 5 },
  titlecheckbox: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  titleimage: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  colorLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default ProductForm;
