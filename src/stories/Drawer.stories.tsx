import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { Drawer } from '../components/Drawer'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

const meta: Meta<typeof Drawer> = {
  title: 'UI/Drawer',
  component: Drawer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Drawer>

function DrawerDemo({
  placement = 'right',
  size = 'md',
  title = 'Drawer',
  overlay = true,
  footer,
  children,
}: {
  placement?: 'left' | 'right' | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg' | 'full'
  title?: string
  overlay?: boolean
  footer?: React.ReactNode
  children?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open {placement} drawer ({size})
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement={placement}
        size={size}
        title={title}
        overlay={overlay}
        footer={footer || (
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>Save</Button>
          </>
        )}
      >
        {children || (
          <div>
            <p>This is the drawer body content. It supports any React nodes.</p>
            <p style={{ marginTop: 12, color: 'var(--ui-text-2)' }}>
              Press Escape or click the overlay to close. Focus is trapped inside the drawer.
            </p>
          </div>
        )}
      </Drawer>
    </>
  )
}

export const Default: Story = {
  render: () => <DrawerDemo />,
}

export const AllPlacements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {(['left', 'right', 'top', 'bottom'] as const).map((p) => (
        <DrawerDemo key={p} placement={p} title={`${p.charAt(0).toUpperCase() + p.slice(1)} drawer`} />
      ))}
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {(['sm', 'md', 'lg', 'full'] as const).map((s) => (
        <DrawerDemo key={s} size={s} title={`Size: ${s}`} />
      ))}
    </div>
  ),
}

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Edit profile
        </Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Edit Profile"
          size="md"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Save changes</Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Name" placeholder="Enter your name" />
            <Input label="Email" placeholder="you@example.com" type="email" />
            <Input label="Bio" placeholder="Tell us about yourself" />
          </div>
        </Drawer>
      </>
    )
  },
}

export const NoOverlay: Story = {
  render: () => <DrawerDemo overlay={false} title="No overlay" />,
}

export const LeftPlacement: Story = {
  render: () => (
    <DrawerDemo placement="left" title="Navigation">
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {['Dashboard', 'Projects', 'Settings', 'Help'].map((item) => (
          <div
            key={item}
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--ui-r-sm)',
              cursor: 'pointer',
              color: 'var(--ui-text-1)',
              transition: 'all 0.15s ease',
            }}
          >
            {item}
          </div>
        ))}
      </nav>
    </DrawerDemo>
  ),
}

export const TopDrawer: Story = {
  render: () => (
    <DrawerDemo placement="top" size="sm" title="Notifications">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {['New comment on your post', 'Deployment succeeded', 'Weekly report ready'].map((msg, i) => (
          <div
            key={i}
            style={{
              padding: '8px 12px',
              background: 'var(--ui-glass)',
              borderRadius: 'var(--ui-r-sm)',
              border: '1px solid var(--ui-border)',
              fontSize: 13,
            }}
          >
            {msg}
          </div>
        ))}
      </div>
    </DrawerDemo>
  ),
}

export const BottomDrawer: Story = {
  render: () => (
    <DrawerDemo placement="bottom" size="md" title="Details">
      <p>Bottom drawers are useful for mobile-first interfaces and action sheets.</p>
    </DrawerDemo>
  ),
}
