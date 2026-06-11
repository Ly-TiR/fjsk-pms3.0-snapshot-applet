<template>
  <view class="create-page">
    <!-- 导航栏 -->
    <FgNavbar title="随手拍" :left-arrow="true" />

    <!-- 表单滚动区 -->
    <scroll-view scroll-y class="create-body">
      <!-- ===== 现场影像资料 ===== -->
      <view class="snapshot-section-card">
        <view class="snapshot-section-title">
          <text><text class="required-star">*</text>现场影像资料</text>
          <text class="snapshot-section-ai-btn" @click="handleAIRecognize">AI识别</text>
        </view>
        <view class="snapshot-upload-row">
          <view
            class="snapshot-upload-tile snapshot-upload-tile-labeled"
            v-for="(file, i) in mediaFiles"
            :key="i"
          >
            <text class="snapshot-upload-tile-name">{{ file.name }}</text>
          </view>
          <view class="snapshot-upload-tile snapshot-upload-tile-add" @click="handleUpload">
            <view class="snapshot-upload-plus">+</view>
            <text class="snapshot-upload-label">拍照/相册</text>
          </view>
        </view>

        <!-- 附件资料 -->
        <view class="snapshot-attachment-line">
          <text class="snapshot-attachment-name">附件资料</text>
          <text class="snapshot-upload-link" @click="handleUploadAttachment">上传附件</text>
        </view>
      </view>

      <!-- ===== 事项描述 ===== -->
      <view class="snapshot-section-card">
        <view class="snapshot-section-title">
          <text>事项描述</text>
        </view>

        <!-- AI 状态栏 -->
        <view
          v-if="aiDraftStatus"
          class="snapshot-ai-field-status"
          :class="{
            'is-edited': aiDraftStatus === 'edited',
            'is-confirmed': aiDraftStatus === 'confirmed',
          }"
        >
          <view class="snapshot-ai-field-status-text">
            <text class="snapshot-ai-field-status-tag">
              {{ aiDraftStatus === 'confirmed' ? '正式意见' : aiDraftStatus === 'edited' ? '人工已编辑' : 'AI草稿' }}
            </text>
            <text class="snapshot-ai-field-status-info">
              {{ aiDraftStatus === 'confirmed' ? '已确认，不再提示对比' : aiDraftStatus === 'edited' ? '已人工修改，可对比原稿' : 'AI 生成草稿，可人工修改' }}
            </text>
          </view>
          <view class="snapshot-ai-field-status-actions" v-if="aiDraftStatus !== 'confirmed'">
            <text class="snapshot-ai-action-btn" @click="showCompare = true">对比</text>
          </view>
        </view>

        <!-- 文本域 -->
        <view class="snapshot-textarea-wrapper">
          <textarea
            class="snapshot-textarea"
            :class="{
              'is-ai-draft': aiDraftStatus === 'draft',
              'is-ai-human-edited': aiDraftStatus === 'edited',
            }"
            v-model="form.description"
            placeholder="请输入内容，说明问题发生位置、现象、影响和处置要求"
            :maxlength="1200"
          />
        </view>

        <!-- 字数统计行 -->
        <view class="snapshot-counter-row">
          <text class="snapshot-clear" v-if="form.description" @click="form.description = ''">清除描述</text>
          <text v-else />
          <text>{{ form.description.length }}/1200</text>
        </view>
      </view>

      <!-- ===== 基本信息 ===== -->
      <view class="snapshot-section-card">
        <view class="snapshot-section-title">
          <text>基本信息</text>
        </view>

        <!-- 社区/网格 -->
        <view class="snapshot-field">
          <view class="snapshot-field-head">
            <text><text class="required-star">*</text>社区/网格</text>
          </view>
          <view class="snapshot-input-button" @click="showPicker('section')">
            <text class="snapshot-input-placeholder" v-if="!form.section">请选择社区/网格</text>
            <text class="snapshot-input-value" v-else>{{ form.section }}</text>
            <text class="snapshot-input-arrow">›</text>
          </view>
        </view>

        <!-- 详细地址/点位 -->
        <view class="snapshot-field">
          <view class="snapshot-field-head">
            <text>详细地址/点位</text>
          </view>
          <view class="snapshot-input-button" @click="showPicker('area')">
            <text class="snapshot-input-placeholder" v-if="!form.area">请选择详细地址/点位</text>
            <text class="snapshot-input-value" v-else>{{ form.area }}</text>
            <text class="snapshot-input-arrow">›</text>
          </view>
        </view>

        <!-- 事项分类 -->
        <view class="snapshot-field">
          <view class="snapshot-field-head">
            <text><text class="required-star">*</text>事项分类</text>
          </view>
          <view class="snapshot-input-button" @click="showPicker('category')">
            <text class="snapshot-input-placeholder" v-if="!form.category">请选择事项分类</text>
            <text class="snapshot-input-value" v-else>{{ form.category }}</text>
            <text class="snapshot-input-arrow">›</text>
          </view>
        </view>

        <!-- 紧急程度 -->
        <view class="snapshot-field">
          <view class="snapshot-field-head">
            <text><text class="required-star">*</text>紧急程度</text>
          </view>
          <view class="snapshot-input-button" @click="showPicker('level')">
            <text class="snapshot-input-placeholder" v-if="!form.level">请选择紧急程度</text>
            <text class="snapshot-input-value" v-else>{{ form.level }}</text>
            <text class="snapshot-input-arrow">›</text>
          </view>
        </view>

        <!-- 要求处理时间 -->
        <view class="snapshot-field">
          <view class="snapshot-field-head">
            <text>要求处理时间</text>
          </view>
          <view class="snapshot-due-row" :class="{ 'is-disabled': !form.level }">
            <input
              class="snapshot-due-input"
              v-model="form.dueDays"
              type="number"
              placeholder="请输入天数"
              :disabled="!form.level"
            />
            <text class="snapshot-due-suffix">天</text>
          </view>
        </view>

        <!-- 实际办结时间 -->
        <view class="snapshot-field">
          <view class="snapshot-field-head">
            <text>实际办结时间</text>
          </view>
          <view class="snapshot-input-readonly">
            <text class="snapshot-input-placeholder">{{ form.actualTime || '由处置单位填写' }}</text>
          </view>
        </view>

        <!-- 是否需要处置方案/联动处置 -->
        <view class="snapshot-field">
          <view class="snapshot-field-head">
            <text>是否需要处置方案/联动处置</text>
          </view>
          <view class="snapshot-segment-row">
            <view
              class="snapshot-segment-btn"
              :class="{ active: form.needPlan === '是' }"
              @click="form.needPlan = '是'"
            >
              <text>是</text>
            </view>
            <view
              class="snapshot-segment-btn"
              :class="{ active: form.needPlan === '否' }"
              @click="form.needPlan = '否'"
            >
              <text>否</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="create-bottom-spacer" />
    </scroll-view>

    <!-- 底部固定按钮 -->
    <view class="snapshot-sticky-footer">
      <view class="snapshot-footer-row">
        <view class="snapshot-footer-btn secondary" @click="goBack">
          <text>取消</text>
        </view>
        <view class="snapshot-footer-btn secondary" @click="handleSaveDraft">
          <text>保存草稿</text>
        </view>
        <view class="snapshot-footer-btn primary" @click="handleSubmit">
          <text>提交</text>
        </view>
      </view>
    </view>

    <!-- AI原稿对比弹窗 -->
    <AiDraftCompare
      v-model:visible="showCompare"
      :ai-draft-text="aiOriginalText"
      :current-text="form.description"
      field-name="description"
      @keep-current="onKeepCurrent"
      @restore-ai="onRestoreAi"
    />
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import FgNavbar from '@/components/fg-navbar/fg-navbar.vue'
import AiDraftCompare from './components/ai-draft-compare.vue'
import { toast } from '@/utils/toast'

// ==================== 表单数据 ====================
const form = reactive({
  description: '',
  section: '',
  area: '',
  category: '',
  categoryPath: [] as string[],
  level: '' as string,
  dueDays: '',
  actualTime: '',
  needPlan: '是' as string,
  source: '群众上报' as string,
  mediaFiles: [] as { name: string; url?: string }[],
  attachments: [] as { name: string; url?: string }[],
})

// ==================== AI相关状态 ====================
const mediaFiles = ref<Array<{ name: string; url?: string }>>([])
// AI草稿状态: '' | 'draft' | 'edited' | 'confirmed'
const aiDraftStatus = ref<'draft' | 'edited' | 'confirmed' | ''>('')
const aiOriginalText = ref('')
const showCompare = ref(false)

// Mock AI识别结果
const mockAiDescription = '经AI识别，该区域存在以下问题：\n1. 消防通道被杂物堵塞，占用面积约3平方米，存在严重安全隐患；\n2. 井盖破损严重，周围无警示标识，易造成行人跌落风险；\n3. 垃圾未及时清理，散发异味，影响周边环境卫生。\n\n建议：立即组织清理消防通道，修复井盖并设置警示牌，安排环卫人员定期清扫。'

// ==================== 方法 ====================
function goBack() {
  uni.navigateBack({
    fail() {
      uni.reLaunch({ url: '/pages/workbench/index' })
    },
  })
}

function handleUpload() {
  uni.showActionSheet({
    itemList: ['拍照', '从相册选择'],
    success: () => {
      const name = `现场影像-${mediaFiles.value.length + 1}.jpg`
      mediaFiles.value.push({ name })
    },
  })
}

function handleUploadAttachment() {
  toast.info('附件上传功能')
}

function handleAIRecognize() {
  uni.showLoading({ title: 'AI识别中...' })
  setTimeout(() => {
    uni.hideLoading()
    form.description = mockAiDescription
    aiOriginalText.value = mockAiDescription
    aiDraftStatus.value = 'draft'
    form.category = '安全隐患/消防通道堵塞'
    form.categoryPath = ['安全隐患', '消防通道堵塞']
    form.level = '紧急'
    form.section = '江汉路街道/民生路网格'
    toast.success('AI识别完成')
  }, 1500)
}

function showPicker(type: string) {
  const options: Record<string, string[]> = {
    section: ['江汉路街道/民生路网格', '江汉路社区/居民区网格', '循礼门社区/循礼门网格'],
    area: ['小区门口', '地铁口附近', '社区广场', '居民楼下', '施工现场', '主干道交叉口'],
    category: ['市容环境/垃圾暴露', '基础设施/井盖破损', '安全隐患/消防通道堵塞', '安全隐患/电线裸露'],
    level: ['一般', '较急', '紧急'],
  }
  const list = options[type] || []
  if (!list.length) return
  uni.showActionSheet({
    itemList: list,
    success: (res: any) => {
      const val = list[res.tapIndex]
      switch (type) {
        case 'section':
          form.section = val
          break
        case 'area':
          form.area = val
          break
        case 'category':
          form.category = val
          form.categoryPath = val.split('/')
          break
        case 'level':
          form.level = val
          break
      }
    },
  })
}

// 监听手动编辑，标记为人工已编辑
let aiInitiated = false
watch(
  () => form.description,
  (newVal) => {
    if (aiDraftStatus.value === 'draft' && aiOriginalText.value) {
      if (!aiInitiated) {
        aiInitiated = true
        return
      }
      if (newVal !== aiOriginalText.value) {
        aiDraftStatus.value = 'edited'
      } else {
        aiDraftStatus.value = 'draft'
      }
    }
  },
)

function handleSaveDraft() {
  toast.success('草稿已保存')
}

async function handleSubmit() {
  if (!form.description) {
    toast.warning('请输入事项描述')
    return
  }
  if (!form.section) {
    toast.warning('请选择社区/网格')
    return
  }
  if (!form.category) {
    toast.warning('请选择事项分类')
    return
  }
  if (!form.level) {
    toast.warning('请选择紧急程度')
    return
  }
  toast.success('提交成功')
  setTimeout(() => goBack(), 800)
}

// AI对比弹窗操作
function onKeepCurrent() {
  aiDraftStatus.value = 'edited'
}

function onRestoreAi() {
  form.description = aiOriginalText.value
  aiDraftStatus.value = 'draft'
  toast.success('已恢复 AI 原稿')
}
</script>

<style lang="scss" scoped>
/* ==================== 页面布局 ==================== */
.create-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f4f7fb;
}

.create-body {
  flex: 1;
  min-height: 0;
  padding: 14px 14px 0;
}

.create-bottom-spacer {
  height: 96px;
}

/* ==================== 表单卡片 ==================== */
.snapshot-section-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid rgba(22, 119, 255, 0.04);
  padding: 14px 12px 16px;
  margin-bottom: 12px;
  box-shadow: 0 6px 16px rgba(31, 35, 41, 0.035);
}

.snapshot-section-title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  color: #303642;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.35;
  margin-bottom: 12px;
}

.required-star {
  color: #ff4d4f;
}

.snapshot-section-ai-btn {
  flex-shrink: 0;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid rgba(22, 119, 255, 0.22);
  border-radius: 999px;
  background: #fff;
  color: #1677ff;
  font-size: 12px;
  font-weight: 800;
  line-height: 28px;
  white-space: nowrap;
}

/* ==================== 上传区域 ==================== */
.snapshot-upload-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex-wrap: wrap;
  min-height: 74px;
}

.snapshot-upload-tile {
  width: 82px;
  height: 82px;
  border: 1px solid #e2e7ef;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.snapshot-upload-tile-labeled {
  flex-direction: column;
  gap: 6px;
  color: #667085;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.3;
}

.snapshot-upload-tile-name {
  font-size: 10px;
  color: #667085;
  text-align: center;
  padding: 2px 4px;
  line-height: 1.2;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.snapshot-upload-tile-add {
  border-style: dashed;
  border-color: rgba(22, 119, 255, 0.28);
  background: #f8fbff;
  flex-direction: column;
  gap: 4px;
}

.snapshot-upload-plus {
  font-size: 28px;
  line-height: 1;
  color: #8b8f97;
}

.snapshot-upload-label {
  font-size: 11px;
  color: #1677ff;
  font-weight: 600;
}

/* 附件行 */
.snapshot-attachment-line {
  min-height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid #f0f2f5;
}

.snapshot-attachment-name {
  color: #303642;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.snapshot-attachment-name::before {
  content: "";
  width: 4px;
  height: 20px;
  border-radius: 8px;
  background: #1677ff;
  display: inline-block;
}

.snapshot-upload-link {
  border: none;
  background: transparent;
  color: #1677ff;
  font-size: 14px;
  font-weight: 700;
}

/* ==================== AI 状态栏 ==================== */
.snapshot-ai-field-status {
  min-height: 32px;
  margin-bottom: 6px;
  padding: 5px 8px 5px 10px;
  border: 1px solid #d7e6ff;
  border-radius: 8px;
  background: #f6faff;
  color: #475467;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  line-height: 1.35;
}

.snapshot-ai-field-status.is-edited {
  border-color: #fde2b8;
  background: #fffaf0;
}

.snapshot-ai-field-status.is-confirmed {
  border-color: #b7ebc6;
  background: #f6ffed;
}

.snapshot-ai-field-status-text {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
}

.snapshot-ai-field-status-tag {
  flex-shrink: 0;
  border-radius: 999px;
  background: #eaf3ff;
  color: #1677ff;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 900;
}

.is-edited .snapshot-ai-field-status-tag {
  background: #fff1d6;
  color: #b36b00;
}

.is-confirmed .snapshot-ai-field-status-tag {
  background: #d9f7be;
  color: #237804;
}

.snapshot-ai-field-status-info {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #475467;
}

.snapshot-ai-field-status-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.snapshot-ai-action-btn {
  min-height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid rgba(22, 119, 255, 0.16);
  background: #fff;
  color: #1677ff;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
  line-height: 24px;
}

/* ==================== 文本域 ==================== */
.snapshot-textarea-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}

.snapshot-textarea {
  width: 100%;
  min-height: 188px;
  max-height: 360px;
  border: 1px solid #e0e5ee;
  border-radius: 12px;
  background: #fff;
  color: #303642;
  padding: 14px;
  font-size: 14px;
  line-height: 1.6;
  box-sizing: border-box;
}

.snapshot-textarea.is-ai-draft {
  border-color: #8ec5ff;
  background: #fbfdff;
}

.snapshot-textarea.is-ai-human-edited {
  border-color: #f6b756;
  background: #fffdfa;
}

.snapshot-counter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #a5adba;
  font-size: 12px;
  margin-top: 6px;
  min-height: 32px;
  padding: 4px 8px 8px 12px;
}

.snapshot-clear {
  color: #303642;
  font-size: 12px;
}

/* ==================== 表单字段 ==================== */
.snapshot-field {
  margin-top: 14px;
}

.snapshot-field:first-child {
  margin-top: 0;
}

.snapshot-field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  color: #303642;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
}

.snapshot-input-button {
  min-height: 44px;
  width: 100%;
  border: 1px solid #dfe4ec;
  border-radius: 8px;
  background: #fff;
  color: #303642;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 12px;
  font-size: 14px;
}

.snapshot-input-placeholder {
  color: #c5cad3;
  font-size: 14px;
}

.snapshot-input-value {
  color: #0f172a;
  font-size: 14px;
  font-weight: 600;
}

.snapshot-input-arrow {
  color: #98a2b3;
  font-size: 20px;
  font-weight: 300;
}

/* 只读输入 */
.snapshot-input-readonly {
  min-height: 44px;
  width: 100%;
  border: 1px solid #dfe4ec;
  border-radius: 8px;
  background: #f5f6f8;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.snapshot-input-readonly .snapshot-input-placeholder {
  color: #c5cad3;
}

/* 处理天数行 */
.snapshot-due-row {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e0e5ee;
  border-radius: 8px;
  background: #fff;
  padding: 0 12px;
  min-height: 42px;
}

.snapshot-due-row.is-disabled {
  background: #f8fafc;
}

.snapshot-due-input {
  flex: 1;
  border: 0;
  background: transparent;
  color: #303642;
  font-size: 14px;
  min-height: 40px;
  padding: 0;
}

.snapshot-due-suffix {
  color: #667085;
  font-size: 14px;
  flex-shrink: 0;
}

/* ==================== Segment 切换 ==================== */
.snapshot-segment-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

.snapshot-segment-btn {
  flex: 1;
  height: 34px;
  border: 1px solid #d8e1ee;
  border-radius: 8px;
  background: #fff;
  color: #475467;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.snapshot-segment-btn.active {
  border-color: #1677ff;
  background: #eaf2ff;
  color: #1677ff;
}

/* ==================== 底部按钮 ==================== */
.snapshot-sticky-footer {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  background: linear-gradient(180deg, transparent, #f4f7fb 18%);
}

.snapshot-footer-row {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(22, 119, 255, 0.06);
  border-radius: 10px;
}

.snapshot-footer-btn {
  flex: 1;
  min-height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
}

.snapshot-footer-btn.secondary {
  border: 1px solid rgba(22, 119, 255, 0.18);
  background: #fff;
  color: #1677ff;
}

.snapshot-footer-btn.primary {
  background: #1677ff;
  color: #fff;
  border: none;
}
</style>
