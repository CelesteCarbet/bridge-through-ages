<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBridgeStore } from '@/stores/bridge'

const router = useRouter()
const store = useBridgeStore()

const selectedNode = ref<typeof store.culturalNodes[0] | null>(null)
const timelineEvents = ref<{ year: number; event: string; type: string }[]>([])

const nodeColors: Record<string, string> = {
  bridge: '#FFD700',
  person: '#90EE90',
  event: '#87CEEB',
  literature: '#DDA0DD'
}

const nodeIcons: Record<string, string> = {
  bridge: '🏛️',
  person: '👤',
  event: '📅',
  literature: '📜'
}

const selectNode = (node: typeof store.culturalNodes[0]) => {
  selectedNode.value = node
  store.selectCulturalNode(node)
  
  if (node.type === 'bridge') {
    const bridge = store.getBridgeById(node.bridgeId || '')
    if (bridge) {
      timelineEvents.value = [
        { year: bridge.buildYear, event: `${bridge.name}始建`, type: '建造' },
        { year: bridge.lastRepairYear || bridge.buildYear, event: '最近一次大修', type: '修缮' }
      ]
    }
  } else if (node.type === 'person') {
    timelineEvents.value = [
      { year: -256, event: '主持建造万里桥', type: '建造' },
      { year: -221, event: '出使东吴', type: '事件' }
    ]
  } else if (node.type === 'literature') {
    timelineEvents.value = [
      { year: 772, event: '创作《枫桥夜泊》', type: '创作' },
      { year: 825, event: '收录于《全唐诗》', type: '收录' }
    ]
  }
}

const formatYear = (year: number) => {
  if (year < 0) return `公元前${Math.abs(year)}年`
  if (year === 0) return '元年'
  return `公元${year}年`
}

const filteredLinks = computed(() => {
  if (!selectedNode.value) return []
  return store.culturalLinks.filter(
    link => link.source === selectedNode.value?.id || link.target === selectedNode.value?.id
  )
})

const getRelatedNodeName = (id: string) => {
  return store.culturalNodes.find(n => n.id === id)?.name || ''
}

onMounted(() => {
  if (store.culturalNodes.length > 0) {
    selectNode(store.culturalNodes[0])
  }
})
</script>

<template>
  <div class="cultural-container">
    <header class="header">
      <div class="logo" @click="router.push('/')">
        <span class="logo-icon">📜</span>
        <span class="logo-text">桥通古今</span>
      </div>
      <nav class="nav">
        <button @click="router.push('/')" class="nav-btn">首页</button>
        <button @click="router.push('/geo-map')" class="nav-btn">时空地理图谱</button>
        <button @click="router.push('/structure-decode')" class="nav-btn">结构技艺解码</button>
        <button @click="router.push('/tech-tree')" class="nav-btn">营造技艺演化树</button>
        <button @click="router.push('/cultural-narrative')" class="nav-btn active">文化印记叙事流</button>
        <button @click="router.push('/data-dashboard')" class="nav-btn">数据量化看板</button>
      </nav>
    </header>

    <main class="main-content">
      <div class="chart-container">
        <div class="chart-header">人—桥—事 三元知识图谱</div>
        <div class="nodes-grid">
          <div class="node-category">
            <div class="category-title">🏛️ 桥梁</div>
            <div 
              v-for="node in store.culturalNodes.filter(n => n.type === 'bridge')" 
              :key="node.id"
              class="node-card"
              :class="{ active: selectedNode?.id === node.id }"
              @click="selectNode(node)"
            >
              <span class="node-icon">{{ nodeIcons[node.type] }}</span>
              <span class="node-name">{{ node.name }}</span>
            </div>
          </div>
          <div class="node-category">
            <div class="category-title">👤 人物</div>
            <div 
              v-for="node in store.culturalNodes.filter(n => n.type === 'person')" 
              :key="node.id"
              class="node-card"
              :class="{ active: selectedNode?.id === node.id }"
              @click="selectNode(node)"
            >
              <span class="node-icon">{{ nodeIcons[node.type] }}</span>
              <span class="node-name">{{ node.name }}</span>
            </div>
          </div>
          <div class="node-category">
            <div class="category-title">📅 事件</div>
            <div 
              v-for="node in store.culturalNodes.filter(n => n.type === 'event')" 
              :key="node.id"
              class="node-card"
              :class="{ active: selectedNode?.id === node.id }"
              @click="selectNode(node)"
            >
              <span class="node-icon">{{ nodeIcons[node.type] }}</span>
              <span class="node-name">{{ node.name }}</span>
            </div>
          </div>
          <div class="node-category">
            <div class="category-title">📜 文学</div>
            <div 
              v-for="node in store.culturalNodes.filter(n => n.type === 'literature')" 
              :key="node.id"
              class="node-card"
              :class="{ active: selectedNode?.id === node.id }"
              @click="selectNode(node)"
            >
              <span class="node-icon">{{ nodeIcons[node.type] }}</span>
              <span class="node-name">{{ node.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <aside class="info-panel">
        <div class="panel-header">
          <h3>详情信息</h3>
        </div>

        <div v-if="selectedNode" class="info-content">
          <div class="info-header">
            <span class="info-icon">{{ nodeIcons[selectedNode.type] }}</span>
            <div class="info-title">
              <h2>{{ selectedNode.name }}</h2>
              <span class="info-type">{{ selectedNode.type === 'bridge' ? '桥梁' : selectedNode.type === 'person' ? '人物' : selectedNode.type === 'event' ? '事件' : '文学作品' }}</span>
            </div>
          </div>
          
          <div class="info-desc">
            <p>{{ selectedNode.description }}</p>
          </div>

          <div class="related-section">
            <h4>关联关系</h4>
            <div class="related-list">
              <div v-for="(link, idx) in filteredLinks" :key="idx" class="related-item">
                <span class="relation-type">{{ link.relation }}</span>
                <span class="relation-target">{{ getRelatedNodeName(link.source === selectedNode?.id ? link.target : link.source) }}</span>
              </div>
            </div>
          </div>

          <div class="timeline-section">
            <h4>时间线</h4>
            <div class="timeline">
              <div 
                v-for="(event, idx) in timelineEvents" 
                :key="idx" 
                class="timeline-item"
              >
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <span class="timeline-year">{{ formatYear(event.year) }}</span>
                  <span class="timeline-event">{{ event.event }}</span>
                  <span class="timeline-tag">{{ event.type }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <p>点击节点查看详情</p>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.cultural-container {
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

.main-content { flex: 1; display: flex; overflow: hidden; }

.chart-container {
  flex: 1;
  padding: 1.5rem;
  border-right: 1px solid rgba(255,255,255,0.1);
  overflow-y: auto;
}

.chart-header {
  color: #FFD700;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.nodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.node-category {
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 1rem;
}

.category-title {
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.node-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem;
  background: rgba(255,255,255,0.03);
  border-radius: 6px;
  margin-bottom: 0.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.node-card:hover { background: rgba(255,255,255,0.1); }
.node-card.active { 
  background: rgba(255,215,0,0.2); 
  border-left: 3px solid #FFD700;
}

.node-icon { font-size: 1.1rem; }
.node-name { color: #fff; font-size: 0.9rem; }

.info-panel {
  width: 320px;
  background: rgba(0,0,0,0.5);
  padding: 1.2rem;
  overflow-y: auto;
}

.panel-header { margin-bottom: 1rem; }
.panel-header h3 { color: #FFD700; font-size: 1.1rem; margin: 0; }

.info-content { color: #fff; }

.info-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}

.info-icon { font-size: 2rem; }

.info-title h2 { color: #FFD700; font-size: 1.3rem; margin: 0 0 0.2rem 0; }

.info-type {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  color: rgba(255,255,255,0.7);
  font-size: 0.75rem;
}

.info-desc p {
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.related-section, .timeline-section { margin-bottom: 1rem; }
.related-section h4, .timeline-section h4 {
  color: rgba(255,255,255,0.9);
  font-size: 0.95rem;
  margin: 0 0 0.6rem 0;
}

.related-list { display: flex; flex-direction: column; gap: 0.4rem; }

.related-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem;
  background: rgba(255,255,255,0.05);
  border-radius: 5px;
}

.relation-type {
  padding: 0.15rem 0.4rem;
  background: rgba(255,215,0,0.2);
  border-radius: 6px;
  color: #FFD700;
  font-size: 0.7rem;
}

.relation-target { color: rgba(255,255,255,0.8); font-size: 0.85rem; }

.timeline {
  position: relative;
  padding-left: 1rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 3px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255,255,255,0.2);
}

.timeline-item {
  position: relative;
  padding-bottom: 0.8rem;
}

.timeline-dot {
  position: absolute;
  left: -0.9rem;
  top: 0.2rem;
  width: 8px;
  height: 8px;
  background: #FFD700;
  border-radius: 50%;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.timeline-year { color: #FFD700; font-size: 0.8rem; font-weight: 500; }
.timeline-event { color: rgba(255,255,255,0.9); font-size: 0.85rem; }
.timeline-tag {
  display: inline-block;
  padding: 0.1rem 0.3rem;
  background: rgba(135,206,235,0.2);
  border-radius: 5px;
  color: #87CEEB;
  font-size: 0.65rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255,255,255,0.4);
}
</style>