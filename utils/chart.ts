export function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function createPieTooltipConfig() {
  return {
    trigger: 'item',
    confine: true,
    formatter: (p: any) => {
      const name = escapeHtml(p.name)
      const value = escapeHtml(String(p.value))
      return `
        <div style="max-width:220px;white-space:normal;">
          <strong>${name}</strong><br/>
          数值：${value}<br/>
          占比：${p.percent}%
        </div>
      `
    },
  }
}
