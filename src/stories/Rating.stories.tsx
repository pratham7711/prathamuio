import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Rating } from '../components/Rating'

const meta: Meta<typeof Rating> = {
  title: 'UI/Rating',
  component: Rating,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Rating>

export const Default: Story = {
  render: () => <Rating defaultValue={3} />,
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <span style={{ color: 'var(--ui-text-2)', fontSize: '13px', marginBottom: '4px', display: 'block' }}>Star</span>
        <Rating variant="star" defaultValue={3} />
      </div>
      <div>
        <span style={{ color: 'var(--ui-text-2)', fontSize: '13px', marginBottom: '4px', display: 'block' }}>Heart</span>
        <Rating variant="heart" defaultValue={4} />
      </div>
      <div>
        <span style={{ color: 'var(--ui-text-2)', fontSize: '13px', marginBottom: '4px', display: 'block' }}>Circle</span>
        <Rating variant="circle" defaultValue={2} />
      </div>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <div key={s}>
          <span style={{ color: 'var(--ui-text-2)', fontSize: '12px', marginBottom: '4px', display: 'block' }}>{s}</span>
          <Rating size={s} defaultValue={3} />
        </div>
      ))}
    </div>
  ),
}

export const HalfStarPrecision: Story = {
  render: () => <Rating precision={0.5} defaultValue={2.5} />,
}

export const ReadOnly: Story = {
  render: () => <Rating readOnly value={3.5} precision={0.5} />,
}

export const Disabled: Story = {
  render: () => <Rating disabled value={2} />,
}

export const CustomIcons: Story = {
  render: () => (
    <Rating
      variant="custom"
      defaultValue={3}
      icon={<span style={{ fontSize: '1.4em' }}>&#9733;</span>}
      emptyIcon={<span style={{ fontSize: '1.4em', opacity: 0.3 }}>&#9733;</span>}
    />
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState(2)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <Rating value={value} onChange={setValue} />
        <span style={{ color: 'var(--ui-text-1)', fontFamily: 'var(--ui-font-mono)', fontSize: '14px' }}>
          Value: {value}
        </span>
      </div>
    )
  },
}

export const MaxTen: Story = {
  render: () => <Rating max={10} defaultValue={7} size="sm" />,
}
