-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th1 14, 2025 lúc 10:04 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `abc`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `banners`
--

CREATE TABLE `banners` (
  `id` bigint(20) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `banners`
--

INSERT INTO `banners` (`id`, `image`, `name`) VALUES
(1, 'banner1.png', 'slide product 1'),
(2, 'banner2.png', 'slide product 2'),
(7, 'banner3.png', 'banner3.png'),
(8, 'banner4.png', 'banner4.png'),
(9, 'banner5.png', 'banner5.png'),
(10, 'banner6.png', 'banner6.png');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `brands`
--

CREATE TABLE `brands` (
  `id` bigint(20) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `brands`
--

INSERT INTO `brands` (`id`, `image`, `name`, `category_id`) VALUES
(1, 'B70688C7-4832-48B4-B918-1B884ACCC20D.jpg', 'Apple', 1),
(2, '4FC866D2-0B4B-4A14-8699-B37BC1787836.jpg', 'Samsung', 1),
(3, 'D324C378-6DFD-42A2-A058-99E27CD51F42.jpg', 'Xiaomi', 1),
(4, 'C2B30B1A-F6F4-40B2-85D4-593A2E63D621.jpg', 'Oppo', 1),
(5, 'B4843669-CA43-4778-AB00-B47DB6CA35D7.jpg', 'Vivo', 1),
(6, '0D45A787-5178-4514-A141-50C4C5B3EDA8.jpg', 'Dell', 2),
(7, '3B2F82FE-C87D-4886-AB96-E9CF8A69BB85.jpg', 'HP', 2),
(8, '8E5799F4-18EA-44D9-975C-75C797011531.jpg', 'Asus', 2),
(9, '31AF62AB-278E-4E76-91DB-2BB3C24680A6.jpg', 'Acer', 2),
(10, 'BD7926F2-0D8B-4065-9AAE-0FA9C284A6FF.jpg', 'Apple', 4),
(16, '9CAFAF5D-0D34-4E2D-8F67-8E752DF204AD.jpg', 'Sony', 1),
(17, 'F23B2554-47D3-41BC-BCD9-291243EAA1C2.jpg', 'Anker', 4),
(19, 'A4E7131B-455C-4586-8089-E2721CA688BF.jpg', 'Apple', 3),
(20, '20EF2749-A36F-425E-A6DB-6859A157C2D4.jpg', 'Huawei', 3),
(21, '3C7BD6BC-BB57-4AC3-8B57-183DD3DCE104.jpg', 'Samsung', 3),
(22, '6E8EA13D-C532-4FF9-B3B8-547ACF744D07.jpg', 'Xiaomi', 3),
(23, '29107157-7BB8-45C0-9BB9-0101F37370D7.jpg', 'Amazfit', 3),
(24, 'D44077CD-3B4D-4001-901E-18AE9428405B.jpg', 'Lenovo', 2),
(25, 'B1CF98D9-C23E-43D8-A502-CF37E540DD0D.jpg', 'Oneplus', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) NOT NULL,
  `price` double NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `selected_color` varchar(255) DEFAULT NULL,
  `selected_image_path` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cart_items`
--

INSERT INTO `cart_items` (`id`, `price`, `product_id`, `product_name`, `quantity`, `selected_color`, `selected_image_path`, `user_id`, `stock`) VALUES
(94, 2399, 4, 'Apple MacBook Air M2 2022', 1, 'grey', 'macbook_air_m2_2_3.webp', 17, 19);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `image`, `name`) VALUES
(1, 'mobile.png', 'Điện thoại'),
(2, 'laptop.png', 'Lap top'),
(3, 'wach.png', 'Đồng hồ'),
(4, 'phukien.png', 'Phụ kiện');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `order_date` datetime(6) NOT NULL,
  `total_amount` double NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `status` enum('CONFIRMED','DELIVERED_SUCCESSFULLY','DELIVERY_FAILED','ORDER_SUCCESS','PENDING_CONFIRMATION','PREPARING','SHIPPING') NOT NULL,
  `order_code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `order_date`, `total_amount`, `updated_at`, `user_id`, `address`, `status`, `order_code`) VALUES
(8, '2024-12-02 13:30:00.000000', 122035000, '2024-12-08 23:11:15.000000', 9, 'Thủ đức', 'CONFIRMED', NULL),
(9, '2024-12-04 13:30:25.000000', 1365000, '2024-12-09 22:03:21.000000', 9, 'Thủ đức', 'DELIVERED_SUCCESSFULLY', NULL),
(11, '2024-12-08 22:38:00.000000', 198551799, '2024-12-08 23:11:24.000000', 9, 'Thủ đức', 'DELIVERED_SUCCESSFULLY', NULL),
(12, '2024-12-09 22:39:58.000000', 26065000, '2024-12-09 20:49:34.000000', 9, 'Thủ đức', 'DELIVERY_FAILED', NULL),
(13, '2024-12-09 20:40:06.000000', 3065000, '2024-12-09 21:40:15.000000', 11, 'Bình dương', 'ORDER_SUCCESS', NULL),
(14, '2024-12-09 20:41:44.000000', 15365000, '2024-12-09 20:50:05.000000', 11, 'Bình dương', 'PENDING_CONFIRMATION', NULL),
(15, '2024-12-09 20:54:42.000000', 19955000, '2024-12-09 21:40:20.000000', 12, 'Bình thạnh', 'ORDER_SUCCESS', NULL),
(16, '2024-12-09 20:59:00.000000', 44555000, '2024-12-09 22:03:16.000000', 11, 'Bình dương', 'DELIVERED_SUCCESSFULLY', NULL),
(17, '2024-12-09 20:59:34.000000', 21565000, '2024-12-09 20:59:34.000000', 11, 'Bình dương', 'PENDING_CONFIRMATION', NULL),
(20, '2024-12-09 21:33:58.000000', 144940000, '2024-12-28 18:50:06.000000', 14, 'Thủ đức, tp hcm', 'PREPARING', NULL),
(21, '2024-12-09 21:35:36.000000', 112835000, '2024-12-09 21:35:36.000000', 14, 'Thủ đức, tp hcm', 'PENDING_CONFIRMATION', NULL),
(24, '2024-12-17 16:44:09.000000', 28055000, '2024-12-17 16:44:09.000000', 9, 'Thủ đức', 'DELIVERED_SUCCESSFULLY', NULL),
(25, '2024-12-24 09:34:09.000000', 134690030, '2024-12-24 09:34:09.000000', 14, 'Thủ đức, tp hcm', 'PENDING_CONFIRMATION', NULL),
(28, '2024-12-27 18:26:37.000000', 6340, '2024-12-27 18:26:37.000000', 9, 'Thủ đức', 'PENDING_CONFIRMATION', NULL),
(29, '2024-12-27 21:56:12.000000', 13140, '2024-12-28 18:59:59.000000', 9, 'Thủ đức', 'PREPARING', NULL),
(30, '2024-12-27 23:07:50.000000', 5319, '2024-12-28 20:36:40.000000', 9, 'Thủ đức', 'CONFIRMED', NULL),
(31, '2024-12-28 21:31:48.000000', 7629, '2024-12-28 21:33:05.000000', 9, 'Thủ đức', 'DELIVERED_SUCCESSFULLY', NULL),
(32, '2024-12-29 11:01:21.000000', 4640, '2024-12-29 11:01:21.000000', 9, 'Thủ đức', 'PENDING_CONFIRMATION', NULL),
(33, '2024-12-30 21:25:55.000000', 3339, '2024-12-30 21:25:55.000000', 9, 'Thủ đức', 'PENDING_CONFIRMATION', NULL),
(34, '2024-12-30 22:02:06.000000', 10739, '2024-12-30 22:02:06.000000', 9, 'Thủ đức', 'PENDING_CONFIRMATION', NULL),
(35, '2024-12-30 22:03:21.000000', 6548, '2024-12-30 22:33:24.000000', 9, 'Thủ đức', 'DELIVERED_SUCCESSFULLY', 'ORD1735570956283'),
(36, '2024-12-31 11:26:41.000000', 2449, '2024-12-31 11:27:41.000000', 9, 'Thủ đức', 'DELIVERED_SUCCESSFULLY', 'ORD1735619163293'),
(37, '2025-01-14 08:02:48.000000', 5498, '2025-01-14 08:02:48.000000', 18, 'Nhsns', 'PENDING_CONFIRMATION', 'ORD1736816504479');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL,
  `price` double NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `selected_color` varchar(255) DEFAULT NULL,
  `order_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `price`, `product_id`, `product_name`, `quantity`, `selected_color`, `order_id`) VALUES
(13, 25990000, 2, 'Samsung Galaxy S24 Ultra', 2, 'black', 8),
(14, 34990000, 5, 'iPhone 16 Pro Max', 2, 'black', 8),
(15, 1290000, 6, 'Đồng hồ thông minh Xiaomi Redmi Watch 5 Lite', 1, 'black', 9),
(18, 25990000, 2, 'Samsung Galaxy S24 Ultra', 2, 'black', 11),
(19, 21490000, 3, 'iPhone 16', 1, 'black', 11),
(20, 23990000, 4, 'Apple MacBook Air M2 2022', 1, 'grey', 11),
(21, 34990000, 5, 'iPhone 16 Pro Max', 1, 'black', 11),
(22, 1290000, 6, 'Đồng hồ thông minh Xiaomi Redmi Watch 5 Lite', 1, 'black', 11),
(23, 5360000, 7, 'Apple Watch SE 2 2023 40mm', 1, 'black', 11),
(24, 12390000, 8, 'Laptop ASUS VivoBook Go 14', 1, 'silver', 11),
(25, 5590000, 9, 'Tai nghe Bluetooth Apple AirPods Pro 2', 1, 'white', 11),
(26, 490000, 10, 'Bàn phím cơ E-DRA EK375', 1, 'blue', 11),
(27, 17990000, 11, 'Laptop Dell Inspiron 15 3520 6HD73', 1, 'black', 11),
(28, 22990000, 12, 'Laptop Gaming Acer Nitro 5 Tiger', 1, 'black', 11),
(29, 1244, 14, 'Hdhdhs', 1, '[\"Black\"', 11),
(30, 555, 15, 'Gccghh', 1, 'black', 11),
(31, 25990000, 2, 'Samsung Galaxy S24 Ultra', 1, 'black', 12),
(32, 2990000, 23, 'Xiaomi Redmi 14C', 1, 'blue', 13),
(33, 12390000, 8, 'Laptop ASUS VivoBook Go 14', 1, 'silver', 14),
(34, 2900000, 28, 'Sạc Apple 140W USB-C', 1, NULL, 14),
(35, 18990000, 24, 'Laptop Dell Latitude 3540', 1, NULL, 15),
(36, 890000, 27, 'Vòng đeo tay thông minh Xiaomi Mi Band 9', 1, 'gray', 15),
(37, 490000, 10, 'Bàn phím cơ E-DRA EK375', 1, 'red', 16),
(38, 43990000, 22, 'Samsung Galaxy Z Fold6', 1, 'pink', 16),
(39, 21490000, 3, 'iPhone 16', 1, 'green', 17),
(45, 21490000, 3, 'iPhone 16', 4, 'pink', 20),
(46, 23990000, 4, 'Apple MacBook Air M2 2022', 1, 'white', 20),
(47, 34990000, 5, 'iPhone 16 Pro Max', 1, 'brown', 20),
(48, 21490000, 3, 'iPhone 16', 3, 'green', 21),
(49, 21490000, 3, 'iPhone 16', 1, 'pink', 21),
(50, 5360000, 7, 'Apple Watch SE 2 2023 40mm', 5, 'silver', 21),
(56, 13990000, 1, 'Xiaomi 14T', 2, 'black', 24),
(57, 10, 28, 'Sạc Apple 140W USB-C', 3, '', 25),
(58, 890000, 27, 'Vòng đeo tay thông minh Xiaomi Mi Band 9', 1, 'black', 25),
(59, 890000, 27, 'Vòng đeo tay thông minh Xiaomi Mi Band 9', 2, 'gray', 25),
(60, 43990000, 22, 'Samsung Galaxy Z Fold6', 1, 'pink', 25),
(61, 43990000, 22, 'Samsung Galaxy Z Fold6', 2, 'gray', 25),
(64, 5590, 9, 'Tai nghe Bluetooth Apple AirPods Pro 2', 1, 'white', 28),
(65, 12390, 8, 'Laptop ASUS VivoBook Go 14', 1, 'silver', 29),
(66, 2149, 3, 'iPhone 16', 1, NULL, 30),
(67, 1290, 6, 'Đồng hồ thông minh Xiaomi Redmi Watch 5 Lite', 1, NULL, 30),
(68, 490, 10, 'Bàn phím cơ E-DRA EK375', 1, NULL, 30),
(69, 890, 27, 'Vòng đeo tay thông minh Xiaomi Mi Band 9', 1, NULL, 30),
(70, 1290, 6, 'Đồng hồ thông minh Xiaomi Redmi Watch 5 Lite', 1, 'black', 31),
(71, 2599, 2, 'Samsung Galaxy S24 Ultra', 1, 'black', 31),
(72, 2990, 23, 'Xiaomi Redmi 14C', 1, 'blue', 31),
(73, 3890, 21, 'Tai nghe Bluetooth Apple AirPods 3 MagSafe', 1, NULL, 32),
(74, 890, 27, 'Vòng đeo tay thông minh Xiaomi Mi Band 9', 1, NULL, 33),
(75, 1699, 26, 'Laptop Acer Gaming Aspire 7 A715-76-53PJ', 1, NULL, 33),
(76, 4399, 22, 'Samsung Galaxy Z Fold6', 1, 'blue', 34),
(77, 5590, 9, 'Tai nghe Bluetooth Apple AirPods Pro 2', 1, 'white', 34),
(78, 2299, 12, 'Laptop Gaming Acer Nitro 5 Tiger', 1, NULL, 35),
(79, 3499, 5, 'iPhone 16 Pro Max', 1, NULL, 35),
(80, 1699, 26, 'Laptop Acer Gaming Aspire 7 A715-76-53PJ', 1, NULL, 36),
(81, 2599, 2, 'Samsung Galaxy S24 Ultra', 1, NULL, 37),
(82, 2149, 3, 'iPhone 16', 1, NULL, 37);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL,
  `battery` varchar(255) DEFAULT NULL,
  `chipset` varchar(255) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `display` varchar(255) DEFAULT NULL,
  `front_camera` varchar(255) DEFAULT NULL,
  `internal_memory` varchar(255) DEFAULT NULL,
  `main_camera` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `operating_system` varchar(255) DEFAULT NULL,
  `price` double NOT NULL,
  `ram` varchar(255) DEFAULT NULL,
  `sale_price` double NOT NULL,
  `screen` varchar(255) DEFAULT NULL,
  `screen_resolution` varchar(255) DEFAULT NULL,
  `screen_technology` varchar(255) DEFAULT NULL,
  `stock` bigint(20) DEFAULT NULL,
  `total_stock` bigint(20) DEFAULT NULL,
  `weight` varchar(255) DEFAULT NULL,
  `brand_id` bigint(20) DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `created_date` datetime(6) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `battery`, `chipset`, `description`, `display`, `front_camera`, `internal_memory`, `main_camera`, `name`, `operating_system`, `price`, `ram`, `sale_price`, `screen`, `screen_resolution`, `screen_technology`, `stock`, `total_stock`, `weight`, `brand_id`, `category_id`, `created_date`, `status`) VALUES
(1, '5000 mAh', 'MediaTek Dimensity 8300-Ultra', 'Xiaomi 14T 5G ra mắt trong tháng 10 đã là dấu mốc đánh dấu thành công sự hợp tác của Xiaomi cùng Leica - thương hiệu máy ảnh nổi tiếng của Đức. Trong đó, dòng điện thoại mới  này còn mang nhiều ưu điểm vượt trội như giá rẻ hơn, trang bị thêm nhiều tính năng AI, chips mạnh hơn và cải tiến nhiều so với thế hệ tiền nhiệm. Cùng khám phá chi tiết ngay nhé!', 'AMOLED', '32MPƒ/2,0 FOV 80,8˚ Chế độ ban đêm HDR Tính năng chụp ảnh bằng lòng bàn tay', '512 GB', 'Camera chính: 50MP, 23mm, ƒ/1 7 Cảm biến hình ảnh IMX906 của Sony 2 0 m Super Pixel Máy ảnh tele: 50MP, 50mm, ƒ/1 9 Máy ảnh góc siêu rộng: 12MP, 15mm, ƒ/2 2', 'Xiaomi 14T', 'androi', 1399, '12 GB', 0, '6.67 inches', '1220 x 2712 pixels', '144Hz, 1,5K CrystalRes AMOLED, 446 ppi, 4000 nits, Độ sâu màu 12 bit, Làm mờ PWM lên đến 3840 HDR10+, Dolby Vision', 0, 158, '195g', 3, 1, '2024-12-02 21:44:45.000000', 1),
(2, '5,000mAh', 'Snapdragon 8 Gen 3 For Galaxy', 'Samsung S24 Ultra là siêu phẩm smartphone đỉnh cao mở đầu năm 2024 đến từ nhà Samsung với chip Snapdragon 8 Gen 3 For Galaxy mạnh mẽ, công nghệ tương lai Galaxy AI cùng khung viền Titan đẳng cấp hứa hẹn sẽ mang tới nhiều sự thay đổi lớn về mặt thiết kế và cấu hình. SS Galaxy S24 bản Ultra sở hữu màn hình 6.8 inch Dynamic AMOLED 2X tần số quét 120Hz. Máy cũng sở hữu camera chính 200MP, camera zoom quang học 50MP, camera tele 10MP và camera góc siêu rộng 12MP.', 'Dynamic AMOLED 2X', '12 MP, f/2.2', '256 GB', 'Camera chính: 200MP, Laser AF, OIS Camera: 50MP, PDAF, OIS, zoom quang học 5x Camera tele: 10MP Camera góc siêu rộng: 12 MP, f/2.2, 13mm, 120˚', 'Samsung Galaxy S24 Ultra', 'Android 14, One UI 6.1', 2599, '12 GB', 0, '6.8 inches', '1440 x 3120 pixels', 'Độ sáng cao nhất 2,600 nits, 120Hz, Corning® Gorilla® Armor®, 16 triệu màu', 238, 351, '232g', 2, 1, '2024-12-02 21:45:15.000000', 1),
(3, '3.561mAh', 'Apple A18', 'Điện thoại iPhone 16 bản thường 128GB sở hữu thiết kế khung nhôm, mặt lưng kính pha màu cùng với 5 màu sắc bắt mắt để lựa chọn. Máy với trọng lượng 170g cùng kích thước màn hình 6.1 inch Super Retina XDR', 'Super Retina XDR OLED', '12MP, ƒ/1.9, Tự động lấy nét theo pha Focus Pixels', '128 GB', 'Camera chính: 48MP, f/1.6, 26mm, Focus Pixels 100%, hỗ trợ ảnh có độ phân giải siêu cao Camera góc siêu rộng: 12MP, ƒ/2.2, 13 mm', 'iPhone 16', 'ios 18', 2249, '8 GB', 2149, '6.1 inches', '2556 x 1179 pixels', 'Dynamic Island Màn hình HDR True Tone Dải màu rộng (P3) Haptic Touch Tỷ lệ tương phản 2.000.000:1', 425, 578, '170 g', 1, 1, '2024-12-02 21:45:19.000000', 1),
(4, '52,6 Wh', 'Apple M2', 'Macbook Air M2 2022 với thiết kế sang trọng, vẻ ngoài siêu mỏng đầy lịch lãm. Mẫu Macbook Air mới với những nâng cấp về thiết kế và cấu hình cùng giá bán phải chăng, đây sẽ là một thiết bị lý tưởng cho công việc và giải trí.', 'Liquid Retina Display', 'Không có', '256GB', 'Không có', 'Apple MacBook Air M2 2022', 'MacOS', 2499, '8GB', 2399, '13.6 inches', '2560 x 1664 pixels', 'Không có', 17, 57, '1.27 kg', 1, 2, '2024-12-02 21:45:23.000000', 1),
(5, '4.676 mAh', 'Apple A18 Pro', 'iPhone 16 Pro Max có thiết kế với khung viền vuông sang trọng quen thuộc được hoàn thiện từ titan Cấp 5. Chất liệu này giúp điện thoại có một không viền cứng cáp nhưng vẫn đảm bảo được trọng lượng nhẹ của thiết bị. Bên trong máy với cải tiến trong cấu hình tản nhiệt giúp máy tản nhiệt hiệu quả hơn đến 20% so với thế hệ trước. Mặt lưng máy được hoàn thiện với mặt kính nhám hỗ trợ giảm thiểu hiện tượng bám vân tay khi sử dụng.', 'Super Retina XDR OLED', '12MP, ƒ/1.9, Tự động lấy nét theo pha Focus Pixels', '256 GB', 'Camera chính: 48MP, f/1.78, 24mm, 2µm, chống rung quang học dịch chuyển cảm biến thế hệ thứ hai, Focus Pixels 100% Telephoto 2x 12MP: 52 mm, ƒ/1.6 Camera góc siêu rộng: 48MP, 13 mm,ƒ/2.2 và trường ảnh 120°, Hybrid Focus Pixels, ảnh có độ phân giải', 'iPhone 16 Pro Max', 'iOS 18', 3699, '8 GB', 3499, '6.9 inches', '2868 x 1320 pixels', 'Dynamic Island Màn hình Luôn Bật Công nghệ ProMotion với tốc độ làm mới thích ứng lên đến 120Hz Màn hình HDR True Tone Dải màu rộng (P3) Haptic Touch Tỷ lệ tương phản 2.000.000:1', 27, 67, '227 g', 1, 1, '2024-12-02 21:45:28.000000', 1),
(6, '18 ngày sử dụng liên tục (không có AOD)', 'CPU Sifli SF32LB523', 'Đồng hồ Xiaomi Redmi Watch 5 Lite sở hữu màn hình AMOLED 1.96 inch sắc nét, mang lại trải nghiệm hiển thị rõ ràng ở nhiều đièu kiện ánh sáng. Với dung lượng pin lớn có thể lên đến 18 ngày chỉ sau một lần sạc, phù hợp cho người dùng có nhu cầu sử dụng dài ngày. Thêm vào đó, sản phẩm đồng hồ này còn được ưu ái sở hữu khả năng chống nước 5ATM và tính năng nghe gọi Bluetooth giúp nâng cao trải nghiệm sử dụng.', 'AMOLED', 'Không có', '4GB', 'Không có', 'Đồng hồ thông minh Xiaomi Redmi Watch 5 Lite', 'Khác', 1390, 'Không công bố', 1290, '1.96 inch', '410 x 502 pixels, mật độ điểm ảnh 332 PPI', 'Đang cập nhật ...', 242, 521, 'Đang cập nhật ...', 22, 3, '2024-12-02 21:45:31.000000', 1),
(7, 'Chế độ tiết kiệm pin: 18 giờ', 'CPU S8 SiP', 'Apple Watch SE 2023 40mm (GPS) không chỉ là một sản phẩm đồng hồ xem giờ, nó còn tích hợp rất nhiều tính năng theo dõi sức khỏe, luyện tập thông minh. Với thiết kế vô cùng sang trọng như màn hình Retina, khung viền nhôm cùng kính cường lực chắc chắn.', 'Retina LTPO OLED', 'Không có', '32GB', 'Không có', 'Apple Watch SE 2 2023 40mm', 'WatchOS', 6390, 'Không công bố', 5360, 'Hãng không công bố', '324 x 394 Pixel', 'Màn hình cảm ứng ', 4, 30, '26.4 g', 1, 3, '2024-12-02 21:45:34.000000', 1),
(8, '42WHrs, 3S1P, Li-ion 3 cell', 'CPU AMD Ryzen 5 7520U (4MB cache, up to 4.3 GHz, 4 lõi/8 luồng)', 'Là một sản phẩm thuộc series Asus Vivobook do đó laptop Asus Vivobook Go 14 E1404FA-NK177W sở hữu nhiều đặc điểm của series này. Bên cạnh đó là nhiều tính năng được nâng cấp, hỗ trợ tối ưu trong quá trình sử dụng của người dùng.', 'AMD Radeon Graphics', '720p HD với màn trập camera', 'SSD 512GB M.2 NVMe PCIe 3.0', 'Không có', 'Laptop ASUS VivoBook Go 14', 'Windows 11 Home', 14490, '16GB LPDDR5 onboard', 12390, '14 inches', '1920 x 1080 pixels (FullHD)', 'Tỉ lệ 16:9 Độ sáng tối đa 250nits Độ phủ màu 45% NTSC Màn hình chống chói Công nghệ LCD', 46, 57, '1.30 kg', 8, 2, '2024-12-02 21:45:37.000000', 1),
(9, 'Tai nghe: Dùng 6 giờ Hộp sạc: Dùng 30 giờ', 'Không có', 'Airpods Pro 2 Type-C với công nghệ khử tiếng ồn chủ động mang lại khả năng khử ồn lên gấp 2 lần mang lại trải nghiệm nghe - gọi và trải nghiệm âm nhạc ấn tượng. Cùng với đó, điện thoại còn được trang bị công nghệ âm thanh không gian giúp trải nghiệm âm nhạc thêm phần sống động. Airpods Pro 2 Type-C với cổng sạc Type C tiện lợi cùng viên pin mang lại thời gian trải nghiệm lên đến 6 giờ tiện lợi.', 'Không có', 'Không có', 'Không có', 'Không có', 'Tai nghe Bluetooth Apple AirPods Pro 2', 'Không có', 6190, 'Không có', 5590, 'Không có', 'Không có', 'Không có', 0, 46, 'Tai nghe: 5.3g Hộp sạc: 50.8g', 1, 4, '2024-12-02 21:45:40.000000', 1),
(10, 'Không có', 'Không có', 'Bàn phím cơ E-Dra EK375 Alpha Brown Switch cung cấp hiệu ứng ánh sáng đẹp mắt với hệ thống LED Rainbow, cùng khả năng tương thích với nhiều hệ điều hành. Bên cạnh đó, dòng bàn phím E-Dra này còn nổi bật với thiết kế gasket độc đáo và foam case silicon tối ưu hóa độ êm khi gõ. Đi kèm theo đó là keycaps PBT Doubleshot, đảm bảo độ bền và khả năng chống mài mòn cao. ', 'Không có', 'Không có', 'Không có', 'Không có', 'Bàn phím cơ E-DRA EK375', 'Không có', 729, 'Không có', 490, 'Không có', 'Không có', 'Không có', 40, 110, '1207 + 5g', NULL, 4, '2024-12-02 21:45:43.000000', 1),
(11, '41Wh , 3Cell', 'CPU Intel Core i7-1255U (thế hệ thứ 12 / 10 nhân 12 luồng / 4.70 GHz, 12MB)', 'Laptop Dell Inspiron 15 3520 6HD73 sở hữu sức mạnh xử lý đa nhiệm vượt trội. Với bộ vi xử lý Intel Core i7 thế hệ 12 mạnh mẽ, RAM 16GB và ổ cứng SSD 512GB PCIe, Dell Inspiron 15 3520 6HD73 hứa hẹn sẽ mang đến hiệu tốc độ làm việc một cách nhanh chóng và mượt mà. \r\n\r\nĐa nhiệm cùng RAM 16GB với ổ cứng SSD 512GB PCIe\r\nLaptop Dell Inspiron 15 3520 6HD73 được trang bị cấu hình mạnh mẽ với RAM chuẩn DDR4 dung lượng 16GB. Điều này cho phép người dùng chạy đa nhiệm mượt mà trên nhiều ứng dụng cùng lúc mà không lo giật lag. Với dung lượng RAM này, người dùng sẽ có thể thoải mái mở nhiều tab trình duyệt, chỉnh sửa ảnh/video hoặc chơi được một số tựa game nhẹ nhàng.', 'LED Backlit WVA', 'HD - 0,92 megapixel - 1280 x 720 (HD) ở tốc độ 30 khung hình/giây - Công nghệ cảm biến CMOS', '512 GB - 1 khe tối đa 1TB', 'Không có', 'Laptop Dell Inspiron 15 3520 6HD73', 'Windows 11 Home', 1999, '16GB DDR4', 1799, '15.6 inches', '1920 x 1080 pixels (FullHD)', 'Độ phủ màu NTSC 45% Màn hình chống chói', 12, 24, '1.66 kg', 6, 2, '2024-12-02 21:45:59.000000', 1),
(12, '57.5 Wh 4-cell Li-ion battery', 'CPU Intel Core i5-12500H (12 lõi / 16 luồng, 4.5 GHz, 18 MB Intel Smart Cache)', 'Laptop Gaming Acer Nitro 5 Tiger AN515 58 50D2 sở hữu sức mạnh vượt trội nhờ vi xử lý Intel Core i5-12500H, kết hợp với card đồ họa NVIDIA GeForce RTX 3060 6GB. Máy đi kèm với 16GB RAM DDR5 và ổ cứng SSD 512GB, mang lại tốc độ truy xuất dữ liệu nhanh và khả năng đa nhiệm vượt trội. Màn hình 15.6 inch Full HD 165Hz nâng cao chất lượng hiển thị. Thiết kế bền bỉ cùng hệ thống tản nhiệt hiệu quả tối ưu hiệu suất hoạt động trong thời gian dài. Với cấu hình tiên tiến và thiết kế bền bỉ, sản phẩm laptop Acer Nitro này mang lại trải nghiệm chơi game mượt mà cùng khả năng đa nhiệm tuyệt vời. ', 'Acer ComfyView LED', 'HD webcam (1280 x 720)', '512GB PCIe NVMe SED SSD cắm sẵn (nâng cấp tối đa 2TB Gen4, 16 Gb/s, NVMe và 1 TB 2.5-inch 5400 RPM)', 'Không có', 'Laptop Gaming Acer Nitro 5 Tiger', 'Windows 11 Home', 2899, '16GB DDR5 4800MHz', 2299, '15.6 inches', '1920 x 1080 pixels (FullHD)', 'Độ sáng 300nits Độ phủ màu 100% sRGB', 11, 20, '2.5 kg', 9, 2, '2024-12-02 21:46:03.000000', 1),
(21, 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Tai nghe Bluetooth Apple AirPods 3 MagSafe', 'Đang cập nhật', 3890, 'Đang cập nhật', 0, 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 299, 300, 'Đang cập nhật', 10, 4, '2024-12-02 21:46:08.000000', 1),
(22, '4400 mAh', 'Snapdragon 8 Gen 3 for Galaxy Tăng lên 42% AI', 'Samsung Galaxy Z Fold 6 phiên bản 12GB 512GB là chiếc flagship gập thế hệ mới được trang bị con chip Snapdragon 8 Gen 3 For Galaxy mạnh mẽ và ổn định. Sản phẩm sở hữu cụm camera sau 50.0 MP + 12.0 MP + 10.0 MP và cảm biến máy ảnh selfie 10 MP - 4MP cho chất lượng ảnh sắc nét và sống động. Tận hưởng các chương trình giải trí trọn vẹn hơn nhờ màn hình Dynamic AMOLED 2X 6.3 inch với khả năng mở rộng 7.6 inch cùng tốc độ làm tươi 120Hz mượt mà. ', 'Dynamic AMOLED 2X', 'Camera bên ngoài:10 MP, f/2.2\nCamera bên trong: 4 MP, F1.8', '512 GB', 'Camera góc rộng: 50.0 MP, f/1.8, Thu phóng quang học 2x\nCamera chụp góc siêu rộng: 12.0 MP, f/2.2\nCamera ống kính tele: 10.0 MP, f/2.4, Thu phóng Quang học 3x', 'Samsung Galaxy Z Fold6', 'androi', 4799, '12 GB', 4399, '7.6 inches', '2160 x 1856 (QXGA+)', 'Màn hình chính: 7.6\", Dynamic AMOLED 2X, 120Hz, độ sâu màu sắc 16M, 2600nits\nMàn hình phụ: 6.3\", 968 x 2376 (HD+), Dynamic AMOLED 2X\nKính cường lực Corning® Gorilla® Glass Victus® 2', 283, 300, '239 g', 2, 1, '2024-12-02 21:46:11.000000', 1),
(23, 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Xiaomi Redmi 14C', 'Đang cập nhật', 3290, 'Đang cập nhật', 2990, 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 298, 300, 'Đang cập nhật', 3, 1, '2024-12-02 21:46:14.000000', 1),
(24, 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Laptop Dell Latitude 3540', 'Đang cập nhật', 1899, 'Đang cập nhật', 0, 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 299, 300, 'Đang cập nhật', 6, 2, '2024-12-02 21:46:40.000000', 1),
(25, 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Laptop ASUS Vivobook 15 X1504ZA-NJ582W', 'Đang cập nhật', 1299, 'Đang cập nhật', 0, 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 300, 300, 'Đang cập nhật', 8, 2, '2024-12-02 21:46:46.000000', 1),
(26, 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Laptop Acer Gaming Aspire 7 A715-76-53PJ', 'Đang cập nhật', 1699, 'Đang cập nhật', 0, 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 293, 300, 'Đang cập nhật', 9, 2, '2024-12-02 21:46:49.000000', 1),
(27, 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Vòng đeo tay thông minh Xiaomi Mi Band 9', 'Đang cập nhật', 890, 'Đang cập nhật', 0, 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 289, 300, 'Đang cập nhật', 22, 3, '2024-12-02 21:46:53.000000', 1),
(28, 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Sạc Apple 140W USB-C', 'Đang cập nhật', 2900, 'Đang cập nhật', 10, 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 296, 300, 'Đang cập nhật', 1, 1, '2024-12-28 12:46:58.000000', 1),
(49, 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 'Sam sung s20', 'Đang cập nhật', 3000, 'Đang cập nhật', 2500, 'Đang cập nhật', 'Đang cập nhật', 'Đang cập nhật', 50, 50, 'Đang cập nhật', 2, 1, '2024-12-31 11:29:21.000000', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_colors`
--

CREATE TABLE `product_colors` (
  `product_id` bigint(20) NOT NULL,
  `colors` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product_colors`
--

INSERT INTO `product_colors` (`product_id`, `colors`) VALUES
(1, 'black'),
(1, 'grey'),
(2, 'black'),
(2, 'purple'),
(2, 'yellow'),
(2, 'gray'),
(3, 'black'),
(3, 'pink'),
(3, 'white'),
(3, 'green'),
(3, 'blue'),
(4, 'grey'),
(4, 'white'),
(4, 'silver'),
(5, 'black'),
(5, 'brown'),
(5, 'white'),
(5, 'grey'),
(6, 'black'),
(6, 'white'),
(7, 'black'),
(7, 'white'),
(7, 'silver'),
(8, 'silver'),
(9, 'white'),
(10, 'blue'),
(10, 'red'),
(10, 'brown'),
(11, 'black'),
(12, 'black'),
(21, 'white'),
(22, 'blue'),
(22, 'gray'),
(22, 'pink'),
(23, 'blue'),
(23, 'black'),
(24, 'black'),
(25, 'silver'),
(26, 'black'),
(27, 'blue'),
(27, 'gray'),
(27, 'black'),
(28, 'white'),
(49, 'black');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_image_paths`
--

CREATE TABLE `product_image_paths` (
  `product_id` bigint(20) NOT NULL,
  `image_paths` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product_image_paths`
--

INSERT INTO `product_image_paths` (`product_id`, `image_paths`) VALUES
(1, '23411-black.webp'),
(1, '23412-grey.webp'),
(2, 'galaxys24ultra-black.webp'),
(2, 'galaxys24ultra-purple.webp'),
(2, 'galaxys24ultra-yellow.webp'),
(2, 'galaxys24ultra-grey.webp'),
(3, 'iphone16-black.webp'),
(3, 'iphone16-pink.webp'),
(3, 'iphone16-white.webp'),
(3, 'iphone16-green.webp'),
(3, 'iphone16-blue.webp'),
(4, 'macbook_air_m2_2_3.webp'),
(4, 'macbook_air_m2_3_2.webp'),
(4, 'macbook_air_m2_4_2.webp'),
(5, 'iphone-16-pro-max-titan-den_2.webp'),
(5, 'iphone-16-pro-max-titan-sa-mac_2.webp'),
(5, 'iphone-16-pro-max-titan-trang_2.webp'),
(5, 'iphone-16-pro-max-titan-tu-nhien_2.webp'),
(6, 'text_ng_n_21__3_51.webp'),
(6, 'text_ng_n_25__3_3.webp'),
(7, '2apple-watch-se-2023-40mm-vien-nhom-day-silicone-xanh-den-2_1.webp'),
(7, 'apple-watch-se-2023-40mm-vien-nhom-day-silicone-trang-starlight-1_1.webp'),
(7, 'mt3q3ref_vw_34fr_watch-case-44-aluminum-silver-nc-se_vw_34fr_watch-face-44-aluminum-silver-se_vw_34fr_1.webp'),
(8, 'text_ng_n_-_2023-06-08t001431.312_3.webp'),
(9, 'apple-airpods-pro-2-usb-c_8__1.webp'),
(10, 'ban-phim-co-e-dra-ek375-alpha-red-switch-2_1.webp'),
(10, 'ban-phim-co-e-dra-ek375-alpha-red-switch-4_1_2.webp'),
(10, 'ban-phim-co-e-dra-ek375-alpha-red-switch-6_1_2.webp'),
(11, 'text_ng_n_88__1_3.webp'),
(12, 'text_ng_n_11__5_86.webp'),
(21, 'apple-airpods-3-ksp_1.webp'),
(22, 'Samsung-Galaxy-Z-Fold6-mau-xanh--e1720628332345-1024x470.png'),
(22, 'samsung-z-fold-6-xam-metal.webp'),
(22, 'samsung-galaxy-z-fold6-smartphone-256gb-pink.jpeg'),
(23, 'Samsung-Galaxy-Z-Fold6-mau-xanh--e1720628332345-1024x470.png'),
(23, 'samsung-z-fold-6-xam-metal.webp'),
(23, 'samsung-galaxy-z-fold6-smartphone-256gb-pink.jpeg'),
(24, 'text_ng_n_19__4_16.webp'),
(25, 'text_ng_n_12__3_22.webp'),
(27, 'vong-deo-tay-thong-minh-xiaomi-mi-band-9_11__1.webp'),
(27, 'vong-deo-tay-thong-minh-xiaomi-mi-band-9_3__1.webp'),
(27, 'text_ng_n_6__2_85.webp'),
(28, 'image_0_20241228220847.png'),
(26, 'image_0_20241229104405.jpg'),
(49, 'image_0_20241231112921.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `created_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `address`, `email`, `gender`, `name`, `phone`, `role`, `created_date`) VALUES
(9, 'Thủ đức', 'thuong06092009@gmail.com', 'Nam', 'Phan Ngọc Thương ', '0702775390', 'admin', '2024-12-02 21:59:30.000000'),
(11, 'Bình dương', 'tuananh@gmail.com', 'Nam', 'Trần tuấn anh', '7412580369', 'user', '2024-12-02 21:59:34.000000'),
(12, 'Bình thạnh', 'thu@gmail.com', 'Nữ', 'Nguyễn thị anh thư', '3692580147', 'user', '2024-12-02 21:59:38.000000'),
(14, 'Thủ đức, tp hcm', 'nt@gmail.com', 'Nam', 'Thuong phan phan', '0001234567', 'user', '2024-12-02 21:59:41.000000'),
(17, 'Hshsb', 'thuong06092007@gmail.com', 'Nam', 'Thuong', '0497969752', 'user', '2024-12-02 21:59:43.000000'),
(18, 'Nhsns', 'thuong06092010@gmail.com', 'Nam', 'Nsjsbbs', '0101123456', 'user', '2024-12-28 13:59:47.000000');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK9q7xi3v910jhoa63aaiyibqex` (`category_id`);

--
-- Chỉ mục cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK709eickf3kc0dujx3ub9i7btf` (`user_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKa3a4mpsfdf4d2y6r8ra3sc8mv` (`brand_id`),
  ADD KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`);

--
-- Chỉ mục cho bảng `product_colors`
--
ALTER TABLE `product_colors`
  ADD KEY `FKqhu7cqni31911lmvx4fqmiw65` (`product_id`);

--
-- Chỉ mục cho bảng `product_image_paths`
--
ALTER TABLE `product_image_paths`
  ADD KEY `FK16g6lklfaw0364f0csdsnpr9v` (`product_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  ADD UNIQUE KEY `UKdu5v5sr43g5bfnji4vb8hg5s3` (`phone`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `banners`
--
ALTER TABLE `banners`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `brands`
--
ALTER TABLE `brands`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `brands`
--
ALTER TABLE `brands`
  ADD CONSTRAINT `FK9q7xi3v910jhoa63aaiyibqex` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Các ràng buộc cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `FK709eickf3kc0dujx3ub9i7btf` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `FKa3a4mpsfdf4d2y6r8ra3sc8mv` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  ADD CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Các ràng buộc cho bảng `product_colors`
--
ALTER TABLE `product_colors`
  ADD CONSTRAINT `FKqhu7cqni31911lmvx4fqmiw65` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Các ràng buộc cho bảng `product_image_paths`
--
ALTER TABLE `product_image_paths`
  ADD CONSTRAINT `FK16g6lklfaw0364f0csdsnpr9v` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
