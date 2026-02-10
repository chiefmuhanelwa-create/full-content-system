import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Zap,
  FileText,
  BookOpen,
  Calendar,
  DollarSign,
  TrendingUp,
  Video,
  Target
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">NOCHILL</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Create Viral Content in <span className="text-blue-600">Minutes</span>, Not Hours
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          AI-powered viral scripting system powered by Claude. Uses R×A×C×U^B Hook Science,
          7-Act Retention Formula, Genesis Framework, and 4E Content Engine to generate
          scroll-stopping hooks and complete production-ready scripts.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-xl mx-auto mb-8">
          <p className="text-sm text-blue-900 font-medium">
            ✨ Create an account to save all your work and never lose progress!
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/auth/signup">Start Creating Free →</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">See Features</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
          <div>
            <div className="text-4xl font-bold text-blue-600">10K+</div>
            <div className="text-gray-600">Hooks Generated</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">5K+</div>
            <div className="text-gray-600">Scripts Created</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">95%</div>
            <div className="text-gray-600">Engagement Increase</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Go Viral</h2>
          <p className="text-gray-600">8 powerful modules to transform your content creation</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Hook Generator</CardTitle>
              <CardDescription>
                Generate scroll-stopping hooks using R×A×C×U^B formula
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Script Writer</CardTitle>
              <CardDescription>
                Complete scripts using 7-Act Retention Formula with retention devices and second-by-second breakdowns
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Storytelling Studio</CardTitle>
              <CardDescription>
                Extract proof stories using Genesis Framework (5 story types) and 7-Stage Story Arc
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Pitch Builder</CardTitle>
              <CardDescription>
                Craft compelling pitches using the 5 Pillars framework
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Video className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Fear Analyzer</CardTitle>
              <CardDescription>
                Identify and leverage 10 Shadow Fears for deeper emotional connection
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>
                30-day content plans using 4E Engine (30% Entertain, 35% Educate, 20% Encourage, 15% Earn)
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Revenue Tracker</CardTitle>
              <CardDescription>
                Track PAIDS Framework (Products, Ads/Affiliates, Information, Deals, Services) revenue streams
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>NOCHILL 120 Hooks Bank</CardTitle>
              <CardDescription>
                120 proven hooks across 6 categories with R×A×C×U^B breakdowns
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">🎯 New: Business System Features</h2>
          <p className="text-gray-600">Transform your content into revenue</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-green-500 border-2">
            <CardHeader>
              <CardTitle className="text-green-700">💰 Sales Script Mode</CardTitle>
              <CardDescription>NEW - Product Selling Framework</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ 10-Step Sales Storytelling Framework</li>
                <li>✓ Multiple formats (Reel/Email/Thread)</li>
                <li>✓ 4 Foundational Principles applied</li>
                <li>✓ Godfather value stacking</li>
              </ul>
              <Button className="w-full mt-6 bg-green-600 hover:bg-green-700" asChild>
                <Link href="/dashboard/scripts">Try Sales Scripts →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-600 border-2">
            <CardHeader>
              <CardTitle className="text-blue-700">🗂️ Product Database</CardTitle>
              <CardDescription>NEW - Manage Your Offers</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ Store product details</li>
                <li>✓ Pain points & benefits</li>
                <li>✓ Bonuses & guarantees</li>
                <li>✓ Audience level targeting</li>
              </ul>
              <Button className="w-full mt-6" asChild>
                <Link href="/dashboard/products">Manage Products →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-purple-600 border-2">
            <CardHeader>
              <CardTitle className="text-purple-700">📚 Story & Content Vault</CardTitle>
              <CardDescription>110+ Ideas & Story Variations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ 4 Awareness Level filtering</li>
                <li>✓ Genesis Framework story types</li>
                <li>✓ 4 Hook Type (C-Component) mapping</li>
                <li>✓ 10 Shadow Fear targeting</li>
              </ul>
              <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700" asChild>
                <Link href="/dashboard/vault">Browse Vault →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-lg font-semibold text-gray-700 mb-4">🎉 Completely Free & Your Work is Always Saved</p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">Create Free Account →</Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-3xl mx-auto bg-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-3xl text-white">Ready to Create Viral Content?</CardTitle>
            <CardDescription className="text-blue-100">
              Open-source AI content system powered by Claude. Free forever.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/signup">Create Free Account →</Link>
            </Button>
            <p className="text-sm text-blue-100 mt-4">
              Free forever. Your work is saved automatically. No credit card required.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-blue-600" />
            <span className="font-bold">NOCHILL</span>
          </div>
          <p className="text-sm text-gray-600">
            © 2026 NOCHILL. Powered by Claude AI.
          </p>
        </div>
      </footer>
    </div>
  )
}
