import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200/50 mt-32 bg-white/50">
      <div className="container mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <span className="text-base">✨</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Tofula</h3>
              <p className="text-xs text-neutral-500">Made with care for children everywhere</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link href="/customer/catalog" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Catalog
            </Link>
            <Link href="/customer/library" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Library
            </Link>
            <span className="text-neutral-300">·</span>
            {/* Hidden Studio Link - minimal */}
            <Link href="/studio/login" className="text-neutral-400 hover:text-neutral-600 transition-colors text-xs">
              Studio
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-neutral-200/50 text-center text-xs text-neutral-400">
          © {new Date().getFullYear()} Tofula. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
