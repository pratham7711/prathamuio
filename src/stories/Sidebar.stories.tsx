import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import type { SidebarItem } from '../components/Sidebar'

const meta: Meta<typeof Sidebar> = {
  title: 'UI/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'glass', 'floating', 'compact'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    collapsed: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Sidebar>

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8l6-5 6 5M3.5 9v4.5h3.25V11h2.5v2.5h3.25V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
const FolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4.5h4.5l1.5 1.5H14v6.5H2V4.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" /><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
)
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" /><path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
)
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l1.8 3.6L14 6.2l-3 2.9.7 4.1L8 11.4l-3.7 1.8.7-4.1-3-2.9 4.2-.6L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
)

const basicItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: <HomeIcon /> },
  { id: 'projects', label: 'Projects', icon: <FolderIcon /> },
  { id: 'starred', label: 'Starred', icon: <StarIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
]

const nestedItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: <HomeIcon /> },
  {
    id: 'projects',
    label: 'Projects',
    icon: <FolderIcon />,
    children: [
      { id: 'proj-a', label: 'Project Alpha' },
      { id: 'proj-b', label: 'Project Beta' },
      { id: 'proj-c', label: 'Project Gamma' },
    ],
  },
  { id: 'div-1', label: '', divider: true },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    children: [
      { id: 'general', label: 'General' },
      { id: 'security', label: 'Security' },
    ],
  },
]

const badgeItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: <HomeIcon /> },
  { id: 'projects', label: 'Projects', icon: <FolderIcon />, badge: 12 },
  { id: 'starred', label: 'Starred', icon: <StarIcon />, badge: 'New' },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon />, disabled: true },
]

function SidebarWrapper(props: Partial<React.ComponentProps<typeof Sidebar>>) {
  const [activeId, setActiveId] = useState('home')
  const [collapsed, setCollapsed] = useState(props.collapsed ?? false)
  return (
    <div style={{ height: 500, display: 'flex', background: 'var(--ui-bg-0)' }}>
      <Sidebar
        items={basicItems}
        activeId={activeId}
        onItemClick={(item) => setActiveId(item.id)}
        collapsed={collapsed}
        onCollapseChange={setCollapsed}
        {...props}
      />
      <div style={{ flex: 1, padding: 24, color: 'var(--ui-text-1)', fontFamily: 'var(--ui-font)' }}>
        <p>Active: <strong>{activeId}</strong></p>
        <p style={{ color: 'var(--ui-text-2)', marginTop: 8 }}>Click sidebar items or use arrow keys to navigate.</p>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <SidebarWrapper />,
}

export const WithNestedItems: Story = {
  render: () => <SidebarWrapper items={nestedItems} />,
}

export const CollapsedMode: Story = {
  render: () => <SidebarWrapper collapsed />,
}

export const FloatingVariant: Story = {
  render: () => (
    <div style={{ height: 500, padding: 16, background: 'var(--ui-bg-0)' }}>
      <SidebarWrapper variant="floating" />
    </div>
  ),
}

export const GlassVariant: Story = {
  render: () => (
    <div style={{ height: 500, background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)', display: 'flex' }}>
      <SidebarWrapper variant="glass" />
    </div>
  ),
}

export const CompactVariant: Story = {
  render: () => <SidebarWrapper variant="compact" />,
}

export const WithBadges: Story = {
  render: () => <SidebarWrapper items={badgeItems} />,
}

export const WithHeaderFooter: Story = {
  render: () => (
    <SidebarWrapper
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 'var(--ui-r-sm)', background: 'var(--ui-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--ui-bg-0)' }}>P</div>
          <span style={{ fontWeight: 600, color: 'var(--ui-text-0)', fontFamily: 'var(--ui-font)' }}>Pratham UI</span>
        </div>
      }
      footer={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserIcon />
          <span style={{ color: 'var(--ui-text-1)', fontSize: 13, fontFamily: 'var(--ui-font)' }}>John Doe</span>
        </div>
      }
    />
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, height: 400, background: 'var(--ui-bg-0)' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Sidebar key={s} items={basicItems} size={s} activeId="home" />
      ))}
    </div>
  ),
}

export const WithDividers: Story = {
  render: () => {
    const items: SidebarItem[] = [
      { id: 'home', label: 'Home', icon: <HomeIcon /> },
      { id: 'projects', label: 'Projects', icon: <FolderIcon /> },
      { id: 'div-1', label: '', divider: true },
      { id: 'starred', label: 'Starred', icon: <StarIcon /> },
      { id: 'div-2', label: '', divider: true },
      { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    ]
    return <SidebarWrapper items={items} />
  },
}
