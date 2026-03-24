import type { Meta, StoryObj } from '@storybook/react'
import { Timeline, TimelineItem } from '../components/Timeline'

const meta: Meta<typeof Timeline> = {
  title: 'UI/Timeline',
  component: Timeline,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Timeline>

export const DefaultVertical: Story = {
  render: () => (
    <div style={{ maxWidth: '500px' }}>
      <Timeline>
        <TimelineItem title="Project started" timestamp="Jan 2024" color="accent">
          Initial setup and architecture decisions.
        </TimelineItem>
        <TimelineItem title="Alpha release" timestamp="Mar 2024" color="success">
          First internal release with core components.
        </TimelineItem>
        <TimelineItem title="Beta release" timestamp="Jun 2024" color="warning" active>
          Public beta with 20+ components.
        </TimelineItem>
        <TimelineItem title="v1.0 planned" timestamp="Sep 2024" color="neutral" subtitle="Upcoming">
          Stable release with full documentation.
        </TimelineItem>
      </Timeline>
    </div>
  ),
}

export const Alternate: Story = {
  render: () => (
    <div style={{ maxWidth: '700px' }}>
      <Timeline variant="alternate">
        <TimelineItem title="Research" timestamp="Week 1" color="accent">
          User research and competitive analysis.
        </TimelineItem>
        <TimelineItem title="Design" timestamp="Week 2" color="success">
          Wireframes and high-fidelity mockups.
        </TimelineItem>
        <TimelineItem title="Development" timestamp="Week 3-4" color="warning" active>
          Implementation and unit testing.
        </TimelineItem>
        <TimelineItem title="Launch" timestamp="Week 5" color="danger">
          Deployment and monitoring.
        </TimelineItem>
      </Timeline>
    </div>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <div style={{ maxWidth: '700px' }}>
      <Timeline orientation="horizontal">
        <TimelineItem title="Step 1" subtitle="Init" color="success" />
        <TimelineItem title="Step 2" subtitle="Build" color="success" />
        <TimelineItem title="Step 3" subtitle="Test" color="accent" active />
        <TimelineItem title="Step 4" subtitle="Deploy" color="neutral" />
      </Timeline>
    </div>
  ),
}

export const Compact: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <Timeline variant="compact">
        <TimelineItem title="Commit abc123" timestamp="2m ago" color="accent" />
        <TimelineItem title="Commit def456" timestamp="15m ago" color="accent" />
        <TimelineItem title="Commit ghi789" timestamp="1h ago" color="accent" />
        <TimelineItem title="Branch created" timestamp="2h ago" color="success" />
      </Timeline>
    </div>
  ),
}

export const CustomIcons: Story = {
  render: () => (
    <div style={{ maxWidth: '500px' }}>
      <Timeline>
        <TimelineItem
          title="Notification sent"
          color="accent"
          icon={<span style={{ fontSize: '14px' }}>&#9993;</span>}
        >
          Email notification dispatched.
        </TimelineItem>
        <TimelineItem
          title="Payment processed"
          color="success"
          icon={<span style={{ fontSize: '14px' }}>&#10003;</span>}
        >
          $49.00 charged successfully.
        </TimelineItem>
        <TimelineItem
          title="Error detected"
          color="danger"
          active
          icon={<span style={{ fontSize: '14px' }}>&#9888;</span>}
        >
          Server returned 500 error.
        </TimelineItem>
      </Timeline>
    </div>
  ),
}

export const ColoredItems: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <Timeline>
        <TimelineItem title="Accent" color="accent" />
        <TimelineItem title="Success" color="success" />
        <TimelineItem title="Warning" color="warning" />
        <TimelineItem title="Danger" color="danger" />
        <TimelineItem title="Neutral" color="neutral" />
      </Timeline>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '40px' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s} style={{ maxWidth: '250px' }}>
          <span style={{ color: 'var(--ui-text-2)', fontSize: '12px', marginBottom: '8px', display: 'block' }}>{s}</span>
          <Timeline size={s}>
            <TimelineItem title="First" color="accent" />
            <TimelineItem title="Second" color="success" active />
            <TimelineItem title="Third" color="neutral" />
          </Timeline>
        </div>
      ))}
    </div>
  ),
}
