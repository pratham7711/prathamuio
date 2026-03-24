import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Checkbox } from '../components/Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Checkbox>

const col = { display: 'flex', flexDirection: 'column' as const, gap: '12px' }

export const Basic: Story = {
  render: () => <Checkbox label="Accept terms and conditions" defaultChecked />,
}

export const AllVariants: Story = {
  render: () => (
    <div style={col}>
      <Checkbox variant="default" label="Default variant" defaultChecked />
      <Checkbox variant="filled" label="Filled variant" defaultChecked />
      <Checkbox variant="outlined" label="Outlined variant" defaultChecked />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={col}>
      <Checkbox size="sm" label="Small" defaultChecked />
      <Checkbox size="md" label="Medium" defaultChecked />
      <Checkbox size="lg" label="Large" defaultChecked />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => <Checkbox label="Send me email notifications" />,
}

export const WithDescription: Story = {
  render: () => (
    <div style={col}>
      <Checkbox
        label="Marketing emails"
        description="Receive occasional emails about new features and promotions."
      />
      <Checkbox
        label="Security alerts"
        description="Get notified about important security updates."
        defaultChecked
      />
    </div>
  ),
}

export const ErrorState: Story = {
  render: () => (
    <Checkbox
      label="I agree to the terms of service"
      error="You must accept the terms to continue."
    />
  ),
}

export const Indeterminate: Story = {
  render: () => (
    <div style={col}>
      <Checkbox label="Select all" indeterminate />
      <div style={{ paddingLeft: '24px', ...col }}>
        <Checkbox label="Option A" defaultChecked />
        <Checkbox label="Option B" />
        <Checkbox label="Option C" defaultChecked />
      </div>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div style={col}>
      <Checkbox label="Disabled unchecked" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
      <Checkbox label="Disabled indeterminate" disabled indeterminate />
    </div>
  ),
}

export const ColorOptions: Story = {
  render: () => (
    <div style={col}>
      <Checkbox color="accent" label="Accent" defaultChecked />
      <Checkbox color="success" label="Success" defaultChecked />
      <Checkbox color="warning" label="Warning" defaultChecked />
      <Checkbox color="danger" label="Danger" defaultChecked />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <div style={col}>
        <Checkbox
          label={`Checkbox is ${checked ? 'checked' : 'unchecked'}`}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <button
          style={{ alignSelf: 'flex-start', cursor: 'pointer' }}
          onClick={() => setChecked(!checked)}
        >
          Toggle externally
        </button>
      </div>
    )
  },
}
