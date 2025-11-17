import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">
      {/* Elegant Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,146,60,0.08),transparent_50%)]"></div>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-rose-200/15 to-amber-200/15 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-2xl">📖</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-800">
              Tofula
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/customer-app/catalog">
              <Button variant="ghost" className="hover:bg-stone-100 text-stone-600 font-medium transition-all duration-300">Browse Stories</Button>
            </Link>
            <Link href="/studio/login">
              <Button 
                className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                Studio Access
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative container mx-auto px-6">
        <div className="max-w-6xl mx-auto pt-16 pb-24">
          {/* Hero Content */}
          <div className="text-center space-y-6 mb-16">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-medium mb-4 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                AI-Powered Storytelling
              </span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">
              <span className="text-stone-800">
                Every child
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                deserves their
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                own story
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed font-light">
              Create personalized, beautifully illustrated storybooks where your child 
              becomes the hero. Premium tales crafted with care, tailored to their unique personality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/customer-app/catalog">
                <Button 
                  size="lg" 
                  className="text-base px-8 py-6 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="mr-2">✨</span>
                  Explore Stories
                </Button>
              </Link>
              <Link href="/studio/login">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base px-8 py-6 rounded-2xl border-2 border-stone-300 hover:border-orange-300 hover:bg-orange-50 text-stone-700 hover:text-stone-900 font-medium transition-all duration-300"
                >
                  <span className="mr-2">🎨</span>
                  Create in Studio
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="group p-8 rounded-3xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md border border-stone-200 hover:border-orange-200 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">Personalized</h3>
              <p className="text-stone-600 leading-relaxed text-sm font-light">
                Each story is uniquely crafted with your child's name, age, and appearance, 
                making them the star of their own adventure.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md border border-stone-200 hover:border-orange-200 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">Beautifully Illustrated</h3>
              <p className="text-stone-600 leading-relaxed text-sm font-light">
                AI-generated illustrations that bring your child's story to life with 
                stunning visuals on every page.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md border border-stone-200 hover:border-orange-200 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">Age-Appropriate</h3>
              <p className="text-stone-600 leading-relaxed text-sm font-light">
                Stories intelligently tailored to your child's reading level and 
                developmental stage for maximum engagement.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-stone-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-xl">📖</span>
              </div>
              <span className="text-xl font-bold text-stone-800">
                Tofula
              </span>
            </div>
            <div className="text-stone-500 text-sm">
              <p>Made with <span className="text-orange-500">❤️</span> for children everywhere</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
