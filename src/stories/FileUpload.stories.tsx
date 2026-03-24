import type { Meta, StoryObj } from '@storybook/react'
import { FileUpload } from '../components/FileUpload'

const meta: Meta<typeof FileUpload> = {
  title: 'UI/FileUpload',
  component: FileUpload,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FileUpload>

const wrap = { width: '400px' }
const col = { ...wrap, display: 'flex', flexDirection: 'column' as const, gap: '24px' }

export const Dropzone: Story = {
  render: () => (
    <div style={wrap}>
      <FileUpload
        variant="dropzone"
        label="Drop files here or click to upload"
        description="PNG, JPG, PDF up to 10MB"
        onFilesSelected={(files) => console.log('Selected:', files)}
      />
    </div>
  ),
}

export const ButtonVariant: Story = {
  render: () => (
    <div style={wrap}>
      <FileUpload
        variant="button"
        label="Upload document"
        onFilesSelected={(files) => console.log('Selected:', files)}
      />
    </div>
  ),
}

export const Minimal: Story = {
  render: () => (
    <div style={wrap}>
      <FileUpload
        variant="minimal"
        label="Choose file"
        onFilesSelected={(files) => console.log('Selected:', files)}
      />
    </div>
  ),
}

export const WithFileTypeRestriction: Story = {
  render: () => (
    <div style={wrap}>
      <FileUpload
        accept="image/*"
        label="Drop images here or click to upload"
        description="Only image files are accepted"
        onError={(err) => console.log('Error:', err)}
      />
    </div>
  ),
}

export const SizeLimit: Story = {
  render: () => (
    <div style={wrap}>
      <FileUpload
        maxSize={1024 * 1024}
        label="Drop files here or click to upload"
        description="Max file size: 1MB"
        onError={(err) => console.log('Size error:', err)}
      />
    </div>
  ),
}

export const MultipleFiles: Story = {
  render: () => (
    <div style={wrap}>
      <FileUpload
        multiple
        maxFiles={5}
        label="Drop files here or click to upload"
        description="Select up to 5 files"
        onFilesSelected={(files) => console.log('Selected:', files)}
        onError={(err) => console.log('Error:', err)}
      />
    </div>
  ),
}

export const DragHoverState: Story = {
  name: 'Drag Hover State',
  render: () => (
    <div style={wrap}>
      <FileUpload
        label="Try dragging a file over this area"
        description="The border will highlight on drag over"
      />
    </div>
  ),
}

export const ErrorFeedback: Story = {
  render: () => (
    <div style={wrap}>
      <FileUpload
        accept=".pdf"
        maxSize={512 * 1024}
        label="Drop PDF files here"
        description="Only .pdf files under 512KB"
        onError={(err) => alert(`Error: ${err.type} — ${err.file.name}`)}
      />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={col}>
      <FileUpload size="sm" label="Small dropzone" description="Compact size" />
      <FileUpload size="md" label="Medium dropzone" description="Default size" />
      <FileUpload size="lg" label="Large dropzone" description="Spacious layout" />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div style={col}>
      <FileUpload variant="dropzone" label="Dropzone variant" description="Drag and drop" />
      <FileUpload variant="button" label="Button variant" />
      <FileUpload variant="minimal" label="Minimal variant" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div style={col}>
      <FileUpload disabled label="Disabled dropzone" description="Cannot interact" />
      <FileUpload disabled variant="button" label="Disabled button" />
      <FileUpload disabled variant="minimal" label="Disabled link" />
    </div>
  ),
}
