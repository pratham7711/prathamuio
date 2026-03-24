import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { CommandPalette } from '../components/CommandPalette'
import type { CommandItem } from '../components/CommandPalette'
import { Button } from '../components/Button'

const meta: Meta<typeof CommandPalette> = {
  title: 'UI/CommandPalette',
  component: CommandPalette,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'glass', 'minimal'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof CommandPalette>

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
)
const FileIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 2h5.5L13 5.5V14H4V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M9 2v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
)
const SettingsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" /><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
)

const basicItems: CommandItem[] = [
  { id: 'home', label: 'Go to Home', icon: <SearchIcon />, onSelect: () => alert('Home'), keywords: ['dashboard'] },
  { id: 'settings', label: 'Open Settings', icon: <SettingsIcon />, shortcut: ['\u2318', ','], onSelect: () => alert('Settings') },
  { id: 'new-file', label: 'New File', icon: <FileIcon />, shortcut: ['\u2318', 'N'], onSelect: () => alert('New file') },
  { id: 'search', label: 'Search Files', icon: <SearchIcon />, shortcut: ['\u2318', 'P'], onSelect: () => alert('Search') },
]

const groupedItems: CommandItem[] = [
  { id: 'home', label: 'Go to Home', group: 'Navigation', icon: <SearchIcon />, onSelect: () => alert('Home') },
  { id: 'projects', label: 'Go to Projects', group: 'Navigation', icon: <FileIcon />, onSelect: () => alert('Projects') },
  { id: 'profile', label: 'Go to Profile', group: 'Navigation', onSelect: () => alert('Profile') },
  { id: 'new-file', label: 'Create New File', group: 'Actions', icon: <FileIcon />, shortcut: ['\u2318', 'N'], onSelect: () => alert('New file') },
  { id: 'deploy', label: 'Deploy to Production', group: 'Actions', shortcut: ['\u2318', 'Shift', 'D'], onSelect: () => alert('Deploy') },
  { id: 'theme', label: 'Toggle Dark Mode', group: 'Settings', onSelect: () => alert('Theme') },
  { id: 'settings', label: 'Open Settings', group: 'Settings', icon: <SettingsIcon />, shortcut: ['\u2318', ','], onSelect: () => alert('Settings') },
]

function PaletteDemo(props: Partial<React.ComponentProps<typeof CommandPalette>>) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open Command Palette (\u2318K)
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={basicItems}
        {...props}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <PaletteDemo />,
}

export const GroupedCommands: Story = {
  render: () => <PaletteDemo items={groupedItems} />,
}

export const WithShortcuts: Story = {
  render: () => <PaletteDemo items={groupedItems} />,
}

export const GlassVariant: Story = {
  render: () => <PaletteDemo variant="glass" items={groupedItems} />,
}

export const MinimalVariant: Story = {
  render: () => <PaletteDemo variant="minimal" />,
}

export const WithRecentItems: Story = {
  render: () => <PaletteDemo items={groupedItems} recentIds={['settings', 'deploy']} />,
}

export const EmptyState: Story = {
  render: () => <PaletteDemo items={[]} emptyMessage="No commands available." />,
}

export const CustomFooter: Story = {
  render: () => (
    <PaletteDemo
      items={groupedItems}
      footer={
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', fontSize: 12, color: 'var(--ui-text-2)', fontFamily: 'var(--ui-font)' }}>
          <span><kbd style={{ padding: '2px 4px', background: 'var(--ui-glass)', borderRadius: 'var(--ui-r-sm)', border: '1px solid var(--ui-border)' }}>&uarr;&darr;</kbd> Navigate</span>
          <span><kbd style={{ padding: '2px 4px', background: 'var(--ui-glass)', borderRadius: 'var(--ui-r-sm)', border: '1px solid var(--ui-border)' }}>&crarr;</kbd> Select</span>
          <span><kbd style={{ padding: '2px 4px', background: 'var(--ui-glass)', borderRadius: 'var(--ui-r-sm)', border: '1px solid var(--ui-border)' }}>esc</kbd> Close</span>
        </div>
      }
    />
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <PaletteDemo key={s} size={s} items={basicItems} />
      ))}
    </div>
  ),
}
