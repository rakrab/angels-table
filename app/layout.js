import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';
import { AntdProvider } from './providers';
import { App } from 'antd';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Angels Table",
  description: "hi :) hope you enjoy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdProvider><App>{children}</App></AntdProvider>
      </body>
    </html>
  );
}
