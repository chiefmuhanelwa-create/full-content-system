import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'

export const dynamic = 'force-dynamic'

const DEFAULT_USER_ID = 'default-user-id'

const NOCHILL_PRODUCTS = [
  {
    productName: 'Stop Posting Random Content',
    description: 'Find the one niche people will pay you for — in 90 minutes, not 9 months.',
    price: 0,
    audienceLevel: 'beginner',
    productType: 'digital_product',
    paidsStream: 'information',
    ladderPosition: 'entry',
    status: 'active',
    painPoints: 'Posting everything and getting nowhere. No niche, no positioning, no money. The algorithm doesn\'t know who to show you to.',
    coreBenefits: 'One profitable niche in 90 minutes. Clear content direction. Audience that pays. Stop guessing, start positioning.',
    bonuses: 'The Niche Test (which niches actually pay in SA) · Platform match guide · 30-day content direction map',
    guarantee: '90-minute result or get your money back',
    notes: 'Used by 500+ SA creators to find their profitable niche',
    tags: JSON.stringify({
      step1_callout: 'If you\'ve been posting for months and still don\'t know what you actually stand for — this is for you.',
      step2_attention: 'Posting everything means the algorithm doesn\'t know who to show you to. And neither does any brand.',
      step3_problem: 'The creator economy doesn\'t reward hard work. It rewards clarity. You\'re working hard into a void.',
      step4_intrigue: 'Every viral creator you follow found ONE thing and went all in. What if you could find yours in 90 minutes?',
      step5_floodlight: 'Without a niche, you\'re competing with everyone. With a niche, you\'re the only option for your people.',
      step6_solution: 'Stop Posting Random Content walks you through the exact niche-finding framework I used to go from scattered to R100K+ brand deals.',
      step7_credentials: 'From posting everything to Netflix, Samsung, Huawei partnerships. The niche clarity changed everything.',
      step8_benefits: 'Find your profitable niche in 90 minutes. Clear content direction for 90 days. Brands start seeing you as the go-to.',
      step9_proof: '500+ SA creators have found their niche with this guide. Average time: 67 minutes.',
      step10_offer: 'Stop Posting Random Content — yours today. Because your gift will make room for you. But only if you give it direction.',
      contentHooks: [
        'You\'ve been posting for months. But you still don\'t know what you actually stand for.',
        'Posting everything means the algorithm doesn\'t know who to show you to.',
        'Your niche isn\'t what you love. It\'s where your love meets someone else\'s problem.',
        'Every viral creator found ONE thing and went all in. You\'re still browsing.',
        'The creator economy doesn\'t reward hard work. It rewards clarity.',
      ],
    }),
  },
  {
    productName: 'Stop Being Broke With a Big Following',
    description: 'Build 5 ways to earn from your content in 30 days — step by step.',
    price: 0,
    audienceLevel: 'beginner',
    productType: 'digital_product',
    paidsStream: 'products',
    ladderPosition: 'entry',
    status: 'active',
    painPoints: 'Massive following, zero income. One income stream. The monetisation gap nobody talks about.',
    coreBenefits: 'PAIDS system: 5 income taps running in parallel. When one runs dry, the other four keep flowing.',
    bonuses: 'Products income blueprint · Affiliates starter kit · Info product launch guide',
    guarantee: 'First income stream activated in 30 days',
    notes: 'Ndivhuwo went from R0 with 500K followers to R300K/month using this exact system',
    tags: JSON.stringify({
      step1_callout: 'If you have more than 1,000 followers and can\'t pay your rent from content — this is for you.',
      step2_attention: 'You have 50,000 followers and can\'t pay rent. That\'s not a follower problem. That\'s a monetisation problem.',
      step3_problem: 'One income stream is a salary. It stops when life does. It dries up when algorithms change. It disappears when brands stop calling.',
      step4_intrigue: 'The PAIDS System: 5 taps — when one runs dry, the other four keep flowing. What if all 5 were running?',
      step5_floodlight: 'I posted 3x a day for 6 months. Got 2 million views. Made R0. Then I built the system. Made R50K in a month.',
      step6_solution: 'Stop Being Broke With a Big Following teaches the full PAIDS system: Products, Affiliates, Information, Deals, Services.',
      step7_credentials: 'Used this system to go from bathroom floors to R600K+ annually. 50+ brand deals. 9 awards.',
      step8_benefits: '5 income streams active in 30 days. Platform-independent income. Money while you sleep. Income that survives algorithm changes.',
      step9_proof: 'R750 → R100K per deal. R0 with 2M views → R50K/month with 1 strategic post per week.',
      step10_offer: 'Stop Being Broke With a Big Following — the system that ends the big-following-broke-creator cycle. Yours today.',
      contentHooks: [
        'You have 50,000 followers and can\'t pay rent. That\'s not a follower problem.',
        'One income stream is a salary. Five income streams is a business.',
        'The creator who posts 3x a day for free is subsidising the brands that profit from their audience.',
        'PAIDS: 5 taps — when one runs dry, the other four keep flowing.',
        'I posted 3x daily for 6 months. Got 2M views. Made R0. Here\'s what changed.',
      ],
    }),
  },
  {
    productName: 'Stop Freezing When a Brand Messages You',
    description: '5 ready-made WhatsApp replies for any brand DM — so you never undersell again.',
    price: 99,
    audienceLevel: 'beginner',
    productType: 'digital_product',
    paidsStream: 'deals',
    ladderPosition: 'entry',
    status: 'active',
    painPoints: 'Brand DMs and you panic-price. You freeze. You don\'t know what to say. You undersell and set a permanent rate.',
    coreBenefits: 'Ready-made replies for every brand scenario. Never freeze again. Know exactly what to say and when.',
    bonuses: 'Counter-offer scripts · Budget probing questions · "No" scripts that don\'t burn bridges',
    priceAnchor: 'A brand deal coaching session costs R997. This gives you the same scripts for R99.',
    guarantee: 'Use these 5 scripts in your next brand DM. Pay what you should, or refund.',
    notes: 'I went from R750 to R100K per deal using these exact response patterns.',
    tags: JSON.stringify({
      step1_callout: 'If a brand DM has ever made your hands shake — or you\'ve taken a low offer because you didn\'t know how to ask for more — this is for you.',
      step2_attention: 'A brand DM just landed. You have 24 hours or they\'ll find someone else. Your hands are shaking. What do you type?',
      step3_problem: 'The first thing you say to a brand sets your rate — forever. Agencies file your rate. They share notes. What did you just file?',
      step4_intrigue: 'R3,000 or R30,000 — the difference isn\'t your followers. It\'s the first message you send back.',
      step5_floodlight: 'I accepted R750 for an Instagram post because I didn\'t know what to say. Netflix paid me R100K for the same post type. One thing changed: the script.',
      step6_solution: 'Stop Freezing When a Brand Messages You — 5 word-for-word WhatsApp replies for: First approach, Budget push-back, Counter-offer, Exclusivity negotiation, Follow-up.',
      step7_credentials: 'I\'ve negotiated 50+ brand deals. Netflix, Samsung, Huawei. The pattern is the same every time.',
      step8_benefits: 'Never freeze again. Know your rate. Protect your value. Turn DMs into deals at the right price.',
      step9_proof: 'R750 to R100K per deal. The script is the difference.',
      step10_offer: 'Stop Freezing When a Brand Messages You — R99. Less than a Checkers shop. More valuable than any course.',
      contentHooks: [
        'A brand DM just landed. Your hands are shaking. You have 24 hours or they\'ll find someone else.',
        'The first thing you say to a brand sets your rate — forever. No pressure.',
        'Agencies are watching how fast you reply. Not just what you say.',
        'That "R3,000 budget" message isn\'t an offer. It\'s a starting point. But only if you know that.',
        '5 messages that turn panic into profit — for every brand scenario.',
      ],
    }),
  },
  {
    productName: 'Stop Doing One-Off Deals',
    description: 'The simple message that turns one campaign into monthly pay — sent in 48 hours.',
    price: 99,
    audienceLevel: 'beginner',
    productType: 'digital_product',
    paidsStream: 'deals',
    ladderPosition: 'entry',
    status: 'coming_soon',
    painPoints: 'Every campaign ends and you\'re back to zero. No extension. No retainer. Just another cold start.',
    coreBenefits: 'The post-campaign upsell message that converts one deal into monthly retainers.',
    bonuses: 'Retainer proposal template · Pricing calculator for recurring deals · Long-term partnership pitch deck',
    priceAnchor: 'One successful retainer upsell = R30K+. This costs R99.',
    guarantee: 'Send the message. If it doesn\'t get a response, refund.',
    notes: 'Samsung became an 18-month, R450K+ partnership because of ONE email sent after the first post.',
    tags: JSON.stringify({
      step1_callout: 'If you\'ve ever sent an invoice and waited in silence — without knowing how to turn that into the next deal — this is for you.',
      step2_attention: 'Every brand deal you finish without a follow-up message is leaving R30,000+ on the table. Every. Single. Time.',
      step3_problem: 'Repeat campaign > 10 cold deals. But most creators treat the invoice email as the end. It\'s step 10 of 12.',
      step4_intrigue: 'What if one message, sent 48 hours after campaign wrap, could turn that R15K deal into R450K over 18 months?',
      step5_floodlight: 'Samsung started as a single post. I sent one email afterwards. They said yes to 18 months and R450K+ total. One email.',
      step6_solution: 'Stop Doing One-Off Deals gives you the exact post-campaign message sequence — and when to send it, how to frame it, what rate to propose.',
      step7_credentials: 'Samsung, 18 months. Netflix, multiple campaigns. The invoice email moment is the highest-leverage point. I use it every time.',
      step8_benefits: 'Turn one-off deals into monthly retainers. Guaranteed income. No cold outreach. Warm client = 5x more valuable.',
      step9_proof: 'R15,000 first post → R450,000 over 18 months with Samsung. One email was the turning point.',
      step10_offer: 'Stop Doing One-Off Deals — R99. Less than one hour of brand-deal income. The email that changes your business.',
      contentHooks: [
        'Every brand deal you finish without a follow-up message is leaving R30K+ on the table.',
        'Samsung became an 18-month partnership because of ONE email I sent after the first post.',
        'The invoice email is your highest-leverage moment. Most creators waste it.',
        'Repeat campaign > 10 cold deals. You\'re doing this backwards.',
        'One message. Sent 48 hours after campaign wrap. R450K over 18 months.',
      ],
    }),
  },
  {
    productName: 'Stop Saying Yes to Low Offers',
    description: '5 quick checks and ready-made replies to take it, ask for more, or say no — without upsetting the brand.',
    price: 0,
    audienceLevel: 'beginner',
    productType: 'digital_product',
    paidsStream: 'deals',
    ladderPosition: 'entry',
    status: 'active',
    painPoints: 'Saying yes out of fear. Setting a low rate anchor. Accidentally blocking sectors with exclusivity you didn\'t price.',
    coreBenefits: 'The 5-check deal decision framework. Know in 5 minutes: take it, counter it, or decline it.',
    notes: 'This framework helped me turn down a $500 deal from Binomo — and protect a R200K+ opportunity the next month.',
    tags: JSON.stringify({
      contentHooks: [
        'Saying yes to R2,500 teaches brands you\'re worth R2,500. Agencies share notes.',
        'The R3,000 deal that blocked R45,000. Exclusivity clauses have a price you\'re not charging for.',
        'How to say no to a brand deal without burning the relationship forever.',
        'Not every deal is worth saying yes to. Here\'s how to know the difference.',
        'First deal rate = filed rate. Agencies talk. What did you just file?',
      ],
    }),
  },
  {
    productName: 'Stop Signing Contracts That Cost You',
    description: '8 warning signs to look for — and what to say — before you sign anything.',
    price: 149,
    audienceLevel: 'established',
    productType: 'digital_product',
    paidsStream: 'deals',
    ladderPosition: 'entry',
    status: 'coming_soon',
    painPoints: 'Signing contracts without reading the clauses that quietly cost money for months.',
    coreBenefits: '8 contract red flags every creator must know. What to say when you find them. How to negotiate without a lawyer.',
    tags: JSON.stringify({
      contentHooks: [
        'The contract clause that blocked R200K worth of deals for 12 months. And nobody told me.',
        'Exclusivity doesn\'t just mean one brand. It can mean an entire category. For a year.',
        'You signed away the right to work with 3 brands. For R5,000. Read the clause.',
        '8 things in brand contracts that quietly cost you money — and what to do about each one.',
        'Your lawyer doesn\'t know creator contracts. Here\'s what they usually miss.',
      ],
    }),
  },
  {
    productName: 'Stop Losing Deals Because You\'re Not Ready',
    description: 'The 9 things brands ask for — ready to send in 24 hours.',
    price: 197,
    audienceLevel: 'established',
    productType: 'digital_product',
    paidsStream: 'deals',
    ladderPosition: 'entry',
    status: 'coming_soon',
    painPoints: 'Losing deals because you can\'t respond professionally in the 24-48 hour brand window.',
    coreBenefits: '9 creator assets ready to send in 24 hours. Media kit, rate card, stats sheet, contract checklist, invoice template and more.',
    tags: JSON.stringify({
      contentHooks: [
        'A brand emailed. You had 24 hours. You spent it trying to find your media kit.',
        'Response speed signals professionalism more than your content quality in the first impression.',
        '9 things brands ask for. Most creators can\'t send all 9. The ones who can, get the deal.',
        'Your competitors aren\'t more talented. They\'re more prepared.',
        'The window is 24 hours. After that, someone else is already on set.',
      ],
    }),
  },
  {
    productName: 'Stop Being Scared of SARS',
    description: 'A simple, step-by-step way to sort out your creator tax — before it\'s too late.',
    price: 0,
    audienceLevel: 'beginner',
    productType: 'digital_product',
    paidsStream: 'information',
    ladderPosition: 'entry',
    status: 'active',
    painPoints: 'Not knowing brand income needs to be declared. SARS arriving with a bill you didn\'t expect.',
    coreBenefits: 'Creator tax system that protects income. Deductions list. VDP guide. SARS-compliant business structure.',
    notes: 'Owed SARS R285,000. Used VDP to save R142,500. Now teach every creator to avoid this.',
    tags: JSON.stringify({
      step1_callout: 'If you\'ve received any brand payment and haven\'t declared it to SARS — this is urgent. For you.',
      step2_attention: 'I owed SARS R285,000 because nobody told me brand payments count as income. The VDP saved half. But nobody told me about that either.',
      step3_problem: 'SARS is watching your Payfast account. Your banking app. Your Instagram collaborations. You\'re already on their radar.',
      step4_intrigue: 'There\'s a deductions list specifically for creators. It\'s legal. It\'s available. Nobody talks about it.',
      step5_floodlight: 'R285,000 owed. R142,500 penalty avoided through VDP. R207,000 in deductions I hadn\'t claimed. All preventable.',
      step6_solution: 'Stop Being Scared of SARS walks you through the full creator tax system: what to declare, what to deduct, what to do if you\'re behind.',
      step7_credentials: 'I paid R285K to learn this. You\'re paying nothing. Use what I bought with my mistake.',
      step8_benefits: 'SARS-compliant from today. Deductions working for you. No surprises. Business structure that protects your income.',
      step9_proof: 'R285K bill → managed through VDP. R207K in deductions found. Sleep without SARS anxiety.',
      step10_offer: 'Stop Being Scared of SARS — fix your creator tax the right way. Before it\'s too late.',
      contentHooks: [
        'I owed SARS R285,000 because nobody told me brand payments count as income.',
        'The VDP saved me R142,500. But I had to find it myself. You don\'t.',
        'SARS is watching your Payfast account. Your Instagram doesn\'t show them everything.',
        'The deductions list that saved R207,000. Yours for under R300.',
        'You\'re earning from content. SARS knows. The question is: are you ready?',
      ],
    }),
  },
  {
    productName: 'PAIDS Starter Course',
    description: 'Build your first 5 income streams from content — in 30 days.',
    price: 997,
    audienceLevel: 'beginner',
    productType: 'course',
    paidsStream: 'information',
    ladderPosition: 'core',
    status: 'coming_soon',
    painPoints: 'One income stream that stops when life does. Platform dependency. Algorithm anxiety. Feast-or-famine income.',
    coreBenefits: 'PAIDS system: Products, Affiliates, Information, Deals, Services — all five income streams activated in 30 days.',
    priceAnchor: 'One successful brand deal = R10K+. One upsell = R30K+. This course costs R997.',
    notes: 'The system Ndivhuwo used to go from R0 with 500K followers to R300K/month.',
    tags: JSON.stringify({
      contentHooks: [
        'You\'ve been a creator for 2 years. You have one income source. What happens when it stops?',
        'PAIDS: 5 income taps — when one runs dry, the other four keep flowing.',
        'The system I used to go from bathroom-floor broke to R300,000/month.',
        'Your first R10,000 from content — within 30 days of completing Module 2.',
        'Platform independence isn\'t a nice-to-have. It\'s survival.',
      ],
    }),
  },
  {
    productName: 'PAIDS Pro Course',
    description: 'Scale to R100K/month from content — the system that survives algorithm changes.',
    price: 1997,
    audienceLevel: 'established',
    productType: 'course',
    paidsStream: 'information',
    ladderPosition: 'premium',
    status: 'coming_soon',
    painPoints: 'Income plateau. Same ceiling despite growing audience. Algorithm changes killing revenue. No systems.',
    coreBenefits: 'The full NOCHILL scaling system. R100K/month target. Platform-independent income. Legacy wealth building.',
    priceAnchor: 'One-on-one coaching costs R9,997. This is the same system at 1/5th the price.',
    notes: 'The framework behind Ndivhuwo\'s R600K+ annual income, 50+ brand deals, 9 industry awards.',
    tags: JSON.stringify({
      contentHooks: [
        'You\'ve crossed R10K/month. The plateau between here and R100K is a system problem, not a talent problem.',
        'The African creator economy is growing at 25.6% a year. Are your systems growing with it?',
        'Platform-independent income isn\'t passive income. It\'s better. Here\'s the difference.',
        'R100K/month from content. Not from followers. From systems.',
        'For children\'s children. Build income that outlives the algorithm.',
      ],
    }),
  },
]

export async function POST(request: NextRequest) {
  try {
    const dbError = checkDatabase()
    if (dbError) return dbError

    const { searchParams } = new URL(request.url)
    const force = searchParams.get('force') === 'true'

    const existing = await prisma!.product.count({ where: { userId: DEFAULT_USER_ID } })

    if (existing > 0 && !force) {
      return NextResponse.json({
        success: true,
        message: `${existing} products already exist. Use force=true to reseed.`,
        skipped: true,
      })
    }

    if (existing > 0 && force) {
      await prisma!.product.deleteMany({ where: { userId: DEFAULT_USER_ID } })
    }

    const created = await prisma!.product.createMany({
      data: NOCHILL_PRODUCTS.map((p) => ({
        ...p,
        userId: DEFAULT_USER_ID,
      })),
    })

    return NextResponse.json({
      success: true,
      message: `Seeded ${created.count} NOCHILL products`,
      count: created.count,
    })
  } catch (error: any) {
    console.error('Products seed error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to seed products' },
      { status: 500 }
    )
  }
}
