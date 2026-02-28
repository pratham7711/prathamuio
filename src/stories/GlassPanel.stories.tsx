import type { Meta, StoryObj } from '@storybook/react'
import { GlassPanel } from '../components/GlassPanel'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'

const meta: Meta<typeof GlassPanel> = {
  title: 'UI/GlassPanel',
  component: GlassPanel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof GlassPanel>

export const Default: Story = {
  render: () => (
    <GlassPanel style={{ width: '360px' }}>
      <h3 style={{ color: 'var(--ui-text-0)', marginBottom: '8px' }}>Glass Panel</h3>
      <p style={{ color: 'var(--ui-text-2)', fontSize: '14px', lineHeight: '1.6' }}>
        Frosted glass container with backdrop blur, border, and subtle background.
      </p>
    </GlassPanel>
  ),
}

export const WithGlow: Story = {
  render: () => (
    <GlassPanel glow style={{ width: '360px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h3 style={{ color: 'var(--ui-text-0)' }}>Glow Panel</h3>
        <Badge variant="accent" dot>Live</Badge>
      </div>
      <p style={{ color: 'var(--ui-text-2)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
        Panel with accent glow border. Great for featured content, API status, or live data.
      </p>
      <Button variant="glow" size="sm">View Details</Button>
    </GlassPanel>
  ),
}

export const NoPadding: Story = {
  render: () => (
    <GlassPanel noPadding style={{ width: '360px', overflow: 'hidden' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, var(--ui-accent-glow), transparent)',
          padding: '20px',
          borderBottom: '1px solid var(--ui-border)',
        }}
      >
        <span style={{ color: 'var(--ui-accent)', fontWeight: 600 }}>Header with no padding</span>
      </div>
      <div style={{ padding: '20px' }}>
        <p style={{ color: 'var(--ui-text-2)', fontSize: '14px' }}>Custom body layout.</p>
      </div>
    </GlassPanel>
  ),
}
