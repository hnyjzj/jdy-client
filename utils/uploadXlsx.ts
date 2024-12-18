import * as XLSX from 'xlsx'

export const uploadXlsx = (event: any): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        resolve(sheetData)
      }
      catch (error) {
        reject(new Error(error as string))
      }
    }
    reader.readAsArrayBuffer(file as File)
  })
}
