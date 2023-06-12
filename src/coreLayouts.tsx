import React, { MouseEventHandler } from 'react'
type FlexProps = {
  children?: React.ReactNode
  className?: string
  flexDirection?: 'row' | 'column'
  onMouseOver?: MouseEventHandler<HTMLDivElement>
  onMouseLeave?: MouseEventHandler<HTMLDivElement>
}

export function Flex({ children, className, flexDirection, onMouseOver, onMouseLeave }: FlexProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection,
      }}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      className={className}>
      {children}
    </div>
  )
}

type ButtonProps = {
  children: React.ReactNode
  variant: 'primary'
  size: 'small'
  onClick?: MouseEventHandler<HTMLButtonElement>
}
export function Button({ children, variant, size, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>
}

export function ButtonGroup({
  children,
  variant,
}: {
  children: React.ReactNode
  variant: 'merged'
}) {
  // TODO: maybe replace Fragment with div?
  return <>{children}</>
}

export function CopyIcon({ variant }: { variant: 'white' }) {
  return <>◼</>
}

export function DeleteIcon({ variant }: { variant: 'white' }) {
  return <>❌</>
}

export const tokens = {
  blue100: 'skyblue',
  blue500: 'navy',

  gray500: 'gainsboro',

  fontSizeM: '16px',

  fontStackPrimary: 'Arial',

  spacingS: '8px',
}
