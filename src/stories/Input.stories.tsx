import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '../components/Input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

const wrap = { width: '320px' }

export const Default: Story = {
  render: () => (
    <div style={wrap}>
      <Input label="Email address" placeholder="you@example.com" type="email" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ ...wrap, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input" />
      <Input size="lg" placeholder="Large input" />
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div style={{ ...wrap, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Input iconLeft="🔍" placeholder="Search…" />
      <Input iconLeft="@" placeholder="Username" />
      <Input iconLeft="🔒" iconRight="👁" placeholder="Password" type="password" />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div style={wrap}>
      <Input
        label="Email"
        value="not-an-email"
        error="Please enter a valid email address."
        readOnly
      />
    </div>
  ),
}

export const WithCharCount: Story = {
  render: () => (
    <div style={wrap}>
      <Input
        label="Username"
        placeholder="Enter username"
        maxLength={20}
        showCount
        defaultValue="pratham"
      />
    </div>
  ),
}
