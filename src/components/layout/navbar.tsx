import { cn } from '@/utils/cn'
import { useRouter } from 'next/router'

export const HEADER_LINKS = [
  { href: '/', name: 'Home' },
  { href: '/blog', name: 'Blog' },
  { href: '/about', name: 'About' },
] as const

const Navbar = () => {
  const { pathname } = useRouter()

  return (
    <nav className="hidden md:block">
      <ul className="flex gap-2">
        {HEADER_LINKS.map((link) => {
          const isActive = pathname === link.href

          return (
            <li
              key={link.href}
              className="relative flex h-[60px] items-center justify-center"
            >
              <a
                href={link.href}
                className={cn(
                  'rounded-sm px-3 py-2 text-sm font-medium transition-colors',
                  {
                    'text-muted-foreground hover:text-foreground': !isActive,
                    'text-foreground': isActive,
                  }
                )}
              >
                {link.name}
              </a>

              {isActive && (
                <>
                  <div className="bg-nav-link-indicator absolute bottom-0 left-1/2 h-px w-12 -translate-x-1/2" />
                  <div className="absolute bottom-0 left-1/2 size-2.5 -translate-x-1/2 rounded-[4px] bg-[rgb(255_122_151)] blur-sm dark:bg-[rgb(223_29_72)]" />
                </>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Navbar
