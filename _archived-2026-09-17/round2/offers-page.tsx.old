'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Gift, DollarSign, Shield, Clock, Copy, Sparkles, Plus, Trash2, Download } from 'lucide-react'
import { ToolPageHeader } from '@/components/ToolPageHeader'

interface Product {
  id: string
  name: string
  price: number
  audienceLevel: string
  painPoints: string
  coreBenefits: string
  description: string
  bonuses: string
  priceAnchor: string
  guarantee: string
  testimonials: string
}

interface Bonus {
  id: string
  name: string
  value: number
  description: string
}

export default function OffersPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [bonuses, setBonuses] = useState<Bonus[]>([])
  const [newBonus, setNewBonus] = useState({ name: '', value: 0, description: '' })
  const [urgency, setUrgency] = useState({
    type: 'limited_time',
    value: '72 hours',
    reason: 'Special launch pricing',
  })
  const [generatedOffer, setGeneratedOffer] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [offerError, setOfferError] = useState('')

  // Load products from DB
  useEffect(() => {
    fetch('/api/products/list')
      .then(r => r.json())
      .then(d => { if (d.products) setProducts(d.products) })
      .catch(() => {
        try {
          const stored = localStorage.getItem('products')
          if (stored) setProducts(JSON.parse(stored))
        } catch {}
      })
  }, [])

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  const addBonus = () => {
    if (!newBonus.name || !newBonus.value) return

    const bonus: Bonus = {
      id: Date.now().toString(),
      ...newBonus,
    }
    setBonuses([...bonuses, bonus])
    setNewBonus({ name: '', value: 0, description: '' })
  }

  const removeBonus = (id: string) => {
    setBonuses(bonuses.filter((b) => b.id !== id))
  }

  const calculateTotalValue = () => {
    if (!selectedProduct) return 0
    const bonusValue = bonuses.reduce((sum, b) => sum + b.value, 0)
    return selectedProduct.price + bonusValue
  }

  const calculateSavings = () => {
    const totalValue = calculateTotalValue()
    if (!selectedProduct) return 0
    return totalValue - selectedProduct.price
  }

  const generateOffer = () => {
    setOfferError('')
    if (!selectedProduct) {
      setOfferError('Please select a product first')
      return
    }

    const totalValue = calculateTotalValue()
    const savings = calculateSavings()

    const offer = `
🎯 THE GODFATHER OFFER

${selectedProduct.name} - Limited Time Only

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💎 WHAT YOU GET:

✅ ${selectedProduct.name} (R${selectedProduct.price.toLocaleString()} value)
${selectedProduct.description}

${bonuses.length > 0 ? `
🎁 EXCLUSIVE BONUSES:

${bonuses.map((b, i) => `${i + 1}. ${b.name} (R${b.value.toLocaleString()} value)
   ${b.description}`).join('\n\n')}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 VALUE BREAKDOWN:

Core Product: R${selectedProduct.price.toLocaleString()}
${bonuses.map((b) => `${b.name}: R${b.value.toLocaleString()}`).join('\n')}

Total Value: R${totalValue.toLocaleString()}
You Pay Today: R${selectedProduct.price.toLocaleString()}

💰 YOU SAVE: R${savings.toLocaleString()} (${Math.round((savings / totalValue) * 100)}% OFF)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛡️ ZERO-RISK GUARANTEE:

${selectedProduct.guarantee}

You literally can't lose. Try it, implement it, see results.
If you don't get value, you get your money back.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ URGENCY - ${urgency.type.replace('_', ' ').toUpperCase()}:

${urgency.reason}

⚠️ This offer expires in ${urgency.value}

After that:
- Price increases to R${Math.round(selectedProduct.price * 1.3).toLocaleString()}
- Bonuses removed
- You miss out on R${savings.toLocaleString()} in value

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💭 CONSIDER THIS:

You're one of two people:

1️⃣ Someone who takes action NOW and transforms their ${selectedProduct.audienceLevel.toLowerCase()} creator business

2️⃣ Someone who "thinks about it" and watches others succeed while you stay stuck

Which one are you?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 TAKE ACTION NOW:

[INSERT YOUR CTA - Link in bio / DM "READY" / Click here]

Remember:
→ R${totalValue.toLocaleString()} in total value
→ Only R${selectedProduct.price.toLocaleString()} today
→ ${urgency.value} remaining
→ Risk-free guarantee

You understand? Because you understand.
This is for your children's children.

Let's build.
`.trim()

    setGeneratedOffer(offer)
  }

  const copyOffer = () => {
    navigator.clipboard.writeText(generatedOffer)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const exportOfferToPDF = () => {
    if (!selectedProduct || !generatedOffer) {
      setOfferError('Please generate an offer first')
      return
    }

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${selectedProduct.name} - Godfather Offer</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              padding: 40px;
              line-height: 1.8;
              max-width: 800px;
              margin: 0 auto;
              color: #2d3748;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding: 30px;
              background: #db2777;
              color: white;
              border-radius: 15px;
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
              color: white;
            }
            .header p {
              margin: 10px 0 0 0;
              font-size: 16px;
              opacity: 0.95;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-family: 'Courier New', monospace;
              font-size: 12px;
              background: #f7fafc;
              padding: 30px;
              border-radius: 10px;
              border: 2px solid #e2e8f0;
            }
            .footer {
              margin-top: 40px;
              padding: 20px;
              background: #f7fafc;
              border-left: 4px solid #f5576c;
              border-radius: 5px;
            }
            @media print {
              body { padding: 20px; }
              pre { font-size: 11px; padding: 20px; }
              .header { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎯 THE GODFATHER OFFER</h1>
            <p>${selectedProduct.name}</p>
            <p>Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          <pre>${generatedOffer}</pre>
          <div class="footer">
            <h3 style="margin-top: 0; color: #2d3748;">📝 Implementation Notes:</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Use this offer in sales posts, emails, and landing pages</li>
              <li>Update the CTA with your specific link or action</li>
              <li>Track conversions and adjust urgency/bonuses based on results</li>
              <li>Test different platforms (Instagram, email, Twitter) to see what converts best</li>
            </ul>
            <p style="margin: 15px 0 0 0; font-size: 12px; color: #718096;">
              Created with NOCHILL Business Operating System
            </p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 100);
            }
          </script>
        </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ToolPageHeader
        icon={Gift}
        iconColor="text-[#2563EB]"
        eyebrow="Create"
        title="Smart Offer Constructor"
        description="Build Godfather offers with value stacking, urgency, and risk reversal"
      />
      <div className="px-6 py-8">

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Build Offer */}
        <div className="space-y-6">
          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle>1. Select Product</CardTitle>
              <CardDescription>Choose the product you want to create an offer for</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product..." />
                </SelectTrigger>
                <SelectContent>
                  {products.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No products found - create one first
                    </SelectItem>
                  ) : (
                    products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - R{product.price.toLocaleString()} ({product.audienceLevel})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {selectedProduct && (
                <div className="mt-4 p-4 bg-[#F9FAFB] border border-[#E4E4E7] rounded-xl">
                  <p className="nc-eyebrow mb-2">Selected Product</p>
                  <p className="font-display font-black text-lg text-[#18181B]">{selectedProduct.name}</p>
                  <p className="text-sm text-[#71717A] mt-1">{selectedProduct.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge className="bg-[#2563EB] text-[#18181B]">R{selectedProduct.price.toLocaleString()}</Badge>
                    <Badge variant="outline">{selectedProduct.audienceLevel}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bonus Builder */}
          <Card>
            <CardHeader>
              <CardTitle>2. Add Value Stack Bonuses</CardTitle>
              <CardDescription>Stack bonuses to increase perceived value</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label>Bonus Name *</Label>
                  <Input
                    placeholder="e.g., Free 30-Day Email Support"
                    value={newBonus.name}
                    onChange={(e) => setNewBonus({ ...newBonus, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Bonus Value (R) *</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 500"
                    value={newBonus.value || ''}
                    onChange={(e) => setNewBonus({ ...newBonus, value: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Bonus Description</Label>
                  <Input
                    placeholder="What they get"
                    value={newBonus.description}
                    onChange={(e) => setNewBonus({ ...newBonus, description: e.target.value })}
                  />
                </div>
                <Button onClick={addBonus} className="w-full" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Bonus
                </Button>
              </div>

              {/* Bonus List */}
              {bonuses.length > 0 && (
                <div className="space-y-2 mt-4">
                  <Label>Added Bonuses:</Label>
                  {bonuses.map((bonus) => (
                    <div
                      key={bonus.id}
                      className="flex items-start justify-between p-3 bg-[#F9FAFB] border border-[#E4E4E7] rounded-xl"
                    >
                      <div className="flex-1">
                        <p className="font-display font-bold text-sm text-[#18181B]">{bonus.name}</p>
                        <p className="text-xs text-[#71717A]">{bonus.description}</p>
                        <Badge className="mt-1 bg-[#2563EB] text-[#18181B]">R{bonus.value.toLocaleString()} value</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeBonus(bonus.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Urgency Builder */}
          <Card>
            <CardHeader>
              <CardTitle>3. Add Urgency & Scarcity</CardTitle>
              <CardDescription>Create FOMO to drive immediate action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Urgency Type</Label>
                <Select
                  value={urgency.type}
                  onValueChange={(value) => setUrgency({ ...urgency, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="limited_time">⏰ Limited Time</SelectItem>
                    <SelectItem value="limited_spots">👥 Limited Spots</SelectItem>
                    <SelectItem value="price_increase">📈 Price Increasing</SelectItem>
                    <SelectItem value="bonus_removal">🎁 Bonuses Being Removed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Duration / Limit</Label>
                <Input
                  placeholder="e.g., 72 hours, 50 spots, Next Monday"
                  value={urgency.value}
                  onChange={(e) => setUrgency({ ...urgency, value: e.target.value })}
                />
              </div>
              <div>
                <Label>Reason for Urgency</Label>
                <Input
                  placeholder="e.g., Launch special, Testing pricing, Limited capacity"
                  value={urgency.reason}
                  onChange={(e) => setUrgency({ ...urgency, reason: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {offerError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{offerError}</p>
          )}
          {/* Generate Button */}
          <Button
            onClick={generateOffer}
            disabled={!selectedProduct}
            className="w-full"
            size="lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Godfather Offer
          </Button>
        </div>

        {/* Right Column: Value Calculator & Preview */}
        <div className="space-y-6">
          {/* Value Calculator */}
          <Card className="border-green-500 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Value Stack Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedProduct ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Core Product:</span>
                    <span className="text-lg font-bold">R{selectedProduct.price.toLocaleString()}</span>
                  </div>

                  {bonuses.map((bonus) => (
                    <div key={bonus.id} className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm">{bonus.name}:</span>
                      <span className="font-semibold">R{bonus.value.toLocaleString()}</span>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
                    <span className="text-lg font-bold">Total Value:</span>
                    <span className="text-2xl font-bold text-green-600">
                      R{calculateTotalValue().toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">They Pay Today:</span>
                    <span className="text-2xl font-display font-black text-[#2563EB]">
                      R{selectedProduct.price.toLocaleString()}
                    </span>
                  </div>

                  {calculateSavings() > 0 && (
                    <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-green-900">They Save:</span>
                        <span className="text-2xl font-bold text-green-700">
                          R{calculateSavings().toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-green-800 mt-2">
                        That's a {Math.round((calculateSavings() / calculateTotalValue()) * 100)}% discount!
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-[#71717A] py-8">
                  Select a product to see value calculation
                </p>
              )}
            </CardContent>
          </Card>

          {/* Generated Offer Preview */}
          {generatedOffer && (
            <Card className="border-[#2563EB] border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-[#2563EB]" />
                    Generated Offer
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={exportOfferToPDF} className="bg-green-50 hover:bg-green-100 border-green-300">
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                    <Button size="sm" variant="outline" onClick={copyOffer}>
                      <Copy className="mr-2 h-4 w-4" />
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">{generatedOffer}</pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card className="bg-amber-50 border-amber-300">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                💡 Godfather Offer Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>✅ <strong>Value Stack:</strong> Make total value 3-5X the price</p>
              <p>✅ <strong>Risk Reversal:</strong> Strong guarantee removes objections</p>
              <p>✅ <strong>Urgency:</strong> Real deadline creates action</p>
              <p>✅ <strong>Clear CTA:</strong> Tell them exactly what to do next</p>
              <p>✅ <strong>Social Proof:</strong> Show others have succeeded</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  )
}
