'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon,
  AcademicCapIcon,
  TrophyIcon,
  UserGroupIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { 
  HomeIcon as HomeIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  TrophyIcon as TrophyIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid'

const navigation = [
  { name: 'Início', href: '/dashboard', icon: HomeIcon, iconSolid: HomeIconSolid },
  { name: 'Aulas', href: '/modules', icon: AcademicCapIcon, iconSolid: AcademicCapIconSolid },
  { name: 'Ranking', href: '/ranking', icon: TrophyIcon, iconSolid: TrophyIconSolid },
  { name: 'Amigos', href: '/friends', icon: UserGroupIcon, iconSolid: UserGroupIconSolid },
  { name: 'Perfil', href: '/profile', icon: UserIcon, iconSolid: UserIconSolid },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = isActive ? item.iconSolid : item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center py-2 px-3 min-w-0 flex-1 ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
} 