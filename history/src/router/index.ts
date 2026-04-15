import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import GeoMap from '@/views/GeoMap.vue'
import StructureDecode from '@/views/StructureDecode.vue'
import TechTree from '@/views/TechTree.vue'
import CulturalNarrative from '@/views/CulturalNarrative.vue'
import DataDashboard from '@/views/DataDashboard.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/geo-map', name: 'GeoMap', component: GeoMap },
  { path: '/structure-decode', name: 'StructureDecode', component: StructureDecode },
  { path: '/tech-tree', name: 'TechTree', component: TechTree },
  { path: '/cultural-narrative', name: 'CulturalNarrative', component: CulturalNarrative },
  { path: '/data-dashboard', name: 'DataDashboard', component: DataDashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router