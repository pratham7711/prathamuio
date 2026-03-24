import type { Meta, StoryObj } from '@storybook/react'
import { Slider } from '../components/Slider'

const meta: Meta<typeof Slider> = {
  title: 'UI/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Slider>

const wrap = { width: '320px' }
const col = { ...wrap, display: 'flex', flexDirection: 'column' as const, gap: '24px' }

export const Basic: Story = {
  render: () => (
    <div style={wrap}>
      <Slider defaultValue={40} label="Volume" showValue />
    </div>
  ),
}

export const Range: Story = {
  render: () => (
    <div style={wrap}>
      <Slider defaultValue={[20, 80]} label="Price range" showValue formatValue={(v) => `$${v}`} />
    </div>
  ),
}

export const WithMarks: Story = {
  render: () => (
    <div style={wrap}>
      <Slider
        defaultValue={50}
        label="Temperature"
        marks={[
          { value: 0, label: '0°C' },
          { value: 25, label: '25°C' },
          { value: 50, label: '50°C' },
          { value: 75, label: '75°C' },
          { value: 100, label: '100°C' },
        ]}
        showValue
        formatValue={(v) => `${v}°C`}
      />
    </div>
  ),
}

export const WithLabels: Story = {
  render: () => (
    <div style={col}>
      <Slider defaultValue={60} label="Brightness" showValue formatValue={(v) => `${v}%`} />
      <Slider defaultValue={3} min={1} max={5} step={1} label="Rating" showValue formatValue={(v) => `${v}/5`} />
    </div>
  ),
}

export const WithTooltip: Story = {
  render: () => (
    <div style={col}>
      <Slider defaultValue={50} label="Hover for tooltip" showTooltip />
      <Slider defaultValue={75} label="Always visible tooltip" showTooltip="always" />
    </div>
  ),
}

export const Gradient: Story = {
  render: () => (
    <div style={col}>
      <Slider variant="gradient" defaultValue={65} label="Gradient variant" showValue />
      <Slider variant="accent" defaultValue={40} label="Accent variant" showValue />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div style={wrap}>
      <Slider defaultValue={50} label="Disabled slider" disabled showValue />
    </div>
  ),
}

export const CustomFormatting: Story = {
  render: () => (
    <div style={col}>
      <Slider
        defaultValue={50000}
        min={0}
        max={100000}
        step={1000}
        label="Budget"
        showValue
        showTooltip
        formatValue={(v) => `$${(v / 1000).toFixed(0)}k`}
      />
      <Slider
        defaultValue={[9, 17]}
        min={0}
        max={24}
        step={1}
        label="Working hours"
        showValue
        formatValue={(v) => `${v}:00`}
      />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={col}>
      <Slider size="sm" defaultValue={30} label="Small" showValue />
      <Slider size="md" defaultValue={50} label="Medium" showValue />
      <Slider size="lg" defaultValue={70} label="Large" showValue />
    </div>
  ),
}
