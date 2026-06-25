/**
 * SPIKE — Remotion composition consuming the SAME shared SpikeProductCard.
 * Proves the keystone: one component definition renders in Remotion (video) too.
 *
 * DELETE this folder after the spike verdict.
 */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { z } from 'zod';
import { SpikeProductCard } from './SpikeProductCard';

export const spikeRemotionSchema = z.object({
  productName: z.string(),
  price: z.string(),
  color: z.string()
});

export type SpikeRemotionProps = z.infer<typeof spikeRemotionSchema>;

export const SpikeRemotionComposition: React.FC<SpikeRemotionProps> = ({
  productName,
  price,
  color
}) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0A0A1A'
      }}
    >
      <SpikeProductCard productName={productName} price={price} color={color} />
    </AbsoluteFill>
  );
};

export const spikeRemotionDefaultProps: SpikeRemotionProps = {
  productName: 'Manzanas Gala',
  price: '$1.990',
  color: '#4361EF'
};
