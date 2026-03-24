import React, { useState, useRef, useCallback, useId } from 'react'

/** FileUpload visual variant */
export type FileUploadVariant = 'dropzone' | 'button' | 'minimal'
/** FileUpload size preset */
export type FileUploadSize = 'sm' | 'md' | 'lg'

/** Error info returned from validation */
export interface FileUploadError {
  type: 'size' | 'type' | 'count'
  file: File
}

export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
  /** Visual style variant */
  variant?: FileUploadVariant
  /** Size preset */
  size?: FileUploadSize
  /** Accepted file types (e.g. "image/*,.pdf") */
  accept?: string
  /** Allow multiple files */
  multiple?: boolean
  /** Max file size in bytes */
  maxSize?: number
  /** Max number of files */
  maxFiles?: number
  /** Called with validated files */
  onFilesSelected?: (files: File[]) => void
  /** Called when validation fails */
  onError?: (error: FileUploadError) => void
  /** Disabled state */
  disabled?: boolean
  /** Label text */
  label?: string
  /** Description shown in dropzone */
  description?: string
  /** Custom icon node */
  icon?: React.ReactNode
  /** Custom dropzone content */
  children?: React.ReactNode
  /** Additional CSS class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

/**
 * FileUpload component supporting dropzone, button, and minimal variants.
 * Drag-and-drop support, file validation, and selected file display with remove.
 */
export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      variant = 'dropzone',
      size = 'md',
      accept,
      multiple = false,
      maxSize,
      maxFiles,
      onFilesSelected,
      onError,
      disabled = false,
      label,
      description,
      icon,
      children,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const id = useId()
    const inputRef = useRef<HTMLInputElement>(null)
    const [dragOver, setDragOver] = useState(false)
    const [files, setFiles] = useState<File[]>([])

    const matchesAccept = useCallback(
      (file: File): boolean => {
        if (!accept) return true
        const patterns = accept.split(',').map((s) => s.trim())
        return patterns.some((pattern) => {
          if (pattern.startsWith('.')) {
            return file.name.toLowerCase().endsWith(pattern.toLowerCase())
          }
          if (pattern.endsWith('/*')) {
            const type = pattern.slice(0, -2)
            return file.type.startsWith(type)
          }
          return file.type === pattern
        })
      },
      [accept]
    )

    const validateAndProcess = useCallback(
      (incoming: File[]) => {
        const valid: File[] = []
        for (const file of incoming) {
          if (!matchesAccept(file)) {
            onError?.({ type: 'type', file })
            continue
          }
          if (maxSize && file.size > maxSize) {
            onError?.({ type: 'size', file })
            continue
          }
          if (maxFiles && files.length + valid.length >= maxFiles) {
            onError?.({ type: 'count', file })
            continue
          }
          valid.push(file)
        }
        if (valid.length > 0) {
          const next = multiple ? [...files, ...valid] : valid.slice(0, 1)
          setFiles(next)
          onFilesSelected?.(next)
        }
      },
      [matchesAccept, maxSize, maxFiles, files, multiple, onError, onFilesSelected]
    )

    const openDialog = () => {
      if (!disabled) inputRef.current?.click()
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files
      if (list) validateAndProcess(Array.from(list))
      // Reset so the same file can be re-selected
      e.target.value = ''
    }

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragOver(false)
        if (disabled) return
        const list = e.dataTransfer.files
        if (list) validateAndProcess(Array.from(list))
      },
      [disabled, validateAndProcess]
    )

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) setDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragOver(false)
    }

    const removeFile = (index: number) => {
      const next = files.filter((_, i) => i !== index)
      setFiles(next)
      onFilesSelected?.(next)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openDialog()
      }
    }

    const cls = [
      'ui-file-upload',
      `ui-file-upload-${variant}`,
      `ui-file-upload-${size}`,
      dragOver && 'ui-file-upload-dragover',
      disabled && 'ui-file-upload-disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const defaultIcon = (
      <svg
        className="ui-file-upload-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    )

    const hiddenInput = (
      <input
        ref={inputRef}
        type="file"
        id={id}
        className="ui-file-upload-native"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
      />
    )

    const fileList = files.length > 0 && (
      <div className="ui-file-upload-files">
        {files.map((file, i) => (
          <div key={`${file.name}-${i}`} className="ui-file-upload-file">
            <span className="ui-file-upload-file-name">{file.name}</span>
            <button
              type="button"
              className="ui-file-upload-file-remove"
              onClick={() => removeFile(i)}
              aria-label={`Remove ${file.name}`}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="4" x2="12" y2="12" />
                <line x1="12" y1="4" x2="4" y2="12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    )

    if (variant === 'button') {
      return (
        <div ref={ref} className={cls} style={style} {...rest}>
          {hiddenInput}
          <button
            type="button"
            className="ui-file-upload-btn"
            onClick={openDialog}
            disabled={disabled}
            aria-label={label ?? 'Upload file'}
          >
            {icon || defaultIcon}
            <span>{label ?? 'Upload file'}</span>
          </button>
          {fileList}
        </div>
      )
    }

    if (variant === 'minimal') {
      return (
        <div ref={ref} className={cls} style={style} {...rest}>
          {hiddenInput}
          <button
            type="button"
            className="ui-file-upload-link"
            onClick={openDialog}
            disabled={disabled}
            aria-label={label ?? 'Choose file'}
          >
            {label ?? 'Choose file'}
          </button>
          {files.length > 0 && (
            <span className="ui-file-upload-file-count">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </span>
          )}
          {fileList}
        </div>
      )
    }

    // Dropzone variant (default)
    return (
      <div ref={ref} className={cls} style={style} {...rest}>
        {hiddenInput}
        <div
          className="ui-file-upload-zone"
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={label ?? 'Drop files here or click to upload'}
          onClick={openDialog}
          onKeyDown={handleKeyDown}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {children || (
            <>
              {icon || defaultIcon}
              <span className="ui-file-upload-zone-label">
                {label ?? 'Drop files here or click to upload'}
              </span>
              {description && (
                <span className="ui-file-upload-zone-desc">{description}</span>
              )}
            </>
          )}
        </div>
        {fileList}
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'
