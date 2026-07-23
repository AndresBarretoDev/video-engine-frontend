import type { Meta, StoryObj } from '@storybook/react';

const SpacingBox = ({
  label,
  size
}: {
  label: string;
  size: number;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 8
    }}
  >
    <div
      style={{
        width: size,
        height: 24,
        background: 'rgba(67,97,239,0.35)',
        borderRadius: 4,
        minWidth: 2,
        border: '1px solid rgba(67,97,239,0.5)'
      }}
    />
    <span style={{ fontSize: 11, color: '#8C8C8C', fontFamily: 'monospace' }}>
      {label} — {size}px
    </span>
  </div>
);

const Section = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div style={{ marginBottom: 40 }}>
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

function SpacingPage() {
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
        Vibe Coding <span style={{ color: '#4361EF' }}>Spacing</span>
      </h1>
      <p style={{ fontSize: 14, color: '#8C8C8C', marginBottom: 48 }}>
        Semantic spacing — Source: spacing_system.json v1.0.0
      </p>

      <Section title="Button Padding X">
        <SpacingBox label="xxs" size={4} />
        <SpacingBox label="xs" size={8} />
        <SpacingBox label="sm" size={16} />
        <SpacingBox label="md" size={24} />
        <SpacingBox label="l" size={32} />
        <SpacingBox label="xl" size={80} />
      </Section>

      <Section title="Button Padding Y">
        <SpacingBox label="xs" size={4} />
        <SpacingBox label="sm" size={8} />
        <SpacingBox label="md" size={16} />
        <SpacingBox label="l" size={24} />
        <SpacingBox label="xl" size={32} />
      </Section>

      <Section title="Card Padding">
        <SpacingBox label="xs" size={8} />
        <SpacingBox label="sm" size={16} />
        <SpacingBox label="md" size={24} />
        <SpacingBox label="l" size={32} />
        <SpacingBox label="xl" size={36} />
        <SpacingBox label="xxl" size={120} />
      </Section>

      <Section title="Card Gap">
        <SpacingBox label="xs" size={4} />
        <SpacingBox label="sm" size={6} />
        <SpacingBox label="md" size={8} />
        <SpacingBox label="l" size={16} />
        <SpacingBox label="xl" size={24} />
      </Section>

      <Section title="Field Padding X">
        <SpacingBox label="sm" size={8} />
        <SpacingBox label="sm2" size={10} />
        <SpacingBox label="md" size={16} />
        <SpacingBox label="l" size={18} />
      </Section>

      <Section title="Field Padding Y">
        <SpacingBox label="sm" size={8} />
        <SpacingBox label="sm2" size={10} />
        <SpacingBox label="md" size={12} />
        <SpacingBox label="l" size={22} />
      </Section>

      <Section title="Field Gap">
        <SpacingBox label="input_helper" size={6} />
        <SpacingBox label="label_input" size={8} />
        <SpacingBox label="group_horizontal" size={16} />
        <SpacingBox label="group_vertical" size={16} />
      </Section>

      <Section title="Container">
        <SpacingBox label="compact" size={16} />
        <SpacingBox label="default" size={24} />
        <SpacingBox label="spacious" size={32} />
        <SpacingBox label="gap: elements" size={16} />
        <SpacingBox label="gap: sections" size={48} />
        <SpacingBox label="gap: text_stack" size={5} />
      </Section>

      <Section title="Utility Gaps">
        <SpacingBox label="gap-4" size={4} />
        <SpacingBox label="gap-6" size={6} />
        <SpacingBox label="gap-8" size={8} />
        <SpacingBox label="gap-12" size={12} />
        <SpacingBox label="gap-16" size={16} />
        <SpacingBox label="gap-24" size={24} />
        <SpacingBox label="gap-32" size={32} />
      </Section>
    </div>
  );
}

const meta = {
  title: 'Design Tokens/Spacing',
  component: SpacingPage,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof SpacingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSpacing: Story = {};
