import type { Meta, StoryObj } from '@storybook/react'
import { Nav } from '../components/Nav'
import { Button } from '../components/Button'

const meta: Meta<typeof Nav> = {
  title: 'UI/Nav',
  component: Nav,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Scroll the iframe to see glass transition effect.' } },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Nav>

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
]

export const Default: Story = {
  render: () => (
    <div style={{ minHeight: '300vh', background: 'var(--ui-bg-1)' }}>
      <Nav
        logo={<span>Pratham<span style={{ color: 'var(--ui-accent)' }}>.dev</span></span>}
        links={LINKS}
        cta={<Button size="sm" variant="glow">Hire Me</Button>}
      />
      <div style={{ paddingTop: '80px', padding: '120px 40px 40px', color: 'var(--ui-text-2)', fontSize: '14px' }}>
        Scroll down to see the frosted glass effect activate…
      </div>
    </div>
  ),
}

export const LogoOnly: Story = {
  render: () => (
    <div style={{ height: '200px', background: 'var(--ui-bg-1)' }}>
      <Nav logo={<span>Studio</span>} />
    </div>
  ),
}

export const WithAllSlots: Story = {
  render: () => (
    <div style={{ height: '200px', background: 'var(--ui-bg-1)' }}>
      <Nav
        logo={<span>⚡ Acme</span>}
        links={LINKS}
        cta={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button size="sm" variant="ghost">Login</Button>
            <Button size="sm" variant="primary">Sign Up</Button>
          </div>
        }
      />
    </div>
  ),
}
