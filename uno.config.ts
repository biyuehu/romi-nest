import { resolve } from 'node:path'
import { defineConfig, presetIcons, presetUno } from 'unocss'
import { presetRomiUI } from './ui/src/preset'

export default defineConfig({
  cli: {
    entry: {
      patterns: ['client/**/*.{html,ts}', 'ui/**/*.{html,ts}'],
      outFile: resolve(__dirname, 'ui/styles.css')
    }
  },
  presets: [presetUno(), presetIcons(), presetRomiUI()],
  rules: [[/^i-mdi.*$/, () => ({})]],
  transformers: [],
  theme: {
    colors: {
      'bg-page': 'var(--bg-page)', // body 背景，撑满全屏
      'bg-surface': 'var(--bg-surface)', // 文章卡片、侧边栏、主容器
      'bg-elevated': 'var(--bg-elevated)', // 代码块、blockquote、略凹陷区域
      'bg-subtle': 'var(--bg-subtle)', // 极淡填充，列表hover背景、分割区域

      // ── 文字层 ──────────────────────────────────────────
      // 对比度从高到低，越往下越"隐入"背景
      'text-base': 'var(--text-base)', // 标题、正文，最高对比
      'text-sub': 'var(--text-sub)', // 日期、描述、次要信息
      'text-muted': 'var(--text-muted)', // tag文字、placeholder、disabled
      'text-on-brand': 'var(--text-on-brand)', // 放在品牌色背景上的白字

      // ── 边框层 ──────────────────────────────────────────
      'border-base': 'var(--border)', // 通用边框、卡片描边、分割线
      'border-strong': 'var(--border-strong)', // 强调边框，表格header线等

      // ── 品牌色语义层 ────────────────────────────────────
      // 不要直接用 brand-500 这种色阶，用下面这些有含义的名字
      brand: 'var(--brand)', // 主按钮bg、文字链接色、激活态
      'brand-hover': 'var(--brand-hover)', // 上面那些的 :hover 态
      'brand-subtle': 'var(--brand-subtle)', // tag背景、高亮块背景（极淡品牌色）
      'brand-border': 'var(--brand-border)', // 引用块左边框、特殊分割线
      accent: 'var(--accent)', // 次要强调色，装饰、badge、特殊标注

      // ── 交互叠加层 ──────────────────────────────────────
      // 用于 hover/press 状态，叠在任意背景上都有效，不需要知道底色
      'hover-overlay': 'var(--hover-overlay)',
      'press-overlay': 'var(--press-overlay)',
      'primary-100': 'var(--brand-100)',
      'primary-200': 'var(--brand-200)',
      'primary-300': 'var(--brand-300)',
      'primary-400': 'var(--brand-400)',
      'primary-500': 'var(--brand-500)',
      'primary-600': 'var(--brand-600)',
      'primary-700': 'var(--brand-700)',
      'primary-800': 'var(--brand-800)',
      'primary-900': 'var(--brand-900)',
      'accent-100': 'var(--accent-100)',
      'accent-200': 'var(--accent-200)',
      'accent-300': 'var(--accent-300)',
      'accent-400': 'var(--accent-400)',
      'accent-500': 'var(--accent-500)',
      'accent-600': 'var(--accent-600)',
      'accent-700': 'var(--accent-700)',
      'accent-800': 'var(--accent-800)',
      'accent-900': 'var(--accent-900)'

      // 'text-100': 'var(--text-100)',
      // 'text-200': 'var(--text-200)',
      // 'text-300': 'var(--text-300)',
      // 'bg-100': 'var(--bg-100)',
      // 'bg-200': 'var(--bg-200)',
      // 'bg-300': 'var(--bg-300)'
    },
    shortcuts: {
      'card-shadow': ''
    }
  }
})
