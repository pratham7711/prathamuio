import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from '../components/Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Avatar>

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar name="Pratham Bhatt" size="sm" />
      <Avatar name="Pratham Bhatt" size="md" />
      <Avatar name="Pratham Bhatt" size="lg" />
      <Avatar name="Pratham Bhatt" size="xl" />
    </div>
  ),
}

export const WithImage: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar
        src="https://avatars.githubusercontent.com/u/1?v=4"
        name="GitHub User"
        size="md"
      />
      <Avatar
        src="broken-url"
        name="Fallback User"
        size="md"
      />
    </div>
  ),
}

export const OnlineStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <Avatar name="Alice Smith" size="lg" online />
        <span style={{ fontSize: '11px', color: 'var(--ui-text-2)' }}>Online</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <Avatar name="Bob Jones" size="lg" />
        <span style={{ fontSize: '11px', color: 'var(--ui-text-2)' }}>Offline</span>
      </div>
    </div>
  ),
}

export const AvatarGroup: Story = {
  render: () => (
    <div style={{ display: 'flex' }}>
      {['Alice Smith', 'Bob Jones', 'Carol King', 'Dave Chen'].map((name, i) => (
        <div key={name} style={{ marginLeft: i === 0 ? 0 : '-10px', zIndex: 4 - i }}>
          <Avatar name={name} size="md" />
        </div>
      ))}
    </div>
  ),
}
