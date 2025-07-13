'use client';

import Image from 'next/image';
import Link from 'next/link';
import ravenLogo from '../public/raven-logo.png';

export default function Navbar() {
  return (
    <nav style={{ backgroundColor: '#000', color: '#FFD700', padding: '10px 20px', display: 'flex', alignItems: 'center' }}>
      <Image src={ravenLogo} alt="Raven Logo" width={50} height={50} />
      <h1 style={{ marginLeft: '15px', flexGrow: 1 }}>Raven Scrap and Supply</h1>
      <div>
        <Link href="/"><a style={{ color: '#FFD700', marginRight: '20px' }}>Home</a></Link>
        <Link href="/pricing"><a style={{ color: '#FFD700' }}>Pricing</a></Link>
      </div>
    </nav>
  );
}
