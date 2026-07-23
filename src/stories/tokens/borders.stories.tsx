import type { Meta, StoryObj } from '@storybook/react';

const RadiusSample = ({
  label,
  value,
  usage
}: {
  label: string;
  value: number;
  usage: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginBottom: 16
    }}
  >
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: value,
        background: 'rgba(67,97,239,0.15)',
        border: '2px solid rgba(67,97,239,0.5)',
        flexShrink: 0
      }}
    />
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#F5F5F5' }}>
        {label}{' '}
        <span
          style={{ fontFamily: 'monospace', color: '#4361EF', fontWeight: 400 }}
        >
          {value}px
        </span>
      </div>
      <div style={{ fontSize: 11, color: '#6E6E6E', marginTop: 2 }}>
        {usage}
      </div>
    </div>
  </div>
);

const StrokeSample = ({
  label,
  width,
  description
}: {
  label: string;
  width: number;
  description: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginBottom: 16
    }}
  >
    <div
      style={{
        width: 120,
        height: 48,
        borderRadius: 8,
        background: 'transparent',
        border: `${width}px solid rgba(255,255,255,0.5)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        color: '#8C8C8C',
        fontFamily: 'monospace'
      }}
    >
      {width}px
    </div>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#F5F5F5' }}>
        {label}
      </div>
      <div style={{ fontSize: 11, color: '#6E6E6E', marginTop: 2 }}>
        {description}
      </div>
    </div>
  </div>
);

const Section = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div style={{ marginBottom: 48 }}>
    <h3
      style={{
        fontSize: 16,
        fontWeight: 600,
        color: '#8C8C8C',
        marginBottom: 16
      }}
    >
      {title}
    </h3>
    {children}
  </div>
);

function BordersPage() {
  return (
    <div
      style={{
        background: '#000',
        color: '#F5F5F5',
        padding: 32,
        fontFamily: 'Mulish, sans-serif'
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
        Vibe Coding{' '}
        <span style={{ color: '#4361EF' }}>Strokes & Radius</span>
      </h1>
      <p style={{ fontSize: 14, color: '#8C8C8C', marginBottom: 48 }}>
        Source: strokes_and_radius_system.json v1.0.0
      </p>

      <Section title="Stroke Widths">
        <StrokeSample
          label="None"
          width={0}
          description="Sin borde. Elementos ghost o superficies planas."
        />
        <StrokeSample
          label="Thin"
          width={1}
          description="Estándar para divisores, bordes de inputs y cards."
        />
        <StrokeSample
          label="Medium"
          width={2}
          description="Énfasis visual. Estados Focus o botones outline."
        />
        <StrokeSample
          label="Thick"
          width={4}
          description="Máximo énfasis. Indicadores de selección fuerte."
        />
      </Section>

      <Section title="Border Radius Scale">
        <RadiusSample
          label="radius-2"
          value={2}
          usage="Micro-elementos, checkboxes, badges internos."
        />
        <RadiusSample
          label="radius-4"
          value={4}
          usage="Elementos compactos, keyboard keys, tags pequeños."
        />
        <RadiusSample
          label="radius-6"
          value={6}
          usage="Sub-contenedores, tooltips, dropdown items."
        />
        <RadiusSample
          label="radius-8"
          value={8}
          usage="Estándar UI: Botones pequeños, Inputs, Cards densas."
        />
        <RadiusSample
          label="radius-10"
          value={10}
          usage="Variante moderna para botones medianos/grandes."
        />
        <RadiusSample
          label="radius-12"
          value={12}
          usage="Estándar UI: Cards principales, Modales, Secciones."
        />
        <RadiusSample
          label="radius-16"
          value={16}
          usage="Contenedores grandes, Drawers, Elementos flotantes."
        />
        <RadiusSample
          label="radius-24"
          value={24}
          usage="Modales grandes, Secciones Hero con bordes suaves."
        />
        <RadiusSample
          label="radius-32"
          value={32}
          usage="Elementos decorativos grandes, contenedores ultra-suaves."
        />
        <RadiusSample
          label="radius-infinite"
          value={9999}
          usage="Pills, Avatares circulares, Status indicators."
        />
      </Section>

      <Section title="Rules">
        <div
          style={{
            background: '#0D0D0D',
            borderRadius: 12,
            padding: 24,
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <p style={{ fontSize: 13, color: '#DCDCDC', marginBottom: 12 }}>
            <strong>Nested Radius:</strong> Outer Radius - Padding = Inner
            Radius.
            <br />
            <span style={{ color: '#8C8C8C' }}>
              Ej: Container radius-16 + padding-8 → elemento interno radius-8
            </span>
          </p>
          <p style={{ fontSize: 13, color: '#DCDCDC' }}>
            <strong>Consistency:</strong> No mezclar radius-8 y radius-10 en el
            mismo contexto visual.
          </p>
        </div>
      </Section>
    </div>
  );
}

const meta = {
  title: 'Design Tokens/Borders & Radius',
  component: BordersPage,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof BordersPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllBorders: Story = {};
