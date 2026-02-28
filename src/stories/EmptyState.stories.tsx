import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from '../components/EmptyState'
import { Button } from '../components/Button'

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  render: () => (
    <EmptyState
      icon="📭"
      title="No messages yet"
      description="When you receive messages, they'll appear here. Start a conversation!"
      action={<Button variant="primary">Start Chatting</Button>}
    />
  ),
}

export const NoAction: Story = {
  render: () => (
    <EmptyState
      icon="🔍"
      title="No results found"
      description="Try adjusting your search or filters to find what you're looking for."
    />
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{ width: '280px', background: 'var(--ui-bg-2)', borderRadius: '16px', border: '1px solid var(--ui-border)' }}>
        <EmptyState icon="📦" title="No repos" description="Create your first repository." action={<Button size="sm">Create</Button>} />
      </div>
      <div style={{ width: '280px', background: 'var(--ui-bg-2)', borderRadius: '16px', border: '1px solid var(--ui-border)' }}>
        <EmptyState icon="⭐" title="No stars" description="Star repos you want to find later." />
      </div>
      <div style={{ width: '280px', background: 'var(--ui-bg-2)', borderRadius: '16px', border: '1px solid var(--ui-border)' }}>
        <EmptyState icon="🔀" title="No PRs" description="Open pull requests will show here." />
      </div>
    </div>
  ),
}
