import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Select } from '../components/Select'
import type { SelectOption } from '../components/Select'

const basicOptions: SelectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'SolidJS' },
]

const groupedOptions: SelectOption[] = [
  { value: 'react', label: 'React', group: 'Frontend' },
  { value: 'vue', label: 'Vue', group: 'Frontend' },
  { value: 'angular', label: 'Angular', group: 'Frontend' },
  { value: 'node', label: 'Node.js', group: 'Backend' },
  { value: 'deno', label: 'Deno', group: 'Backend' },
  { value: 'bun', label: 'Bun', group: 'Backend' },
  { value: 'postgres', label: 'PostgreSQL', group: 'Database' },
  { value: 'redis', label: 'Redis', group: 'Database' },
]

const disabledOptions: SelectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue', disabled: true },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte', disabled: true },
  { value: 'solid', label: 'SolidJS' },
]

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'ghost', 'filled'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    multiple: { control: 'boolean' },
    searchable: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Select>

const SelectDemo = (props: Partial<React.ComponentProps<typeof Select>>) => {
  const [value, setValue] = useState<string | string[]>(props.multiple ? [] : '')
  return (
    <div style={{ width: '280px' }}>
      <Select
        options={basicOptions}
        value={value}
        onChange={setValue}
        placeholder="Choose a framework..."
        {...props}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <SelectDemo />,
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '280px' }}>
      <Select options={basicOptions} variant="default" placeholder="Default" />
      <Select options={basicOptions} variant="ghost" placeholder="Ghost" />
      <Select options={basicOptions} variant="filled" placeholder="Filled" />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '280px' }}>
      <SelectDemo size="sm" />
      <SelectDemo size="md" />
      <SelectDemo size="lg" />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => <SelectDemo label="Framework" />,
}

export const WithGroups: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div style={{ width: '280px' }}>
        <Select
          options={groupedOptions}
          value={value}
          onChange={(v) => setValue(v as string)}
          label="Technology"
          placeholder="Pick a technology..."
        />
      </div>
    )
  },
}

export const Searchable: Story = {
  render: () => <SelectDemo searchable label="Searchable" />,
}

export const MultiSelect: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([])
    return (
      <div style={{ width: '320px' }}>
        <Select
          options={basicOptions}
          value={value}
          onChange={(v) => setValue(v as string[])}
          multiple
          label="Select Frameworks"
          placeholder="Choose multiple..."
        />
      </div>
    )
  },
}

export const Clearable: Story = {
  render: () => <SelectDemo clearable label="Clearable" />,
}

export const WithError: Story = {
  render: () => (
    <div style={{ width: '280px' }}>
      <Select
        options={basicOptions}
        label="Framework"
        error="This field is required"
        placeholder="Select..."
      />
    </div>
  ),
}

export const DisabledOptions: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div style={{ width: '280px' }}>
        <Select
          options={disabledOptions}
          value={value}
          onChange={(v) => setValue(v as string)}
          label="Some options disabled"
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div style={{ width: '280px' }}>
      <Select
        options={basicOptions}
        disabled
        label="Disabled Select"
        value="react"
      />
    </div>
  ),
}
