import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from '../components/Tooltip'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <Tooltip content="This is a tooltip">
      <Button variant="secondary">Hover me</Button>
    </Tooltip>
  ),
}

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', padding: '60px' }}>
      <Tooltip content="Top tooltip" placement="top">
        <Button variant="secondary" size="sm">Top</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" placement="right">
        <Button variant="secondary" size="sm">Right</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" placement="bottom">
        <Button variant="secondary" size="sm">Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" placement="left">
        <Button variant="secondary" size="sm">Left</Button>
      </Tooltip>
    </div>
  ),
}

export const OnBadge: Story = {
  render: () => (
    <Tooltip content="Verified on 2024-01-15" placement="top">
      <Badge variant="success" dot>Verified</Badge>
    </Tooltip>
  ),
}

export const NoDelay: Story = {
  render: () => (
    <Tooltip content="Instant tooltip (0ms delay)" delay={0}>
      <Button variant="ghost">No delay</Button>
    </Tooltip>
  ),
}
