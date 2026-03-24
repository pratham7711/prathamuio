import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect } from 'react'
import { SearchInput } from '../components/SearchInput'
import type { SearchSuggestion } from '../components/SearchInput'

const meta: Meta<typeof SearchInput> = {
  title: 'UI/SearchInput',
  component: SearchInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'filled', 'ghost', 'glass'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    showSearchIcon: { control: 'boolean' },
    showClearButton: { control: 'boolean' },
    showShortcut: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof SearchInput>

const sampleSuggestions: SearchSuggestion[] = [
  { id: '1', label: 'Dashboard', description: 'Main overview page' },
  { id: '2', label: 'Settings', description: 'App configuration' },
  { id: '3', label: 'Users', description: 'Manage team members' },
  { id: '4', label: 'Analytics', description: 'View metrics and reports' },
  { id: '5', label: 'Billing', description: 'Payment and invoices' },
]

const groupedSuggestions: SearchSuggestion[] = [
  { id: '1', label: 'Button', description: 'Clickable actions', group: 'Components' },
  { id: '2', label: 'Input', description: 'Text entry fields', group: 'Components' },
  { id: '3', label: 'Modal', description: 'Dialog overlays', group: 'Components' },
  { id: '4', label: 'Colors', description: 'Design tokens', group: 'Tokens' },
  { id: '5', label: 'Typography', description: 'Font system', group: 'Tokens' },
  { id: '6', label: 'Installation', description: 'Getting started', group: 'Guides' },
]

export const Basic: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <SearchInput placeholder="Search pages..." />
    </div>
  ),
}

export const WithSuggestions: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <SearchInput suggestions={sampleSuggestions} placeholder="Search pages..." />
    </div>
  ),
}

export const GroupedSuggestions: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <SearchInput suggestions={groupedSuggestions} placeholder="Search components..." />
    </div>
  ),
}

export const LoadingState: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <SearchInput loading placeholder="Fetching results..." />
    </div>
  ),
}

export const RecentSearches: Story = {
  render: () => {
    const Demo = () => {
      const [recent, setRecent] = useState(['Dashboard', 'User settings', 'API keys'])
      return (
        <div style={{ width: 360 }}>
          <SearchInput
            recentSearches={recent}
            onClearRecent={() => setRecent([])}
            placeholder="Search..."
          />
        </div>
      )
    }
    return <Demo />
  },
}

export const GlassVariant: Story = {
  render: () => (
    <div style={{ width: 360, background: 'var(--ui-bg-1)', padding: 24, borderRadius: 12 }}>
      <SearchInput variant="glass" suggestions={sampleSuggestions} placeholder="Search..." />
    </div>
  ),
}

export const WithShortcutBadge: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <SearchInput showShortcut placeholder="Quick search..." />
    </div>
  ),
}

export const EmptyState: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <SearchInput
        suggestions={[]}
        defaultValue="xyznotfound"
        emptyMessage="No results match your query"
        placeholder="Search..."
      />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
      <SearchInput size="sm" placeholder="Small..." />
      <SearchInput size="md" placeholder="Medium..." />
      <SearchInput size="lg" placeholder="Large..." />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360, background: 'var(--ui-bg-1)', padding: 24, borderRadius: 12 }}>
      <SearchInput variant="default" placeholder="Default..." />
      <SearchInput variant="filled" placeholder="Filled..." />
      <SearchInput variant="ghost" placeholder="Ghost..." />
      <SearchInput variant="glass" placeholder="Glass..." />
    </div>
  ),
}

export const DebouncedApiSimulation: Story = {
  render: () => {
    const Demo = () => {
      const [loading, setLoading] = useState(false)
      const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
      const [query, setQuery] = useState('')

      const allItems: SearchSuggestion[] = [
        { id: '1', label: 'React', description: 'JavaScript library for UIs' },
        { id: '2', label: 'Redux', description: 'State management' },
        { id: '3', label: 'Router', description: 'Client-side routing' },
        { id: '4', label: 'TypeScript', description: 'Typed JavaScript' },
        { id: '5', label: 'Tailwind', description: 'Utility-first CSS' },
        { id: '6', label: 'Vite', description: 'Build tool' },
      ]

      useEffect(() => {
        if (!query) {
          setSuggestions([])
          return
        }
        setLoading(true)
        const t = setTimeout(() => {
          const filtered = allItems.filter((i) =>
            i.label.toLowerCase().includes(query.toLowerCase())
          )
          setSuggestions(filtered)
          setLoading(false)
        }, 800)
        return () => clearTimeout(t)
      }, [query])

      return (
        <div style={{ width: 360 }}>
          <p style={{ color: 'var(--ui-text-2)', fontSize: 13, marginBottom: 8 }}>
            Type to search (simulated 800ms API delay)
          </p>
          <SearchInput
            suggestions={suggestions}
            loading={loading}
            onChange={setQuery}
            debounce={300}
            placeholder="Search libraries..."
          />
        </div>
      )
    }
    return <Demo />
  },
}
