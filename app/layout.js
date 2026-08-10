import { Geist } from "next/font/google";
import ClientLayoutHelper from './ClientLayoutHelper';
import './globals.css';

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: 'My Shop',
  description: 'Next.js + Laravel integration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geist.className} antialiased h-full m-0`}>
        <ClientLayoutHelper>
          {children}
        </ClientLayoutHelper>
      </body>
    </html>
  );
}