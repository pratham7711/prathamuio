import type { Meta, StoryObj } from '@storybook/react'
import { LoadingSpinner } from '../components/LoadingSpinner'

const meta: Meta<typeof LoadingSpinner> = {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof LoadingSpinner>

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <LoadingSpinner size="sm" />
      <LoadingSpinner size="md" />
      <LoadingSpinner size="lg" />
    </div>
  ),
}

export const Small: Story = { args: { size: 'sm' } }
export const Medium: Story = { args: { size: 'md' } }
export const Large: Story = { args: { size: 'lg' } }

export const InContext: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        color: 'var(--ui-text-2)',
        fontSize: '14px',
      }}
    >
      <LoadingSpinner size="lg" />
      <span>Loading your content…</span>
    </div>
  ),
}
