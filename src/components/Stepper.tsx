import React from 'react'

/** Visual variant for stepper */
export type StepperVariant = 'default' | 'outlined' | 'dots' | 'progress'

/** Size preset for stepper */
export type StepperSize = 'sm' | 'md' | 'lg'

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current active step (0-indexed) */
  activeStep: number
  /** Visual variant */
  variant?: StepperVariant
  /** Size preset */
  size?: StepperSize
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Called when a step is clicked */
  onStepClick?: (index: number) => void
  /** Custom connector element */
  connector?: React.ReactNode
  /** Step children */
  children: React.ReactNode
}

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Step label */
  label: string
  /** Step description */
  description?: string
  /** Custom icon */
  icon?: React.ReactNode
  /** Whether step has an error */
  error?: boolean
  /** Whether step is optional */
  optional?: boolean
  /** Override completed state */
  completed?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Content shown when step is active (vertical orientation) */
  children?: React.ReactNode
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="ui-step-icon-svg" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" className="ui-step-icon-svg" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

/**
 * Stepper component for multi-step workflows.
 * Supports horizontal/vertical orientation, multiple visual variants,
 * clickable navigation, error states, and optional steps.
 */
export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      activeStep,
      variant = 'default',
      size = 'md',
      orientation = 'horizontal',
      onStepClick,
      connector,
      children,
      className = '',
      ...rest
    },
    ref
  ) => {
    const cls = [
      'ui-stepper',
      `ui-stepper-${variant}`,
      `ui-stepper-${size}`,
      `ui-stepper-${orientation}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const steps = React.Children.toArray(children).filter(React.isValidElement)
    const totalSteps = steps.length

    return (
      <div ref={ref} className={cls} role="list" {...rest}>
        {steps.map((child, index) => {
          if (!React.isValidElement<StepProps>(child)) return child
          const isActive = index === activeStep
          const isCompleted = child.props.completed !== undefined
            ? child.props.completed
            : index < activeStep
          const isLast = index === totalSteps - 1

          const stepCls = [
            'ui-step',
            isActive && 'ui-step-active',
            isCompleted && 'ui-step-completed',
            child.props.error && 'ui-step-error',
            child.props.disabled && 'ui-step-disabled',
            child.props.className,
          ]
            .filter(Boolean)
            .join(' ')

          const clickable = !!onStepClick && !child.props.disabled
          const progress = variant === 'progress' && !isLast
            ? isCompleted ? 100 : isActive ? 50 : 0
            : undefined

          return (
            <React.Fragment key={index}>
              <div
                className={stepCls}
                role="listitem"
                aria-current={isActive ? 'step' : undefined}
                onClick={clickable ? () => onStepClick(index) : undefined}
                onKeyDown={clickable ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onStepClick(index)
                  }
                } : undefined}
                tabIndex={clickable ? 0 : undefined}
                style={clickable ? { cursor: 'pointer' } : undefined}
              >
                <span className="ui-step-indicator">
                  {child.props.error ? (
                    <ErrorIcon />
                  ) : isCompleted ? (
                    child.props.icon || <CheckIcon />
                  ) : child.props.icon ? (
                    child.props.icon
                  ) : variant === 'dots' ? (
                    <span className="ui-step-dot" />
                  ) : (
                    <span className="ui-step-number">{index + 1}</span>
                  )}
                </span>
                <div className="ui-step-label-group">
                  <span className="ui-step-label">{child.props.label}</span>
                  {child.props.optional && (
                    <span className="ui-step-optional">Optional</span>
                  )}
                  {child.props.description && (
                    <span className="ui-step-description">{child.props.description}</span>
                  )}
                </div>
                {/* Vertical orientation: show content under active step */}
                {orientation === 'vertical' && isActive && child.props.children && (
                  <div className="ui-step-content">{child.props.children}</div>
                )}
              </div>
              {!isLast && (
                connector || (
                  <span className="ui-stepper-connector" aria-hidden="true">
                    {progress !== undefined && (
                      <span className="ui-stepper-connector-progress" style={{ [orientation === 'vertical' ? 'height' : 'width']: `${progress}%` }} />
                    )}
                  </span>
                )
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }
)

Stepper.displayName = 'Stepper'

/**
 * Individual step within a Stepper. Props are consumed by the parent Stepper.
 * Renders nothing on its own — used as a declarative config.
 */
export const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ children }, _ref) => {
    // Step is rendered by Stepper parent; this is a pass-through
    return <>{children}</>
  }
)

Step.displayName = 'Step'
