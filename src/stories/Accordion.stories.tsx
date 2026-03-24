import type { Meta, StoryObj } from '@storybook/react'
import { Accordion, AccordionItem } from '../components/Accordion'

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Accordion variant="default" size="md">
        <AccordionItem title="What is pratham-ui?">
          A React component library with a dark theme, glass morphism effects, and accessibility-first design.
        </AccordionItem>
        <AccordionItem title="How do I install it?">
          Run <code>npm install @pratham7711/ui</code> and import the styles in your main entry file.
        </AccordionItem>
        <AccordionItem title="Is it accessible?">
          Yes. All components include ARIA attributes, keyboard navigation, and focus management.
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

export const Bordered: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Accordion variant="bordered" size="md">
        <AccordionItem title="Account settings">
          Manage your profile, email, and password settings from the dashboard.
        </AccordionItem>
        <AccordionItem title="Billing information">
          Update your payment method, view invoices, and manage subscriptions.
        </AccordionItem>
        <AccordionItem title="Notifications">
          Configure email and push notification preferences.
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

export const Separated: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Accordion variant="separated" size="md">
        <AccordionItem title="Getting started">
          Follow the quick-start guide to set up your first project.
        </AccordionItem>
        <AccordionItem title="API reference">
          Browse the complete API documentation for all components.
        </AccordionItem>
        <AccordionItem title="Examples">
          View example implementations and code snippets.
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

export const Ghost: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Accordion variant="ghost" size="md">
        <AccordionItem title="Section one">
          Ghost variant has no borders for a minimal look.
        </AccordionItem>
        <AccordionItem title="Section two">
          Suitable for nested content or sidebars.
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: 480 }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8 }}>size=&quot;{s}&quot;</div>
          <Accordion variant="bordered" size={s}>
            <AccordionItem title="Item one">Content for size {s}</AccordionItem>
            <AccordionItem title="Item two">More content for size {s}</AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  ),
}

export const MultipleOpen: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Accordion variant="bordered" size="md" allowMultiple>
        <AccordionItem title="First panel" defaultOpen>
          This panel starts open. You can open multiple panels at once.
        </AccordionItem>
        <AccordionItem title="Second panel" defaultOpen>
          This panel also starts open.
        </AccordionItem>
        <AccordionItem title="Third panel">
          Click to open without closing the others.
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

export const DisabledItem: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Accordion variant="bordered" size="md">
        <AccordionItem title="Available section">
          This section is interactive.
        </AccordionItem>
        <AccordionItem title="Locked section (disabled)" disabled>
          You cannot see this content.
        </AccordionItem>
        <AccordionItem title="Another available section">
          This section is also interactive.
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

export const CustomIcons: Story = {
  render: () => {
    const plusIcon = (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
    return (
      <div style={{ width: 480 }}>
        <Accordion variant="separated" size="md">
          <AccordionItem title="Custom icon item" icon={plusIcon}>
            This item uses a custom plus icon instead of the default arrow.
          </AccordionItem>
          <AccordionItem title="Another custom icon" icon={plusIcon}>
            Icons rotate on expand just like the default arrow.
          </AccordionItem>
        </Accordion>
      </div>
    )
  },
}

export const NestedContent: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Accordion variant="bordered" size="md">
        <AccordionItem title="Rich content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p>Accordion items can contain any React content:</p>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li>Lists</li>
              <li>Images</li>
              <li>Forms</li>
              <li>Other components</li>
            </ul>
            <div style={{ padding: 12, background: 'var(--ui-glass)', borderRadius: 'var(--ui-r-sm)', border: '1px solid var(--ui-border)' }}>
              Nested card-like content
            </div>
          </div>
        </AccordionItem>
        <AccordionItem title="Simple text">
          Just a simple paragraph of text content.
        </AccordionItem>
      </Accordion>
    </div>
  ),
}
