'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ backgroundColor: '#000', color: '#D4AF37', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image src={ravenLogo} alt="Raven Logo" width={50} height={50} />
        <h1 style={{ marginLeft: '10px', fontWeight: 'bold' }}>Raven's Scrap & Supply</h1>
      </div>
      <div>
        <Link href="/"><a style={{ color: '#D4AF37', marginRight: '15px' }}>Materials</a></Link>
        <Link href="/database"><a style={{ color: '#D4AF37' }}>Database</a></Link>
      </div>
    </nav>
  );
}
