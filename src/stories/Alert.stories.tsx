import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from '../components/Alert'

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'danger'] },
    title: { control: 'text' },
    children: { control: 'text' },
    onClose: { action: 'closed' },
    icon: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof Alert>

export const Primary: Story = {
  args: { variant: 'info', title: 'Information', children: 'This is an informational alert.' },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '400px' }}>
      <Alert variant="info" title="Info">This is an info alert.</Alert>
      <Alert variant="success" title="Success">Operation completed successfully.</Alert>
      <Alert variant="warning" title="Warning">Please review before continuing.</Alert>
      <Alert variant="danger" title="Danger">Something went wrong.</Alert>
    </div>
  ),
}

export const WithoutTitle: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '400px' }}>
      <Alert variant="info">A simple info alert without a title.</Alert>
      <Alert variant="success">A simple success alert without a title.</Alert>
      <Alert variant="warning">A simple warning alert without a title.</Alert>
      <Alert variant="danger">A simple danger alert without a title.</Alert>
    </div>
  ),
}

export const Dismissible: Story = {
  args: {
    variant: 'warning',
    title: 'Heads up',
    children: 'This alert can be dismissed by clicking the close button.',
    onClose: () => {},
  },
}

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '400px' }}>
      <Alert variant="info" title="Info" icon="ℹ">Informational message with icon.</Alert>
      <Alert variant="success" title="Done" icon="✓">Success message with icon.</Alert>
      <Alert variant="warning" title="Caution" icon="⚠">Warning message with icon.</Alert>
      <Alert variant="danger" title="Error" icon="✕">Error message with icon.</Alert>
    </div>
  ),
}

export const FullFeatured: Story = {
  args: {
    variant: 'success',
    title: 'Deployment complete',
    children: 'Your application has been deployed to production.',
    icon: '✓',
    onClose: () => {},
  },
}
