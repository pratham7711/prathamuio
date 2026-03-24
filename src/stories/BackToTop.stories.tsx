import type { Meta, StoryObj } from '@storybook/react'
import React, { useRef } from 'react'
import { BackToTop } from '../components/BackToTop'

const meta: Meta<typeof BackToTop> = {
  title: 'UI/BackToTop',
  component: BackToTop,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'pill', 'circle', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    position: { control: 'select', options: ['bottom-right', 'bottom-left', 'bottom-center'] },
  },
}

export default meta
type Story = StoryObj<typeof BackToTop>

const ScrollContainer = ({
  children,
  height = 400,
}: {
  children: (containerRef: React.RefObject<HTMLDivElement | null>) => React.ReactNode
  height?: number
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={containerRef}
      style={{
        height,
        overflow: 'auto',
        position: 'relative',
        background: 'var(--ui-bg-1)',
        borderRadius: 'var(--ui-r-lg)',
        border: '1px solid var(--ui-border)',
      }}
    >
      <div style={{ padding: 24 }}>
        <h3 style={{ color: 'var(--ui-text-0)', margin: '0 0 16px', fontFamily: 'var(--ui-font)' }}>
          Scroll down to see the button
        </h3>
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} style={{ color: 'var(--ui-text-2)', fontFamily: 'var(--ui-font)', lineHeight: 1.6 }}>
            Line {i + 1} — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
          </p>
        ))}
      </div>
      {children(containerRef)}
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <ScrollContainer>
      {(ref) => <BackToTop target={ref.current || undefined} showAfter={100} />}
    </ScrollContainer>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {(['default', 'pill', 'circle', 'ghost'] as const).map((v) => (
        <div key={v} style={{ width: 280 }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8, fontFamily: 'var(--ui-font)' }}>
            variant=&quot;{v}&quot;
          </div>
          <ScrollContainer height={300}>
            {(ref) => (
              <BackToTop
                variant={v}
                label={v === 'pill' ? 'Top' : undefined}
                target={ref.current || undefined}
                showAfter={50}
              />
            )}
          </ScrollContainer>
        </div>
      ))}
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s} style={{ width: 280 }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8, fontFamily: 'var(--ui-font)' }}>
            size=&quot;{s}&quot;
          </div>
          <ScrollContainer height={300}>
            {(ref) => (
              <BackToTop
                variant="circle"
                size={s}
                target={ref.current || undefined}
                showAfter={50}
              />
            )}
          </ScrollContainer>
        </div>
      ))}
    </div>
  ),
}

export const CustomIcon: Story = {
  render: () => (
    <ScrollContainer>
      {(ref) => (
        <BackToTop
          variant="circle"
          target={ref.current || undefined}
          showAfter={100}
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 14V2M3 6l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      )}
    </ScrollContainer>
  ),
}

export const PillWithLabel: Story = {
  render: () => (
    <ScrollContainer>
      {(ref) => (
        <BackToTop
          variant="pill"
          label="Back to top"
          target={ref.current || undefined}
          showAfter={100}
        />
      )}
    </ScrollContainer>
  ),
}

export const BottomLeft: Story = {
  render: () => (
    <ScrollContainer>
      {(ref) => (
        <BackToTop
          position="bottom-left"
          target={ref.current || undefined}
          showAfter={100}
        />
      )}
    </ScrollContainer>
  ),
}

export const CustomOffset: Story = {
  render: () => (
    <ScrollContainer>
      {(ref) => (
        <BackToTop
          variant="circle"
          target={ref.current || undefined}
          showAfter={100}
          offset={{ bottom: 40, right: 40 }}
        />
      )}
    </ScrollContainer>
  ),
}

export const AppearsAfter100px: Story = {
  render: () => (
    <ScrollContainer height={500}>
      {(ref) => (
        <BackToTop
          variant="pill"
          label="Scroll up"
          target={ref.current || undefined}
          showAfter={100}
        />
      )}
    </ScrollContainer>
  ),
}
