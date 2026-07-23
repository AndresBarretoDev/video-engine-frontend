/**
 * SPIKE — Creative Studio keystone proof.
 * This component is PURE: it imports NOTHING from craft.js or Remotion.
 * The whole point of the spike is that this single definition is consumed
 * by BOTH the craft.js editor (DOM, editable) AND a Remotion composition (video).
 * Uses inline styles so rendering is identical in both contexts (no CSS pipeline dependency).
 *
 * DELETE this folder after the spike verdict.
 */
import React from 'react';

export interface SpikeProductCardProps {
  productName: string;
  price: string;
  color: string;
}

export const SpikeProductCard: React.FC<SpikeProductCardProps> = ({
  productName,
  price,
  color
}) => {
  return (
    <div
      style={{
        width: 320,
        padding: 24,
        borderRadius: 16,
        background: color,
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
      }}
    >
      <div style={{ fontSize: 14, opacity: 0.85, letterSpacing: 1 }}>
        OFERTA
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>
        {productName}
      </div>
      <div style={{ fontSize: 40, fontWeight: 800, marginTop: 12 }}>
        {price}
      </div>
    </div>
  );
};
