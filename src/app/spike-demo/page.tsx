/**
 * SPIKE — Creative Studio editor proof (craft.js).
 * Route: /_spike  — DELETE this folder after the spike verdict.
 * Proves: register a React component → drag + edit props deterministically →
 * serialize the whole document to JSON. Same SpikeProductCard also renders in Remotion.
 */
'use client';
import React from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { CraftProductCard } from '@/_spike-creative-studio/CraftProductCard';

const Topbar: React.FC = () => {
  const { query } = useEditor();
  return (
    <button
      type="button"
      onClick={() => {
        const json = query.serialize();
        // eslint-disable-next-line no-console
        console.log('craft.js document JSON:', json);
        window.alert('Documento serializado a JSON (ver consola).');
      }}
      style={{ padding: '8px 16px', borderRadius: 8 }}
    >
      Serializar documento → JSON
    </button>
  );
};

const SettingsPanel: React.FC = () => {
  const { settings } = useEditor((state, query) => {
    const currentNodeId = query.getEvent('selected').last();
    let settings: React.ComponentType | undefined;
    if (currentNodeId && state.nodes[currentNodeId]) {
      settings = state.nodes[currentNodeId].related?.settings as
        | React.ComponentType
        | undefined;
    }
    return { settings };
  });

  return (
    <aside style={{ padding: 16, borderLeft: '1px solid #333', minWidth: 260 }}>
      <h3 style={{ marginTop: 0 }}>Propiedades</h3>
      {settings ? (
        React.createElement(settings)
      ) : (
        <p style={{ opacity: 0.7 }}>Seleccioná la card para editar.</p>
      )}
    </aside>
  );
};

export default function SpikePage() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
      <h2>SPIKE — Creative Studio (craft.js + Remotion shared component)</h2>
      <Editor resolver={{ CraftProductCard }}>
        <div style={{ marginBottom: 12 }}>
          <Topbar />
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Frame>
            <Element
              is="div"
              canvas
              style={{
                flex: 1,
                padding: 48,
                minHeight: 460,
                background: '#0A0A1A',
                borderRadius: 12
              }}
            >
              <CraftProductCard
                productName="Manzanas Gala"
                price="$1.990"
                color="#4361EF"
              />
            </Element>
          </Frame>
          <SettingsPanel />
        </div>
      </Editor>
    </div>
  );
}
