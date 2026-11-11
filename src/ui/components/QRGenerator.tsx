import React from 'react';

interface QRGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ value, size = 160, className = '' }) => {
  // Uses high-speed, crisp Google Chart or local SVG render
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=ffffff&color=0f172a&margin=6`;

  return (
    <div className={`inline-flex flex-col items-center justify-center p-2.5 bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
      <img
        src={qrUrl}
        alt={`QR Code for ${value}`}
        width={size}
        height={size}
        className="rounded-lg object-contain"
        loading="lazy"
      />
      <span className="text-[11px] font-mono font-semibold text-slate-700 mt-1.5 tracking-wider uppercase">
        {value}
      </span>
    </div>
  );
};

