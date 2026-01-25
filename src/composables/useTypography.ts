import { watch } from 'vue'
import { useAppStore } from '../stores/appStore'

type ReaderDensity = 'compact' | 'normal' | 'loose'

const DENSITY_PRESETS: Record<ReaderDensity, Record<string, string>> = {
  compact: {
    '--reader-line-height': '1.65',
    '--reader-paragraph-line-height': '1.75',
    '--reader-paragraph-gap': '1.1em',
    '--reader-h1-font-size': '2.0em',
    '--reader-h2-font-size': '1.45em',
    '--reader-h3-font-size': '1.22em',
    '--reader-h4-font-size': '1.05em',
    '--reader-h5-font-size': '0.98em',
    '--reader-h6-font-size': '0.92em',
    '--reader-code-font-size': '0.88em',
    '--reader-pre-code-font-size': '13px',
    '--reader-code-line-height': '1.45'
  },
  normal: {
    '--reader-line-height': '1.85',
    '--reader-paragraph-line-height': '1.9',
    '--reader-paragraph-gap': '1.6em',
    '--reader-h1-font-size': '2.2em',
    '--reader-h2-font-size': '1.6em',
    '--reader-h3-font-size': '1.3em',
    '--reader-h4-font-size': '1.1em',
    '--reader-h5-font-size': '1em',
    '--reader-h6-font-size': '0.95em',
    '--reader-code-font-size': '0.9em',
    '--reader-pre-code-font-size': '14px',
    '--reader-code-line-height': '1.5'
  },
  loose: {
    '--reader-line-height': '2.05',
    '--reader-paragraph-line-height': '2.15',
    '--reader-paragraph-gap': '1.9em',
    '--reader-h1-font-size': '2.35em',
    '--reader-h2-font-size': '1.7em',
    '--reader-h3-font-size': '1.38em',
    '--reader-h4-font-size': '1.16em',
    '--reader-h5-font-size': '1.03em',
    '--reader-h6-font-size': '0.98em',
    '--reader-code-font-size': '0.94em',
    '--reader-pre-code-font-size': '15px',
    '--reader-code-line-height': '1.55'
  }
}

export function useTypography() {
  const appStore = useAppStore()

  const applyDensity = (density: ReaderDensity) => {
    const root = document.documentElement
    const preset = DENSITY_PRESETS[density] || DENSITY_PRESETS.normal
    Object.entries(preset).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }

  const initTypography = () => {
    watch(
      () => appStore.userSettings.readerDensity,
      (density) => {
        const resolved = (density || 'normal') as ReaderDensity
        applyDensity(resolved in DENSITY_PRESETS ? resolved : 'normal')
      },
      { immediate: true }
    )
  }

  return {
    initTypography
  }
}

