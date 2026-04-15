<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoaded = ref(false)

onMounted(() => {
  isLoaded.value = true
})

const navItems = [
  { name: '时空地理图谱', path: '/geo-map', icon: '🗺️', desc: '以中国历史地图为底图，呈现古桥的时空分布' },
  { name: '结构技艺解码', path: '/structure-decode', icon: '🏗️', desc: '三维结构拆解，展示典型桥梁的构造奥秘' },
  { name: '营造技艺演化树', path: '/tech-tree', icon: '🌳', desc: '追溯六大核心技术体系的传承与演变' },
  { name: '文化印记叙事流', path: '/cultural-narrative', icon: '📜', desc: '构建"人—桥—事"三元知识图谱' },
  { name: '数据量化看板', path: '/data-dashboard', icon: '📊', desc: '多维度统计分析，呈现古桥遗产全貌' }
]
</script>

<template>
  <div class="home-container">
    <div class="hero">
      <div class="hero-content" :class="{ loaded: isLoaded }">
        <div class="hero-bg"></div>
        <div class="hero-text">
          <h1 class="title">桥通古今</h1>
          <h2 class="subtitle">中国古代桥梁建筑成就交互可视化系统</h2>
          <p class="description">跨越千年时空，领略古代工程智慧</p>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="section-header">
        <h2>五大可视化模块</h2>
        <p>深入探索中国古代桥梁的辉煌成就</p>
      </div>

      <div class="modules-grid">
        <div 
          v-for="item in navItems" 
          :key="item.path"
          class="module-card"
          @click="router.push(item.path)"
        >
          <div class="card-icon">{{ item.icon }}</div>
          <div class="card-content">
            <h3>{{ item.name }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>

      <div class="feature-section">
        <div class="feature-card">
          <h3>📊 36座代表性古桥</h3>
          <p>全国1911年前建造、现存或史料确载的代表性古桥</p>
        </div>
        <div class="feature-card">
          <h3>🏛️ 六大技术体系</h3>
          <p>石拱券砌、桥基处理、索桥锚固等核心技术传承演变</p>
        </div>
        <div class="feature-card">
          <h3>🎨 多维可视化</h3>
          <p>地理图谱、三维模型、演化树、关系图谱、数据看板</p>
        </div>
      </div>
    </div>

    <footer class="footer">
      <p>© 2026 桥通古今项目团队 | 审图号：GS(2024)0650号</p>
    </footer>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #fff;
}

.hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.hero-content.loaded .hero-text {
  opacity: 1;
  transform: translateY(0);
}

.hero-text {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
}

.content-section {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.section-header p {
  color: rgba(255, 255, 255, 0.6);
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.module-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.module-card:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
  transform: translateY(-3px);
}

.card-icon {
  font-size: 2rem;
}

.card-content h3 {
  margin: 0 0 0.3rem 0;
  color: #FFD700;
}

.card-content p {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.feature-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 3rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 1.2rem;
  text-align: center;
}

.feature-card h3 {
  margin: 0 0 0.3rem 0;
}

.feature-card p {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

.footer {
  text-align: center;
  padding: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
}
</style>