import type { Link as ULink, Badge } from '#ui/types'

export interface Link extends ULink {
  label: string
  class?: string
  click?: () => void
}

export interface NavigationLink extends Link {
  icon?: string
  iconClass?: string
  badge?: string | Badge
}

export interface NavigationTree extends NavigationLink {
  children?: NavigationTree[]
}

export interface NavigationGroup {
  type?: 'link' | 'accordion'
  defaultOpen?: boolean
  children: NavigationTree[]
}
