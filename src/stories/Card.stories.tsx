import type { Meta, StoryObj } from '@storybook/react'
import { Card } from '../components/Card'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

const cardStyle = { width: '280px' }

export const Glass: Story = {
  render: () => (
    <div style={cardStyle}>
      <Card variant="glass">
        <h3 style={{ color: 'var(--ui-text-0)', marginBottom: '8px' }}>Glass Card</h3>
        <p style={{ color: 'var(--ui-text-2)', fontSize: '14px' }}>
          Frosted glass surface with subtle border and backdrop blur.
        </p>
      </Card>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {(['glass', 'solid', 'outlined'] as const).map((v) => (
        <div key={v} style={{ width: '220px' }}>
          <Card variant={v}>
            <h4 style={{ color: 'var(--ui-text-0)', marginBottom: '8px', textTransform: 'capitalize' }}>{v}</h4>
            <p style={{ color: 'var(--ui-text-2)', fontSize: '13px' }}>Card content goes here.</p>
          </Card>
        </div>
      ))}
    </div>
  ),
}

export const Clickable: Story = {
  render: () => (
    <div style={cardStyle}>
      <Card variant="glass" clickable onClick={() => alert('Card clicked!')}>
        <h3 style={{ color: 'var(--ui-text-0)', marginBottom: '8px' }}>Clickable Card</h3>
        <p style={{ color: 'var(--ui-text-2)', fontSize: '14px' }}>Click me! Press Enter or Space too.</p>
      </Card>
    </div>
  ),
}

export const NoPadding: Story = {
  render: () => (
    <div style={{ width: '300px', overflow: 'hidden', borderRadius: '16px' }}>
      <Card variant="glass" noPadding>
        <div style={{ background: 'var(--ui-accent-glow)', padding: '20px', borderRadius: '16px 16px 0 0' }}>
          <span style={{ color: 'var(--ui-accent)', fontWeight: 700 }}>Header Area</span>
        </div>
        <div style={{ padding: '20px' }}>
          <p style={{ color: 'var(--ui-text-2)', fontSize: '14px' }}>Body with custom padding.</p>
        </div>
      </Card>
    </div>
  ),
}
