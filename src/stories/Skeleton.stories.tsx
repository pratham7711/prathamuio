import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from '../components/Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const TextLines: Story = {
  render: () => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="45%" />
    </div>
  ),
}

export const CardSkeleton: Story = {
  render: () => (
    <div
      style={{
        width: '300px',
        padding: '20px',
        background: 'var(--ui-bg-2)',
        borderRadius: '16px',
        border: '1px solid var(--ui-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Skeleton variant="circle" width={40} height={40} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="rect" height={120} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="65%" />
    </div>
  ),
}

export const Rect: Story = {
  render: () => <Skeleton variant="rect" width={300} height={180} />,
}

export const Circle: Story = {
  render: () => <Skeleton variant="circle" width={80} height={80} />,
}
