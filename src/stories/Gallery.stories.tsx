import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Gallery } from '../components/Gallery'
import type { GalleryItem } from '../components/Gallery'

const meta: Meta<typeof Gallery> = {
  title: 'UI/Gallery',
  component: Gallery,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['grid', 'masonry', 'carousel', 'list'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    gap: { control: 'select', options: ['sm', 'md', 'lg'] },
    aspectRatio: { control: 'select', options: ['1:1', '4:3', '16:9', 'auto'] },
    lightbox: { control: 'boolean' },
    filterable: { control: 'boolean' },
    overlay: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Gallery>

const sampleItems: GalleryItem[] = [
  { id: '1', src: 'https://picsum.photos/seed/a/800/600', alt: 'Mountain landscape', caption: 'Mountain Landscape', category: 'Nature' },
  { id: '2', src: 'https://picsum.photos/seed/b/800/600', alt: 'City skyline', caption: 'City Skyline', category: 'Urban' },
  { id: '3', src: 'https://picsum.photos/seed/c/800/600', alt: 'Ocean waves', caption: 'Ocean Waves', category: 'Nature' },
  { id: '4', src: 'https://picsum.photos/seed/d/800/600', alt: 'Forest path', caption: 'Forest Path', category: 'Nature' },
  { id: '5', src: 'https://picsum.photos/seed/e/800/600', alt: 'Street art', caption: 'Street Art', category: 'Urban' },
  { id: '6', src: 'https://picsum.photos/seed/f/800/600', alt: 'Desert dunes', caption: 'Desert Dunes', category: 'Nature' },
  { id: '7', src: 'https://picsum.photos/seed/g/800/600', alt: 'Neon signs', caption: 'Neon Signs', category: 'Urban' },
  { id: '8', src: 'https://picsum.photos/seed/h/800/600', alt: 'Abstract art', caption: 'Abstract Art', category: 'Art' },
  { id: '9', src: 'https://picsum.photos/seed/i/800/600', alt: 'Sculpture', caption: 'Modern Sculpture', category: 'Art' },
]

const masonryItems: GalleryItem[] = [
  { id: '1', src: 'https://picsum.photos/seed/m1/400/600', alt: 'Tall image 1', caption: 'Portrait Shot', category: 'Nature' },
  { id: '2', src: 'https://picsum.photos/seed/m2/400/300', alt: 'Wide image 1', caption: 'Landscape', category: 'Nature' },
  { id: '3', src: 'https://picsum.photos/seed/m3/400/500', alt: 'Medium image', caption: 'City View', category: 'Urban' },
  { id: '4', src: 'https://picsum.photos/seed/m4/400/250', alt: 'Short image', caption: 'Panorama', category: 'Nature' },
  { id: '5', src: 'https://picsum.photos/seed/m5/400/450', alt: 'Tall image 2', caption: 'Tower', category: 'Urban' },
  { id: '6', src: 'https://picsum.photos/seed/m6/400/350', alt: 'Regular image', caption: 'Park', category: 'Nature' },
]

export const BasicGrid: Story = {
  args: {
    items: sampleItems,
    variant: 'grid',
    columns: 3,
  },
}

export const MasonryLayout: Story = {
  args: {
    items: masonryItems,
    variant: 'masonry',
    columns: 3,
  },
}

export const WithLightbox: Story = {
  args: {
    items: sampleItems.slice(0, 6),
    lightbox: true,
    columns: 3,
  },
}

export const FilterableByCategory: Story = {
  args: {
    items: sampleItems,
    filterable: true,
    columns: 3,
  },
}

export const ListView: Story = {
  args: {
    items: sampleItems.slice(0, 4),
    variant: 'list',
  },
}

export const CustomColumns: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Gallery items={sampleItems.slice(0, 2)} columns={2} />
      <Gallery items={sampleItems.slice(0, 4)} columns={4} />
    </div>
  ),
}

export const ResponsiveColumns: Story = {
  args: {
    items: sampleItems,
    columns: { sm: 1, md: 2, lg: 3 },
  },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <p style={{ color: 'var(--ui-text-2)', marginBottom: '8px', fontSize: 12 }}>Small</p>
        <Gallery items={sampleItems.slice(0, 3)} size="sm" columns={3} />
      </div>
      <div>
        <p style={{ color: 'var(--ui-text-2)', marginBottom: '8px', fontSize: 12 }}>Medium</p>
        <Gallery items={sampleItems.slice(0, 3)} size="md" columns={3} />
      </div>
      <div>
        <p style={{ color: 'var(--ui-text-2)', marginBottom: '8px', fontSize: 12 }}>Large</p>
        <Gallery items={sampleItems.slice(0, 3)} size="lg" columns={3} />
      </div>
    </div>
  ),
}

export const Captions: Story = {
  args: {
    items: sampleItems.slice(0, 6),
    overlay: true,
    columns: 3,
  },
}

export const NoOverlay: Story = {
  args: {
    items: sampleItems.slice(0, 6),
    overlay: false,
    columns: 3,
  },
}

export const SquareAspect: Story = {
  args: {
    items: sampleItems.slice(0, 6),
    aspectRatio: '1:1',
    columns: 3,
  },
}

export const WideAspect: Story = {
  args: {
    items: sampleItems.slice(0, 4),
    aspectRatio: '16:9',
    columns: 2,
  },
}

export const MixedCategories: Story = {
  args: {
    items: sampleItems,
    filterable: true,
    categories: ['Nature', 'Urban', 'Art'],
    columns: 3,
  },
}
