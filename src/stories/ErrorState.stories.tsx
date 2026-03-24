import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ErrorState } from '../components/ErrorState'

const meta: Meta<typeof ErrorState> = {
  title: 'UI/ErrorState',
  component: ErrorState,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['404', '500', '403', 'offline', 'maintenance', 'empty', 'custom'] },
    variant: { control: 'select', options: ['default', 'minimal', 'illustrated', 'glass'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'full'] },
    fullPage: { control: 'boolean' },
    showCode: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof ErrorState>

export const NotFound: Story = {
  args: {
    type: '404',
    action: { label: 'Go Home', onClick: () => alert('Navigate home') },
    secondaryAction: { label: 'Go Back', onClick: () => alert('Navigate back') },
  },
}

export const ServerError: Story = {
  args: {
    type: '500',
    action: { label: 'Try Again', onClick: () => alert('Retry') },
  },
}

export const Forbidden: Story = {
  args: {
    type: '403',
    action: { label: 'Request Access', onClick: () => alert('Request access') },
    secondaryAction: { label: 'Go Home', onClick: () => alert('Navigate home') },
  },
}

export const Offline: Story = {
  args: {
    type: 'offline',
    action: { label: 'Retry Connection', onClick: () => alert('Retrying...') },
  },
}

export const Maintenance: Story = {
  args: {
    type: 'maintenance',
  },
}

export const Empty: Story = {
  args: {
    type: 'empty',
    action: { label: 'Create First Item', onClick: () => alert('Create') },
  },
}

export const CustomError: Story = {
  args: {
    type: 'custom',
    title: 'Payment Failed',
    description: 'Your credit card was declined. Please try a different payment method.',
    code: 'ERR_PAYMENT',
    showCode: true,
    action: { label: 'Update Payment', onClick: () => alert('Update') },
  },
}

export const MinimalVariant: Story = {
  args: {
    type: '404',
    variant: 'minimal',
    action: { label: 'Go Home', onClick: () => alert('Home') },
  },
}

export const IllustratedVariant: Story = {
  args: {
    type: '500',
    variant: 'illustrated',
    action: { label: 'Refresh', onClick: () => alert('Refresh') },
  },
}

export const GlassVariant: Story = {
  render: () => (
    <div style={{ padding: '48px', background: 'var(--ui-bg-1)', borderRadius: '16px' }}>
      <ErrorState
        type="404"
        variant="glass"
        action={{ label: 'Go Home', onClick: () => alert('Home') }}
      />
    </div>
  ),
}

export const FullPage: Story = {
  render: () => (
    <ErrorState
      type="404"
      size="full"
      fullPage
      action={{ label: 'Go Home', onClick: () => alert('Home') }}
      secondaryAction={{ label: 'Contact Support', onClick: () => alert('Support') }}
    />
  ),
  parameters: { layout: 'fullscreen' },
}

export const WithActions: Story = {
  args: {
    type: '500',
    action: { label: 'Try Again', onClick: () => alert('Retry') },
    secondaryAction: { label: 'Report Issue', onClick: () => alert('Report') },
  },
}

export const WithChildren: Story = {
  render: () => (
    <ErrorState
      type="empty"
      title="No Results"
      description="Try adjusting your search or filters."
    >
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <span style={{
          padding: '4px 12px',
          background: 'var(--ui-glass)',
          border: '1px solid var(--ui-border)',
          borderRadius: 'var(--ui-r-full)',
          color: 'var(--ui-text-2)',
          fontSize: 12,
        }}>
          Suggestion: try a broader search
        </span>
      </div>
    </ErrorState>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center' }}>
      <ErrorState type="404" size="sm" action={{ label: 'Home', onClick: () => {} }} />
      <ErrorState type="404" size="md" action={{ label: 'Home', onClick: () => {} }} />
      <ErrorState type="404" size="lg" action={{ label: 'Home', onClick: () => {} }} />
    </div>
  ),
}

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', maxWidth: '900px' }}>
      <ErrorState type="404" size="sm" />
      <ErrorState type="500" size="sm" />
      <ErrorState type="403" size="sm" />
      <ErrorState type="offline" size="sm" />
      <ErrorState type="maintenance" size="sm" />
      <ErrorState type="empty" size="sm" />
    </div>
  ),
}
