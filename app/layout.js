import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Raven Supply',
  description: 'Scrap and Supply',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
