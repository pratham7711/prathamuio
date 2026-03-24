import type { Meta, StoryObj } from '@storybook/react'
import { Carousel, CarouselSlide } from '../components/Carousel'

const meta: Meta<typeof Carousel> = {
  title: 'UI/Carousel',
  component: Carousel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Carousel>

const slideStyle = (color: string): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '200px',
  background: color,
  borderRadius: 'var(--ui-r-md)',
  color: 'var(--ui-text-0)',
  fontSize: '24px',
  fontFamily: 'var(--ui-font)',
  fontWeight: 600,
})

export const Basic: Story = {
  render: () => (
    <div style={{ width: '500px' }}>
      <Carousel>
        <CarouselSlide><div style={slideStyle('var(--ui-bg-2)')}>Slide 1</div></CarouselSlide>
        <CarouselSlide><div style={slideStyle('var(--ui-bg-3)')}>Slide 2</div></CarouselSlide>
        <CarouselSlide><div style={slideStyle('var(--ui-bg-2)')}>Slide 3</div></CarouselSlide>
      </Carousel>
    </div>
  ),
}

export const AutoPlay: Story = {
  render: () => (
    <div style={{ width: '500px' }}>
      <Carousel autoPlay autoPlayInterval={3000}>
        <CarouselSlide><div style={slideStyle('var(--ui-bg-2)')}>Auto 1</div></CarouselSlide>
        <CarouselSlide><div style={slideStyle('var(--ui-bg-3)')}>Auto 2</div></CarouselSlide>
        <CarouselSlide><div style={slideStyle('var(--ui-bg-2)')}>Auto 3</div></CarouselSlide>
        <CarouselSlide><div style={slideStyle('var(--ui-bg-3)')}>Auto 4</div></CarouselSlide>
      </Carousel>
    </div>
  ),
}

export const FadeTransition: Story = {
  render: () => (
    <div style={{ width: '500px' }}>
      <Carousel variant="fade">
        <CarouselSlide><div style={slideStyle('var(--ui-bg-2)')}>Fade 1</div></CarouselSlide>
        <CarouselSlide><div style={slideStyle('var(--ui-bg-3)')}>Fade 2</div></CarouselSlide>
        <CarouselSlide><div style={slideStyle('var(--ui-bg-2)')}>Fade 3</div></CarouselSlide>
      </Carousel>
    </div>
  ),
}

export const CardMultiSlide: Story = {
  render: () => (
    <div style={{ width: '700px' }}>
      <Carousel variant="card" slidesToShow={3} gap={12}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <CarouselSlide key={n}>
            <div style={{ ...slideStyle(n % 2 === 0 ? 'var(--ui-bg-3)' : 'var(--ui-bg-2)'), height: '160px', fontSize: '18px' }}>
              Card {n}
            </div>
          </CarouselSlide>
        ))}
      </Carousel>
    </div>
  ),
}

export const NoControls: Story = {
  render: () => (
    <div style={{ width: '500px' }}>
      <Carousel showArrows={false} showDots={false} autoPlay autoPlayInterval={2000}>
        <CarouselSlide><div style={slideStyle('var(--ui-bg-2)')}>Clean 1</div></CarouselSlide>
        <CarouselSlide><div style={slideStyle('var(--ui-bg-3)')}>Clean 2</div></CarouselSlide>
        <CarouselSlide><div style={slideStyle('var(--ui-bg-2)')}>Clean 3</div></CarouselSlide>
      </Carousel>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '500px' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s}>
          <span style={{ color: 'var(--ui-text-2)', fontSize: '12px', marginBottom: '8px', display: 'block' }}>{s}</span>
          <Carousel size={s} loop={false}>
            <CarouselSlide><div style={{ ...slideStyle('var(--ui-bg-2)'), height: '120px', fontSize: '16px' }}>{s} - Slide 1</div></CarouselSlide>
            <CarouselSlide><div style={{ ...slideStyle('var(--ui-bg-3)'), height: '120px', fontSize: '16px' }}>{s} - Slide 2</div></CarouselSlide>
          </Carousel>
        </div>
      ))}
    </div>
  ),
}

export const NoLoop: Story = {
  render: () => (
    <div style={{ width: '500px' }}>
      <Carousel loop={false}>
        <CarouselSlide><div style={slideStyle('var(--ui-bg-2)')}>First (no loop)</div></CarouselSlide>
        <CarouselSlide><div style={slideStyle('var(--ui-bg-3)')}>Middle</div></CarouselSlide>
        <CarouselSlide><div style={slideStyle('var(--ui-bg-2)')}>Last (no loop)</div></CarouselSlide>
      </Carousel>
    </div>
  ),
}
