<template>
  <view class="ai-home">
    <!-- 空状态引导 -->
    <view class="empty-guide">
      <view class="hero-wrap">
        <view class="hero-icon">🤖</view>
      </view>
      <view class="empty-title">嗨，我是小匠</view>
      <view class="empty-desc">我可以帮你分析随手拍列表、查找相似案例、检查填报内容、辅助复核</view>
      <view class="prompt-list">
        <view class="prompt-chip" v-for="p in promptList" :key="p" @click="sendPrompt(p)">
          {{ p }}
        </view>
      </view>
    </view>

    <!-- 输入区 -->
    <view class="composer">
      <view class="composer-inner">
        <input
          class="composer-input"
          v-model="inputText"
          placeholder="向小匠提问..."
          @confirm="send"
        />
        <button class="send-btn" :class="{ active: inputText.trim() }" @click="send">➤</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toast } from '@/utils/toast'

const inputText = ref('')
const promptList = [
  '总结当前随手拍列表',
  '哪些随手拍临近超期？',
  '帮我优化随手拍描述',
  '这个处置反馈是否充分？',
  '帮我生成治理汇报口径',
]

function sendPrompt(p: string) {
  inputText.value = p
  send()
}

function send() {
  if (!inputText.value.trim()) return
  toast.success('已发送（AI Mock）')
  inputText.value = ''
}
</script>

<style lang="scss" scoped>
.ai-home {
  height: 100vh; display: flex; flex-direction: column; overflow: hidden;
  background: radial-gradient(circle at 52% 0%, rgba(22,119,255,0.22), transparent 30%),
              linear-gradient(180deg, #edf7ff 0%, #f7fbff 42%, #ffffff 100%);
}
.empty-guide { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px 0; }
.hero-wrap { width: 88px; height: 88px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, rgba(77,138,255,0.16), rgba(77,138,255,0) 70%); }
.hero-icon { font-size: 48px; }
.empty-title { margin-top: 16px; font-size: 22px; font-weight: 900; color: #141b2d; }
.empty-desc { margin-top: 8px; font-size: 13px; color: #5d667b; text-align: center; max-width: 292px; }
.prompt-list { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 22px; }
.prompt-chip { padding: 7px 12px; border: 1px solid rgba(22,119,255,0.16); border-radius: 999px; background: rgba(255,255,255,0.94); color: #1f4f8f; font-size: 13px; font-weight: 700; white-space: nowrap; cursor: pointer; }
.composer { padding: 10px 16px; background: linear-gradient(180deg, transparent, #fff 60%); }
.composer-inner { display: flex; align-items: center; gap: 8px; padding: 6px 6px 6px 16px; border: 1px solid rgba(22,119,255,0.08); border-radius: 999px; background: rgba(255,255,255,0.98); box-shadow: 0 8px 20px rgba(31,70,150,0.08); }
.composer-input { flex: 1; border: none; outline: none; font-size: 14px; padding: 8px 0; }
.send-btn { width: 44px; height: 44px; border: none; border-radius: 50%; background: #e8edf5; color: #98a2b3; font-size: 18px; display: flex; align-items: center; justify-content: center; }
.send-btn.active { background: #1677ff; color: #fff; }
</style>
