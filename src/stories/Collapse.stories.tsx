import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Collapse } from '../components/Collapse'

const meta: Meta<typeof Collapse> = {
  title: 'UI/Collapse',
  component: Collapse,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'bordered', 'ghost', 'card'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Collapse>

export const Default: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Collapse title="What is pratham-ui?">
        A React component library with a dark theme, glass morphism effects, and accessibility-first design.
      </Collapse>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 480 }}>
      {(['default', 'bordered', 'ghost', 'card'] as const).map((v) => (
        <Collapse key={v} variant={v} title={`${v.charAt(0).toUpperCase() + v.slice(1)} variant`}>
          Content for the {v} variant. Each variant has a distinct visual style.
        </Collapse>
      ))}
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 480 }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8 }}>size=&quot;{s}&quot;</div>
          <Collapse variant="bordered" size={s} title={`Size ${s}`}>
            Content at size {s}. Padding and font size scale with the size prop.
          </Collapse>
        </div>
      ))}
    </div>
  ),
}

export const InitiallyOpen: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Collapse title="Expanded by default" defaultOpen>
        This section is open on first render using the defaultOpen prop.
      </Collapse>
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <div style={{ width: 480 }}>
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: 'var(--ui-glass)',
              border: '1px solid var(--ui-border)',
              color: 'var(--ui-text-0)',
              padding: '6px 12px',
              borderRadius: 'var(--ui-r-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--ui-font)',
            }}
          >
            {open ? 'Close' : 'Open'} externally
          </button>
        </div>
        <Collapse title="Controlled collapse" open={open} onOpenChange={setOpen} variant="bordered">
          This collapse is controlled by external state. Toggle the button above.
        </Collapse>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Collapse title="This section is locked" disabled variant="bordered">
        You should not be able to see this content.
      </Collapse>
    </div>
  ),
}

export const CustomTrigger: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Collapse
        variant="card"
        trigger={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            <span style={{ fontSize: 20 }}>&#9881;</span>
            <span style={{ flex: 1 }}>Custom trigger content</span>
            <span style={{ fontSize: 12, opacity: 0.5 }}>click to expand</span>
          </div>
        }
      >
        This collapse uses a fully custom trigger element instead of the default title + arrow.
      </Collapse>
    </div>
  ),
}

export const NoAnimation: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Collapse title="No animation" animate={false} variant="bordered">
        This collapse toggles instantly without any height animation.
      </Collapse>
    </div>
  ),
}

export const NestedCollapses: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Collapse title="Outer section" variant="bordered" defaultOpen>
        <p style={{ marginBottom: 12 }}>This is the outer section content.</p>
        <Collapse title="Inner section A" variant="ghost" size="sm">
          Nested collapse content A.
        </Collapse>
        <Collapse title="Inner section B" variant="ghost" size="sm" style={{ marginTop: 8 }}>
          Nested collapse content B.
        </Collapse>
      </Collapse>
    </div>
  ),
}
