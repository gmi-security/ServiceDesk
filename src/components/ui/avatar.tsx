import { cn, initials } from '@/lib/utils'
import Image from 'next/image'
import type { ReactNode } from 'react'

// ============================================
// Avatar sizes
// ============================================

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-5 w-5 text-[9px]',
  sm: 'h-7 w-7 text-[11px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
  xl: 'h-14 w-14 text-base',
}

const pixelSizes: Record<AvatarSize, number> = {
  xs: 20,
  sm: 28,
  md: 32,
  lg: 40,
  xl: 56,
}

// Avatar color palette — deterministic from name
const COLORS = [
  'bg-indigo-600 text-indigo-100',
  'bg-blue-600 text-blue-100',
  'bg-violet-600 text-violet-100',
  'bg-emerald-700 text-emerald-100',
  'bg-teal-700 text-teal-100',
  'bg-amber-700 text-amber-100',
  'bg-rose-700 text-rose-100',
  'bg-cyan-700 text-cyan-100',
  'bg-fuchsia-700 text-fuchsia-100',
  'bg-sky-700 text-sky-100',
]

function getAvatarColor(name: string): string {
  if (!name) return COLORS[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

// ============================================
// Avatar component
// ============================================

export interface AvatarProps {
  name?: string | null
  image?: string | null
  size?: AvatarSize
  className?: string
}

export function Avatar({ name, image, size = 'md', className }: AvatarProps) {
  const displayName = name ?? 'Unknown'
  const abbrev = initials(displayName)
  const colorClass = getAvatarColor(displayName)
  const px = pixelSizes[size]

  return (
    <span
      className={cn(
        'relative inline-flex items-center justify-center flex-shrink-0',
        'rounded-full overflow-hidden',
        'ring-2 ring-[#1e2535]',
        sizeClasses[size],
        !image && colorClass,
        className,
      )}
      title={displayName}
      aria-label={displayName}
    >
      {image ? (
        <Image
          src={image}
          alt={displayName}
          width={px}
          height={px}
          className="object-cover w-full h-full"
          unoptimized
        />
      ) : (
        <span className="font-semibold leading-none select-none">{abbrev}</span>
      )}
    </span>
  )
}

// ============================================
// AvatarGroup — stacked set of avatars
// ============================================

export interface AvatarGroupProps {
  users: Array<{ name?: string | null; image?: string | null }>
  max?: number
  size?: AvatarSize
  className?: string
}

export function AvatarGroup({ users, max = 4, size = 'sm', className }: AvatarGroupProps) {
  const visible = users.slice(0, max)
  const overflow = users.length - max

  return (
    <div className={cn('flex items-center', className)}>
      {visible.map((user, i) => (
        <Avatar
          key={i}
          name={user.name}
          image={user.image}
          size={size}
          className="-ml-2 first:ml-0 ring-2 ring-[#0f1117]"
        />
      ))}

      {overflow > 0 && (
        <span
          className={cn(
            '-ml-2 inline-flex items-center justify-center flex-shrink-0',
            'rounded-full ring-2 ring-[#0f1117]',
            'bg-[#253047] text-slate-300 font-semibold',
            sizeClasses[size],
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}

// ============================================
// AvatarWithLabel — avatar + name/subtitle
// ============================================

export interface AvatarWithLabelProps {
  name?: string | null
  image?: string | null
  label?: ReactNode
  sublabel?: ReactNode
  size?: AvatarSize
  className?: string
}

export function AvatarWithLabel({
  name,
  image,
  label,
  sublabel,
  size = 'md',
  className,
}: AvatarWithLabelProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Avatar name={name} image={image} size={size} />
      <div className="min-w-0">
        {label && (
          <p className="text-sm font-medium text-slate-100 truncate">
            {label ?? name}
          </p>
        )}
        {sublabel && (
          <p className="text-xs text-slate-400 truncate">{sublabel}</p>
        )}
      </div>
    </div>
  )
}
