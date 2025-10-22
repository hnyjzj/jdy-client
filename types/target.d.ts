interface Target {
  category: number
  class: number
  craft: number
  end_time: string
  gem: number
  id: string
  is_default: boolean
  material: number
  method: number
  name: string
  object: number
  quality: number
  scope: number
  start_time: string
  store_id: string
  store: Stores
}

interface TargetGroup {
  name: string
  created_at: string
  id: string
  target_id: string
  update_at: string
}

interface TargetPersonal {
  created_at: string
  update_at: string
  group: TargetGroup
  id: string
  group_id: string
  /**
   * 是否组长
   */
  is_leader: boolean
  /** 目标 */
  purpose: string
  /** 员工 */
  staff: Staff
  staff_id: Staff['id']
  target_id: string
}

interface TargetInfo {
  category: number
  class: number
  craft: number
  end_time: string
  gem: number
  id: string
  is_default: boolean
  material: number
  method: number
  name: string
  object: number
  quality: number
  scope: number
  start_time: string
  store_id: string
  store: Stores
  groups: TargetGroup[]
  personals: TargetPersonal[]
}
