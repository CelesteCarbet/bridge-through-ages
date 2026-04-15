<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBridgeStore } from '@/stores/bridge'

const router = useRouter()
const store = useBridgeStore()

const selectedNode = ref<typeof store.techTreeData[0] | null>(null)

const formatYear = (year: number) => {
  if (year < 0) return `公元前${Math.abs(year)}年`
  if (year === 0) return '元年'
  return `公元${year}年`
}

const expandNode = (node: typeof store.techTreeData[0]) => {
  selectedNode.value = node
  store.selectTechNode(node)
}

onMounted(() => {
  if (store.techTreeData.length > 0) {
    selectedNode.value = store.techTreeData[0]
  }
})
</script>

<template>
  <div class="tech-tree-container">
    <header class="header">
      <div class="logo" @click="router.push('/')">
        <span class="logo-icon">🌳</span>
        <span class="logo-text">桥通古今</span>
      </div>
      <nav class="nav">
        <button @click="router.push('/')" class="nav-btn">首页</button>
        <button @click="router.push('/geo-map')" class="nav-btn">时空地理图谱</button>
        <button @click="router.push('/structure-decode')" class="nav-btn">结构技艺解码</button>
        <button @click="router.push('/tech-tree')" class="nav-btn active">营造技艺演化树</button>
        <button @click="router.push('/cultural-narrative')" class="nav-btn">文化印记叙事流</button>
        <button @click="router.push('/data-dashboard')" class="nav-btn">数据量化看板</button>
      </nav>
    </header>

    <main class="main-content">
      <div class="tree-container">
        <div class="tree-header">六大核心技术体系</div>
        <div class="tree-list">
          <div 
            v-for="tech in store.techTreeData" 
            :key="tech.id"
            class="tree-node root-node"
            @click="expandNode(tech)"
            :class="{ active: selectedNode?.id === tech.id }"
          >
            <div class="node-header">
              <span class="node-icon">📌</span>
              <span class="node-name">{{ tech.name }}</span>
              <span class="node-year">{{ formatYear(tech.year) }}</span>
            </div>
            <div v-if="selectedNode?.id === tech.id" class="node-children">
              <div 
                v-for="child in tech.children" 
                :key="child.id"
                class="tree-node branch-node"
                @click.stop="expandNode(child)"
                :class="{ active: selectedNode?.id === child.id }"
              >
                <span class="node-icon">🔹</span>
                <span class="node-name">{{ child.name }}</span>
                <span class="node-year">{{ formatYear(child.year) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside class="info-panel">
        <div class="panel-header">
          <h3>技术详情</h3>
          <div class="legend">
            <div class="legend-item"><span class="legend-dot root"></span>核心技术</div>
            <div class="legend-item"><span class="legend-dot branch"></span>技术分支</div>
          </div>
        </div>

        <div v-if="selectedNode" class="info-content">
          <div class="info-title">
            <h2>{{ selectedNode.name }}</h2>
            <span class="tech-type" :class="selectedNode.type">{{ selectedNode.type === 'root' ? '核心技术' : '技术分支' }}</span>
          </div>
          
          <div class="info-row">
            <span class="label">首创年代</span>
            <span class="value">{{ formatYear(selectedNode.year) }}</span>
          </div>
          
          <div class="info-row">
            <span class="label">代表性桥梁</span>
            <span class="value">{{ selectedNode.representativeBridge }}</span>
          </div>
          
          <div class="info-row">
            <span class="label">技术优势</span>
            <p class="description">{{ selectedNode.description }}</p>
          </div>
          
          <div class="info-row">
            <span class="label">文献出处</span>
            <span class="value">{{ selectedNode.literature }}</span>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <p>点击技术节点查看详情</p>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.tech-tree-container {
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

.tree-container {
  flex: 1;
  padding: 1.5rem;
  border-right: 1px solid rgba(255,255,255,0.1);
  overflow-y: auto;
}

.tree-header {
  color: #FFD700;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.tree-list { display: flex; flex-direction: column; gap: 0.5rem; }

.tree-node {
  padding: 0.8rem;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tree-node:hover { background: rgba(255,255,255,0.1); }
.tree-node.active { background: rgba(255,215,0,0.15); border-left: 3px solid #FFD700; }

.root-node { background: rgba(255,215,0,0.08); }

.node-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.node-icon { font-size: 1.1rem; }
.node-name { color: #fff; font-weight: 500; flex: 1; }
.node-year { color: rgba(255,255,255,0.5); font-size: 0.85rem; }

.node-children {
  margin-top: 0.8rem;
  padding-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.branch-node {
  padding: 0.6rem;
  background: rgba(255,255,255,0.03);
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.info-panel {
  width: 320px;
  background: rgba(0,0,0,0.5);
  padding: 1.2rem;
  overflow-y: auto;
}

.panel-header { margin-bottom: 1rem; }
.panel-header h3 { color: #FFD700; font-size: 1.1rem; margin: 0 0 0.8rem 0; }

.legend { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.legend-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: rgba(255,255,255,0.7);
  font-size: 0.75rem;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.legend-dot.root { background: #FFD700; }
.legend-dot.branch { background: #90EE90; }

.info-content { color: #fff; }

.info-title { margin-bottom: 1rem; }
.info-title h2 { color: #FFD700; font-size: 1.3rem; margin: 0 0 0.3rem 0; }

.tech-type {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
}
.tech-type.root { background: rgba(255,215,0,0.2); color: #FFD700; }
.tech-type.branch { background: rgba(144,238,144,0.2); color: #90EE90; }

.info-row { margin-bottom: 0.8rem; }
.info-row .label { display: block; color: rgba(255,255,255,0.5); font-size: 0.8rem; margin-bottom: 0.2rem; }
.info-row .value { color: rgba(255,255,255,0.9); font-size: 0.9rem; }
.info-row .description {
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255,255,255,0.4);
}
</style>