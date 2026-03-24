import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { DatePicker } from '../components/DatePicker'

const meta: Meta<typeof DatePicker> = {
  title: 'UI/DatePicker',
  component: DatePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'filled', 'ghost', 'glass'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    placement: { control: 'select', options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'] },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof DatePicker>

export const Basic: Story = {
  render: () => <DatePicker />,
}

export const WithLabel: Story = {
  render: () => <DatePicker label="Start date" />,
}

export const WithError: Story = {
  render: () => <DatePicker label="Due date" error="This field is required" />,
}

export const MinMaxDates: Story = {
  render: () => {
    const today = new Date()
    const min = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
    const max = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14)
    return <DatePicker label="Select within range" minDate={min} maxDate={max} />
  },
}

export const DisabledDates: Story = {
  render: () => (
    <DatePicker
      label="No weekends"
      disabledDates={(date) => date.getDay() === 0 || date.getDay() === 6}
    />
  ),
}

export const DifferentFormats: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '280px' }}>
      <DatePicker label="MMM dd, yyyy" format="MMM dd, yyyy" defaultValue={new Date(2024, 0, 15)} />
      <DatePicker label="MM/dd/yyyy" format="MM/dd/yyyy" defaultValue={new Date(2024, 0, 15)} />
      <DatePicker label="dd/MM/yyyy" format="dd/MM/yyyy" defaultValue={new Date(2024, 0, 15)} />
      <DatePicker label="yyyy-MM-dd" format="yyyy-MM-dd" defaultValue={new Date(2024, 0, 15)} />
    </div>
  ),
}

export const Clearable: Story = {
  render: () => <DatePicker label="Clearable (default)" defaultValue={new Date()} clearable />,
}

export const NotClearable: Story = {
  render: () => <DatePicker label="Not clearable" defaultValue={new Date()} clearable={false} />,
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <DatePicker size="sm" label="Small" defaultValue={new Date()} />
      <DatePicker size="md" label="Medium" defaultValue={new Date()} />
      <DatePicker size="lg" label="Large" defaultValue={new Date()} />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <DatePicker variant="default" label="Default" defaultValue={new Date()} />
      <DatePicker variant="filled" label="Filled" defaultValue={new Date()} />
      <DatePicker variant="ghost" label="Ghost" defaultValue={new Date()} />
      <DatePicker variant="glass" label="Glass" defaultValue={new Date()} />
    </div>
  ),
}

export const GlassVariant: Story = {
  render: () => (
    <div style={{ padding: '32px', background: 'var(--ui-bg-1)', borderRadius: '12px' }}>
      <DatePicker variant="glass" label="Glass date picker" defaultValue={new Date()} />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => <DatePicker label="Disabled" defaultValue={new Date()} disabled />,
}

export const ReadOnly: Story = {
  render: () => <DatePicker label="Read only" defaultValue={new Date()} readOnly />,
}

export const PlacementOptions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', paddingTop: '300px', flexWrap: 'wrap' }}>
      <DatePicker label="Top Start" placement="top-start" />
      <DatePicker label="Top End" placement="top-end" />
      <DatePicker label="Bottom Start" placement="bottom-start" />
      <DatePicker label="Bottom End" placement="bottom-end" />
    </div>
  ),
}

const ControlledDemo = () => {
  const [date, setDate] = useState<Date | null>(new Date())
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <DatePicker value={date} onChange={setDate} label="Controlled" />
      <p style={{ color: 'var(--ui-text-1)', fontSize: 14 }}>
        Selected: {date ? date.toLocaleDateString() : 'None'}
      </p>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}
