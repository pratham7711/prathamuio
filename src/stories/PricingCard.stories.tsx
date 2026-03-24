import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { PricingCard, PricingCardGroup } from '../components/PricingCard'
import type { PricingFeature } from '../components/PricingCard'

const meta: Meta<typeof PricingCard> = {
  title: 'UI/PricingCard',
  component: PricingCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'glass', 'outlined', 'featured'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    ctaVariant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'glow'] },
    disabled: { control: 'boolean' },
    highlighted: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof PricingCard>

const basicFeatures: PricingFeature[] = [
  { text: '5 Projects', included: true },
  { text: '10GB Storage', included: true },
  { text: 'Email Support', included: true },
  { text: 'Custom Domain', included: false },
  { text: 'Analytics', included: false },
]

const proFeatures: PricingFeature[] = [
  { text: 'Unlimited Projects', included: true },
  { text: '100GB Storage', included: true },
  { text: 'Priority Support', included: true },
  { text: 'Custom Domain', included: true },
  { text: 'Advanced Analytics', included: true },
  { text: 'Team Collaboration', included: false, tooltip: 'Available in Enterprise' },
]

const enterpriseFeatures: PricingFeature[] = [
  { text: 'Unlimited Everything', included: true },
  { text: '1TB Storage', included: true },
  { text: '24/7 Support', included: true },
  { text: 'Custom Domain', included: true },
  { text: 'Advanced Analytics', included: true },
  { text: 'Team Collaboration', included: true },
  { text: 'SSO & SAML', included: true },
]

export const BasicPlan: Story = {
  args: {
    name: 'Starter',
    price: 9,
    description: 'Perfect for individuals and small projects.',
    features: basicFeatures,
    onCtaClick: () => alert('Starter selected'),
  },
}

export const FeaturedPlan: Story = {
  args: {
    name: 'Pro',
    price: 29,
    variant: 'featured',
    badge: 'Popular',
    description: 'Best for growing teams and businesses.',
    features: proFeatures,
    ctaVariant: 'glow',
    onCtaClick: () => alert('Pro selected'),
  },
}

export const FreeTier: Story = {
  args: {
    name: 'Free',
    price: 'Free',
    description: 'Get started at no cost.',
    features: [
      { text: '1 Project', included: true },
      { text: '1GB Storage', included: true },
      { text: 'Community Support', included: true },
      { text: 'Custom Domain', included: false },
    ],
    ctaText: 'Start Free',
    ctaVariant: 'secondary',
  },
}

export const EnterpriseTier: Story = {
  args: {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with specific needs.',
    features: enterpriseFeatures,
    ctaText: 'Contact Sales',
    ctaVariant: 'ghost',
    badge: 'Best Value',
  },
}

export const GlassVariant: Story = {
  render: () => (
    <div style={{ padding: '32px', background: 'var(--ui-bg-1)', borderRadius: '16px' }}>
      <PricingCard
        variant="glass"
        name="Glass"
        price={49}
        description="Transparent elegance."
        features={proFeatures}
      />
    </div>
  ),
}

export const PricingPage: Story = {
  render: () => (
    <PricingCardGroup>
      <PricingCard
        name="Free"
        price="Free"
        description="Get started at no cost."
        features={[
          { text: '1 Project', included: true },
          { text: '1GB Storage', included: true },
          { text: 'Community Support', included: true },
          { text: 'Custom Domain', included: false },
          { text: 'Analytics', included: false },
        ]}
        ctaText="Start Free"
        ctaVariant="secondary"
      />
      <PricingCard
        name="Pro"
        price={29}
        variant="featured"
        badge="Popular"
        description="Best for growing teams."
        features={proFeatures}
        ctaVariant="glow"
        highlighted
      />
      <PricingCard
        name="Enterprise"
        price="Custom"
        description="For large organizations."
        features={enterpriseFeatures}
        ctaText="Contact Sales"
        ctaVariant="ghost"
      />
    </PricingCardGroup>
  ),
}

export const WithBadges: Story = {
  render: () => (
    <PricingCardGroup>
      <PricingCard name="Basic" price={9} features={basicFeatures} badge="Starter" />
      <PricingCard name="Pro" price={29} features={proFeatures} badge="Most Popular" variant="featured" />
      <PricingCard name="Enterprise" price={99} features={enterpriseFeatures} badge="Best Value" />
    </PricingCardGroup>
  ),
}

export const CustomCTA: Story = {
  args: {
    name: 'Custom',
    price: 49,
    features: proFeatures,
    ctaText: 'Try 14 Days Free',
    ctaVariant: 'glow',
    onCtaClick: () => alert('Trial started!'),
  },
}

export const Disabled: Story = {
  args: {
    name: 'Unavailable',
    price: 99,
    features: proFeatures,
    disabled: true,
    description: 'This plan is currently unavailable.',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <PricingCard size="sm" name="Small" price={9} features={basicFeatures.slice(0, 3)} />
      <PricingCard size="md" name="Medium" price={19} features={basicFeatures.slice(0, 4)} />
      <PricingCard size="lg" name="Large" price={29} features={basicFeatures} />
    </div>
  ),
}
