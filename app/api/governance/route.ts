/** GET /api/governance?key=icp|pillars|algorithm|voice|cta_keywords|ledger_totals|search_demand|fact_lock */
import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabase } from '@/lib/db-helper'
const U = 'default-user-id'
export async function GET(req: NextRequest) {
  const dbError = checkDatabase(); if (dbError) return dbError
  const key = new URL(req.url).searchParams.get('key')
  if (key) {
    const s = await prisma!.systemSetting.findFirst({ where: { userId: U, key } })
    if (!s) return NextResponse.json({ error: `No setting "${key}". Run: npx tsx scripts/seed-from-estate.ts` }, { status: 404 })
    return NextResponse.json({ key: s.key, category: s.category, value: s.value })
  }
  const all = await prisma!.systemSetting.findMany({ where: { userId: U } })
  return NextResponse.json({ settings: all.map(s => ({ key: s.key, category: s.category, value: s.value })) })
}
