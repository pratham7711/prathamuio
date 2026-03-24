import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { ThemeSwitcher } from '../components/ThemeSwitcher'
import type { ThemeOption } from '../components/ThemeSwitcher'

const meta: Meta<typeof ThemeSwitcher> = {
  title: 'UI/ThemeSwitcher',
  component: ThemeSwitcher,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['toggle', 'dropdown', 'segmented', 'icon'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    showLabel: { control: 'boolean' },
    showPreview: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof ThemeSwitcher>

const SystemIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5.5 14h5M8 11v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const tripleOptions: ThemeOption[] = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
  { id: 'system', label: 'System', icon: <SystemIcon /> },
]

const colorOptions: ThemeOption[] = [
  { id: 'dark', label: 'Dark', colors: { primary: '#00E5D1', bg: '#080810' } },
  { id: 'light', label: 'Light', colors: { primary: '#0066FF', bg: '#ffffff' } },
  { id: 'sunset', label: 'Sunset', colors: { primary: '#ff6b35', bg: '#1a0a00' } },
  { id: 'forest', label: 'Forest', colors: { primary: '#22c55e', bg: '#001a0a' } },
]

export const DarkLightToggle: Story = {
  render: () => {
    const [value, setValue] = useState('dark')
    return (
      <ThemeSwitcher
        value={value}
        onChange={setValue}
        variant="toggle"
        showLabel
        applyToDocument={false}
      />
    )
  },
}

export const DropdownMultiTheme: Story = {
  render: () => {
    const [value, setValue] = useState('dark')
    return (
      <ThemeSwitcher
        value={value}
        onChange={setValue}
        variant="dropdown"
        options={colorOptions}
        showLabel
        showPreview
        applyToDocument={false}
      />
    )
  },
}

export const SegmentedThreeThemes: Story = {
  render: () => {
    const [value, setValue] = useState('dark')
    return (
      <ThemeSwitcher
        value={value}
        onChange={setValue}
        variant="segmented"
        options={tripleOptions}
        showLabel
        applyToDocument={false}
      />
    )
  },
}

export const IconCycling: Story = {
  render: () => {
    const [value, setValue] = useState('dark')
    return (
      <ThemeSwitcher
        value={value}
        onChange={setValue}
        variant="icon"
        options={tripleOptions}
        applyToDocument={false}
      />
    )
  },
}

export const WithColorPreviews: Story = {
  render: () => {
    const [value, setValue] = useState('dark')
    return (
      <ThemeSwitcher
        value={value}
        onChange={setValue}
        variant="segmented"
        options={colorOptions}
        showLabel
        showPreview
        applyToDocument={false}
      />
    )
  },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <ThemeSwitcher key={s} size={s} variant="toggle" showLabel applyToDocument={false} />
      ))}
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => {
    const [value, setValue] = useState('dark')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: 'var(--ui-text-2)', fontSize: 11, marginBottom: 4, fontFamily: 'var(--ui-font)' }}>Toggle</div>
          <ThemeSwitcher value={value} onChange={setValue} variant="toggle" showLabel applyToDocument={false} />
        </div>
        <div>
          <div style={{ color: 'var(--ui-text-2)', fontSize: 11, marginBottom: 4, fontFamily: 'var(--ui-font)' }}>Dropdown</div>
          <ThemeSwitcher value={value} onChange={setValue} variant="dropdown" showLabel applyToDocument={false} />
        </div>
        <div>
          <div style={{ color: 'var(--ui-text-2)', fontSize: 11, marginBottom: 4, fontFamily: 'var(--ui-font)' }}>Segmented</div>
          <ThemeSwitcher value={value} onChange={setValue} variant="segmented" showLabel applyToDocument={false} />
        </div>
        <div>
          <div style={{ color: 'var(--ui-text-2)', fontSize: 11, marginBottom: 4, fontFamily: 'var(--ui-font)' }}>Icon</div>
          <ThemeSwitcher value={value} onChange={setValue} variant="icon" applyToDocument={false} />
        </div>
      </div>
    )
  },
}

export const CustomThemeOptions: Story = {
  render: () => {
    const [value, setValue] = useState('dark')
    return (
      <ThemeSwitcher
        value={value}
        onChange={setValue}
        variant="dropdown"
        options={colorOptions}
        showLabel
        showPreview
        applyToDocument={false}
      />
    )
  },
}
