/**
 * SPIKE — craft.js ADAPTER for the shared SpikeProductCard.
 * Keeps SpikeProductCard pure: this thin wrapper adds the craft.js editor behavior
 * (selectable, draggable, editable props) WITHOUT touching the shared component.
 * This is the real pattern: pure component + a craft adapter for the editor.
 *
 * DELETE this folder after the spike verdict.
 */
'use client';
import React from 'react';
import { useNode } from '@craftjs/core';
import { SpikeProductCard, type SpikeProductCardProps } from './SpikeProductCard';

export const CraftProductCard: React.FC<SpikeProductCardProps> & {
  craft?: unknown;
} = ({ productName, price, color }) => {
  const {
    connectors: { connect, drag },
    selected
  } = useNode((node) => ({ selected: node.events.selected }));

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        display: 'inline-block',
        outline: selected ? '3px solid #4361EF' : 'none',
        outlineOffset: 4,
        cursor: 'move'
      }}
    >
      <SpikeProductCard productName={productName} price={price} color={color} />
    </div>
  );
};

const ProductSettings: React.FC = () => {
  const {
    actions: { setProp },
    productName,
    price,
    color
  } = useNode((node) => ({
    productName: node.data.props.productName as string,
    price: node.data.props.price as string,
    color: node.data.props.color as string
  }));

  return (
    <div style={{ display: 'grid', gap: 12, minWidth: 220 }}>
      <label style={{ display: 'grid', gap: 4 }}>
        <span>Producto</span>
        <input
          value={productName}
          onChange={(e) =>
            setProp((p: SpikeProductCardProps) => {
              p.productName = e.target.value;
            })
          }
        />
      </label>
      <label style={{ display: 'grid', gap: 4 }}>
        <span>Precio</span>
        <input
          value={price}
          onChange={(e) =>
            setProp((p: SpikeProductCardProps) => {
              p.price = e.target.value;
            })
          }
        />
      </label>
      <label style={{ display: 'grid', gap: 4 }}>
        <span>Color</span>
        <input
          type="color"
          value={color}
          onChange={(e) =>
            setProp((p: SpikeProductCardProps) => {
              p.color = e.target.value;
            })
          }
        />
      </label>
    </div>
  );
};

CraftProductCard.craft = {
  displayName: 'ProductCard',
  props: {
    productName: 'Manzanas Gala',
    price: '$1.990',
    color: '#4361EF'
  } satisfies SpikeProductCardProps,
  related: { settings: ProductSettings }
};
