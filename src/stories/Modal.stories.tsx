import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { Modal } from '../components/Modal'
import { Button } from '../components/Button'

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Modal>

function ModalDemo({
  size = 'md',
  title = 'Confirm action',
  children = 'Are you sure you want to continue? This action cannot be undone.',
}: {
  size?: 'sm' | 'md' | 'lg' | 'full'
  title?: string
  children?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Modal ({size})
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        size={size}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
          </>
        }
      >
        {children}
      </Modal>
    </>
  )
}

export const Default: Story = {
  render: () => <ModalDemo size="md" />,
}

export const Small: Story = {
  render: () => (
    <ModalDemo size="sm" title="Quick confirm">
      This is a small confirmation dialog.
    </ModalDemo>
  ),
}

export const Large: Story = {
  render: () => (
    <ModalDemo size="lg" title="Detailed view">
      <p>This is a larger modal for more complex content.</p>
      <br />
      <p>It can contain forms, tables, or rich content while maintaining the backdrop blur and focus trap.</p>
    </ModalDemo>
  ),
}

export const KeyboardNav: Story = {
  render: () => (
    <ModalDemo size="md" title="Keyboard Navigation">
      <p>Tab through the buttons in the footer. Press Escape to close. Click the backdrop to close.</p>
    </ModalDemo>
  ),
}
