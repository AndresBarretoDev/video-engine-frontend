import type { Meta, StoryObj } from '@storybook/react';

const TypeSample = ({
  label,
  size,
  lineHeight,
  weight,
  text
}: {
  label: string;
  size: number;
  lineHeight: number;
  weight: number;
  text: string;
}) => (
  <div style={{ marginBottom: 24 }}>
    <div
      style={{
        fontSize: 10,
        color: '#6E6E6E',
        fontFamily: 'monospace',
        marginBottom: 4
      }}
    >
      {label} — {size}px / {lineHeight}px / {weight}
    </div>
    <div
      style={{
        fontSize: size,
        lineHeight: `${lineHeight}px`,
        fontWeight: weight,
        fontFamily: 'Mulish, sans-serif',
        color: '#F5F5F5'
      }}
    >
      {text}
    </div>
  </div>
);

const Section = ({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div style={{ marginBottom: 48 }}>
    <h3
      style={{
        fontSize: 16,
        fontWeight: 600,
        color: '#8C8C8C',
        marginBottom: 4
      }}
    >
      {title}
    </h3>
    {description && (
      <p
        style={{
          fontSize: 12,
          color: '#545454',
          marginBottom: 16
        }}
      >
        {description}
      </p>
    )}
    {children}
  </div>
);

function TypographyPage() {
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
        Vibe Coding <span style={{ color: '#4361EF' }}>Typography</span>
      </h1>
      <p style={{ fontSize: 14, color: '#8C8C8C', marginBottom: 48 }}>
        Font: Mulish — Source: typography_system.json v2.2.0
      </p>

      <Section
        title="Display"
        description="High impact — hero sections and main titles"
      >
        <TypeSample
          label="Display XL Bold"
          size={60}
          lineHeight={62}
          weight={700}
          text="Video Engine"
        />
        <TypeSample
          label="Display L Bold"
          size={40}
          lineHeight={42}
          weight={700}
          text="Personalized Video at Scale"
        />
        <TypeSample
          label="Display M Medium"
          size={32}
          lineHeight={34}
          weight={500}
          text="Automated Production Pipeline"
        />
      </Section>

      <Section title="Headings">
        <TypeSample
          label="H1"
          size={48}
          lineHeight={50}
          weight={700}
          text="Project Dashboard"
        />
        <TypeSample
          label="H2"
          size={32}
          lineHeight={34}
          weight={700}
          text="Render Queue"
        />
        <TypeSample
          label="H3"
          size={24}
          lineHeight={26}
          weight={600}
          text="Asset Library"
        />
        <TypeSample
          label="H4"
          size={20}
          lineHeight={22}
          weight={600}
          text="Component Registry"
        />
      </Section>

      <Section title="Body">
        {(['bold', 'medium', 'regular', 'light'] as const).map((w) => {
          const weightMap = { bold: 700, medium: 500, regular: 400, light: 300 };
          return (
            <div key={w} style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 11,
                  color: '#4361EF',
                  fontWeight: 600,
                  marginBottom: 8
                }}
              >
                Weight: {w} ({weightMap[w]})
              </div>
              <TypeSample
                label="Body Large"
                size={18}
                lineHeight={20}
                weight={weightMap[w]}
                text="The quick brown fox jumps over the lazy dog."
              />
              <TypeSample
                label="Body Regular"
                size={16}
                lineHeight={18}
                weight={weightMap[w]}
                text="The quick brown fox jumps over the lazy dog."
              />
              <TypeSample
                label="Body Small"
                size={14}
                lineHeight={16}
                weight={weightMap[w]}
                text="The quick brown fox jumps over the lazy dog."
              />
              <TypeSample
                label="Body X-Small"
                size={12}
                lineHeight={14}
                weight={weightMap[w]}
                text="The quick brown fox jumps over the lazy dog."
              />
            </div>
          );
        })}
      </Section>

      <Section title="Caption">
        <TypeSample
          label="Caption Bold"
          size={10}
          lineHeight={12}
          weight={700}
          text="CAPTION TEXT — BOLD"
        />
        <TypeSample
          label="Caption Medium"
          size={10}
          lineHeight={12}
          weight={500}
          text="Caption text — Medium"
        />
        <TypeSample
          label="Caption Light"
          size={10}
          lineHeight={12}
          weight={300}
          text="Caption text — Light"
        />
      </Section>

      <Section title="CTA">
        <TypeSample
          label="Primary/Secondary Bold"
          size={16}
          lineHeight={18}
          weight={700}
          text="Start Rendering"
        />
        <TypeSample
          label="Primary/Secondary Medium"
          size={16}
          lineHeight={18}
          weight={500}
          text="Start Rendering"
        />
        <TypeSample
          label="CTA Small"
          size={12}
          lineHeight={14}
          weight={500}
          text="View Details"
        />
        <TypeSample
          label="Tertiary Medium"
          size={14}
          lineHeight={16}
          weight={300}
          text="Learn more"
        />
        <TypeSample
          label="Tertiary Small"
          size={12}
          lineHeight={14}
          weight={300}
          text="Learn more"
        />
      </Section>
    </div>
  );
}

const meta = {
  title: 'Design Tokens/Typography',
  component: TypographyPage,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof TypographyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllTypography: Story = {};
