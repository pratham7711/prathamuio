import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { RadioGroup, Radio } from '../components/Radio'

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/Radio',
  component: RadioGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RadioGroup>

const col = { display: 'flex', flexDirection: 'column' as const, gap: '16px', minWidth: '300px' }

export const Basic: Story = {
  render: () => (
    <div style={col}>
      <RadioGroup name="basic" defaultValue="react" label="Favourite framework">
        <Radio value="react" label="React" />
        <Radio value="vue" label="Vue" />
        <Radio value="svelte" label="Svelte" />
      </RadioGroup>
    </div>
  ),
}

export const CardVariant: Story = {
  render: () => (
    <div style={col}>
      <RadioGroup name="plan" defaultValue="pro" variant="card" label="Select plan">
        <Radio value="free" label="Free" description="For personal projects" />
        <Radio value="pro" label="Pro" description="For growing teams" />
        <Radio value="enterprise" label="Enterprise" description="Custom solutions" />
      </RadioGroup>
    </div>
  ),
}

export const HorizontalLayout: Story = {
  render: () => (
    <div style={col}>
      <RadioGroup name="size" defaultValue="md" orientation="horizontal" label="Size">
        <Radio value="sm" label="Small" />
        <Radio value="md" label="Medium" />
        <Radio value="lg" label="Large" />
      </RadioGroup>
    </div>
  ),
}

export const WithDescriptions: Story = {
  render: () => (
    <div style={col}>
      <RadioGroup name="notify" defaultValue="email" label="Notification method">
        <Radio
          value="email"
          label="Email"
          description="Get notified via your email address"
        />
        <Radio
          value="sms"
          label="SMS"
          description="Receive text messages on your phone"
        />
        <Radio
          value="push"
          label="Push notification"
          description="Browser push notifications"
        />
      </RadioGroup>
    </div>
  ),
}

export const ErrorState: Story = {
  render: () => (
    <div style={col}>
      <RadioGroup name="agree" label="Do you agree?" error="Please select an option.">
        <Radio value="yes" label="Yes" />
        <Radio value="no" label="No" />
      </RadioGroup>
    </div>
  ),
}

export const DisabledOptions: Story = {
  render: () => (
    <div style={col}>
      <RadioGroup name="tier" defaultValue="basic" label="Subscription">
        <Radio value="basic" label="Basic" />
        <Radio value="premium" label="Premium" disabled />
        <Radio value="team" label="Team" />
      </RadioGroup>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px' }}>
      <RadioGroup name="s-sm" defaultValue="a" size="sm" label="Small">
        <Radio value="a" label="Alpha" />
        <Radio value="b" label="Beta" />
      </RadioGroup>
      <RadioGroup name="s-md" defaultValue="a" size="md" label="Medium">
        <Radio value="a" label="Alpha" />
        <Radio value="b" label="Beta" />
      </RadioGroup>
      <RadioGroup name="s-lg" defaultValue="a" size="lg" label="Large">
        <Radio value="a" label="Alpha" />
        <Radio value="b" label="Beta" />
      </RadioGroup>
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('react')
    return (
      <div style={col}>
        <RadioGroup
          name="ctrl"
          value={value}
          onChange={setValue}
          label={`Selected: ${value}`}
        >
          <Radio value="react" label="React" />
          <Radio value="vue" label="Vue" />
          <Radio value="angular" label="Angular" />
        </RadioGroup>
        <button
          style={{ alignSelf: 'flex-start', cursor: 'pointer' }}
          onClick={() => setValue('vue')}
        >
          Select Vue externally
        </button>
      </div>
    )
  },
}
