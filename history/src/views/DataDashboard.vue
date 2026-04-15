<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBridgeStore } from '@/stores/bridge'

const router = useRouter()
const store = useBridgeStore()

const stats = ref({
  totalBridges: store.allBridges.length,
  avgAge: Math.round(store.allBridges.reduce((sum, b) => sum + (2024 - b.buildYear), 0) / store.allBridges.length),
  completeCount: store.allBridges.filter(b => b.preservationLevel === '完整').length,
  nationalLevel: store.allBridges.filter(b => b.protectionLevel.includes('全国重点')).length
})

const structureData = ref([
  { name: '拱桥', value: 18, color: '#FFD700' },
  { name: '梁桥', value: 10, color: '#90EE90' },
  { name: '索桥', value: 3, color: '#87CEEB' },
  { name: '浮桥', value: 2, color: '#DDA0DD' },
  { name: '其他', value: 3, color: '#FFA500' }
])

const dynastyData = ref([
  { name: '先秦', build: 2, repair: 0 },
  { name: '秦汉', build: 3, repair: 1 },
  { name: '魏晋南北朝', build: 2, repair: 1 },
  { name: '隋唐', build: 5, repair: 2 },
  { name: '宋元', build: 8, repair: 3 },
  { name: '明清', build: 16, repair: 8 }
])

const wordCloudData = ref([
  { text: '石材', weight: 100 },
  { text: '松木', weight: 70 },
  { text: '铁', weight: 55 },
  { text: '糯米灰浆', weight: 45 },
  { text: '石料', weight: 40 },
  { text: '木材', weight: 35 },
  { text: '竹', weight: 30 },
  { text: '砖', weight: 28 },
  { text: '花岗岩', weight: 25 },
  { text: '榫卯', weight: 22 },
  { text: '铁链', weight: 20 },
  { text: '蛎灰', weight: 18 }
])

const protectionData = ref([
  { name: '全国重点文物保护单位', value: 12, color: '#FFD700' },
  { name: '省级文物保护单位', value: 14, color: '#90EE90' },
  { name: '市县级文物保护单位', value: 6, color: '#87CEEB' },
  { name: '未定级', value: 4, color: '#DDA0DD' }
])

const getMaxDynastyBuild = () => Math.max(...dynastyData.value.map(d => d.build + d.repair))

const getMaxStructure = () => Math.max(...structureData.value.map(s => s.value))

onMounted(() => {})
</script>

<template>
  <div class="dashboard-container">
    <header class="header">
      <div class="logo" @click="router.push('/')">
        <span class="logo-icon">📊</span>
        <span class="logo-text">桥通古今</span>
      </div>
      <nav class="nav">
        <button @click="router.push('/')" class="nav-btn">首页</button>
        <button @click="router.push('/geo-map')" class="nav-btn">时空地理图谱</button>
        <button @click="router.push('/structure-decode')" class="nav-btn">结构技艺解码</button>
        <button @click="router.push('/tech-tree')" class="nav-btn">营造技艺演化树</button>
        <button @click="router.push('/cultural-narrative')" class="nav-btn">文化印记叙事流</button>
        <button @click="router.push('/data-dashboard')" class="nav-btn active">数据量化看板</button>
      </nav>
    </header>

    <main class="main-content">
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon">🌉</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalBridges }}</span>
            <span class="stat-label">座古桥收录</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.avgAge }}</span>
            <span class="stat-label">年平均历史</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.completeCount }}</span>
            <span class="stat-label">座保存完整</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.nationalLevel }}</span>
            <span class="stat-label">处全国重点文保</span>
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-header">
            <h3>结构类型分布</h3>
          </div>
          <div class="chart-content">
            <div class="bar-chart">
              <div 
                v-for="item in structureData" 
                :key="item.name" 
                class="bar-item"
              >
                <span class="bar-label">{{ item.name }}</span>
                <div class="bar-track">
                  <div 
                    class="bar-fill" 
                    :style="{ 
                      width: (item.value / getMaxStructure() * 100) + '%',
                      backgroundColor: item.color 
                    }"
                  ></div>
                </div>
                <span class="bar-value">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3>朝代分布对比</h3>
          </div>
          <div class="chart-content">
            <div class="stacked-chart">
              <div v-for="dynasty in dynastyData" :key="dynasty.name" class="stacked-item">
                <span class="stacked-label">{{ dynasty.name }}</span>
                <div class="stacked-track">
                  <div 
                    class="stacked-build" 
                    :style="{ width: (dynasty.build / getMaxDynastyBuild() * 100) + '%' }"
                  ></div>
                  <div 
                    class="stacked-repair" 
                    :style="{ width: (dynasty.repair / getMaxDynastyBuild() * 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="stacked-legend">
              <span class="legend-item"><span class="legend-color build"></span>新建</span>
              <span class="legend-item"><span class="legend-color repair"></span>修缮</span>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3>材料使用词云</h3>
          </div>
          <div class="chart-content">
            <div class="word-cloud">
              <span 
                v-for="(word, idx) in wordCloudData" 
                :key="idx"
                class="word-item"
                :style="{ 
                  fontSize: (word.weight / 3) + 'px',
                  color: ['#FFD700', '#90EE90', '#87CEEB', '#DDA0DD', '#FFA500'][idx % 5]
                }"
              >{{ word.text }}</span>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3>保护等级分布</h3>
          </div>
          <div class="chart-content">
            <div class="pie-chart">
              <svg viewBox="0 0 200 200" class="pie-svg">
                <circle 
                  v-for="(item, idx) in protectionData" 
                  :key="item.name"
                  cx="100" 
                  cy="100" 
                  r="80"
                  :fill="item.color"
                  :stroke="item.color"
                  :stroke-width="10"
                  :stroke-dasharray="`${(item.value / stats.totalBridges * 2 * Math.PI * 80)} ${2 * Math.PI * 80}`"
                  :stroke-dashoffset="-protectionData.slice(0, idx).reduce((sum, d) => sum + (d.value / stats.totalBridges * 2 * Math.PI * 80), 0)"
                  transform="rotate(-90 100 100)"
                  class="pie-segment"
                />
              </svg>
            </div>
            <div class="pie-legend">
              <div v-for="item in protectionData" :key="item.name" class="legend-row">
                <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
                <span class="legend-text">{{ item.name }}</span>
                <span class="legend-value">{{ item.value }}座 ({{ Math.round(item.value / stats.totalBridges * 100) }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(0,0,0,0.3);
}

.logo { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
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

.main-content { flex: 1; padding: 1.5rem; }

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0,0,0,0.4);
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.stat-icon { font-size: 2rem; }

.stat-info { display: flex; flex-direction: column; }
.stat-value { font-size: 1.6rem; font-weight: 700; color: #FFD700; }
.stat-label { color: rgba(255,255,255,0.6); font-size: 0.85rem; }

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.chart-card {
  background: rgba(0,0,0,0.4);
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.chart-header { margin-bottom: 1rem; }
.chart-header h3 { color: #fff; font-size: 1rem; margin: 0; }

.chart-content { min-height: 150px; }

.bar-chart { display: flex; flex-direction: column; gap: 0.6rem; }

.bar-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.bar-label { color: rgba(255,255,255,0.7); font-size: 0.85rem; width: 40px; }

.bar-track {
  flex: 1;
  height: 20px;
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.bar-value { color: rgba(255,255,255,0.9); font-size: 0.85rem; width: 30px; text-align: right; }

.stacked-chart { display: flex; flex-direction: column; gap: 0.5rem; }

.stacked-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stacked-label { color: rgba(255,255,255,0.7); font-size: 0.8rem; width: 80px; }

.stacked-track {
  flex: 1;
  height: 16px;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  display: flex;
  overflow: hidden;
}

.stacked-build {
  height: 100%;
  background: #FFD700;
  border-radius: 8px 0 0 8px;
}

.stacked-repair {
  height: 100%;
  background: #90EE90;
  border-radius: 0 8px 8px 0;
}

.stacked-legend {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 0.8rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: rgba(255,255,255,0.7);
  font-size: 0.8rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-color.build { background: #FFD700; }
.legend-color.repair { background: #90EE90; }

.word-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  min-height: 120px;
}

.word-item {
  padding: 0.3rem 0.5rem;
  background: rgba(255,255,255,0.05);
  border-radius: 6px;
}

.pie-chart {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.pie-svg {
  width: 150px;
  height: 150px;
}

.pie-segment {
  fill: none;
  transition: all 0.3s ease;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-row .legend-color {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.legend-text { color: rgba(255,255,255,0.7); font-size: 0.8rem; flex: 1; }
.legend-value { color: rgba(255,255,255,0.9); font-size: 0.8rem; }
</style>