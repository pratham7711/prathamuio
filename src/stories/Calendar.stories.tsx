import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { Calendar } from '../components/Calendar'

const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Basic: Story = {
  render: () => <Calendar />,
}

export const Glass: Story = {
  render: () => <Calendar variant="glass" />,
}

export const Compact: Story = {
  render: () => <Calendar variant="compact" />,
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Calendar size="sm" />
      <Calendar size="md" />
      <Calendar size="lg" />
    </div>
  ),
}

export const MinMaxDates: Story = {
  render: () => {
    const today = new Date()
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5)
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10)
    return <Calendar minDate={minDate} maxDate={maxDate} />
  },
}

export const DisabledDatesFunction: Story = {
  render: () => (
    <Calendar disabledDates={(date) => date.getDay() === 0 || date.getDay() === 6} />
  ),
}

export const HighlightedDates: Story = {
  render: () => {
    const today = new Date()
    const highlighted = [
      new Date(today.getFullYear(), today.getMonth(), 5),
      new Date(today.getFullYear(), today.getMonth(), 12),
      new Date(today.getFullYear(), today.getMonth(), 20),
      new Date(today.getFullYear(), today.getMonth(), 25),
    ]
    return <Calendar highlightedDates={highlighted} />
  },
}

export const WeekStartsMonday: Story = {
  render: () => <Calendar weekStartsOn={1} />,
}

const ControlledDemo = () => {
  const [date, setDate] = useState<Date | null>(new Date())
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <Calendar value={date} onChange={setDate} />
      <p style={{ color: 'var(--ui-text-1)', fontSize: 14 }}>
        Selected: {date ? date.toLocaleDateString() : 'None'}
      </p>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}
