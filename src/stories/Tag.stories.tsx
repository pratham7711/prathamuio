import type { Meta, StoryObj } from '@storybook/react'
import { Tag } from '../components/Tag'

const meta: Meta<typeof Tag> = {
  title: 'UI/Tag',
  component: Tag,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tag>

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Tag>React</Tag>
      <Tag>TypeScript</Tag>
      <Tag>Node.js</Tag>
      <Tag>PostgreSQL</Tag>
    </div>
  ),
}

export const Outlined: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Tag outlined>React</Tag>
      <Tag outlined>TypeScript</Tag>
      <Tag outlined>Node.js</Tag>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Tag icon="⚛️">React</Tag>
      <Tag icon="🦕">Deno</Tag>
      <Tag icon="🐍">Python</Tag>
    </div>
  ),
}

export const Removable: Story = {
  render: () => {
    const tags = ['React', 'TypeScript', 'Vite', 'Tailwind']
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {tags.map((t) => (
          <Tag key={t} removable onRemove={() => alert(`Remove: ${t}`)}>
            {t}
          </Tag>
        ))}
      </div>
    )
  },
}

export const Clickable: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Tag clickable onClick={() => alert('React clicked')}>React</Tag>
      <Tag clickable outlined onClick={() => alert('TS clicked')}>TypeScript</Tag>
    </div>
  ),
}
