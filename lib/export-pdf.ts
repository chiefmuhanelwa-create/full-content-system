export async function exportElementToPDF(elementId: string, filename: string) {
  const { default: jsPDF } = await import('jspdf')
  const { default: html2canvas } = await import('html2canvas')
  const el = document.getElementById(elementId)
  if (!el) return
  const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const w = pdf.internal.pageSize.getWidth()
  const h = (canvas.height * w) / canvas.width
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, h)
  pdf.save(filename)
}
