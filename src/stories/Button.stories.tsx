import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../components/Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger', 'glow'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { children: 'Get Started', variant: 'primary', size: 'md' },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="glow">Glow ✦</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const Loading: Story = {
  args: { children: 'Saving…', loading: true, variant: 'primary' },
}

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary" disabled>Primary</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="glow" disabled>Glow</Button>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary" iconLeft="→">Deploy</Button>
      <Button variant="secondary" iconRight="↗">Open</Button>
      <Button variant="ghost" iconLeft="⚙">Settings</Button>
    </div>
  ),
}

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <Button variant="primary" fullWidth>Full Width Button</Button>
    </div>
  ),
}
