import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Định nghĩa kiểu cho thông tin người dùng
interface User {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  address?: string;
  role?: string;
}

// Định nghĩa kiểu cho giá trị của context
interface UserContextType {
  userInfo: User | null;
  setUserInfo: (user: User | null) => void;
  logout: () => void; // Thêm phương thức logout
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfoState] = useState<User | null>(null);

  // Hàm để cập nhật thông tin người dùng và lưu vào AsyncStorage
  const setUserInfo = async (user: User | null) => {
    setUserInfoState(user);
    if (user) {
      await AsyncStorage.setItem('userInfo', JSON.stringify(user)); // Lưu thông tin người dùng vào AsyncStorage
    } else {
      await AsyncStorage.removeItem('userInfo'); // Xóa thông tin người dùng khỏi AsyncStorage khi đăng xuất
    }
  };

  // Hàm để lấy thông tin người dùng từ AsyncStorage khi ứng dụng khởi động
  const loadUserInfo = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userInfo');
      if (storedUser) {
        setUserInfoState(JSON.parse(storedUser)); // Cập nhật lại thông tin người dùng từ AsyncStorage
      }
    } catch (error) {
      console.error('Failed to load user info:', error);
    }
  };

  // Hàm để đăng xuất và xóa thông tin người dùng khỏi AsyncStorage
  const logout = async () => {
    await AsyncStorage.removeItem('userInfo');
    setUserInfoState(null); // Xóa trạng thái người dùng trong context
  };

  // Lắng nghe sự thay đổi của `userInfo` và tự động cập nhật vào AsyncStorage
  useEffect(() => {
    loadUserInfo(); // Tải thông tin người dùng khi khởi động ứng dụng
  }, []);

  useEffect(() => {
    if (userInfo !== null) {
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo)); // Cập nhật lại thông tin người dùng mỗi khi `userInfo` thay đổi
    }
  }, [userInfo]);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Định nghĩa kiểu cho thông tin người dùng
// interface User {
//   id?: number;
//   name?: string;
//   email?: string;
//   phone?: string;
//   gender?: string;
//   address?: string;
//   role?: string;
// }

// // Định nghĩa kiểu cho giá trị của context
// interface UserContextType {
//   userInfo: User | null;
//   setUserInfo: (user: User | null) => void;
//   logout: () => void; // Thêm phương thức logout
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [userInfo, setUserInfoState] = useState<User | null>(null);

//   // Hàm để cập nhật thông tin người dùng và lưu vào AsyncStorage
//   const setUserInfo = async (user: User | null) => {
//     setUserInfoState(user);
//     if (user) {
//       await AsyncStorage.setItem('userInfo', JSON.stringify(user)); // Lưu thông tin người dùng vào AsyncStorage
//     } else {
//       await AsyncStorage.removeItem('userInfo'); // Xóa thông tin người dùng khỏi AsyncStorage khi đăng xuất
//     }
//   };

//   // Hàm để lấy thông tin người dùng từ AsyncStorage khi ứng dụng khởi động
//   const loadUserInfo = async () => {
//     try {
//       const storedUser = await AsyncStorage.getItem('userInfo');
//       if (storedUser) {
//         setUserInfoState(JSON.parse(storedUser)); // Cập nhật lại thông tin người dùng từ AsyncStorage
//       }
//     } catch (error) {
//       console.error('Failed to load user info:', error);
//     }
//   };

//   // Hàm để đăng xuất và xóa thông tin người dùng khỏi AsyncStorage
//   const logout = async () => {
//     await AsyncStorage.removeItem('userInfo');
//     setUserInfoState(null); // Xóa trạng thái người dùng trong context
//   };

//   // Lắng nghe sự thay đổi của `userInfo` và tự động cập nhật vào AsyncStorage
//   useEffect(() => {
//     loadUserInfo(); // Tải thông tin người dùng khi khởi động ứng dụng
//   }, []);

//   useEffect(() => {
//     if (userInfo !== null) {
//       AsyncStorage.setItem('userInfo', JSON.stringify(userInfo)); // Cập nhật lại thông tin người dùng mỗi khi `userInfo` thay đổi
//     }
//   }, [userInfo]);

//   return (
//     <UserContext.Provider value={{ userInfo, setUserInfo, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };
