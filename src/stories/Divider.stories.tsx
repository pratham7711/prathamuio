import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from '../components/Divider'

const meta: Meta<typeof Divider> = {
  title: 'UI/Divider',
  component: Divider,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Divider>

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <Divider variant="solid" />
      <Divider variant="dashed" />
      <Divider variant="dotted" />
      <Divider variant="gradient" />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <div>
        <span style={{ color: 'var(--ui-text-2)', fontSize: 12 }}>sm</span>
        <Divider size="sm" />
      </div>
      <div>
        <span style={{ color: 'var(--ui-text-2)', fontSize: 12 }}>md</span>
        <Divider size="md" />
      </div>
      <div>
        <span style={{ color: 'var(--ui-text-2)', fontSize: 12 }}>lg</span>
        <Divider size="lg" />
      </div>
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <Divider label="OR" />
      <Divider label="Section Title" variant="dashed" />
      <Divider label="Continue" variant="gradient" />
    </div>
  ),
}

export const LabelPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <Divider label="Start" labelPosition="start" />
      <Divider label="Center" labelPosition="center" />
      <Divider label="End" labelPosition="end" />
    </div>
  ),
}

export const VerticalInFlex: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '80px' }}>
      <span style={{ color: 'var(--ui-text-1)' }}>Left</span>
      <Divider orientation="vertical" />
      <span style={{ color: 'var(--ui-text-1)' }}>Center</span>
      <Divider orientation="vertical" variant="dashed" />
      <span style={{ color: 'var(--ui-text-1)' }}>Right</span>
    </div>
  ),
}

export const GradientDivider: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <Divider variant="gradient" />
      <Divider variant="gradient" label="Gradient with label" />
    </div>
  ),
}

export const CustomColor: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <Divider color="#ef4444" />
      <Divider color="#f59e0b" label="Warning" />
      <Divider color="#22c55e" variant="dashed" />
    </div>
  ),
}

export const AllSpacing: Story = {
  render: () => (
    <div style={{ width: '100%' }}>
      <p style={{ color: 'var(--ui-text-1)', margin: 0 }}>Content above</p>
      <Divider spacing="sm" label="sm spacing" />
      <p style={{ color: 'var(--ui-text-1)', margin: 0 }}>Content between</p>
      <Divider spacing="md" label="md spacing" />
      <p style={{ color: 'var(--ui-text-1)', margin: 0 }}>Content between</p>
      <Divider spacing="lg" label="lg spacing" />
      <p style={{ color: 'var(--ui-text-1)', margin: 0 }}>Content below</p>
    </div>
  ),
}
