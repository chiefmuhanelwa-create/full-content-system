import { Generator } from '@/components/Generator'
import { SPECS } from '@/lib/generators/specs'

export default function Page() {
  return <Generator spec={SPECS['runsheet']} iconName="ClipboardList" />
}
