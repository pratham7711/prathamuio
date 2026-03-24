import type { Meta, StoryObj } from '@storybook/react'
import { ListGroup, ListGroupItem } from '../components/ListGroup'

const meta: Meta<typeof ListGroup> = {
  title: 'UI/ListGroup',
  component: ListGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'bordered', 'flush', 'glass'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    horizontal: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof ListGroup>

export const Default: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <ListGroup>
        <ListGroupItem>Dashboard</ListGroupItem>
        <ListGroupItem>Projects</ListGroupItem>
        <ListGroupItem>Settings</ListGroupItem>
        <ListGroupItem>Notifications</ListGroupItem>
      </ListGroup>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '320px' }}>
      {(['default', 'bordered', 'flush', 'glass'] as const).map((v) => (
        <div key={v}>
          <div style={{ color: 'var(--ui-text-2)', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase' }}>{v}</div>
          <ListGroup variant={v}>
            <ListGroupItem>Item One</ListGroupItem>
            <ListGroupItem>Item Two</ListGroupItem>
            <ListGroupItem>Item Three</ListGroupItem>
          </ListGroup>
        </div>
      ))}
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '320px' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s}>
          <div style={{ color: 'var(--ui-text-2)', marginBottom: '8px', fontSize: '12px' }}>{s}</div>
          <ListGroup size={s}>
            <ListGroupItem>First</ListGroupItem>
            <ListGroupItem>Second</ListGroupItem>
          </ListGroup>
        </div>
      ))}
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <ListGroup>
        <ListGroupItem icon={<span>&#x1F4CA;</span>}>Analytics</ListGroupItem>
        <ListGroupItem icon={<span>&#x2699;</span>}>Settings</ListGroupItem>
        <ListGroupItem icon={<span>&#x1F464;</span>}>Profile</ListGroupItem>
        <ListGroupItem icon={<span>&#x1F512;</span>}>Security</ListGroupItem>
      </ListGroup>
    </div>
  ),
}

export const WithBadges: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <ListGroup>
        <ListGroupItem badge={<span style={{ background: 'var(--ui-accent-dim)', color: 'var(--ui-accent)', padding: '2px 8px', borderRadius: '9999px', fontSize: '11px' }}>3</span>}>
          Inbox
        </ListGroupItem>
        <ListGroupItem badge={<span style={{ background: 'var(--ui-danger-dim)', color: 'var(--ui-danger)', padding: '2px 8px', borderRadius: '9999px', fontSize: '11px' }}>12</span>}>
          Alerts
        </ListGroupItem>
        <ListGroupItem badge={<span style={{ background: 'var(--ui-warning-dim)', color: 'var(--ui-warning)', padding: '2px 8px', borderRadius: '9999px', fontSize: '11px' }}>New</span>}>
          Updates
        </ListGroupItem>
      </ListGroup>
    </div>
  ),
}

export const Clickable: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <ListGroup>
        <ListGroupItem onClick={() => alert('Dashboard clicked')}>Dashboard</ListGroupItem>
        <ListGroupItem onClick={() => alert('Projects clicked')} active>Projects</ListGroupItem>
        <ListGroupItem onClick={() => alert('Settings clicked')}>Settings</ListGroupItem>
        <ListGroupItem onClick={() => alert('Logout clicked')}>Logout</ListGroupItem>
      </ListGroup>
    </div>
  ),
}

export const ActiveItem: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <ListGroup variant="bordered">
        <ListGroupItem>Home</ListGroupItem>
        <ListGroupItem active>Projects</ListGroupItem>
        <ListGroupItem>Tasks</ListGroupItem>
        <ListGroupItem>Reports</ListGroupItem>
      </ListGroup>
    </div>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <ListGroup horizontal>
      <ListGroupItem>Home</ListGroupItem>
      <ListGroupItem active>Projects</ListGroupItem>
      <ListGroupItem>Tasks</ListGroupItem>
      <ListGroupItem>Reports</ListGroupItem>
    </ListGroup>
  ),
}

export const Flush: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <ListGroup variant="flush">
        <ListGroupItem>No outer border</ListGroupItem>
        <ListGroupItem>Only dividers</ListGroupItem>
        <ListGroupItem>Between items</ListGroupItem>
      </ListGroup>
    </div>
  ),
}

export const GlassVariant: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <ListGroup variant="glass">
        <ListGroupItem icon={<span>&#x2728;</span>}>Glass morphism</ListGroupItem>
        <ListGroupItem icon={<span>&#x1F48E;</span>}>Translucent items</ListGroupItem>
        <ListGroupItem icon={<span>&#x1F30A;</span>}>Backdrop blur</ListGroupItem>
      </ListGroup>
    </div>
  ),
}

export const DisabledItems: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <ListGroup>
        <ListGroupItem onClick={() => {}}>Enabled</ListGroupItem>
        <ListGroupItem onClick={() => {}} disabled>Disabled</ListGroupItem>
        <ListGroupItem onClick={() => {}}>Enabled</ListGroupItem>
        <ListGroupItem onClick={() => {}} disabled>Disabled</ListGroupItem>
      </ListGroup>
    </div>
  ),
}
