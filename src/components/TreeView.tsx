import React, { useState, useCallback, useRef, useEffect } from 'react'

/** Visual variant for the tree view */
export type TreeViewVariant = 'default' | 'lined' | 'filled' | 'glass'

/** Size preset for the tree view */
export type TreeViewSize = 'sm' | 'md' | 'lg'

/** A node in the tree hierarchy */
export interface TreeNode {
  /** Unique identifier */
  id: string
  /** Display label */
  label: string
  /** Child nodes */
  children?: TreeNode[]
  /** Optional icon */
  icon?: React.ReactNode
  /** Whether the node is disabled */
  disabled?: boolean
  /** Arbitrary data payload */
  data?: unknown
}

export interface TreeViewProps {
  /** Tree data */
  data: TreeNode[]
  /** Visual variant */
  variant?: TreeViewVariant
  /** Size preset */
  size?: TreeViewSize
  /** Enable selection */
  selectable?: boolean
  /** Enable multi-select (shows checkboxes) */
  multiSelect?: boolean
  /** Controlled selected node id(s) */
  selected?: string | string[]
  /** Selection change handler */
  onSelect?: (id: string | string[]) => void
  /** Controlled expanded node ids */
  expanded?: string[]
  /** Expand change handler */
  onExpand?: (ids: string[]) => void
  /** Initially expanded nodes or 'all' */
  defaultExpanded?: string[] | 'all'
  /** Show connecting lines (default true for 'lined' variant) */
  showLines?: boolean
  /** Show node icons (default true) */
  showIcons?: boolean
  /** Custom expand icon */
  expandIcon?: React.ReactNode
  /** Custom collapse icon */
  collapseIcon?: React.ReactNode
  /** Additional CSS class */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

function collectAllIds(nodes: TreeNode[]): string[] {
  const ids: string[] = []
  const walk = (list: TreeNode[]) => {
    for (const n of list) {
      if (n.children?.length) {
        ids.push(n.id)
        walk(n.children)
      }
    }
  }
  walk(nodes)
  return ids
}

function flattenVisible(nodes: TreeNode[], expandedSet: Set<string>): TreeNode[] {
  const result: TreeNode[] = []
  const walk = (list: TreeNode[]) => {
    for (const n of list) {
      result.push(n)
      if (n.children?.length && expandedSet.has(n.id)) {
        walk(n.children)
      }
    }
  }
  walk(nodes)
  return result
}

const defaultExpandSvg = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 4 10 8 6 12" />
  </svg>
)

const defaultCollapseSvg = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 6 8 10 12 6" />
  </svg>
)

const defaultFolderIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
)

const defaultFileIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

interface TreeNodeItemProps {
  node: TreeNode
  level: number
  variant: TreeViewVariant
  size: TreeViewSize
  expandedSet: Set<string>
  selectedSet: Set<string>
  selectable: boolean
  multiSelect: boolean
  showLines: boolean
  showIcons: boolean
  expandIcon: React.ReactNode
  collapseIcon: React.ReactNode
  onToggle: (id: string) => void
  onSelectNode: (id: string) => void
  focusedId: string | null
  onFocusId: (id: string) => void
}

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  level,
  variant,
  size,
  expandedSet,
  selectedSet,
  selectable,
  multiSelect,
  showLines,
  showIcons,
  expandIcon,
  collapseIcon,
  onToggle,
  onSelectNode,
  focusedId,
  onFocusId,
}) => {
  const hasChildren = !!(node.children?.length)
  const isExpanded = expandedSet.has(node.id)
  const isSelected = selectedSet.has(node.id)
  const isFocused = focusedId === node.id

  const cls = [
    'ui-tree-node',
    isSelected && 'ui-tree-node-selected',
    isFocused && 'ui-tree-node-focused',
    node.disabled && 'ui-tree-node-disabled',
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = () => {
    if (node.disabled) return
    if (hasChildren) onToggle(node.id)
    if (selectable) onSelectNode(node.id)
    onFocusId(node.id)
  }

  return (
    <>
      <div
        className={cls}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={selectable ? isSelected : undefined}
        aria-level={level}
        aria-disabled={node.disabled || undefined}
        data-node-id={node.id}
        tabIndex={isFocused ? 0 : -1}
        onClick={handleClick}
        style={{ paddingLeft: `${level * (size === 'sm' ? 16 : size === 'lg' ? 28 : 22)}px` }}
      >
        {showLines && level > 0 && <span className="ui-tree-line" />}
        <span className="ui-tree-toggle">
          {hasChildren ? (isExpanded ? (collapseIcon || defaultCollapseSvg) : (expandIcon || defaultExpandSvg)) : <span className="ui-tree-toggle-spacer" />}
        </span>
        {multiSelect && selectable && (
          <span className={['ui-tree-checkbox', isSelected && 'ui-tree-checkbox-checked'].filter(Boolean).join(' ')}>
            {isSelected && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="2 6 5 9 10 3" />
              </svg>
            )}
          </span>
        )}
        {showIcons && (
          <span className="ui-tree-icon">
            {node.icon ?? (hasChildren ? defaultFolderIcon : defaultFileIcon)}
          </span>
        )}
        <span className="ui-tree-label">{node.label}</span>
      </div>
      {hasChildren && isExpanded && (
        <div className={['ui-tree-children', showLines && 'ui-tree-children-lined'].filter(Boolean).join(' ')} role="group">
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              variant={variant}
              size={size}
              expandedSet={expandedSet}
              selectedSet={selectedSet}
              selectable={selectable}
              multiSelect={multiSelect}
              showLines={showLines}
              showIcons={showIcons}
              expandIcon={expandIcon}
              collapseIcon={collapseIcon}
              onToggle={onToggle}
              onSelectNode={onSelectNode}
              focusedId={focusedId}
              onFocusId={onFocusId}
            />
          ))}
        </div>
      )}
    </>
  )
}

/**
 * Hierarchical tree view with expand/collapse, single/multi selection,
 * keyboard navigation, and connecting lines. Supports 4 visual variants.
 */
export const TreeView: React.FC<TreeViewProps> = ({
  data,
  variant = 'default',
  size = 'md',
  selectable = false,
  multiSelect = false,
  selected,
  onSelect,
  expanded: controlledExpanded,
  onExpand,
  defaultExpanded,
  showLines,
  showIcons = true,
  expandIcon,
  collapseIcon,
  className,
  style,
}) => {
  const resolvedShowLines = showLines ?? variant === 'lined'

  const [internalExpanded, setInternalExpanded] = useState<string[]>(() => {
    if (defaultExpanded === 'all') return collectAllIds(data)
    return defaultExpanded ?? []
  })

  const expandedIds = controlledExpanded ?? internalExpanded
  const expandedSet = new Set(expandedIds)

  const selectedSet = new Set<string>(
    selected == null ? [] : Array.isArray(selected) ? selected : [selected]
  )

  const [focusedId, setFocusedId] = useState<string | null>(null)
  const treeRef = useRef<HTMLDivElement>(null)

  const handleToggle = useCallback(
    (id: string) => {
      const next = expandedSet.has(id)
        ? expandedIds.filter((x) => x !== id)
        : [...expandedIds, id]
      if (onExpand) onExpand(next)
      else setInternalExpanded(next)
    },
    [expandedIds, expandedSet, onExpand]
  )

  const handleSelect = useCallback(
    (id: string) => {
      if (!selectable || !onSelect) return
      if (multiSelect) {
        const arr = Array.isArray(selected) ? selected : selected ? [selected] : []
        const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]
        onSelect(next)
      } else {
        onSelect(id)
      }
    },
    [selectable, multiSelect, selected, onSelect]
  )

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const visible = flattenVisible(data, expandedSet)
      const idx = visible.findIndex((n) => n.id === focusedId)

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          const next = visible[idx + 1]
          if (next && !next.disabled) setFocusedId(next.id)
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          const prev = visible[idx - 1]
          if (prev && !prev.disabled) setFocusedId(prev.id)
          break
        }
        case 'ArrowRight': {
          e.preventDefault()
          const cur = visible[idx]
          if (cur?.children?.length && !expandedSet.has(cur.id)) {
            handleToggle(cur.id)
          }
          break
        }
        case 'ArrowLeft': {
          e.preventDefault()
          const cur = visible[idx]
          if (cur?.children?.length && expandedSet.has(cur.id)) {
            handleToggle(cur.id)
          }
          break
        }
        case 'Enter':
        case ' ': {
          e.preventDefault()
          const cur = visible[idx]
          if (cur && !cur.disabled && selectable) handleSelect(cur.id)
          break
        }
        case 'Home': {
          e.preventDefault()
          if (visible.length) setFocusedId(visible[0].id)
          break
        }
        case 'End': {
          e.preventDefault()
          if (visible.length) setFocusedId(visible[visible.length - 1].id)
          break
        }
      }
    },
    [data, expandedSet, focusedId, handleToggle, handleSelect, selectable]
  )

  // Scroll focused node into view
  useEffect(() => {
    if (!focusedId || !treeRef.current) return
    const el = treeRef.current.querySelector(`[data-node-id="${focusedId}"]`) as HTMLElement | null
    el?.focus()
  }, [focusedId])

  const cls = [
    'ui-tree',
    `ui-tree-${variant}`,
    `ui-tree-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={treeRef}
      className={cls}
      style={style}
      role="tree"
      aria-multiselectable={multiSelect || undefined}
      onKeyDown={handleKeyDown}
    >
      {data.map((node) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          level={0}
          variant={variant}
          size={size}
          expandedSet={expandedSet}
          selectedSet={selectedSet}
          selectable={selectable}
          multiSelect={multiSelect}
          showLines={resolvedShowLines}
          showIcons={showIcons}
          expandIcon={expandIcon ?? null}
          collapseIcon={collapseIcon ?? null}
          onToggle={handleToggle}
          onSelectNode={handleSelect}
          focusedId={focusedId}
          onFocusId={setFocusedId}
        />
      ))}
    </div>
  )
}
