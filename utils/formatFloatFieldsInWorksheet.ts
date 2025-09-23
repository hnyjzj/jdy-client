import * as XLSX from 'xlsx'

export function formatFloatFieldsInWorksheet(
  worksheet: XLSX.WorkSheet,
  aoaData: any[][],
  fieldOrder: string[],
  fields: { name: string, preset?: Record<any, string>, type?: string }[],
) {
  const floatFields = fields
    .filter(field => field.type === 'float')
    .map(field => field.name)

  aoaData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const fieldName = fieldOrder[colIndex]
      if (floatFields.includes(fieldName) && rowIndex > 0) { // Skip header row
        const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })
        if (!worksheet[cellRef])
          worksheet[cellRef] = { v: cell }
        worksheet[cellRef].t = 'n'
        if (typeof cell === 'string' && cell !== '') {
          const parsed = Number.parseFloat(cell)
          if (!Number.isNaN(parsed)) {
            worksheet[cellRef].v = parsed
          }
        }
      }
    })
  })
}
