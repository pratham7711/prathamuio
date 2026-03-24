import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Stepper, Step } from '../components/Stepper'

const meta: Meta<typeof Stepper> = {
  title: 'UI/Stepper',
  component: Stepper,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Stepper>

export const Default: Story = {
  render: () => (
    <div style={{ width: '600px' }}>
      <Stepper activeStep={1}>
        <Step label="Account" />
        <Step label="Details" />
        <Step label="Review" />
        <Step label="Submit" />
      </Stepper>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '600px' }}>
      {(['default', 'outlined', 'dots', 'progress'] as const).map((v) => (
        <div key={v}>
          <span style={{ color: 'var(--ui-text-2)', fontSize: '12px', marginBottom: '8px', display: 'block' }}>{v}</span>
          <Stepper activeStep={2} variant={v}>
            <Step label="Step 1" />
            <Step label="Step 2" />
            <Step label="Step 3" />
            <Step label="Step 4" />
          </Stepper>
        </div>
      ))}
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '600px' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s}>
          <span style={{ color: 'var(--ui-text-2)', fontSize: '12px', marginBottom: '8px', display: 'block' }}>{s}</span>
          <Stepper activeStep={1} size={s}>
            <Step label="One" />
            <Step label="Two" />
            <Step label="Three" />
          </Stepper>
        </div>
      ))}
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Stepper activeStep={1} orientation="vertical">
        <Step label="Create account" description="Set up your credentials">
          <div style={{ padding: '8px 0', color: 'var(--ui-text-2)', fontSize: '14px' }}>
            Fill in your email and password to get started.
          </div>
        </Step>
        <Step label="Personal details" description="Tell us about yourself">
          <div style={{ padding: '8px 0', color: 'var(--ui-text-2)', fontSize: '14px' }}>
            Enter your name, address, and phone number.
          </div>
        </Step>
        <Step label="Confirmation" description="Review and submit" />
      </Stepper>
    </div>
  ),
}

export const WithDescriptions: Story = {
  render: () => (
    <div style={{ width: '700px' }}>
      <Stepper activeStep={1}>
        <Step label="Shipping" description="Enter address" />
        <Step label="Payment" description="Add card details" />
        <Step label="Review" description="Confirm order" />
      </Stepper>
    </div>
  ),
}

export const ErrorStep: Story = {
  render: () => (
    <div style={{ width: '600px' }}>
      <Stepper activeStep={2}>
        <Step label="Account" />
        <Step label="Verification" error />
        <Step label="Complete" />
      </Stepper>
    </div>
  ),
}

export const ClickableNavigation: Story = {
  render: () => {
    const [active, setActive] = useState(0)
    return (
      <div style={{ width: '600px' }}>
        <Stepper activeStep={active} onStepClick={setActive}>
          <Step label="Select plan" />
          <Step label="Add-ons" />
          <Step label="Checkout" />
          <Step label="Done" />
        </Stepper>
        <div style={{ marginTop: '16px', color: 'var(--ui-text-1)', fontFamily: 'var(--ui-font-mono)', fontSize: '13px', textAlign: 'center' }}>
          Active step: {active}
        </div>
      </div>
    )
  },
}

export const OptionalSteps: Story = {
  render: () => (
    <div style={{ width: '600px' }}>
      <Stepper activeStep={1}>
        <Step label="Required" />
        <Step label="Optional info" optional />
        <Step label="Submit" />
      </Stepper>
    </div>
  ),
}

export const CustomIcons: Story = {
  render: () => (
    <div style={{ width: '600px' }}>
      <Stepper activeStep={1}>
        <Step label="Cart" icon={<span style={{ fontSize: '16px' }}>&#128722;</span>} />
        <Step label="Shipping" icon={<span style={{ fontSize: '16px' }}>&#128230;</span>} />
        <Step label="Payment" icon={<span style={{ fontSize: '16px' }}>&#128179;</span>} />
      </Stepper>
    </div>
  ),
}
