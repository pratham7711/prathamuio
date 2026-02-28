import type { Meta, StoryObj } from '@storybook/react'
import { StatCard } from '../components/StatCard'

const meta: Meta<typeof StatCard> = {
  title: 'UI/StatCard',
  component: StatCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StatCard>

export const Default: Story = {
  args: {
    value: '2,840',
    label: 'Total Commits',
    trend: 'up',
    trendLabel: '+12% this month',
    icon: '📦',
  },
}

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', width: '520px' }}>
      <StatCard value="2,840" label="Commits" trend="up" trendLabel="+12%" icon="📦" />
      <StatCard value="48" label="Repositories" trend="neutral" trendLabel="No change" icon="🗂" />
      <StatCard value="1.2k" label="Stars Earned" trend="up" trendLabel="+8%" icon="⭐" />
      <StatCard value="3" label="PRs Open" trend="down" trendLabel="-2 from last week" icon="🔀" />
    </div>
  ),
}

export const TrendVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <div style={{ width: '200px' }}>
        <StatCard value="94%" label="Uptime" trend="up" trendLabel="+2% MoM" icon="✅" />
      </div>
      <div style={{ width: '200px' }}>
        <StatCard value="12ms" label="Latency" trend="neutral" trendLabel="Stable" icon="⚡" />
      </div>
      <div style={{ width: '200px' }}>
        <StatCard value="2" label="Incidents" trend="down" trendLabel="+1 this week" icon="🚨" />
      </div>
    </div>
  ),
}
