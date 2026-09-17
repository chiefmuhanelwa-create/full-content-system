/**
 * Icon names travel through JSON as strings, so the register stays serialisable.
 * Resolved to components here, on the client, in one place.
 */
import {
  Clapperboard, Zap, FileText, Tv2, LayoutGrid, BookOpen, MonitorPlay, Hash, Repeat,
  PenTool, Image, ClipboardList, Instagram, Target, History, Brain, Mic, CalendarRange,
  RotateCcw, Kanban, Calendar, Layers, Users, Mail, Megaphone, Link2, Presentation, Star,
  Briefcase, Handshake, Wallet, Package, Fingerprint, BookMarked, Archive, ShieldCheck,
  Database, Cpu, Plug, Settings, Sparkles, type LucideIcon,
} from 'lucide-react'

const MAP: Record<string, LucideIcon> = {
  Clapperboard, Zap, FileText, Tv2, LayoutGrid, BookOpen, MonitorPlay, Hash, Repeat,
  PenTool, Image, ClipboardList, Instagram, Target, History, Brain, Mic, CalendarRange,
  RotateCcw, Kanban, Calendar, Layers, Users, Mail, Megaphone, Link2, Presentation, Star,
  Briefcase, Handshake, Wallet, Package, Fingerprint, BookMarked, Archive, ShieldCheck,
  Database, Cpu, Plug, Settings,
}

export function icon(name?: string): LucideIcon {
  return (name && MAP[name]) || Sparkles
}
