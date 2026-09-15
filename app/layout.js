import { Geist } from "next/font/google";
import { AuthProvider } from '../lib/auth';
import ClientLayoutHelper from './ClientLayoutHelper';
import './globals.css';

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: 'My Shop',
  description: 'Course platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geist.className} antialiased h-full m-0`}>
        <AuthProvider>
          <ClientLayoutHelper>
            {children}
          </ClientLayoutHelper>
        </AuthProvider>
      </body>
    </html>
  );
}
