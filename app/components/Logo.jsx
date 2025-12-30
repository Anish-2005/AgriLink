import React from 'react';
import Image from 'next/image';

export default function Logo({ size = 40, showText = true, className = '' }) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative rounded-xl overflow-hidden" style={{ width: size, height: size }}>
        <Image src="/agrilink.png" alt="AgriLink logo" width={size} height={size} priority />
      </div>
      {showText && (
        <span className="text-3xl font-extrabold text-emerald-700 tracking-tight drop-shadow-lg">AgriLink</span>
      )}
    </div>
  );
}
