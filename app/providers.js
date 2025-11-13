'use client';

import { ConfigProvider, theme } from 'antd';

export function AntdProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#4a9008',
          colorBgContainer: '#0d0d0d',
          colorBgElevated: '#0d0d0d',
          colorBorder: '#4a9008',
          borderRadius: 8,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}