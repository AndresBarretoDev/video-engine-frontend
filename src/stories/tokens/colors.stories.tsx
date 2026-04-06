import type { Meta, StoryObj } from '@storybook/react';

const ColorSwatch = ({
  name,
  value,
  textColor = 'white',
}: {
  name: string;
  value: string;
  textColor?: string;
}) => (
  <div
    style={{
      background: value,
      color: textColor,
      width: 100,
      height: 80,
      borderRadius: 12,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '6px 4px',
      fontSize: 10,
      fontWeight: 600,
      border: '1px solid rgba(255,255,255,0.1)',
    }}
  >
    <span>{name}</span>
    <span style={{ opacity: 0.7, fontFamily: 'monospace', fontSize: 9 }}>
      {value}
    </span>
  </div>
);

const SurfacePair = ({
  level,
  bg,
  contrast,
}: {
  level: string;
  bg: string;
  contrast: string;
}) => (
  <div
    style={{
      display: 'flex',
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)',
      marginBottom: 8,
    }}
  >
    <div
      style={{
        background: bg,
        color: contrast,
        width: 140,
        height: 64,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
      }}
    >
      <strong>Level {level} BG</strong>
      <span style={{ fontFamily: 'monospace', fontSize: 9, opacity: 0.8 }}>
        {bg}
      </span>
    </div>
    <div
      style={{
        background: contrast,
        color: bg === '#000000' ? '#000' : bg,
        width: 140,
        height: 64,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
      }}
    >
      <strong>Contrast</strong>
      <span style={{ fontFamily: 'monospace', fontSize: 9, opacity: 0.8 }}>
        {contrast}
      </span>
    </div>
  </div>
);

const StatusBadge = ({
  label,
  bg,
  text,
  border,
}: {
  label: string;
  bg: string;
  text: string;
  border: string;
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 16px',
      borderRadius: 9999,
      fontSize: 13,
      fontWeight: 600,
      background: bg,
      color: text,
      border: `1px solid ${border}`,
    }}
  >
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: text,
      }}
    />
    {label}
  </div>
);

const Section = ({
  title,
  children,
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
        marginBottom: 16,
      }}
    >
      {title}
    </h3>
    {children}
  </div>
);

function ColorsPage() {
  return (
    <div
      style={{
        background: '#000',
        color: '#F5F5F5',
        padding: 32,
        fontFamily: 'Mulish, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
        Vibe Coding <span style={{ color: '#4361EF' }}>Color System</span>
      </h1>
      <p style={{ fontSize: 14, color: '#8C8C8C', marginBottom: 48 }}>
        Design System v2.0.0 — Source of Truth: colors_system.json
      </p>

      <Section title="OP Blue Scale — Primary: #4361EF (600)">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <ColorSwatch name="50" value="#F6F8FF" textColor="#191A52" />
          <ColorSwatch name="100" value="#F0F3FE" textColor="#191A52" />
          <ColorSwatch name="200" value="#DCE3FD" textColor="#191A52" />
          <ColorSwatch name="300" value="#C1CFFC" textColor="#191A52" />
          <ColorSwatch name="400" value="#97B1F9" textColor="#191A52" />
          <ColorSwatch name="500" value="#6689F4" textColor="#FFF" />
          <ColorSwatch name="600 *" value="#4361EF" textColor="#FFF" />
          <ColorSwatch name="700" value="#2C40E4" textColor="#FFF" />
          <ColorSwatch name="800" value="#242DD1" textColor="#FFF" />
          <ColorSwatch name="900" value="#2327AA" textColor="#FFF" />
          <ColorSwatch name="950" value="#191A52" textColor="#FFF" />
        </div>
      </Section>

      <Section title="General Surfaces (Dark Mode First)">
        <SurfacePair level="0" bg="#000000" contrast="#FFFFFF" />
        <SurfacePair level="1" bg="#080808" contrast="#F5F5F5" />
        <SurfacePair level="2" bg="#0D0D0D" contrast="#DCDCDC" />
        <SurfacePair level="3" bg="#131313" contrast="#8C8C8C" />
        <SurfacePair level="4" bg="#191919" contrast="#6E6E6E" />
        <SurfacePair level="5" bg="#202020" contrast="#545454" />
        <SurfacePair level="6" bg="#3B3B3B" contrast="#3B3B3B" />
      </Section>

      <Section title="Component Colors — Button Principal">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <ColorSwatch name="Light" value="#6689F4" />
          <ColorSwatch name="Light Med" value="#4361EF" />
          <ColorSwatch name="Medium" value="#2C40E4" />
          <ColorSwatch name="Dark" value="#2327AA" />
          <ColorSwatch name="Text" value="#FFFFFF" textColor="#000" />
        </div>
        <h4
          style={{
            fontSize: 13,
            color: '#6E6E6E',
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          Disabled
        </h4>
        <div style={{ display: 'flex', gap: 8 }}>
          <ColorSwatch name="Light" value="#545454" />
          <ColorSwatch name="Dark" value="#202020" />
          <ColorSwatch name="Text" value="#545454" textColor="#202020" />
        </div>
      </Section>

      <Section title="Status Colors">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <StatusBadge
            label="Approved"
            bg="rgba(34,197,94,0.15)"
            text="#22C55E"
            border="rgba(34,197,94,0.3)"
          />
          <StatusBadge
            label="Client Approved"
            bg="rgba(21,128,61,0.15)"
            text="#15803D"
            border="rgba(21,128,61,0.3)"
          />
          <StatusBadge
            label="Rejected"
            bg="rgba(239,68,68,0.15)"
            text="#EF4444"
            border="rgba(239,68,68,0.3)"
          />
          <StatusBadge
            label="Warning"
            bg="rgba(245,158,11,0.15)"
            text="#F59E0B"
            border="rgba(245,158,11,0.3)"
          />
          <StatusBadge
            label="Pending"
            bg="rgba(107,114,128,0.15)"
            text="#9CA3AF"
            border="rgba(107,114,128,0.3)"
          />
          <StatusBadge
            label="In Review"
            bg="rgba(139,92,246,0.15)"
            text="#8B5CF6"
            border="rgba(139,92,246,0.3)"
          />
          <StatusBadge
            label="Delivered"
            bg="rgba(67,97,239,0.15)"
            text="#4361EF"
            border="rgba(67,97,239,0.3)"
          />
        </div>
      </Section>

      <Section title="Transparencies — White (#FFFFFF)">
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[0, 5, 15, 25, 35, 45, 55, 65, 75, 85, 95].map((alpha) => (
            <div
              key={alpha}
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                background: `rgba(255,255,255,${alpha / 100})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                fontWeight: 600,
                fontFamily: 'monospace',
                color: alpha > 60 ? '#000' : '#888',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {alpha}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Transparencies — Black (#000000)">
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[0, 5, 15, 25, 35, 45, 55, 65, 75, 85, 95].map((alpha) => (
            <div
              key={alpha}
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                background: `rgba(0,0,0,${alpha / 100})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                fontWeight: 600,
                fontFamily: 'monospace',
                color: alpha > 60 ? '#fff' : '#aaa',
                border: alpha === 0 ? '1px dashed #333' : '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {alpha}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Transparencies — OP Blue (#4361EF)">
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[0, 5, 15, 25, 35, 45, 55, 65, 75, 85, 95].map((alpha) => (
            <div
              key={alpha}
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                background: `rgba(67,97,239,${alpha / 100})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                fontWeight: 600,
                fontFamily: 'monospace',
                color: alpha > 40 ? '#fff' : '#aaa',
              }}
            >
              {alpha}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

const meta = {
  title: 'Design Tokens/Colors',
  component: ColorsPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ColorsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllColors: Story = {};
