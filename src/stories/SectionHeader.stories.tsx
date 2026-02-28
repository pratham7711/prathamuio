import type { Meta, StoryObj } from '@storybook/react'
import { SectionHeader } from '../components/SectionHeader'

const meta: Meta<typeof SectionHeader> = {
  title: 'UI/SectionHeader',
  component: SectionHeader,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SectionHeader>

export const Default: Story = {
  render: () => (
    <div style={{ width: '560px' }}>
      <SectionHeader
        overline="01 — About"
        title="Building things people love to use"
        subtitle="Full-stack developer focused on crafting clean, performant web applications with exceptional attention to detail."
      />
    </div>
  ),
}

export const Centered: Story = {
  render: () => (
    <div style={{ width: '560px' }}>
      <SectionHeader
        overline="Featured Work"
        title="Selected Projects"
        subtitle="A curated selection of projects I've built — from SaaS platforms to open source tools."
        centered
      />
    </div>
  ),
}

export const TitleOnly: Story = {
  render: () => (
    <div style={{ width: '560px' }}>
      <SectionHeader title="Latest Articles" />
    </div>
  ),
}

export const AllLevels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '560px' }}>
      <SectionHeader as="h1" overline="H1 Heading" title="The biggest heading" subtitle="Used for page-level titles." />
      <SectionHeader as="h2" overline="H2 Heading" title="Section heading" subtitle="Most common usage for page sections." />
      <SectionHeader as="h3" overline="H3 Heading" title="Sub-section heading" subtitle="For smaller grouped content." />
    </div>
  ),
}
