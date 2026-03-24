import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Table } from '../components/Table'
import type { TableColumn } from '../components/Table'

type User = {
  [key: string]: unknown
  id: number
  name: string
  email: string
  role: string
  status: string
}

const sampleData: User[] = [
  { id: 1, name: 'Alice Chen', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Rivera', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Carol Wu', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'David Kim', email: 'david@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Eva Lopez', email: 'eva@example.com', role: 'Admin', status: 'Active' },
]

const columns: TableColumn<User>[] = [
  { key: 'id', header: 'ID', width: '60px', align: 'center' },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
]

const meta: Meta = {
  title: 'UI/Table',
  component: Table,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'striped', 'bordered', 'glass'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    hoverable: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <Table data={sampleData} columns={columns} />,
}

export const Striped: Story = {
  render: () => <Table data={sampleData} columns={columns} variant="striped" />,
}

export const Bordered: Story = {
  render: () => <Table data={sampleData} columns={columns} variant="bordered" />,
}

export const Glass: Story = {
  render: () => <Table data={sampleData} columns={columns} variant="glass" />,
}

export const Sortable: Story = {
  render: () => {
    const [sortKey, setSortKey] = useState<string | undefined>()
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
    const sorted = [...sampleData].sort((a, b) => {
      if (!sortKey) return 0
      const aVal = String(a[sortKey])
      const bVal = String(b[sortKey])
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
    return (
      <Table
        data={sorted}
        columns={columns}
        sortable
        sortKey={sortKey}
        sortDirection={sortDir}
        onSort={(key, dir) => { setSortKey(key); setSortDir(dir) }}
      />
    )
  },
}

export const StickyHeader: Story = {
  render: () => {
    const manyRows: User[] = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 3 === 0 ? 'Admin' : 'Viewer',
      status: i % 4 === 0 ? 'Inactive' : 'Active',
    }))
    return (
      <div style={{ height: '300px', overflow: 'auto' }}>
        <Table data={manyRows} columns={columns} stickyHeader variant="striped" />
      </div>
    )
  },
}

export const EmptyState: Story = {
  render: () => (
    <Table
      data={[]}
      columns={columns}
      emptyMessage="No users found. Try adjusting your filters."
    />
  ),
}

export const Loading: Story = {
  render: () => <Table data={[]} columns={columns} loading />,
}

export const CustomCellRender: Story = {
  render: () => {
    const customColumns: TableColumn<User>[] = [
      ...columns.slice(0, 4),
      {
        key: 'status',
        header: 'Status',
        render: (row) => (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '12px',
              background: row.status === 'Active' ? 'var(--ui-success-dim)' : 'var(--ui-danger-dim)',
              color: row.status === 'Active' ? 'var(--ui-success)' : 'var(--ui-danger)',
            }}
          >
            {String(row.status)}
          </span>
        ),
      },
    ]
    return <Table data={sampleData} columns={customColumns} />
  },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Table data={sampleData.slice(0, 3)} columns={columns} size="sm" />
      <Table data={sampleData.slice(0, 3)} columns={columns} size="md" />
      <Table data={sampleData.slice(0, 3)} columns={columns} size="lg" />
    </div>
  ),
}
