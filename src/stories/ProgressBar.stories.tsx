import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar } from '../components/ProgressBar'

const meta: Meta<typeof ProgressBar> = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    variant: { control: 'select', options: ['accent', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md'] },
    showLabel: { control: 'boolean' },
    animated: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof ProgressBar>

export const Primary: Story = {
  args: { value: 60, variant: 'accent', size: 'md' },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '300px' }}>
      <ProgressBar value={60} variant="accent" showLabel />
      <ProgressBar value={80} variant="success" showLabel />
      <ProgressBar value={45} variant="warning" showLabel />
      <ProgressBar value={30} variant="danger" showLabel />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '300px' }}>
      <ProgressBar value={50} size="sm" />
      <ProgressBar value={50} size="md" />
    </div>
  ),
}

export const WithLabel: Story = {
  args: { value: 75, variant: 'accent', showLabel: true },
}

export const Animated: Story = {
  args: { value: 65, variant: 'success', animated: true, showLabel: true },
}

export const ProgressValues: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '300px' }}>
      <ProgressBar value={0} showLabel />
      <ProgressBar value={25} showLabel />
      <ProgressBar value={50} showLabel />
      <ProgressBar value={75} showLabel />
      <ProgressBar value={100} showLabel />
    </div>
  ),
}

export const EdgeCases: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '300px' }}>
      <ProgressBar value={-10} showLabel />
      <ProgressBar value={0} showLabel />
      <ProgressBar value={100} showLabel />
      <ProgressBar value={150} showLabel />
    </div>
  ),
}
