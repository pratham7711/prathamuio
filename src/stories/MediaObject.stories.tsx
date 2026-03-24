import type { Meta, StoryObj } from '@storybook/react'
import { MediaObject } from '../components/MediaObject'

const meta: Meta<typeof MediaObject> = {
  title: 'UI/MediaObject',
  component: MediaObject,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'card', 'bordered', 'glass'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    mediaPosition: { control: 'select', options: ['left', 'right', 'top'] },
    align: { control: 'select', options: ['start', 'center', 'end'] },
  },
}

export default meta
type Story = StoryObj<typeof MediaObject>

const AvatarCircle = ({ letter, bg }: { letter: string; bg: string }) => (
  <div
    style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 600,
      fontSize: 16,
      fontFamily: 'var(--ui-font)',
    }}
  >
    {letter}
  </div>
)

const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      width: 48,
      height: 48,
      borderRadius: 'var(--ui-r-md)',
      background: 'var(--ui-accent-dim)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 20,
    }}
  >
    {children}
  </div>
)

const SampleImage = () => (
  <div
    style={{
      width: 80,
      height: 80,
      borderRadius: 'var(--ui-r-md)',
      background: 'linear-gradient(135deg, var(--ui-accent-dim), var(--ui-bg-3))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--ui-text-2)',
      fontSize: 12,
    }}
  >
    80x80
  </div>
)

export const WithAvatar: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <MediaObject
        media={<AvatarCircle letter="P" bg="#6366f1" />}
        title="Pratham"
        subtitle="Building components for the design system."
      />
    </div>
  ),
}

export const WithImage: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <MediaObject
        media={<SampleImage />}
        title="Project Thumbnail"
        subtitle="A brief description of the project and its goals."
      />
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <MediaObject
        media={<IconBox>&#9889;</IconBox>}
        title="Fast Performance"
        subtitle="Optimized for speed with minimal bundle size."
      />
    </div>
  ),
}

export const RightAlignedMedia: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <MediaObject
        media={<AvatarCircle letter="R" bg="#ec4899" />}
        mediaPosition="right"
        title="Right-aligned media"
        subtitle="Media slot rendered on the right side."
      />
    </div>
  ),
}

export const TopPosition: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <MediaObject
        media={<IconBox>&#128640;</IconBox>}
        mediaPosition="top"
        variant="card"
        title="Launch Ready"
        subtitle="Deploy your application with confidence."
      />
    </div>
  ),
}

export const CardVariant: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <MediaObject
        variant="card"
        media={<AvatarCircle letter="C" bg="#14b8a6" />}
        title="Card Media Object"
        subtitle="Wrapped in a card with padding and subtle hover effect."
      />
    </div>
  ),
}

export const GlassVariant: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <MediaObject
        variant="glass"
        media={<AvatarCircle letter="G" bg="#8b5cf6" />}
        title="Glass Morphism"
        subtitle="Frosted glass background with blur effect."
      />
    </div>
  ),
}

export const WithActions: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <MediaObject
        variant="card"
        media={<AvatarCircle letter="A" bg="#f59e0b" />}
        title="Actionable Item"
        subtitle="This media object has action buttons."
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{
                background: 'var(--ui-glass)',
                border: '1px solid var(--ui-border)',
                color: 'var(--ui-text-1)',
                padding: '4px 10px',
                borderRadius: 'var(--ui-r-sm)',
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: 'var(--ui-font)',
              }}
            >
              Edit
            </button>
            <button
              style={{
                background: 'var(--ui-accent-dim)',
                border: '1px solid var(--ui-accent)',
                color: 'var(--ui-accent)',
                padding: '4px 10px',
                borderRadius: 'var(--ui-r-sm)',
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: 'var(--ui-font)',
              }}
            >
              View
            </button>
          </div>
        }
      />
    </div>
  ),
}

export const NestedMediaObjects: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <MediaObject
        variant="bordered"
        media={<AvatarCircle letter="N" bg="#6366f1" />}
        title="Parent media object"
        subtitle="Contains nested media objects"
      />
      <div style={{ marginLeft: 52, marginTop: 8 }}>
        <MediaObject
          size="sm"
          media={<AvatarCircle letter="C" bg="#14b8a6" />}
          title="Child reply"
          subtitle="A nested media object for comment threads."
        />
      </div>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 480 }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8 }}>size=&quot;{s}&quot;</div>
          <MediaObject
            variant="bordered"
            size={s}
            media={<AvatarCircle letter={s[0].toUpperCase()} bg="#6366f1" />}
            title={`Size ${s}`}
            subtitle={`Media object at the ${s} size preset.`}
          />
        </div>
      ))}
    </div>
  ),
}

export const CommentThread: Story = {
  render: () => (
    <div style={{ width: 480, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <MediaObject
        media={<AvatarCircle letter="A" bg="#6366f1" />}
        title="Alice"
      >
        <div>
          <span style={{ color: 'var(--ui-text-0)', fontWeight: 600, fontSize: 14 }}>Alice</span>
          <span style={{ color: 'var(--ui-text-2)', fontSize: 12, marginLeft: 8 }}>2h ago</span>
          <p style={{ color: 'var(--ui-text-1)', fontSize: 14, margin: '4px 0 0' }}>
            Great work on the design system! The components look polished.
          </p>
        </div>
      </MediaObject>
      <div style={{ marginLeft: 52 }}>
        <MediaObject
          size="sm"
          media={<AvatarCircle letter="B" bg="#ec4899" />}
        >
          <div>
            <span style={{ color: 'var(--ui-text-0)', fontWeight: 600, fontSize: 13 }}>Bob</span>
            <span style={{ color: 'var(--ui-text-2)', fontSize: 11, marginLeft: 8 }}>1h ago</span>
            <p style={{ color: 'var(--ui-text-1)', fontSize: 13, margin: '4px 0 0' }}>
              Thanks! The glass morphism variants turned out really well.
            </p>
          </div>
        </MediaObject>
      </div>
    </div>
  ),
}
