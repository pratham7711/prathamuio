import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Pagination } from '../components/Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'UI/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'outlined', 'ghost', 'pills'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    total: { control: 'number' },
    current: { control: 'number' },
    siblings: { control: 'number' },
    boundaries: { control: 'number' },
    showFirstLast: { control: 'boolean' },
    showPrevNext: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Pagination>

const PaginationDemo = (props: Partial<React.ComponentProps<typeof Pagination>>) => {
  const [page, setPage] = useState(props.current ?? 1)
  return (
    <Pagination
      total={20}
      current={page}
      onChange={setPage}
      {...props}
    />
  )
}

export const Default: Story = {
  render: () => <PaginationDemo total={20} current={1} />,
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PaginationDemo variant="default" total={20} current={5} />
      <PaginationDemo variant="outlined" total={20} current={5} />
      <PaginationDemo variant="ghost" total={20} current={5} />
      <PaginationDemo variant="pills" total={20} current={5} />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PaginationDemo size="sm" total={20} current={5} />
      <PaginationDemo size="md" total={20} current={5} />
      <PaginationDemo size="lg" total={20} current={5} />
    </div>
  ),
}

export const ManyPagesWithEllipsis: Story = {
  render: () => <PaginationDemo total={100} current={50} siblings={2} boundaries={2} />,
}

export const FewPages: Story = {
  render: () => <PaginationDemo total={5} current={3} />,
}

export const WithFirstLastButtons: Story = {
  render: () => <PaginationDemo total={50} current={25} showFirstLast />,
}

export const Disabled: Story = {
  render: () => <PaginationDemo total={20} current={5} disabled />,
}
