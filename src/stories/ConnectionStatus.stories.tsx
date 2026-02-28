import type { Meta, StoryObj } from '@storybook/react'
import { ConnectionStatus } from '../components/ConnectionStatus'

const meta: Meta<typeof ConnectionStatus> = {
  title: 'UI/ConnectionStatus',
  component: ConnectionStatus,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ConnectionStatus>

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <ConnectionStatus state="connected" variant="badge" />
      <ConnectionStatus state="connecting" variant="badge" />
      <ConnectionStatus state="disconnected" variant="badge" />
      <ConnectionStatus state="unavailable" variant="badge" />
    </div>
  ),
}

export const Banners: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '400px' }}>
      <ConnectionStatus state="connected" variant="banner" />
      <ConnectionStatus state="connecting" variant="banner" />
      <ConnectionStatus state="disconnected" variant="banner" />
      <ConnectionStatus state="unavailable" variant="banner" />
    </div>
  ),
}

export const ConnectedBadge: Story = {
  args: { state: 'connected', variant: 'badge' },
}

export const ConnectingBanner: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <ConnectionStatus
        state="connecting"
        variant="banner"
        label="Reconnecting to server…"
      />
    </div>
  ),
}

export const DisconnectedBanner: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <ConnectionStatus
        state="disconnected"
        variant="banner"
        label="Lost connection. Check your network."
      />
    </div>
  ),
}
