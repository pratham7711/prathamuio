import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Toggle } from '../components/Toggle'

const meta: Meta<typeof Toggle> = {
  title: 'UI/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    label: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    onChange: { action: 'toggled' },
  },
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Primary: Story = {
  args: { checked: false, label: 'Enable notifications', size: 'md' },
}

export const AllSizes: Story = {
  render: () => {
    const [sm, setSm] = useState(false)
    const [md, setMd] = useState(true)
    return (
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Toggle size="sm" checked={sm} onChange={setSm} label="Small" />
        <Toggle size="md" checked={md} onChange={setMd} label="Medium" />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <Toggle checked={false} onChange={() => {}} disabled label="Disabled off" />
      <Toggle checked={true} onChange={() => {}} disabled label="Disabled on" />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(true)
    return <Toggle checked={checked} onChange={setChecked} label="Dark mode" />
  },
}

export const WithoutLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return <Toggle checked={checked} onChange={setChecked} />
  },
}

export const Interactive: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true)
    const [darkMode, setDarkMode] = useState(false)
    const [autoSave, setAutoSave] = useState(true)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Toggle checked={notifications} onChange={setNotifications} label="Push notifications" />
        <Toggle checked={darkMode} onChange={setDarkMode} label="Dark mode" />
        <Toggle checked={autoSave} onChange={setAutoSave} label="Auto-save" />
      </div>
    )
  },
}
