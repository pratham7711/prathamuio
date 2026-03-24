import type { Meta, StoryObj } from '@storybook/react'
import { Thumbnail, ThumbnailGroup } from '../components/Thumbnail'

const meta: Meta<typeof Thumbnail> = {
  title: 'UI/Thumbnail',
  component: Thumbnail,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'rounded', 'circle', 'glass'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    aspectRatio: { control: 'select', options: ['auto', '1:1', '4:3', '16:9', '3:2'] },
    zoom: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Thumbnail>

const SAMPLE_IMG = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop'
const SAMPLE_IMG_2 = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop'
const SAMPLE_IMG_3 = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop'
const SAMPLE_IMG_4 = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop'

export const Basic: Story = {
  render: () => (
    <Thumbnail src={SAMPLE_IMG} alt="Mountain landscape" />
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
      {(['default', 'rounded', 'circle', 'glass'] as const).map((v) => (
        <div key={v} style={{ textAlign: 'center' }}>
          <Thumbnail src={SAMPLE_IMG} alt={`${v} variant`} variant={v} aspectRatio="1:1" />
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 }}>{v}</div>
        </div>
      ))}
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'end' }}>
      {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <div key={s} style={{ textAlign: 'center' }}>
          <Thumbnail src={SAMPLE_IMG} alt={`Size ${s}`} size={s} aspectRatio="1:1" />
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 }}>{s}</div>
        </div>
      ))}
    </div>
  ),
}

export const WithOverlay: Story = {
  render: () => (
    <Thumbnail
      src={SAMPLE_IMG}
      alt="Landscape with overlay"
      size="xl"
      aspectRatio="16:9"
      overlay={
        <div style={{ color: '#fff', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>View Details</div>
          <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Click to expand</div>
        </div>
      }
      onClick={() => alert('Thumbnail clicked')}
    />
  ),
}

export const WithCaption: Story = {
  render: () => (
    <Thumbnail
      src={SAMPLE_IMG}
      alt="Mountain landscape"
      size="lg"
      caption="Mountain landscape at sunset"
    />
  ),
}

export const AspectRatios: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'start' }}>
      {(['1:1', '4:3', '16:9', '3:2'] as const).map((ar) => (
        <div key={ar} style={{ textAlign: 'center' }}>
          <Thumbnail src={SAMPLE_IMG_2} alt={`Ratio ${ar}`} size="lg" aspectRatio={ar} />
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 }}>{ar}</div>
        </div>
      ))}
    </div>
  ),
}

export const ImageGrid: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <ThumbnailGroup columns={3} gap="md">
        <Thumbnail src={SAMPLE_IMG} alt="Image 1" aspectRatio="1:1" />
        <Thumbnail src={SAMPLE_IMG_2} alt="Image 2" aspectRatio="1:1" />
        <Thumbnail src={SAMPLE_IMG_3} alt="Image 3" aspectRatio="1:1" />
        <Thumbnail src={SAMPLE_IMG_4} alt="Image 4" aspectRatio="1:1" />
        <Thumbnail src={SAMPLE_IMG} alt="Image 5" aspectRatio="1:1" />
        <Thumbnail src={SAMPLE_IMG_2} alt="Image 6" aspectRatio="1:1" />
      </ThumbnailGroup>
    </div>
  ),
}

export const ErrorFallback: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Thumbnail src="https://broken-url.invalid/image.jpg" alt="Broken image" size="lg" />
      <Thumbnail
        src="https://broken-url.invalid/image.jpg"
        alt="Custom fallback"
        size="lg"
        fallback={
          <div style={{ color: 'var(--ui-text-2)', textAlign: 'center', fontSize: 12 }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>&#128247;</div>
            No image
          </div>
        }
      />
    </div>
  ),
}

export const CircleAvatars: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Thumbnail src={SAMPLE_IMG} alt="Avatar 1" variant="circle" size="sm" aspectRatio="1:1" />
      <Thumbnail src={SAMPLE_IMG_2} alt="Avatar 2" variant="circle" size="md" aspectRatio="1:1" />
      <Thumbnail src={SAMPLE_IMG_3} alt="Avatar 3" variant="circle" size="lg" aspectRatio="1:1" />
    </div>
  ),
}

export const GalleryLayout: Story = {
  render: () => (
    <div style={{ width: 600 }}>
      <ThumbnailGroup columns={4} gap="sm">
        {[SAMPLE_IMG, SAMPLE_IMG_2, SAMPLE_IMG_3, SAMPLE_IMG_4, SAMPLE_IMG, SAMPLE_IMG_2, SAMPLE_IMG_3, SAMPLE_IMG_4].map((src, i) => (
          <Thumbnail
            key={i}
            src={src}
            alt={`Gallery image ${i + 1}`}
            variant="rounded"
            aspectRatio="1:1"
            size="lg"
            overlay={
              <div style={{ color: '#fff', fontSize: 12 }}>#{i + 1}</div>
            }
          />
        ))}
      </ThumbnailGroup>
    </div>
  ),
}
