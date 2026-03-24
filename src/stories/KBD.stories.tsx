import type { Meta, StoryObj } from '@storybook/react'
import { KBD, KBDCombo, formatShortcut } from '../components/KBD'

const meta: Meta<typeof KBD> = {
  title: 'UI/KBD',
  component: KBD,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'outlined', 'ghost', 'glass'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof KBD>

export const SingleKey: Story = {
  args: { children: 'K', variant: 'default', size: 'sm' },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <KBD variant="default">Ctrl</KBD>
      <KBD variant="outlined">Ctrl</KBD>
      <KBD variant="ghost">Ctrl</KBD>
      <KBD variant="glass">Ctrl</KBD>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <KBD size="xs">K</KBD>
      <KBD size="sm">K</KBD>
      <KBD size="md">K</KBD>
      <KBD size="lg">K</KBD>
    </div>
  ),
}

export const KeyCombo: Story = {
  render: () => <KBDCombo keys={['\u2318', 'K']} />,
}

export const MultiKeyCombo: Story = {
  render: () => <KBDCombo keys={['Ctrl', 'Shift', 'P']} />,
}

export const PlatformFormatting: Story = {
  render: () => {
    const macKeys = formatShortcut(['Meta', 'Shift', 'P'], 'mac')
    const winKeys = formatShortcut(['Meta', 'Shift', 'P'], 'windows')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <span style={{ color: 'var(--ui-text-2)', fontSize: 12, marginRight: 8 }}>Mac:</span>
          <KBDCombo keys={macKeys} />
        </div>
        <div>
          <span style={{ color: 'var(--ui-text-2)', fontSize: 12, marginRight: 8 }}>Windows:</span>
          <KBDCombo keys={winKeys} />
        </div>
      </div>
    )
  },
}

export const InlineWithText: Story = {
  render: () => (
    <p style={{ color: 'var(--ui-text-1)', fontSize: 14, fontFamily: 'var(--ui-font)' }}>
      Press <KBDCombo keys={['\u2318', 'K']} /> to open the command palette, or{' '}
      <KBD>Esc</KBD> to close it.
    </p>
  ),
}

export const CommonShortcuts: Story = {
  render: () => {
    const shortcuts = [
      { label: 'Copy', keys: ['\u2318', 'C'] },
      { label: 'Paste', keys: ['\u2318', 'V'] },
      { label: 'Undo', keys: ['\u2318', 'Z'] },
      { label: 'Redo', keys: ['\u2318', 'Shift', 'Z'] },
      { label: 'Save', keys: ['\u2318', 'S'] },
      { label: 'Find', keys: ['\u2318', 'F'] },
      { label: 'Select all', keys: ['\u2318', 'A'] },
    ]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {shortcuts.map((s) => (
          <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 240 }}>
            <span style={{ color: 'var(--ui-text-1)', fontSize: 13, fontFamily: 'var(--ui-font)' }}>{s.label}</span>
            <KBDCombo keys={s.keys} size="xs" />
          </div>
        ))}
      </div>
    )
  },
}

export const VariantCombos: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <KBDCombo keys={['\u2318', 'K']} variant="default" />
      <KBDCombo keys={['\u2318', 'K']} variant="outlined" />
      <KBDCombo keys={['\u2318', 'K']} variant="ghost" />
      <KBDCombo keys={['\u2318', 'K']} variant="glass" />
    </div>
  ),
}
