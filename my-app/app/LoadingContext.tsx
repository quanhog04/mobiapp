import React, { createContext, useState, useContext } from 'react';

// Tạo context để quản lý trạng thái loading
const LoadingContext = createContext({
  isLoading: false,
  setLoading: (loading: boolean) => {},
});

export const useLoading = () => useContext(LoadingContext);

// Provider để quản lý và cung cấp trạng thái loading cho các màn hình
export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
