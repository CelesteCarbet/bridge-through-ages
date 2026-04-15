import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Bridge, TechNode, CulturalNode, CulturalLink } from '@/types'
import { bridges, techTreeData, culturalNodes, culturalLinks } from '@/data/mockData'

export const useBridgeStore = defineStore('bridge', () => {
  const allBridges = ref<Bridge[]>(bridges)
  const currentYear = ref(-2000)
  const selectedBridge = ref<Bridge | null>(null)
  const selectedTechNode = ref<TechNode | null>(null)
  const selectedCulturalNode = ref<CulturalNode | null>(null)

  const filteredBridges = computed(() => {
    return allBridges.value.filter(bridge => bridge.buildYear <= currentYear.value)
  })

  const getBridgeById = (id: string) => {
    return allBridges.value.find(b => b.id === id) || null
  }

  const setCurrentYear = (year: number) => {
    currentYear.value = year
  }

  const selectBridge = (bridge: Bridge | null) => {
    selectedBridge.value = bridge
  }

  const selectTechNode = (node: TechNode | null) => {
    selectedTechNode.value = node
  }

  const selectCulturalNode = (node: CulturalNode | null) => {
    selectedCulturalNode.value = node
  }

  return {
    allBridges,
    currentYear,
    selectedBridge,
    selectedTechNode,
    selectedCulturalNode,
    filteredBridges,
    getBridgeById,
    setCurrentYear,
    selectBridge,
    selectTechNode,
    selectCulturalNode,
    techTreeData,
    culturalNodes,
    culturalLinks
  }
})