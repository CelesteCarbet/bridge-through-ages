<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBridgeStore } from '@/stores/bridge'
import * as echarts from 'echarts'

const router = useRouter()
const store = useBridgeStore()
const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const currentYear = ref(-2000)
const hoveredBridge = ref<typeof store.allBridges.value[0] | null>(null)

const dynastyColors: Record<string, string> = {
  '先秦': '#8B4513',
  '秦汉': '#CD853F',
  '魏晋南北朝': '#DAA520',
  '隋唐': '#FFD700',
  '宋元': '#90EE90',
  '明清': '#87CEEB'
}

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  updateChart()
  
  window.addEventListener('resize', () => chartInstance?.resize())
}

const updateChart = () => {
  if (!chartInstance) return
  
  const bridges = store.allBridges.filter(b => b.buildYear <= currentYear.value)
  
  const regionData = [
    { name: '华北', value: bridges.filter(b => ['北京', '天津', '河北', '山西', '内蒙古'].includes(b.province)).length },
    { name: '东北', value: bridges.filter(b => ['辽宁', '吉林', '黑龙江'].includes(b.province)).length },
    { name: '华东', value: bridges.filter(b => ['上海', '江苏', '浙江', '安徽', '福建', '江西', '山东'].includes(b.province)).length },
    { name: '华中', value: bridges.filter(b => ['河南', '湖北', '湖南'].includes(b.province)).length },
    { name: '华南', value: bridges.filter(b => ['广东', '广西', '海南'].includes(b.province)).length },
    { name: '西南', value: bridges.filter(b => ['重庆', '四川', '贵州', '云南', '西藏'].includes(b.province)).length },
    { name: '西北', value: bridges.filter(b => ['陕西', '甘肃', '青海', '宁夏', '新疆'].includes(b.province)).length },
    { name: '港澳台', value: bridges.filter(b => ['香港', '澳门', '台湾'].includes(b.province)).length }
  ]
  
  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: unknown) => {
        const p = params as { name: string; value: number }
        return `<div style="padding: 8px;">
          <div style="font-weight: bold; color: #FFD700;">${p.name}</div>
          <div style="color: rgba(255,255,255,0.7);">桥梁数量: ${p.value}座</div>
        </div>`
      }
    },
    series: [
      {
        name: '桥梁分布',
        type: 'map',
        map: 'china',
        roam: false,
        label: {
          show: true,
          color: '#fff',
          fontSize: 10
        },
        itemStyle: {
          areaColor: 'rgba(255, 255, 255, 0.08)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        emphasis: {
          itemStyle: {
            areaColor: 'rgba(255, 215, 0, 0.2)'
          }
        },
        data: regionData
      },
      {
        name: '桥梁位置',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: bridges.map(bridge => ({
          name: bridge.name,
          value: [bridge.lng, bridge.lat],
          itemStyle: {
            color: dynastyColors[bridge.dynasty] || '#fff',
            borderColor: '#fff',
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: dynastyColors[bridge.dynasty]
          },
          symbolSize: bridge.preservationLevel === '完整' ? 18 : bridge.preservationLevel === '局部残损' ? 14 : 10,
          bridgeData: bridge
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 20
          }
        }
      }
    ]
  }
  
  chartInstance.setOption(option)
  
  chartInstance.on('mouseover', (params: unknown) => {
    const p = params as { data: { bridgeData: typeof store.allBridges.value[0] } }
    if (p.data?.bridgeData) {
      hoveredBridge.value = p.data.bridgeData
    }
  })
  
  chartInstance.on('mouseout', () => {
    hoveredBridge.value = null
  })
  
  chartInstance.on('click', (params: unknown) => {
    const p = params as { data: { bridgeData: typeof store.allBridges.value[0] } }
    if (p.data?.bridgeData) {
      store.selectBridge(p.data.bridgeData)
      router.push('/structure-decode')
    }
  })
}

const formatYear = (year: number) => {
  if (year < 0) return `公元前${Math.abs(year)}年`
  if (year === 0) return '元年'
  return `公元${year}年`
}

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', () => chartInstance?.resize())
})
</script>

<template>
  <div class="geo-map-container">
    <header class="header">
      <div class="logo" @click="router.push('/')">
        <span class="logo-icon">🗺️</span>
        <span class="logo-text">桥通古今</span>
      </div>
      <nav class="nav">
        <button @click="router.push('/')" class="nav-btn">首页</button>
        <button @click="router.push('/geo-map')" class="nav-btn active">时空地理图谱</button>
        <button @click="router.push('/structure-decode')" class="nav-btn">结构技艺解码</button>
        <button @click="router.push('/tech-tree')" class="nav-btn">营造技艺演化树</button>
        <button @click="router.push('/cultural-narrative')" class="nav-btn">文化印记叙事流</button>
        <button @click="router.push('/data-dashboard')" class="nav-btn">数据量化看板</button>
      </nav>
    </header>

    <main class="main-content">
      <div class="chart-container" ref="chartRef">
        <div v-if="hoveredBridge" class="tooltip" :style="{ left: '20px', top: '20px' }">
          <h4>{{ hoveredBridge.name }}</h4>
          <p>始建: {{ formatYear(hoveredBridge.buildYear) }}</p>
          <p>结构: {{ hoveredBridge.structureType }}</p>
          <p>保护: {{ hoveredBridge.protectionLevel }}</p>
        </div>
      </div>

      <div class="legend-panel">
        <div class="legend-title">图例</div>
        <div class="legend-section">
          <div class="legend-header">保存状况</div>
          <div class="legend-item"><span class="legend-dot" style="width: 18px; height: 18px;"></span>完整</div>
          <div class="legend-item"><span class="legend-dot" style="width: 14px; height: 14px;"></span>局部残损</div>
          <div class="legend-item"><span class="legend-dot" style="width: 10px; height: 10px;"></span>仅存遗址</div>
        </div>
        <div class="legend-section">
          <div class="legend-header">始建朝代</div>
          <div v-for="(color, dynasty) in dynastyColors" :key="dynasty" class="legend-item">
            <span class="legend-dot" :style="{ backgroundColor: color }"></span>{{ dynasty }}
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="year-display">当前时间：{{ formatYear(currentYear) }}</div>
      <input 
        type="range" 
        v-model="currentYear" 
        :min="-2000" 
        :max="1911" 
        class="year-slider"
        @input="updateChart"
      />
      <div class="info-bar">
        <span>已显示 {{ store.allBridges.filter(b => b.buildYear <= currentYear).length }} 座桥梁</span>
        <span class="map-info">审图号：GS(2024)0650号</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.geo-map-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.logo-icon { font-size: 1.5rem; }
.logo-text { font-size: 1.2rem; font-weight: 600; color: #fff; }

.nav { display: flex; gap: 1rem; }

.nav-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
.nav-btn.active { background: rgba(255,215,0,0.2); border-color: rgba(255,215,0,0.5); color: #FFD700; }

.main-content { flex: 1; display: flex; }

.chart-container { flex: 1; position: relative; }

.tooltip {
  position: absolute;
  background: rgba(0,0,0,0.9);
  border: 1px solid rgba(255,215,0,0.3);
  border-radius: 8px;
  padding: 1rem;
  z-index: 1000;
}

.tooltip h4 { color: #FFD700; margin: 0 0 0.5rem 0; }
.tooltip p { color: rgba(255,255,255,0.7); margin: 0.3rem 0; font-size: 0.9rem; }

.legend-panel {
  width: 180px;
  background: rgba(0,0,0,0.5);
  padding: 1.2rem;
  border-left: 1px solid rgba(255,255,255,0.1);
}

.legend-title { color: #FFD700; font-size: 1rem; font-weight: 600; margin-bottom: 1rem; }

.legend-section { margin-bottom: 1rem; }
.legend-header { color: rgba(255,255,255,0.5); font-size: 0.8rem; margin-bottom: 0.5rem; }

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255,255,255,0.7);
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #FFD700;
}

.footer {
  background: rgba(0,0,0,0.5);
  padding: 1rem 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.year-display {
  text-align: center;
  color: #FFD700;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.year-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(255,255,255,0.2);
  border-radius: 3px;
  outline: none;
}

.year-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: #FFD700;
  border-radius: 50%;
  cursor: pointer;
}

.info-bar {
  display: flex;
  justify-content: space-between;
  color: rgba(255,255,255,0.4);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.map-info { color: #90EE90; }
</style>