import type { Meta, StoryObj } from '@storybook/react'
import { ToastProvider, useToast } from '../components/Toast'
import { Button } from '../components/Button'

const meta: Meta = {
  title: 'UI/Toast',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const position = context.args?.position || 'top-right'
      return (
        <ToastProvider position={position}>
          <Story />
        </ToastProvider>
      )
    },
  ],
}

export default meta
type Story = StoryObj

function AllVariantsDemo() {
  const { toast } = useToast()
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="secondary" onClick={() => toast({ variant: 'info', message: 'This is an informational toast.' })}>
        Info
      </Button>
      <Button variant="secondary" onClick={() => toast({ variant: 'success', message: 'Operation completed successfully!' })}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => toast({ variant: 'warning', message: 'Please review the changes before continuing.' })}>
        Warning
      </Button>
      <Button variant="secondary" onClick={() => toast({ variant: 'danger', message: 'Something went wrong. Please try again.' })}>
        Danger
      </Button>
    </div>
  )
}

export const AllVariants: Story = {
  render: () => <AllVariantsDemo />,
}

function WithTitleDemo() {
  const { toast } = useToast()
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="secondary" onClick={() => toast({ variant: 'success', title: 'Saved!', message: 'Your changes have been saved to the database.' })}>
        With title
      </Button>
      <Button variant="secondary" onClick={() => toast({ variant: 'danger', title: 'Error', message: 'Failed to connect to the server. Check your network.' })}>
        Error with title
      </Button>
    </div>
  )
}

export const WithTitle: Story = {
  render: () => <WithTitleDemo />,
}

function WithActionDemo() {
  const { toast } = useToast()
  return (
    <Button
      variant="secondary"
      onClick={() =>
        toast({
          variant: 'info',
          title: 'File deleted',
          message: 'The file has been moved to trash.',
          action: { label: 'Undo', onClick: () => alert('Undo clicked!') },
          duration: 8000,
        })
      }
    >
      Toast with action
    </Button>
  )
}

export const WithAction: Story = {
  render: () => <WithActionDemo />,
}

function PersistentDemo() {
  const { toast } = useToast()
  return (
    <Button
      variant="secondary"
      onClick={() =>
        toast({
          variant: 'warning',
          title: 'Persistent',
          message: 'This toast will not auto-dismiss. Close it manually.',
          duration: 0,
        })
      }
    >
      Persistent toast
    </Button>
  )
}

export const Persistent: Story = {
  render: () => <PersistentDemo />,
}

function AutoDismissDemo() {
  const { toast } = useToast()
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="secondary" onClick={() => toast({ variant: 'info', message: '3 second toast', duration: 3000 })}>
        3s
      </Button>
      <Button variant="secondary" onClick={() => toast({ variant: 'success', message: '5 second toast (default)', duration: 5000 })}>
        5s
      </Button>
      <Button variant="secondary" onClick={() => toast({ variant: 'warning', message: '10 second toast', duration: 10000 })}>
        10s
      </Button>
    </div>
  )
}

export const AutoDismiss: Story = {
  render: () => <AutoDismissDemo />,
}

function StackedDemo() {
  const { toast, dismissAll } = useToast()
  let counter = 0
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button
        variant="secondary"
        onClick={() => {
          counter++
          toast({ variant: (['info', 'success', 'warning', 'danger'] as const)[counter % 4], message: `Toast #${counter}`, duration: 15000 })
        }}
      >
        Add toast
      </Button>
      <Button variant="ghost" onClick={dismissAll}>
        Dismiss all
      </Button>
    </div>
  )
}

export const Stacked: Story = {
  render: () => <StackedDemo />,
}

function SizesDemo() {
  const { toast } = useToast()
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Button key={s} variant="secondary" size="sm" onClick={() => toast({ variant: 'info', message: `Size: ${s}`, size: s })}>
          {s}
        </Button>
      ))}
    </div>
  )
}

export const Sizes: Story = {
  render: () => <SizesDemo />,
}

function CustomIconDemo() {
  const { toast } = useToast()
  const rocketIcon = (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2l2 4h4l-3.5 3 1.5 5L9 11.5 4.5 14l1.5-5L2.5 6h4L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
  return (
    <Button
      variant="secondary"
      onClick={() =>
        toast({
          variant: 'success',
          title: 'Launched!',
          message: 'Your project is now live.',
          icon: rocketIcon,
        })
      }
    >
      Custom icon toast
    </Button>
  )
}

export const CustomIcon: Story = {
  render: () => <CustomIconDemo />,
}

function PositionDemo() {
  const { toast } = useToast()
  return (
    <Button variant="primary" onClick={() => toast({ variant: 'info', message: 'Check the position!' })}>
      Show toast
    </Button>
  )
}

export const TopLeft: Story = {
  args: { position: 'top-left' },
  render: () => <PositionDemo />,
}

export const TopCenter: Story = {
  args: { position: 'top-center' },
  render: () => <PositionDemo />,
}

export const BottomRight: Story = {
  args: { position: 'bottom-right' },
  render: () => <PositionDemo />,
}

export const BottomCenter: Story = {
  args: { position: 'bottom-center' },
  render: () => <PositionDemo />,
}
