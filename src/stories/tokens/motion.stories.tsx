import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const DurationBar = ({
  label,
  ms,
  usage
}: {
  label: string;
  ms: number;
  usage: string;
}) => (
  <div style={{ marginBottom: 16 }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 4
      }}
    >
      <div
        style={{
          width: Math.max(ms / 3, 20),
          height: 24,
          borderRadius: 4,
          background: 'rgba(67,97,239,0.35)',
          border: '1px solid rgba(67,97,239,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          fontFamily: 'monospace',
          color: '#F5F5F5'
        }}
      >
        {ms}ms
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#F5F5F5' }}>
        {label}
      </span>
    </div>
    <div style={{ fontSize: 11, color: '#6E6E6E', paddingLeft: 4 }}>
      {usage}
    </div>
  </div>
);

const EasingDemo = ({
  label,
  value,
  usage
}: {
  label: string;
  value: string;
  usage: string;
}) => {
  const [active, setActive] = useState(false);

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 8
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: '#F5F5F5' }}>
          {label}
        </span>
        <span
          style={{ fontSize: 10, fontFamily: 'monospace', color: '#4361EF' }}
        >
          {value}
        </span>
      </div>
      <div style={{ fontSize: 11, color: '#6E6E6E', marginBottom: 8 }}>
        {usage}
      </div>
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          height: 40,
          background: '#0D0D0D',
          borderRadius: 8,
          position: 'relative',
          cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
        onClick={() => setActive((prev) => !prev)}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: '#4361EF',
            position: 'absolute',
            left: active ? 'calc(100% - 40px)' : 0,
            top: 0,
            transition: `left 600ms ${value}`
          }}
        />
        <span
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 9,
            color: '#545454'
          }}
        >
          click to animate
        </span>
      </div>
    </div>
  );
};

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

function MotionPage() {
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
        Vibe Coding <span style={{ color: '#4361EF' }}>Motion</span>
      </h1>
      <p style={{ fontSize: 14, color: '#8C8C8C', marginBottom: 48 }}>
        Durations, easings & semantic transitions — Source: motion_system.json
        v1.0.0
      </p>

      <Section title="Durations">
        <DurationBar
          label="Fast"
          ms={120}
          usage="Feedback táctil inmediato: checkboxes, toggles, press."
        />
        <DurationBar
          label="Standard"
          ms={300}
          usage="UI estándar: aperturas, cierres, tabs, cambios de layout."
        />
        <DurationBar
          label="Slow"
          ms={400}
          usage="Hover premium, degradados, modales grandes, recorridos de luz."
        />
        <DurationBar
          label="Story"
          ms={600}
          usage="Storytelling puntual. Solo onboarding, no navegación diaria."
        />
      </Section>

      <Section title="Easings (click to animate)">
        <EasingDemo
          label="UI"
          value="cubic-bezier(0.2, 0, 0, 1)"
          usage="Curva limpia y moderna. 90% de la interfaz."
        />
        <EasingDemo
          label="Premium"
          value="cubic-bezier(0.16, 1, 0.3, 1)"
          usage="Suave y lujosa. Degradados, overlays, elementos destacados."
        />
        <EasingDemo
          label="Editorial"
          value="cubic-bezier(0, 0, 0.58, 1)"
          usage="Dramática. Exclusiva para momentos Story."
        />
      </Section>

      <Section title="Semantic Transitions">
        <div
          style={{
            background: '#0D0D0D',
            borderRadius: 12,
            padding: 24,
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <table
            style={{
              width: '100%',
              fontSize: 12,
              borderCollapse: 'collapse'
            }}
          >
            <thead>
              <tr style={{ color: '#6E6E6E', textAlign: 'left' }}>
                <th style={{ padding: '8px 0' }}>Component</th>
                <th>Action</th>
                <th>Duration</th>
                <th>Easing</th>
              </tr>
            </thead>
            <tbody style={{ color: '#DCDCDC' }}>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '8px 0' }}>Button</td>
                <td>Hover (bg/glow)</td>
                <td style={{ fontFamily: 'monospace', color: '#4361EF' }}>
                  400ms
                </td>
                <td>premium</td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '8px 0' }}>Button</td>
                <td>Hover (content)</td>
                <td style={{ fontFamily: 'monospace', color: '#4361EF' }}>
                  300ms
                </td>
                <td>ui</td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '8px 0' }}>Button</td>
                <td>Press</td>
                <td style={{ fontFamily: 'monospace', color: '#4361EF' }}>
                  120ms
                </td>
                <td>ui</td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '8px 0' }}>Card</td>
                <td>Hover default</td>
                <td style={{ fontFamily: 'monospace', color: '#4361EF' }}>
                  300ms
                </td>
                <td>ui</td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '8px 0' }}>Card</td>
                <td>Hover featured</td>
                <td style={{ fontFamily: 'monospace', color: '#4361EF' }}>
                  400ms
                </td>
                <td>premium</td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '8px 0' }}>Modal/Drawer</td>
                <td>Entry</td>
                <td style={{ fontFamily: 'monospace', color: '#4361EF' }}>
                  400ms
                </td>
                <td>premium</td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '8px 0' }}>Modal/Drawer</td>
                <td>Overlay fade</td>
                <td style={{ fontFamily: 'monospace', color: '#4361EF' }}>
                  300ms
                </td>
                <td>ui</td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '8px 0' }}>Dropdown</td>
                <td>Toggle</td>
                <td style={{ fontFamily: 'monospace', color: '#4361EF' }}>
                  300ms
                </td>
                <td>premium</td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '8px 0' }}>Dropdown</td>
                <td>Item hover</td>
                <td style={{ fontFamily: 'monospace', color: '#4361EF' }}>
                  120ms
                </td>
                <td>ui</td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '8px 0' }}>Tooltip</td>
                <td>Entry</td>
                <td style={{ fontFamily: 'monospace', color: '#4361EF' }}>
                  120ms
                </td>
                <td>ui</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Performance Rules">
        <div
          style={{
            background: '#0D0D0D',
            borderRadius: 12,
            padding: 24,
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: 12
          }}
        >
          <p style={{ color: '#22C55E', marginBottom: 8 }}>
            <strong>Allowed:</strong> opacity, transform, background-position,
            color, box-shadow
          </p>
          <p style={{ color: '#EF4444', marginBottom: 8 }}>
            <strong>Forbidden:</strong> width, height, top, left, margin,
            padding
          </p>
          <p style={{ color: '#8C8C8C' }}>
            <strong>prefers-reduced-motion:</strong> Override all transitions to
            opacity 0ms, animation none.
          </p>
        </div>
      </Section>
    </div>
  );
}

const meta = {
  title: 'Design Tokens/Motion',
  component: MotionPage,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof MotionPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllMotion: Story = {};
