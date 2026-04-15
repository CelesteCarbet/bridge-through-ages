export interface Bridge {
  id: string
  name: string
  buildYear: number
  lastRepairYear?: number
  location: string
  province: string
  lat: number
  lng: number
  structureType: string
  preservationLevel: '完整' | '局部残损' | '仅存遗址'
  protectionLevel: string
  dynasty: string
  dynastyColor: string
  description: string
  verses: string[]
  imageUrl?: string
}

export interface TechNode {
  id: string
  name: string
  type: 'root' | 'branch' | 'leaf'
  year: number
  representativeBridge: string
  description: string
  literature: string
  children?: TechNode[]
}

export interface CulturalNode {
  id: string
  name: string
  type: 'bridge' | 'person' | 'event' | 'literature'
  bridgeId?: string
  description: string
}

export interface CulturalLink {
  source: string
  target: string
  relation: string
}

export interface DynastyData {
  name: string
  startYear: number
  endYear: number
  color: string
}

export const DYNASTIES: DynastyData[] = [
  { name: '先秦', startYear: -221, endYear: -2070, color: '#8B4513' },
  { name: '秦汉', startYear: -206, endYear: 220, color: '#CD853F' },
  { name: '魏晋南北朝', startYear: 221, endYear: 589, color: '#DAA520' },
  { name: '隋唐', startYear: 581, endYear: 907, color: '#FFD700' },
  { name: '宋元', startYear: 960, endYear: 1368, color: '#90EE90' },
  { name: '明清', startYear: 1368, endYear: 1911, color: '#87CEEB' }
]

export const STRUCTURE_TYPES = ['拱桥', '梁桥', '索桥', '浮桥', '栈道']