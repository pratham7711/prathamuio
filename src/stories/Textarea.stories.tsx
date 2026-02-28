import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from '../components/Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Textarea>

const wrap = { width: '360px' }

export const Default: Story = {
  render: () => (
    <div style={wrap}>
      <Textarea label="Message" placeholder="Write something…" rows={4} />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div style={wrap}>
      <Textarea
        label="Bio"
        value="Too short"
        error="Bio must be at least 50 characters."
        readOnly
        rows={3}
      />
    </div>
  ),
}

export const WithCharCount: Story = {
  render: () => (
    <div style={wrap}>
      <Textarea
        label="Tweet"
        placeholder="What's on your mind?"
        maxLength={280}
        showCount
        rows={4}
      />
    </div>
  ),
}

export const AutoResize: Story = {
  render: () => (
    <div style={wrap}>
      <Textarea
        label="Auto-resize"
        placeholder="Start typing… I'll grow with your content."
        autoResize
        rows={2}
      />
    </div>
  ),
}
