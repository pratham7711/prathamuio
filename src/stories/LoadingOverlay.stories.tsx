import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect } from 'react'
import { LoadingOverlay } from '../components/LoadingOverlay'

const meta: Meta<typeof LoadingOverlay> = {
  title: 'UI/LoadingOverlay',
  component: LoadingOverlay,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'glass', 'solid', 'minimal'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    visible: { control: 'boolean' },
    fullScreen: { control: 'boolean' },
    blur: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof LoadingOverlay>

const ContentBox = ({ children, height = 240 }: { children?: React.ReactNode; height?: number }) => (
  <div
    style={{
      position: 'relative',
      width: 400,
      height,
      background: 'var(--ui-bg-2)',
      border: '1px solid var(--ui-border)',
      borderRadius: 'var(--ui-r-md)',
      padding: 24,
      color: 'var(--ui-text-1)',
      fontSize: 14,
      overflow: 'hidden',
    }}
  >
    <h3 style={{ margin: '0 0 8px', color: 'var(--ui-text-0)' }}>Content Area</h3>
    <p>This content is behind the overlay. It demonstrates how the loading state covers the container.</p>
    {children}
  </div>
)

export const DefaultOverContent: Story = {
  render: () => (
    <ContentBox>
      <LoadingOverlay visible />
    </ContentBox>
  ),
}

export const FullScreen: Story = {
  render: () => {
    const Demo = () => {
      const [visible, setVisible] = useState(false)
      return (
        <>
          <button
            onClick={() => {
              setVisible(true)
              setTimeout(() => setVisible(false), 3000)
            }}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Show Fullscreen (3s)
          </button>
          <LoadingOverlay visible={visible} fullScreen message="Loading application..." />
        </>
      )
    }
    return <Demo />
  },
}

export const GlassBlur: Story = {
  render: () => (
    <ContentBox>
      <LoadingOverlay visible variant="glass" message="Loading data..." />
    </ContentBox>
  ),
}

export const Solid: Story = {
  render: () => (
    <ContentBox>
      <LoadingOverlay visible variant="solid" message="Please wait..." />
    </ContentBox>
  ),
}

export const Minimal: Story = {
  render: () => (
    <ContentBox>
      <LoadingOverlay visible variant="minimal" />
    </ContentBox>
  ),
}

export const WithMessage: Story = {
  render: () => (
    <ContentBox>
      <LoadingOverlay visible message="Fetching records..." description="This may take a moment" />
    </ContentBox>
  ),
}

export const WithProgressBar: Story = {
  render: () => {
    const Demo = () => {
      const [progress, setProgress] = useState(0)
      useEffect(() => {
        const t = setInterval(() => {
          setProgress((p) => (p >= 100 ? 0 : p + 5))
        }, 300)
        return () => clearInterval(t)
      }, [])
      return (
        <ContentBox>
          <LoadingOverlay
            visible
            message="Uploading files..."
            description={`${progress}% complete`}
            progress={progress}
          />
        </ContentBox>
      )
    }
    return <Demo />
  },
}

export const CustomSpinner: Story = {
  render: () => (
    <ContentBox>
      <LoadingOverlay
        visible
        message="Processing..."
        spinner={
          <div style={{ fontSize: 32, animation: 'spin 1s linear infinite' }}>
            ⚙
          </div>
        }
      />
    </ContentBox>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ position: 'relative', width: 160, height: 160, background: 'var(--ui-bg-2)', border: '1px solid var(--ui-border)', borderRadius: 'var(--ui-r-md)', overflow: 'hidden' }}>
        <LoadingOverlay visible size="sm" message="Small" />
      </div>
      <div style={{ position: 'relative', width: 160, height: 160, background: 'var(--ui-bg-2)', border: '1px solid var(--ui-border)', borderRadius: 'var(--ui-r-md)', overflow: 'hidden' }}>
        <LoadingOverlay visible size="md" message="Medium" />
      </div>
      <div style={{ position: 'relative', width: 160, height: 160, background: 'var(--ui-bg-2)', border: '1px solid var(--ui-border)', borderRadius: 'var(--ui-r-md)', overflow: 'hidden' }}>
        <LoadingOverlay visible size="lg" message="Large" />
      </div>
    </div>
  ),
}

export const FadeTransition: Story = {
  render: () => {
    const Demo = () => {
      const [visible, setVisible] = useState(true)
      return (
        <div>
          <button
            onClick={() => setVisible((v) => !v)}
            style={{ padding: '8px 16px', cursor: 'pointer', marginBottom: 12 }}
          >
            Toggle Overlay
          </button>
          <ContentBox>
            <LoadingOverlay visible={visible} variant="glass" message="Toggle me!" />
          </ContentBox>
        </div>
      )
    }
    return <Demo />
  },
}
