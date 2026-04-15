<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBridgeStore } from '@/stores/bridge'

const router = useRouter()
const store = useBridgeStore()

const selectedBridge = ref(store.selectedBridge || store.allBridges.find(b => b.id === 'zhaozhou') || store.allBridges[0])
const showArchLayer = ref(true)
const showDeckLayer = ref(true)
const showFoundationLayer = ref(true)
const showAccessoriesLayer = ref(true)
const showForceArrows = ref(false)

const bridges = store.allBridges.filter(b => 
  ['zhaozhou', 'luoyang', 'luding', 'bazi'].includes(b.id)
)

const bridgeInfo = ref({
  structureType: '',
  dynasticTerm: '',
  modernAnalysis: '',
  keyComponents: [] as { name: string; desc: string }[]
})

const loadBridgeInfo = () => {
  const infoMap: Record<string, typeof bridgeInfo.value> = {
    zhaozhou: {
      structureType: '敞肩拱石拱桥',
      dynasticTerm: '《营造法式》称之为"券洞桥"，采用并列砌筑法',
      modernAnalysis: '敞肩拱结构通过减轻自重、增加泄洪能力，使桥梁更加稳固耐用',
      keyComponents: [
        { name: '拱券层', desc: '由28道独立拱券并列砌筑而成' },
        { name: '桥面系', desc: '石板铺成，两侧设栏杆' },
        { name: '桥基', desc: '采用睡木沉基法，深埋于河床' },
        { name: '敞肩孔', desc: '大拱两侧各设两个小拱，减轻自重' }
      ]
    },
    luoyang: {
      structureType: '梁桥筏形基础',
      dynasticTerm: '《营造法式》称之为"石梁桥"，采用筏形基础',
      modernAnalysis: '筏形基础扩大了受力面积，种蛎固基技术利用生物加固',
      keyComponents: [
        { name: '筏形基础', desc: '长条石垒成，呈船形' },
        { name: '桥墩', desc: '尖形分水尖设计，减少水流冲击' },
        { name: '石梁', desc: '巨大花岗岩条石铺设' },
        { name: '护堤', desc: '种蛎固基形成的天然防护' }
      ]
    },
    luding: {
      structureType: '铁索桥',
      dynasticTerm: '《武经总要》记载为"铁绳桥"',
      modernAnalysis: '利用铁链的抗拉性能，跨越深谷激流',
      keyComponents: [
        { name: '铁链', desc: '13根铁链组成，其中9根承重' },
        { name: '锚碇', desc: '巨型铸铁锚固定两岸' },
        { name: '桥面', desc: '木板铺设于铁链之上' },
        { name: '桥塔', desc: '支撑铁链的木构塔楼' }
      ]
    },
    bazi: {
      structureType: '城市水上立交',
      dynasticTerm: '古称"八字桥"，为多向交通枢纽',
      modernAnalysis: '世界最早的城市立交桥雏形，解决复杂交通需求',
      keyComponents: [
        { name: '主拱', desc: '主河道上的主拱券' },
        { name: '副拱', desc: '连接支流的小拱券' },
        { name: '踏道', desc: '多方向的坡道设计' },
        { name: '护栏', desc: '石质栏杆保护行人' }
      ]
    }
  }
  
  bridgeInfo.value = infoMap[selectedBridge.value.id] || infoMap.zhaozhou
}

const selectBridge = (bridge: typeof store.allBridges.value[0]) => {
  selectedBridge.value = bridge
  store.selectBridge(bridge)
  loadBridgeInfo()
}

onMounted(() => {
  loadBridgeInfo()
})
</script>

<template>
  <div class="structure-container">
    <header class="header">
      <div class="logo" @click="router.push('/')">
        <span class="logo-icon">🏗️</span>
        <span class="logo-text">桥通古今</span>
      </div>
      <nav class="nav">
        <button @click="router.push('/')" class="nav-btn">首页</button>
        <button @click="router.push('/geo-map')" class="nav-btn">时空地理图谱</button>
        <button @click="router.push('/structure-decode')" class="nav-btn active">结构技艺解码</button>
        <button @click="router.push('/tech-tree')" class="nav-btn">营造技艺演化树</button>
        <button @click="router.push('/cultural-narrative')" class="nav-btn">文化印记叙事流</button>
        <button @click="router.push('/data-dashboard')" class="nav-btn">数据量化看板</button>
      </nav>
    </header>

    <main class="main-content">
      <aside class="sidebar">
        <div class="sidebar-header">桥梁选择</div>
        <div 
          v-for="bridge in bridges" 
          :key="bridge.id"
          class="bridge-item"
          :class="{ active: selectedBridge.id === bridge.id }"
          @click="selectBridge(bridge)"
        >
          <span class="bridge-name">{{ bridge.name }}</span>
          <span class="bridge-type">{{ bridge.structureType }}</span>
        </div>
        
        <div class="sidebar-divider"></div>
        
        <div class="sidebar-header">结构层显隐</div>
        <label class="checkbox-label">
          <input type="checkbox" v-model="showArchLayer" />
          <span>拱券层</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="showDeckLayer" />
          <span>桥面系</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="showFoundationLayer" />
          <span>桥基</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="showAccessoriesLayer" />
          <span>附属构件</span>
        </label>
        
        <button 
          class="force-btn" 
          :class="{ active: showForceArrows }"
          @click="showForceArrows = !showForceArrows"
        >
          {{ showForceArrows ? '隐藏力学示意' : '显示力学示意' }}
        </button>
      </aside>

      <div class="canvas-container">
        <div class="bridge-preview">
          <div class="preview-header">{{ selectedBridge.name }}</div>
          <div class="preview-visual">
            <div class="bridge-schematic">
              <div v-if="selectedBridge.id === 'zhaozhou'" class="arch-bridge">
                <div class="arch-main"></div>
                <div class="arch-side arch-side-1"></div>
                <div class="arch-side arch-side-2"></div>
                <div class="arch-side arch-side-3"></div>
                <div class="arch-side arch-side-4"></div>
                <div class="deck"></div>
              </div>
              <div v-else-if="selectedBridge.id === 'luoyang'" class="beam-bridge">
                <div class="foundation"></div>
                <div class="pier pier-1"></div>
                <div class="pier pier-2"></div>
                <div class="pier pier-3"></div>
                <div class="pier pier-4"></div>
                <div class="beam"></div>
              </div>
              <div v-else-if="selectedBridge.id === 'luding'" class="cable-bridge">
                <div class="tower tower-left"></div>
                <div class="tower tower-right"></div>
                <div class="cable cable-1"></div>
                <div class="cable cable-2"></div>
                <div class="cable cable-3"></div>
                <div class="suspension-deck"></div>
              </div>
              <div v-else-if="selectedBridge.id === 'bazi'" class="clover-bridge">
                <div class="clover-main"></div>
                <div class="clover-arm clover-arm-1"></div>
                <div class="clover-arm clover-arm-2"></div>
                <div class="clover-arm clover-arm-3"></div>
                <div class="clover-arm clover-arm-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside class="info-panel">
        <div class="info-header">
          <h3>{{ selectedBridge.name }}</h3>
          <span class="info-tag">{{ bridgeInfo.structureType }}</span>
        </div>
        
        <div class="info-section">
          <h4>《营造法式》术语</h4>
          <p>{{ bridgeInfo.dynasticTerm }}</p>
        </div>
        
        <div class="info-section">
          <h4>现代力学分析</h4>
          <p>{{ bridgeInfo.modernAnalysis }}</p>
        </div>
        
        <div class="info-section">
          <h4>核心构件</h4>
          <div class="component-list">
            <div v-for="(comp, idx) in bridgeInfo.keyComponents" :key="idx" class="component-item">
              <span class="component-name">{{ comp.name }}</span>
              <span class="component-desc">{{ comp.desc }}</span>
            </div>
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.structure-container {
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

.sidebar {
  width: 220px;
  background: rgba(0,0,0,0.5);
  padding: 1.2rem;
  border-right: 1px solid rgba(255,255,255,0.1);
}

.sidebar-header { color: #FFD700; font-size: 0.95rem; font-weight: 600; margin-bottom: 0.8rem; }

.bridge-item {
  padding: 0.6rem;
  background: rgba(255,255,255,0.05);
  border-radius: 6px;
  margin-bottom: 0.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bridge-item:hover { background: rgba(255,255,255,0.1); }
.bridge-item.active { background: rgba(255,215,0,0.2); border-left: 3px solid #FFD700; }

.bridge-name { display: block; color: #fff; font-weight: 500; }
.bridge-type { display: block; color: rgba(255,255,255,0.5); font-size: 0.75rem; margin-top: 0.2rem; }

.sidebar-divider { height: 1px; background: rgba(255,255,255,0.1); margin: 1rem 0; }

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255,255,255,0.7);
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
  cursor: pointer;
}

.force-btn {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.8rem;
  background: rgba(255,100,100,0.2);
  border: 1px solid rgba(255,100,100,0.3);
  border-radius: 6px;
  color: #ff6464;
  cursor: pointer;
  transition: all 0.3s ease;
}

.canvas-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.3);
}

.bridge-preview {
  text-align: center;
}

.preview-header {
  color: #FFD700;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.bridge-schematic {
  width: 300px;
  height: 200px;
  position: relative;
}

.arch-bridge { position: relative; width: 100%; height: 100%; }
.arch-main {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 80px;
  border: 4px solid #B87333;
  border-radius: 0 0 100px 100px;
  border-top: none;
}
.arch-side {
  position: absolute;
  bottom: 30px;
  width: 50px;
  height: 30px;
  border: 3px solid #B87333;
  border-radius: 0 0 25px 25px;
  border-top: none;
}
.arch-side-1 { left: 30px; }
.arch-side-2 { right: 30px; }
.arch-side-3 { left: 10px; height: 20px; width: 35px; }
.arch-side-4 { right: 10px; height: 20px; width: 35px; }
.deck {
  position: absolute;
  top: 50px;
  left: 10px;
  width: 280px;
  height: 15px;
  background: #8B4513;
  border-radius: 3px;
}

.beam-bridge { position: relative; width: 100%; height: 100%; }
.foundation {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 250px;
  height: 20px;
  background: #654321;
  border-radius: 5px;
}
.pier {
  position: absolute;
  bottom: 30px;
  width: 30px;
  height: 60px;
  background: #8B4513;
}
.pier-1 { left: 40px; }
.pier-2 { left: 100px; }
.pier-3 { left: 160px; }
.pier-4 { left: 220px; }
.beam {
  position: absolute;
  top: 40px;
  left: 10px;
  width: 280px;
  height: 20px;
  background: #A0522D;
  border-radius: 5px;
}

.cable-bridge { position: relative; width: 100%; height: 100%; }
.tower {
  position: absolute;
  bottom: 30px;
  width: 25px;
  height: 100px;
  background: #654321;
}
.tower-left { left: 30px; }
.tower-right { right: 30px; }
.cable {
  position: absolute;
  top: 30px;
  left: 55px;
  width: 190px;
  height: 3px;
  background: #708090;
}
.cable-1 { top: 30px; }
.cable-2 { top: 50px; }
.cable-3 { top: 70px; }
.suspension-deck {
  position: absolute;
  top: 90px;
  left: 30px;
  width: 240px;
  height: 15px;
  background: #8B4513;
}

.clover-bridge { position: relative; width: 100%; height: 100%; }
.clover-main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border: 4px solid #B87333;
  border-radius: 50%;
}
.clover-arm {
  position: absolute;
  width: 60px;
  height: 3px;
  background: #B87333;
}
.clover-arm-1 { top: 30px; left: 120px; }
.clover-arm-2 { top: 100px; right: 30px; transform: rotate(90deg); }
.clover-arm-3 { bottom: 30px; left: 120px; }
.clover-arm-4 { top: 100px; left: 30px; transform: rotate(-90deg); }

.info-panel {
  width: 300px;
  background: rgba(0,0,0,0.5);
  padding: 1.2rem;
  border-left: 1px solid rgba(255,255,255,0.1);
  overflow-y: auto;
}

.info-header { margin-bottom: 1rem; }
.info-header h3 { color: #FFD700; font-size: 1.3rem; margin: 0 0 0.3rem 0; }

.info-tag {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: rgba(255,215,0,0.2);
  border-radius: 15px;
  color: #FFD700;
  font-size: 0.8rem;
}

.info-section { margin-bottom: 1rem; }
.info-section h4 { color: rgba(255,255,255,0.9); font-size: 0.95rem; margin: 0 0 0.3rem 0; }
.info-section p { color: rgba(255,255,255,0.6); font-size: 0.85rem; line-height: 1.5; margin: 0; }

.component-list { display: flex; flex-direction: column; gap: 0.4rem; }
.component-item {
  padding: 0.5rem;
  background: rgba(255,255,255,0.05);
  border-radius: 5px;
}
.component-name { display: block; color: #90EE90; font-weight: 500; font-size: 0.85rem; }
.component-desc { display: block; color: rgba(255,255,255,0.5); font-size: 0.75rem; margin-top: 0.2rem; }
</style>