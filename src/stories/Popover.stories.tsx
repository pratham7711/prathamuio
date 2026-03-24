import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Popover } from '../components/Popover'
import { Button } from '../components/Button'

const meta: Meta<typeof Popover> = {
  title: 'UI/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <Popover content="This is a popover with some helpful information.">
      <Button variant="secondary">Click me</Button>
    </Popover>
  ),
}

export const AllPlacements: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, padding: 80 }}>
      <div />
      <Popover content="Top placement" placement="top">
        <Button variant="secondary" size="sm">Top</Button>
      </Popover>
      <div />

      <Popover content="Left placement" placement="left">
        <Button variant="secondary" size="sm">Left</Button>
      </Popover>
      <div />
      <Popover content="Right placement" placement="right">
        <Button variant="secondary" size="sm">Right</Button>
      </Popover>

      <div />
      <Popover content="Bottom placement" placement="bottom">
        <Button variant="secondary" size="sm">Bottom</Button>
      </Popover>
      <div />

      <Popover content="Bottom start" placement="bottom-start">
        <Button variant="secondary" size="sm">Bottom Start</Button>
      </Popover>
      <Popover content="Top start" placement="top-start">
        <Button variant="secondary" size="sm">Top Start</Button>
      </Popover>
      <Popover content="Bottom end" placement="bottom-end">
        <Button variant="secondary" size="sm">Bottom End</Button>
      </Popover>
    </div>
  ),
}

export const HoverTrigger: Story = {
  render: () => (
    <Popover
      content="This popover appears on hover with a small delay to prevent flicker."
      trigger="hover"
      placement="top"
    >
      <Button variant="secondary">Hover me</Button>
    </Popover>
  ),
}

export const WithTitle: Story = {
  render: () => (
    <Popover
      title="Help"
      content="You can click anywhere outside this popover to dismiss it, or press Escape."
      placement="bottom"
    >
      <Button variant="secondary">With title</Button>
    </Popover>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Popover
          content="This popover is controlled externally."
          open={open}
          onOpenChange={setOpen}
          placement="bottom"
        >
          <Button variant="secondary">Trigger</Button>
        </Popover>
        <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}>
          Toggle ({open ? 'open' : 'closed'})
        </Button>
      </div>
    )
  },
}

export const CustomContent: Story = {
  render: () => (
    <Popover
      placement="bottom"
      content={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ui-accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ui-accent)', fontWeight: 600 }}>
              P
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ui-text-0)' }}>Pratham</div>
              <div style={{ fontSize: 12, color: 'var(--ui-text-2)' }}>@pratham7711</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--ui-text-1)' }}>
            Building UI components with care.
          </div>
        </div>
      }
    >
      <Button variant="secondary">User card</Button>
    </Popover>
  ),
}

export const NoArrow: Story = {
  render: () => (
    <Popover content="This popover has no arrow." placement="bottom" arrow={false}>
      <Button variant="secondary">No arrow</Button>
    </Popover>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Popover key={s} content={`This is the ${s} size popover.`} size={s} placement="bottom">
          <Button variant="secondary" size="sm">{s}</Button>
        </Popover>
      ))}
    </div>
  ),
}

export const NestedInteractive: Story = {
  render: () => (
    <Popover
      placement="bottom"
      title="Confirm"
      content={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ margin: 0 }}>Are you sure you want to delete this item?</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="ghost" size="sm">Cancel</Button>
            <Button variant="danger" size="sm">Delete</Button>
          </div>
        </div>
      }
    >
      <Button variant="danger">Delete item</Button>
    </Popover>
  ),
}
