import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Tabs } from '../components/Tabs'

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['pills', 'underline', 'solid'] },
    items: { control: 'object' },
    activeTab: { control: 'text' },
    onChange: { action: 'changed' },
  },
}

export default meta
type Story = StoryObj<typeof Tabs>

const defaultItems = [
  { label: 'Overview', value: 'overview' },
  { label: 'Features', value: 'features' },
  { label: 'Pricing', value: 'pricing' },
]

export const Primary: Story = {
  args: {
    items: defaultItems,
    activeTab: 'overview',
    variant: 'underline',
  },
}

export const AllVariants: Story = {
  render: () => {
    const [active1, setActive1] = useState('overview')
    const [active2, setActive2] = useState('overview')
    const [active3, setActive3] = useState('overview')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <div style={{ marginBottom: '8px', fontSize: '12px', opacity: 0.6 }}>underline</div>
          <Tabs variant="underline" items={defaultItems} activeTab={active1} onChange={setActive1} />
        </div>
        <div>
          <div style={{ marginBottom: '8px', fontSize: '12px', opacity: 0.6 }}>pills</div>
          <Tabs variant="pills" items={defaultItems} activeTab={active2} onChange={setActive2} />
        </div>
        <div>
          <div style={{ marginBottom: '8px', fontSize: '12px', opacity: 0.6 }}>solid</div>
          <Tabs variant="solid" items={defaultItems} activeTab={active3} onChange={setActive3} />
        </div>
      </div>
    )
  },
}

export const WithIcons: Story = {
  render: () => {
    const [active, setActive] = useState('home')
    return (
      <Tabs
        variant="underline"
        items={[
          { label: 'Home', value: 'home', icon: '🏠' },
          { label: 'Settings', value: 'settings', icon: '⚙' },
          { label: 'Profile', value: 'profile', icon: '👤' },
        ]}
        activeTab={active}
        onChange={setActive}
      />
    )
  },
}

export const ManyTabs: Story = {
  render: () => {
    const [active, setActive] = useState('tab1')
    return (
      <Tabs
        variant="pills"
        items={[
          { label: 'Tab 1', value: 'tab1' },
          { label: 'Tab 2', value: 'tab2' },
          { label: 'Tab 3', value: 'tab3' },
          { label: 'Tab 4', value: 'tab4' },
          { label: 'Tab 5', value: 'tab5' },
          { label: 'Tab 6', value: 'tab6' },
        ]}
        activeTab={active}
        onChange={setActive}
      />
    )
  },
}
