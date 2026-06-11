<template>
    <view class="wb-page">
        <!-- 顶部蓝色头部 -->
        <view class="wb-hero">
            <view class="wb-hero-top">
                <view class="wb-hero-left">
                    <view class="wb-date">今日随手拍</view>
                    <view class="wb-location">{{ currentAreaName }}</view>
                    <view class="wb-switch-btn" @click="showAreaPicker = true">
                        <image src="/static/svg/project.svg" class="wb-switch-icon" mode="aspectFit" />
                        <text class="wb-switch-text">{{ currentAreaLabel }}</text>
                        <text class="wb-switch-arrow">切换</text>
                    </view>
                </view>
                <view class="wb-hero-right">
                    <view class="wb-bell" @click="goMessages">
                        <image src="/static/svg/notice.svg" class="wb-bell-icon" mode="aspectFit" />
                        <view v-if="hasNotice" class="wb-bell-dot" />
                    </view>
                </view>
            </view>
        </view>

        <!-- 区域选择弹窗 -->
        <FgAreaPicker :visible="showAreaPicker" :current="currentArea" @close="showAreaPicker = false"
            @confirm="onAreaConfirm" />

        <!-- 可滚动内容区 -->
        <scroll-view class="wb-scroll" scroll-y enhanced :show-scrollbar="false">
            <!-- 总览卡片 -->
            <view class="wb-card">
            <view class="wb-card-head">
                <view>
                    <view class="wb-kicker">{{ currentAreaLabel }} · 随手拍处理</view>
                    <view class="wb-title">随手拍处理总览</view>
                </view>
                <view class="wb-status-pill">有风险</view>
            </view>
            <view class="wb-metrics">
                <view class="wb-metric" v-for="m in metrics" :key="m.label">
                    <text class="metric-label">{{ m.label }}</text>
                    <text class="metric-value">{{ m.value }}</text>
                </view>
            </view>
            <view class="focus-content">
                <view class="focus-head">
                    <text class="focus-title">最近先处理</text>
                    <text class="focus-priority-tag">超期优先</text>
                </view>
                <view class="focus-item">
                    <view class="focus-meta">
                        <text class="focus-title-text">{{ focusItem.title }}</text>
                    </view>
                    <view class="focus-tags">
                        <text class="focus-tag" v-for="t in focusItem.tags" :key="t">{{ t }}</text>
                    </view>
                    <view class="focus-actions">
                        <button class="wb-btn wb-btn-primary wb-btn-sm" @click="goDetail(focusItem.id)">立即处理</button>
                        <button class="wb-btn wb-btn-ghost wb-btn-sm" @click="goLedger">查看全部</button>
                    </view>
                </view>
            </view>
        </view>

        <!-- 今日处理建议 -->
        <view class="wb-card">
            <view class="section-head">
                <text class="section-title">今日处理建议</text>
                <text class="section-note">按风险优先</text>
            </view>
            <view class="advice-list">
                <view class="advice-row" :class="item.tone" v-for="item in advices" :key="item.title" @click="goLedger">
                    <view class="advice-copy">
                        <text class="advice-title">{{ item.title }}</text>
                        <text class="advice-desc">{{ item.desc }}</text>
                    </view>
                    <view class="advice-side">
                        <text class="advice-badge" :class="item.tone">{{ item.count }}</text>
                        <text class="advice-link">{{ item.action }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 治理热区 -->
        <view class="wb-card">
            <view class="section-head">
                <text class="section-title">治理热区</text>
                <text class="section-note">{{ hotspots.length ? '按风险集中度' : '暂无热区' }}</text>
            </view>
            <view class="hotspot-list">
                <view class="hotspot-card" v-for="item in hotspots" :key="item.name" @click="goLedger">
                    <view class="hotspot-main">
                        <text class="hotspot-title">{{ item.name }}</text>
                        <text class="hotspot-meta">{{ item.meta }}</text>
                        <view class="hotspot-tags">
                            <text v-if="item.overdue" class="hotspot-tag is-danger">超期 {{ item.overdue }}</text>
                            <text v-if="item.rejected" class="hotspot-tag is-danger">驳回 {{ item.rejected }}</text>
                            <text class="hotspot-tag">共 {{ item.count }} 条</text>
                        </view>
                    </view>
                    <view class="hotspot-count">{{ item.count }}</view>
                </view>
            </view>
            </view>
        </scroll-view>

        <!-- 底部安全区 -->
        <view class="wb-safe-bottom" />
    </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FgAreaPicker from './components/fg-area-picker/fg-area-picker.vue'

const showAreaPicker = ref(false)
const currentArea = ref('jianghanlushequ')
const hasNotice = ref(true)

const currentAreaLabel = computed(() => {
    const map: Record<string, string> = {
        minshenglu: '民生路社区',
        jianghanlushequ: '江汉路社区',
        buxingjie: '步行街网格',
        xunlimenwg: '循礼门网格',
        shangquanwg: '商圈网格',
    }
    return map[currentArea.value] || '江汉路社区'
})

const currentAreaName = computed(() => {
    return `${currentAreaLabel.value} · 网格治理岗`
})

function onAreaConfirm(value: string) {
    currentArea.value = value
    showAreaPicker.value = false
}

const metrics = ref([
    { label: '待我处理', value: 6 },
    { label: '风险事项', value: 2 },
    { label: '今日新增', value: 6 },
])

const focusItem = ref({
    title: '随手拍驳回-飞线充电-004',
    tags: ['SSP-004', '已驳回', '已超期','民生路社区 / 民生路网络 / 三号线外侧'],
    id: 'SSP-004',
})

const advices = ref([
    { title: '先处理超期事项', desc: '有 2 条已超期，需要优先进入处理。', count: 2, action: '查看超期', tone: 'is-danger' },
    { title: '清理驳回事项', desc: '有 1 条驳回相关随手拍，建议当天明确处理口径。', count: 1, action: '查看驳回', tone: 'is-warning' },
    { title: '复核队列尽快清掉', desc: '有 2 条等待复核，避免处理完成后滞留。', count: 2, action: '查看复核', tone: '' },
])

const hotspots = ref([
    {
        name: '民生路社区',
        meta: '民生路网格 · 高频类型：飞线充电',
        overdue: 1,
        rejected: 1,
        count: 1,
    },
    {
        name: '循礼门社区',
        meta: '循礼门网格 · 高频类型：通道占用',
        overdue: 1,
        rejected: 1,
        count: 2,
    },
])

function goLedger(tab?: string) {
    const url = tab ? `/pages/ledger/index?tab=${tab}` : '/pages/ledger/index'
    uni.navigateTo({ url })
}
function goDetail(id: string) {
    uni.navigateTo({ url: `/pages/detail/index?id=${id}` })
}
function goMessages() {
    uni.navigateTo({ url: '/pages/messages/index' })
}
</script>

<style lang="scss" scoped>
.wb-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.wb-scroll {
    flex: 1;
    min-height: 0;
    padding-bottom: 24px;
    background: linear-gradient(180deg, #2f86f8 0%, #6aaaf7 104px, #eef5ff 104px, #f4f7fb 220px, #f4f7fb 100%);
}


.wb-hero {
    background: linear-gradient(180deg, #1768dc 0%, #2478f6 58%, #2f86f8 100%);
    box-shadow: 0 10px 24px rgba(23, 104, 220, 0.16);
    flex-shrink: 0;
    padding: 54px 20px 24px;
    color: #fff;
}

.wb-hero-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}

.wb-date {
    font-size: 22px;
    font-weight: 900;
    margin-bottom: 6px;
}

.wb-location {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.78);
    margin-bottom: 10px;
}

.wb-switch-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 30px;
    padding: 0 10px;
    background: rgba(255, 255, 255, 0.16);
    border: 1px solid rgba(255, 255, 255, 0.24);
    border-radius: 15px;
    color: #fff;
}

.wb-switch-icon {
    width: 14px;
    height: 14px;
}

.wb-switch-text {
    font-size: 12px;
    font-weight: 700;
}

.wb-switch-arrow {
    font-size: 10px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
}

.wb-bell {
    position: relative;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
}

.wb-bell-icon {
    width: 20px;
    height: 20px;
}

.wb-bell-dot {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
}

/* 卡片通用 */
.wb-card {
    margin: 10px 14px;
    padding: 16px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}

/* 总览卡片 */
.wb-card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.wb-kicker {
    font-size: 12px;
    color: #667085;
    font-weight: 700;
}

.wb-title {
    margin-top: 2px;
    font-size: 18px;
    color: #101828;
    font-weight: 900;
}

.wb-status-pill {
    height: 26px;
    padding: 0 10px;
    border-radius: 8px;
    background: #eef5ff;
    color: #1677ff;
    font-size: 11px;
    font-weight: 800;
    display: flex;
    align-items: center;
}

.wb-metrics {
    display: flex;
    gap: 8px;
    margin-top: 14px;
}

.wb-metric {
    padding: 10px 8px;
    border-radius: 8px;
    width: 100%;
    background: #f8fbff;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(23, 104, 220, 0.08);
}

.metric-label {
    font-size: 11px;
    color: #667085;
    font-weight: 700;
}

.metric-value {
    font-size: 16px;
    color: #1677ff;
    font-weight: 900;
}

.focus-content {
    margin-top: 12px;
    padding: 12px;
    border-radius: 8px;
    background: linear-gradient(180deg, #f7fbff 0%, #f1f6ff 100%);
    border: 1px solid #dbeafe;
}

.focus-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.focus-title {
    font-size: 12px;
    font-weight: 700;
    color: #1677ff;
}

.focus-priority-tag {
    font-size: 10px;
    font-weight: 700;
    color: #ef4444;
    background: #fef2f2;
    border: 1px solid #fecaca;
    padding: 2px 8px;
    border-radius: 4px;
}


.focus-title-text {
    display: block;
    font-size: 14px;
    font-weight: 800;
    color: #101828;
    margin-bottom: 8px;
}

.focus-tags {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    flex-wrap: wrap;
}

.focus-tag {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    padding: 0 8px;
    border-radius: 8px;
    background: #fff;
    color: #475467;
    border: 1px solid rgba(23, 104, 220, 0.10);
    font-size: 11px;
    font-weight: 800;
    line-height: 1;
}

.focus-location {
    font-size: 11px;
    color: #8a94a6;
    margin-bottom: 10px;
    line-height: 1.4;
}

.focus-actions {
    display: flex;
    gap: 8px;
}

.wb-btn {
    flex: 1;
    padding: 0 14px;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
}

.wb-btn-primary {
    background: #1677ff;
    color: #fff;
}

.wb-btn-ghost {
    background: #fff;
    color: #475467;
    border: 1px solid #e6ebf2;
}

/* 区块头 */
.section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.section-title {
    font-size: 15px;
    font-weight: 900;
    color: #101828;
}

.section-note {
    font-size: 11px;
    color: #8a94a6;
    font-weight: 600;
}

/* 建议列表 */
.advice-list {
    display: grid;
    gap: 8px;
}

.advice-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 12px 14px;
    border-radius: 8px;
    background: #fff;
    border: 1px solid rgba(23, 104, 220, 0.08);
}

.advice-copy {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: 4px;
}

.advice-title {
    display: block;
    font-size: 14px;
    color: #101828;
    font-weight: 800;
    line-height: 1.35;
}

.advice-desc {
    display: block;
    font-size: 12px;
    color: #667085;
    line-height: 1.45;
}

.advice-side {
    flex-shrink: 0;
    display: grid;
    gap: 6px;
    justify-items: end;
    margin-left: 10px;
}

.advice-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    min-height: 24px;
    padding: 0 7px;
    border-radius: 999px;
    background: #e8f3ff;
    color: #1677ff;
    font-size: 13px;
    font-weight: 900;
    line-height: 1;
}

.advice-badge.tone-red {
    background: #fff1f0;
    color: #dc2626;
}

.advice-badge.tone-orange {
    background: #fff7e6;
    color: #d46b08;
}

.advice-badge.tone-blue {
    background: #e8f3ff;
    color: #1677ff;
}

.advice-link {
    display: block;
    font-size: 12px;
    color: #1677ff;
    font-weight: 700;
}

/* 治理热区 */
.hotspot-list {
    display: grid;
    gap: 8px;
}

.hotspot-card {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
    align-items: center;
    padding: 11px 12px;
    border-radius: 8px;
    background: #fff;
    border: 1px solid rgba(23, 104, 220, 0.08);
}

.hotspot-main {
    min-width: 0;
}

.hotspot-title {
    color: #101828;
    font-size: 14px;
    font-weight: 900;
    line-height: 1.35;
}

.hotspot-meta {
    display: block;
    margin-top: 3px;
    color: #667085;
    font-size: 11px;
    font-weight: 800;
    line-height: 1.4;
}

.hotspot-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
}

.hotspot-tag {
    min-height: 22px;
    display: inline-flex;
    align-items: center;
    padding: 0 7px;
    border-radius: 8px;
    background: #f1f6ff;
    color: #1768dc;
    font-size: 11px;
    font-weight: 900;
}

.hotspot-tag.is-danger {
    background: #fff1f0;
    color: #dc2626;
}

.hotspot-count {
    min-width: 46px;
    min-height: 46px;
    display: grid;
    place-items: center;
    border-radius: 8px;
    background: #f8fbff;
    color: #1768dc;
    font-size: 18px;
    font-weight: 900;
}

/* 底部安全区 */
.wb-safe-bottom {
    flex-shrink: 0;
    height: 24px;
}
</style>
