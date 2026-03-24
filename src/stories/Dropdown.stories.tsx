import type { Meta, StoryObj } from '@storybook/react'
import { Dropdown } from '../components/Dropdown'

const meta: Meta<typeof Dropdown> = {
  title: 'UI/Dropdown',
  component: Dropdown,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    trigger: { control: false },
    items: { control: 'object' },
    align: { control: 'select', options: ['left', 'right'] },
  },
}

export default meta
type Story = StoryObj<typeof Dropdown>

const defaultItems = [
  { label: 'Edit', onClick: () => {} },
  { label: 'Duplicate', onClick: () => {} },
  { label: 'Archive', onClick: () => {} },
  { label: 'Delete', danger: true, onClick: () => {} },
]

export const Primary: Story = {
  args: {
    trigger: <button>Open Menu</button>,
    items: defaultItems,
    align: 'left',
  },
}

export const AlignRight: Story = {
  args: {
    trigger: <button>Options</button>,
    items: defaultItems,
    align: 'right',
  },
}

export const WithIcons: Story = {
  args: {
    trigger: <button>Actions</button>,
    items: [
      { label: 'Edit', icon: '✏', onClick: () => {} },
      { label: 'Copy', icon: '📋', onClick: () => {} },
      { label: 'Move', icon: '📁', onClick: () => {} },
      { label: 'Delete', icon: '🗑', danger: true, onClick: () => {} },
    ],
  },
}

export const WithDangerItems: Story = {
  args: {
    trigger: <button>Manage</button>,
    items: [
      { label: 'Rename', onClick: () => {} },
      { label: 'Transfer ownership', onClick: () => {} },
      { label: 'Delete project', danger: true, onClick: () => {} },
      { label: 'Delete permanently', danger: true, onClick: () => {} },
    ],
  },
}

export const AllAlignments: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
      <Dropdown
        align="left"
        trigger={<button>Left Aligned</button>}
        items={[
          { label: 'Option A', onClick: () => {} },
          { label: 'Option B', onClick: () => {} },
          { label: 'Option C', onClick: () => {} },
        ]}
      />
      <Dropdown
        align="right"
        trigger={<button>Right Aligned</button>}
        items={[
          { label: 'Option A', onClick: () => {} },
          { label: 'Option B', onClick: () => {} },
          { label: 'Option C', onClick: () => {} },
        ]}
      />
    </div>
  ),
}
