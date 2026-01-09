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
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
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
          AI-powered viral scripting system that generates scroll-stopping hooks,
          complete scripts, and content calendars using Claude AI and the proven NOCHILL framework.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/auth/signup">Start Free Trial</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">See How It Works</Link>
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
                Complete scripts with SEEDS framework and second-by-second breakdowns
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Story Extractor</CardTitle>
              <CardDescription>
                Extract powerful proof stories from your journey
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
                Identify and leverage Shadow Fears to create compelling content
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>
                30-day content plans using the 4E framework
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Revenue Tracker</CardTitle>
              <CardDescription>
                Track PAIDS revenue streams and optimize earnings
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Hook Bank</CardTitle>
              <CardDescription>
                Save, organize, and track your best-performing hooks
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600">Choose the plan that fits your content goals</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold mt-4">R0</div>
              <div className="text-gray-600">/month</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ 10 hooks/month</li>
                <li>✓ 3 scripts/month</li>
                <li>✓ 1 story extraction</li>
                <li>✓ Basic analytics</li>
              </ul>
              <Button className="w-full mt-6" variant="outline" asChild>
                <Link href="/auth/signup">Start Free</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-600 border-2">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>For serious creators</CardDescription>
              <div className="text-3xl font-bold mt-4">R499</div>
              <div className="text-gray-600">/month</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ Unlimited hooks</li>
                <li>✓ Unlimited scripts</li>
                <li>✓ Unlimited stories</li>
                <li>✓ Content calendar</li>
                <li>✓ Revenue tracking</li>
                <li>✓ PDF exports</li>
                <li>✓ Priority support</li>
              </ul>
              <Button className="w-full mt-6" asChild>
                <Link href="/auth/signup?plan=pro">Start Pro Trial</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agency</CardTitle>
              <CardDescription>For teams & agencies</CardDescription>
              <div className="text-3xl font-bold mt-4">R1,999</div>
              <div className="text-gray-600">/month</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ Everything in Pro</li>
                <li>✓ Team collaboration (5 users)</li>
                <li>✓ White-label exports</li>
                <li>✓ API access</li>
                <li>✓ Custom branding</li>
                <li>✓ Dedicated support</li>
              </ul>
              <Button className="w-full mt-6" variant="outline" asChild>
                <Link href="/auth/signup?plan=agency">Contact Sales</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-3xl mx-auto bg-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-3xl text-white">Ready to Create Viral Content?</CardTitle>
            <CardDescription className="text-blue-100">
              Join thousands of creators using NOCHILL to generate millions of views
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/signup">Start Your Free Trial</Link>
            </Button>
            <p className="text-sm text-blue-100 mt-4">
              No credit card required. Start creating in 2 minutes.
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
