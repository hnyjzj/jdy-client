interface WorkTabless {
  id?: number
  title?: string
  name?: string
  path?: string
  children?: WorkTabless[]
}

interface WorkTables {
  id: number
  title?: string
  name?: string
  path?: string
  children?: WorkTabless[]
}

type WorkTablesStatus = Record<number, boolean>
