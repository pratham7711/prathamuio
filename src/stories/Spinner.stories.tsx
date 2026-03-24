import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from '../components/Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'UI/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Spinner>

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner variant="ring" />
        <p style={{ color: 'var(--ui-text-2)', fontSize: 12, marginTop: 8 }}>Ring</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner variant="dots" />
        <p style={{ color: 'var(--ui-text-2)', fontSize: 12, marginTop: 8 }}>Dots</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner variant="pulse" />
        <p style={{ color: 'var(--ui-text-2)', fontSize: 12, marginTop: 8 }}>Pulse</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner variant="bars" />
        <p style={{ color: 'var(--ui-text-2)', fontSize: 12, marginTop: 8 }}>Bars</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner variant="orbit" />
        <p style={{ color: 'var(--ui-text-2)', fontSize: 12, marginTop: 8 }}>Orbit</p>
      </div>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
}

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <Spinner color="accent" />
      <div style={{ background: 'var(--ui-bg-3)', padding: 16, borderRadius: 8 }}>
        <Spinner color="white" />
      </div>
      <div style={{ color: 'var(--ui-warning)' }}>
        <Spinner color="inherit" />
      </div>
    </div>
  ),
}

export const AllSpeeds: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner speed="slow" />
        <p style={{ color: 'var(--ui-text-2)', fontSize: 12, marginTop: 8 }}>Slow</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner speed="normal" />
        <p style={{ color: 'var(--ui-text-2)', fontSize: 12, marginTop: 8 }}>Normal</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner speed="fast" />
        <p style={{ color: 'var(--ui-text-2)', fontSize: 12, marginTop: 8 }}>Fast</p>
      </div>
    </div>
  ),
}

export const OverlayMode: Story = {
  render: () => (
    <div
      style={{
        position: 'relative',
        width: 300,
        height: 200,
        background: 'var(--ui-bg-2)',
        borderRadius: 'var(--ui-r-md)',
        border: '1px solid var(--ui-border)',
        padding: 24,
      }}
    >
      <p style={{ color: 'var(--ui-text-1)' }}>Content behind the overlay spinner.</p>
      <Spinner overlay label="Loading content..." />
    </div>
  ),
}

export const CustomLabel: Story = {
  render: () => (
    <Spinner label="Fetching data, please wait..." />
  ),
}

export const InlineUsage: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ui-text-1)' }}>
      <Spinner size="xs" color="inherit" />
      <span>Saving changes...</span>
    </div>
  ),
}
