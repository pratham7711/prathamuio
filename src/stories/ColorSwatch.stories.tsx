import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { ColorSwatch, ColorSwatchGroup } from '../components/ColorSwatch'

const meta: Meta<typeof ColorSwatch> = {
  title: 'UI/ColorSwatch',
  component: ColorSwatch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ColorSwatch>

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <ColorSwatch color="#00E5D1" variant="circle" />
      <ColorSwatch color="#00E5D1" variant="square" />
      <ColorSwatch color="#00E5D1" variant="rounded" />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <ColorSwatch color="#00E5D1" size="sm" />
      <ColorSwatch color="#00E5D1" size="md" />
      <ColorSwatch color="#00E5D1" size="lg" />
      <ColorSwatch color="#00E5D1" size="xl" />
    </div>
  ),
}

export const SelectedState: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <ColorSwatch color="#ef4444" selected />
      <ColorSwatch color="#f59e0b" selected variant="square" />
      <ColorSwatch color="#22c55e" selected variant="rounded" />
    </div>
  ),
}

export const WithLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <ColorSwatch color="#ef4444" withLabel />
      <ColorSwatch color="#f59e0b" withLabel />
      <ColorSwatch color="#22c55e" withLabel />
      <ColorSwatch color="#3b82f6" withLabel />
    </div>
  ),
}

export const WithBorder: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <ColorSwatch color="#ffffff" withBorder />
      <ColorSwatch color="#f0f0f0" withBorder />
      <ColorSwatch color="#000000" withBorder />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <ColorSwatch color="#ef4444" disabled />
      <ColorSwatch color="#22c55e" disabled />
      <ColorSwatch color="#3b82f6" disabled />
    </div>
  ),
}

export const CustomColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {[
        '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
        '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
        '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
        '#ec4899', '#f43f5e',
      ].map((c) => (
        <ColorSwatch key={c} color={c} />
      ))}
    </div>
  ),
}

const GroupDemo = () => {
  const [selected, setSelected] = useState('#00E5D1')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <ColorSwatchGroup
        colors={[
          '#ef4444', '#f97316', '#f59e0b', '#22c55e',
          '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
          '#00E5D1', '#ffffff', '#6b7280', '#000000',
        ]}
        value={selected}
        onChange={setSelected}
        columns={6}
        gap="md"
      />
      <p style={{ color: 'var(--ui-text-1)', fontSize: 14 }}>
        Selected: <span style={{ color: selected }}>{selected}</span>
      </p>
    </div>
  )
}

export const GroupWithSelection: Story = {
  render: () => <GroupDemo />,
}

export const PaletteGrid: Story = {
  render: () => (
    <ColorSwatchGroup
      colors={[
        '#fecaca', '#fde68a', '#bbf7d0', '#bae6fd',
        '#c7d2fe', '#e9d5ff', '#fbcfe8', '#d1d5db',
        '#ef4444', '#f59e0b', '#22c55e', '#0ea5e9',
        '#6366f1', '#a855f7', '#ec4899', '#6b7280',
        '#991b1b', '#92400e', '#166534', '#075985',
        '#3730a3', '#6b21a8', '#9d174d', '#374151',
      ]}
      columns={8}
      gap="sm"
      variant="rounded"
      size="sm"
    />
  ),
}
