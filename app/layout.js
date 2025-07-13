import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Raven Scrap and Supply',
  description: 'Invoice and Supply Management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
