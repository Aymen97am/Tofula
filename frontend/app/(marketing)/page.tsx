import Link from 'next/link'
import { Button } from '@/components/ui/button'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import PageShell from '@/components/layout/PageShell'

export default function MarketingPage() {
  return (
    <PageShell>
      <SiteHeader />
      
      {/* Hero Section */}
      <main className="container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto pt-24 pb-20">
          {/* Hero Content */}
          <div className="text-center space-y-6 mb-20 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-700 border border-neutral-800 text-xs font-medium text-white shadow-lg">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
              </span>
              AI-Powered Storytelling
            </div>
            
            {/* Heading with gradient */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9]">
              <span className="bg-gradient-to-br from-black via-neutral-800 to-neutral-600 bg-clip-text text-transparent">
                Every child<br />deserves their<br />own story
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-base md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed pt-2">
              Personalized, beautifully illustrated storybooks where<br className="hidden md:block" />
              your child becomes the hero of their own adventure.
            </p>

            {/* CTA with gradient */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link href="/customer/catalog">
                <Button 
                  className="group relative bg-black hover:bg-neutral-900 text-white h-12 px-8 text-sm font-semibold rounded-xl shadow-2xl hover:shadow-black/50 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Browse Stories
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-black opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-24">
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white to-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-black to-neutral-800 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-black">Personalized</h3>
                <p className="text-neutral-600 leading-relaxed text-sm">
                  Each story is uniquely crafted with your child's name, age, and appearance, making them the star of their own adventure.
                </p>
              </div>
            </div>

            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white to-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-black to-neutral-800 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-black">Beautifully Illustrated</h3>
                <p className="text-neutral-600 leading-relaxed text-sm">
                  AI-generated illustrations that bring your child's story to life with stunning, custom visuals on every page.
                </p>
              </div>
            </div>

            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white to-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-black to-neutral-800 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-black">Age-Appropriate</h3>
                <p className="text-neutral-600 leading-relaxed text-sm">
                  Stories intelligently tailored to your child's reading level and developmental stage for maximum engagement.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div id="how-it-works" className="max-w-3xl mx-auto scroll-mt-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                How It Works
              </h2>
              <p className="text-base text-neutral-600">
                Creating your personalized storybook is simple
              </p>
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-5 items-start p-6 rounded-xl glass border border-neutral-200/50 hover:border-neutral-300 transition-smooth">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-900 mb-1">Browse the Catalog</h3>
                  <p className="text-neutral-600 leading-relaxed text-sm">
                    Explore our curated collection of story templates with unique themes and morals.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-5 items-start p-6 rounded-xl glass border border-neutral-200/50 hover:border-neutral-300 transition-smooth">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-900 mb-1">Personalize the Story</h3>
                  <p className="text-neutral-600 leading-relaxed text-sm">
                    Add your child's name, age, and appearance. Our AI weaves these details seamlessly.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-5 items-start p-6 rounded-xl glass border border-neutral-200/50 hover:border-neutral-300 transition-smooth">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-900 mb-1">Receive Your Storybook</h3>
                  <p className="text-neutral-600 leading-relaxed text-sm">
                    Within minutes, your personalized storybook is ready to view or download.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <Link href="/customer/catalog">
                <Button 
                  size="lg" 
                  className="bg-neutral-900 hover:bg-neutral-800 text-white h-12 px-8 text-base font-medium shadow-lg hover:shadow-xl transition-smooth"
                >
                  Start Creating Now
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <SiteFooter />
    </PageShell>
  )
}
