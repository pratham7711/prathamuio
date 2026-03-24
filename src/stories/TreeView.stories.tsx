import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { TreeView } from '../components/TreeView'
import type { TreeNode } from '../components/TreeView'

const meta: Meta<typeof TreeView> = {
  title: 'UI/TreeView',
  component: TreeView,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'lined', 'filled', 'glass'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    selectable: { control: 'boolean' },
    multiSelect: { control: 'boolean' },
    showLines: { control: 'boolean' },
    showIcons: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof TreeView>

const fileSystem: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'input', label: 'Input.tsx' },
          { id: 'modal', label: 'Modal.tsx' },
        ],
      },
      {
        id: 'styles',
        label: 'styles',
        children: [
          { id: 'tokens', label: 'tokens.css' },
          { id: 'components-css', label: 'components.css' },
        ],
      },
      { id: 'index', label: 'index.ts' },
    ],
  },
  {
    id: 'package',
    label: 'package.json',
  },
  {
    id: 'readme',
    label: 'README.md',
  },
]

const departments: TreeNode[] = [
  {
    id: 'eng',
    label: 'Engineering',
    children: [
      {
        id: 'frontend',
        label: 'Frontend',
        children: [
          { id: 'alice', label: 'Alice Chen' },
          { id: 'bob', label: 'Bob Smith' },
        ],
      },
      {
        id: 'backend',
        label: 'Backend',
        children: [
          { id: 'carol', label: 'Carol Davis' },
          { id: 'dave', label: 'Dave Wilson', disabled: true },
        ],
      },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    children: [
      { id: 'eve', label: 'Eve Johnson' },
      { id: 'frank', label: 'Frank Lee' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    disabled: true,
    children: [
      { id: 'grace', label: 'Grace Taylor' },
    ],
  },
]

const deepNested: TreeNode[] = [
  {
    id: 'l1',
    label: 'Level 1',
    children: [
      {
        id: 'l2',
        label: 'Level 2',
        children: [
          {
            id: 'l3',
            label: 'Level 3',
            children: [
              {
                id: 'l4',
                label: 'Level 4',
                children: [
                  {
                    id: 'l5',
                    label: 'Level 5',
                    children: [
                      { id: 'l6a', label: 'Leaf A' },
                      { id: 'l6b', label: 'Leaf B' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

export const FileSystemTree: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <TreeView data={fileSystem} defaultExpanded={['src', 'components']} />
    </div>
  ),
}

export const DepartmentHierarchy: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <TreeView data={departments} defaultExpanded={['eng']} variant="filled" />
    </div>
  ),
}

export const WithCustomIcons: Story = {
  render: () => {
    const data: TreeNode[] = [
      {
        id: 'music',
        label: 'Music',
        icon: <span>🎵</span>,
        children: [
          { id: 'rock', label: 'Rock', icon: <span>🎸</span> },
          { id: 'jazz', label: 'Jazz', icon: <span>🎷</span> },
          { id: 'classical', label: 'Classical', icon: <span>🎻</span> },
        ],
      },
      {
        id: 'movies',
        label: 'Movies',
        icon: <span>🎬</span>,
        children: [
          { id: 'action', label: 'Action', icon: <span>💥</span> },
          { id: 'drama', label: 'Drama', icon: <span>🎭</span> },
        ],
      },
    ]
    return (
      <div style={{ width: 280 }}>
        <TreeView data={data} defaultExpanded="all" />
      </div>
    )
  },
}

export const MultiSelect: Story = {
  render: () => {
    const Demo = () => {
      const [selected, setSelected] = useState<string[]>([])
      return (
        <div style={{ width: 320 }}>
          <p style={{ color: 'var(--ui-text-2)', fontSize: 13, marginBottom: 8 }}>
            Selected: {selected.length ? selected.join(', ') : 'none'}
          </p>
          <TreeView
            data={fileSystem}
            defaultExpanded="all"
            selectable
            multiSelect
            selected={selected}
            onSelect={(ids) => setSelected(ids as string[])}
          />
        </div>
      )
    }
    return <Demo />
  },
}

export const GlassVariant: Story = {
  render: () => (
    <div style={{ width: 320, background: 'var(--ui-bg-1)', padding: 16, borderRadius: 12 }}>
      <TreeView data={fileSystem} defaultExpanded={['src']} variant="glass" />
    </div>
  ),
}

export const LinedVariant: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <TreeView data={departments} defaultExpanded="all" variant="lined" />
    </div>
  ),
}

export const AllExpanded: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <TreeView data={fileSystem} defaultExpanded="all" />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32 }}>
      <div>
        <p style={{ color: 'var(--ui-text-2)', fontSize: 12, marginBottom: 4 }}>Small</p>
        <TreeView data={fileSystem} defaultExpanded={['src']} size="sm" />
      </div>
      <div>
        <p style={{ color: 'var(--ui-text-2)', fontSize: 12, marginBottom: 4 }}>Medium</p>
        <TreeView data={fileSystem} defaultExpanded={['src']} size="md" />
      </div>
      <div>
        <p style={{ color: 'var(--ui-text-2)', fontSize: 12, marginBottom: 4 }}>Large</p>
        <TreeView data={fileSystem} defaultExpanded={['src']} size="lg" />
      </div>
    </div>
  ),
}

export const DisabledNodes: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <TreeView data={departments} defaultExpanded="all" selectable />
    </div>
  ),
}

export const DeeplyNested: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <TreeView data={deepNested} defaultExpanded="all" variant="lined" />
    </div>
  ),
}
