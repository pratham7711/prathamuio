import React from 'react'

export type InvoiceCardStatus = 'paid' | 'pending' | 'overdue' | 'draft'

export interface InvoiceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Invoice number or ID */
  invoiceNumber: string
  /** Amount */
  amount: number
  /** Currency code */
  currency?: string
  /** Payment status */
  status: InvoiceCardStatus
  /** Issue date */
  issuedDate: string
  /** Due date */
  dueDate?: string
  /** Payer or payee name */
  entityName: string
  /** Description / campaign name */
  description?: string
  /** Download action */
  onDownload?: () => void
  /** Clickable card */
  onClick?: () => void
}

const STATUS_LABELS: Record<InvoiceCardStatus, string> = {
  paid: 'Paid',
  pending: 'Pending',
  overdue: 'Overdue',
  draft: 'Draft',
}

/**
 * Invoice card component for displaying payment/invoice summaries.
 * Shows amount, status, dates, and optional download action.
 */
export const InvoiceCard = React.forwardRef<HTMLDivElement, InvoiceCardProps>(
  (
    {
      invoiceNumber,
      amount,
      currency = 'USD',
      status,
      issuedDate,
      dueDate,
      entityName,
      description,
      onDownload,
      onClick,
      className = '',
      ...rest
    },
    ref
  ) => {
    const cls = [
      'ui-invoice',
      `ui-invoice-${status}`,
      onClick ? 'ui-invoice-clickable' : '',
      className,
    ].filter(Boolean).join(' ')

    const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)

    return (
      <div ref={ref} className={cls} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} {...rest}>
        <div className="ui-invoice-header">
          <span className="ui-invoice-number">{invoiceNumber}</span>
          <span className={`ui-invoice-status ui-invoice-status-${status}`}>{STATUS_LABELS[status]}</span>
        </div>
        <div className="ui-invoice-body">
          <div className="ui-invoice-amount">{formattedAmount}</div>
          <div className="ui-invoice-entity">{entityName}</div>
          {description && <div className="ui-invoice-desc">{description}</div>}
        </div>
        <div className="ui-invoice-footer">
          <div className="ui-invoice-dates">
            <span>Issued: {issuedDate}</span>
            {dueDate && <span>Due: {dueDate}</span>}
          </div>
          {onDownload && (
            <button className="ui-invoice-download" onClick={(e) => { e.stopPropagation(); onDownload(); }} type="button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>
          )}
        </div>
      </div>
    )
  }
)
InvoiceCard.displayName = 'InvoiceCard'
