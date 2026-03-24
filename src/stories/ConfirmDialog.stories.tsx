import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'

const meta: Meta<typeof ConfirmDialog> = {
  title: 'UI/ConfirmDialog',
  component: ConfirmDialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'danger', 'custom'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    confirmLoading: { control: 'boolean' },
    hideCancel: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof ConfirmDialog>

const Wrapper = (props: Partial<React.ComponentProps<typeof ConfirmDialog>> & { label?: string }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        {props.label ?? 'Open Dialog'}
      </button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="Confirm Action"
        {...props}
      />
    </>
  )
}

export const Info: Story = {
  render: () => <Wrapper variant="info" title="Information" description="This is an informational confirmation dialog." />,
}

export const Success: Story = {
  render: () => <Wrapper variant="success" title="Success!" description="The operation was completed successfully." />,
}

export const Warning: Story = {
  render: () => <Wrapper variant="warning" title="Warning" description="This action may have unintended consequences. Please review before continuing." />,
}

export const Danger: Story = {
  render: () => <Wrapper variant="danger" title="Delete Item?" description="This action cannot be undone. All associated data will be permanently removed." confirmText="Delete" />,
}

export const Custom: Story = {
  render: () => (
    <Wrapper
      variant="custom"
      title="Custom Dialog"
      description="A dialog with a custom icon."
      icon={<span style={{ fontSize: 24 }}>🚀</span>}
    />
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Wrapper size="sm" title="Small Dialog" description="Compact size." label="Small" />
      <Wrapper size="md" title="Medium Dialog" description="Default size." label="Medium" />
      <Wrapper size="lg" title="Large Dialog" description="Spacious size." label="Large" />
    </div>
  ),
}

export const LoadingConfirm: Story = {
  render: () => {
    const Demo = () => {
      const [open, setOpen] = useState(false)
      const [loading, setLoading] = useState(false)
      return (
        <>
          <button onClick={() => setOpen(true)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Open Loading
          </button>
          <ConfirmDialog
            open={open}
            onClose={() => { setOpen(false); setLoading(false) }}
            onConfirm={() => {
              setLoading(true)
              setTimeout(() => { setLoading(false); setOpen(false) }, 2000)
            }}
            title="Processing..."
            description="Click confirm to simulate a loading state."
            variant="info"
            confirmLoading={loading}
          />
        </>
      )
    }
    return <Demo />
  },
}

export const HideCancel: Story = {
  render: () => <Wrapper title="Acknowledged" description="Click confirm to dismiss." hideCancel confirmText="Got it" variant="success" />,
}

export const CustomButtonText: Story = {
  render: () => <Wrapper title="Discard Changes?" description="You have unsaved changes." confirmText="Discard" cancelText="Keep Editing" variant="warning" />,
}

export const LongDescription: Story = {
  render: () => (
    <Wrapper
      title="Terms of Service"
      variant="info"
      description="By proceeding, you agree to our updated Terms of Service and Privacy Policy. This includes changes to data handling, account management, and third-party integrations. We recommend reviewing the full document before continuing. The changes will take effect immediately upon confirmation."
    />
  ),
}

export const WithExtraContent: Story = {
  render: () => (
    <Wrapper title="Export Data" description="Select export format:" variant="info">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 0' }}>
        <label style={{ display: 'flex', gap: 8, color: 'var(--ui-text-1)', fontSize: 14 }}>
          <input type="radio" name="fmt" defaultChecked /> CSV
        </label>
        <label style={{ display: 'flex', gap: 8, color: 'var(--ui-text-1)', fontSize: 14 }}>
          <input type="radio" name="fmt" /> JSON
        </label>
        <label style={{ display: 'flex', gap: 8, color: 'var(--ui-text-1)', fontSize: 14 }}>
          <input type="radio" name="fmt" /> XML
        </label>
      </div>
    </Wrapper>
  ),
}
