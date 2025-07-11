<script setup lang="ts">
const props = defineProps<{
  /**
   * 订单详情
   */
  details?: Partial<OrderInfo>
  /**
   * 打印模板
   */
  numerical: Partial<PrintTemplate>
  /**
   * 打印单类型
   */
  type?: number
  /**
   * 支付方式
   */
  payMethod?: string
}>()

const intercepting = () => {
  if (props.details?.created_at) {
    const originalString = props.details.created_at
    const formattedString = originalString.split('T')[0]
    return formattedString
  }
  else {
    return '订单日期'
  }
}

const hasFinished = ref(false)
const hasOld = ref(false)
const hasAccessorie = ref(false)
const majorSalesman = ref('')

const findSalesman = () => {
  if (props.details?.clerks) {
    for (let i = 0; i < props.details?.clerks.length; i++) {
      if (props.details?.clerks[i].is_main) {
        // 销售员没有昵称会被赋值为'''
        majorSalesman.value = props.details?.clerks[i].salesman?.nickname || ''
        break
      }
    }
  }
}

const judgeType = () => {
  if (props.details) {
    // 判断该订单是否有成品、旧料、配件
    props.details?.products?.forEach((item) => {
      if (item.type === 1) {
        hasFinished.value = true
      }
      else if (item.type === 2) {
        hasOld.value = true
      }
      else if (item.type === 3) {
        hasAccessorie.value = true
      }
    })
  }
}

findSalesman()
judgeType()
</script>

<template>
  <div
    class="print"
    :style="{
      '--size-width': `${props.numerical.config?.size.width}mm`,
      '--size-height': `${props.numerical.config?.size.height}mm`,
      '--size-font-size': `${props.numerical.config?.size.fontSize}mm`,

      '--base-top': `${props.numerical.config?.base.top}mm`,
      '--base-width': `${props.numerical.config?.base.width}mm`,
      '--base-right': `${props.numerical.config?.base.right}mm`,

      '--phone-top': `${props.numerical.config?.phone.top}mm`,
      '--phone-right': `${props.numerical.config?.phone.right}mm`,

      '--list-left': `${props.numerical.config?.list.left}mm`,
      '--list-top': `${props.numerical.config?.list.top}mm`,
      '--list-right': `${props.numerical.config?.list.right}mm`,
      '--list-height': `${props.numerical.config?.list.height}mm`,

      '--total-top': `${props.numerical.config?.total.top}mm`,
      '--total-right': `${props.numerical.config?.total.right}mm`,

      '--more-bottom': `${props.numerical.config?.more.bottom}mm`,
      '--more-right': `${props.numerical.config?.more.right}mm`,
      '--more-left': `${props.numerical.config?.more.left}mm`,
    }">
    <div class="base">
      <div
        class="default-presence flex flex-col gap-[1mm]">
        <div>
          {{ props.details?.store?.name || '门店名称' }}
        </div>

        <div>
          {{ intercepting() }}
        </div>

        <div>
          {{ props.details?.id || '销售单号' }}
        </div>
      </div>
    </div>

    <div class="phone">
      - -
    </div>

    <div class="form">
      <!-- 销售打印单字段 -->
      <template v-if="props.type === 1">
        <div class="flex flex-col gap-[16px] p-[40px]">
          <template v-if="hasFinished || !props.details">
            <table cellspacing="0" class="table-header" style="width: 100%;">
              <thead>
                <tr>
                  <th class="table-header" style="width: 16%;">
                    条码
                  </th>
                  <th class="table-header" style="width: 12%;">
                    名称
                  </th>
                  <th class="table-header" style="width: 12%;">
                    金重
                  </th>
                  <th class="table-header" style="width: 12%;">
                    金价
                  </th>
                  <th class="table-header" style="width: auto;">
                    工费
                  </th>
                  <th class="table-header" style="width: 12%;">
                    证书号
                  </th>
                  <th class="table-header" style="width: 12%;">
                    单价
                  </th>
                  <th class="table-header" style="width: 16%;">
                    应付金额
                  </th>
                </tr>
              </thead>
              <template v-if="props.details">
                <tbody>
                  <tr v-for="(item, index) in props.details.products" :key="index">
                    <template v-if="item.type === 1">
                      <td class="table-body">
                        {{ item.finished.product?.code || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.finished.product?.name || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.finished.product?.weight_metal || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.finished.price_gold || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.finished.labor_fee || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.finished.product?.certificate?.[0] || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.finished.product?.label_price || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.finished.price || '' }}
                      </td>
                    </template>
                  </tr>
                </tbody>
              </template>
            </table>
          </template>

          <template v-if="hasOld || !props.details">
            <table cellspacing="0" class="table-header" style="width: 100%;">
              <thead>
                <tr>
                  <th class="table-header" style=" width:16%;">
                    原条码
                  </th>
                  <th class="table-header" style=" width:16%;">
                    旧料名称
                  </th>
                  <th class="table-header" style=" width:12%;">
                    金重
                  </th>
                  <th class="table-header" style=" width:12%;">
                    回收金价
                  </th>
                  <th class="table-header" style=" width:auto;">
                    工费
                  </th>
                  <th class="table-header" style=" width:12%;">
                    原单价
                  </th>
                  <th class="table-header" style=" width:16%;">
                    旧料抵值
                  </th>
                </tr>
              </thead>
              <template v-if="props.details">
                <tbody>
                  <tr v-for="(item, index) in props.details.products" :key="index">
                    <template v-if="item.type === 2">
                      <td class="table-body">
                        {{ item.old.product?.code || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.old.product?.name || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.old.product?.weight_metal || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.old.recycle_price_gold || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.old.recycle_price_labor || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.old.product?.label_price || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.old.product?.recycle_price || '' }}
                      </td>
                    </template>
                  </tr>
                </tbody>
              </template>
            </table>
          </template>

          <template v-if="hasAccessorie || !props.details">
            <table cellspacing="0" class="table-header" style="width:100%;">
              <thead>
                <tr>
                  <th class="table-header" style="width:16%;">
                    配件条码
                  </th>
                  <th class="table-header" style="width:16%;">
                    配料名称
                  </th>
                  <th class="table-header" style="width:auto;">
                    数量
                  </th>
                  <th class="table-header" style="width:16%;">
                    单价
                  </th>
                  <th class="table-header" style="width:auto;">
                    总计金额
                  </th>
                  <th class="table-header" style="width:16%;">
                    应收金额
                  </th>
                </tr>
              </thead>
              <template v-if="props.details">
                <tbody>
                  <tr v-for="(item, index) in props.details.products" :key="index">
                    <template v-if="item.type === 3">
                      <td class="table-body">
                        {{ item.accessorie.product?.category.code || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.accessorie.product?.category.name || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.accessorie.quantity || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.accessorie.product?.category.label_price || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.accessorie.price || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.accessorie.price || '' }}
                      </td>
                    </template>
                  </tr>
                </tbody>
              </template>
            </table>
          </template>
        </div>
      </template>

      <!-- 退货打印单字段 -->
      <template v-else-if="props.type === 2">
        <div class="flex flex-col gap-[1mm]">
          <template v-if="hasFinished || !props.details">
            <table cellspacing="0" class="table-header" style="width: 100%;">
              <thead>
                <tr>
                  <th class="table-header" style="width: 16%;">
                    条码
                  </th>
                  <th class="table-header" style="width: 16%;">
                    名称
                  </th>
                  <th class="table-header" style="width: 12%;">
                    金重
                  </th>
                  <th class="table-header" style="width: 16%;">
                    金价/单价
                  </th>
                  <th class="table-header" style="width: auto;">
                    工费
                  </th>
                  <th class="table-header" style="width: 16%;">
                    证书号
                  </th>
                  <th class="table-header" style="width: 16%;">
                    退款金额
                  </th>
                </tr>
              </thead>
              <template v-if="props.details">
                <tbody>
                  <tr v-for="(item, index) in props.details.products" :key="index">
                    <template v-if="item.type === 1">
                      <td class="table-body">
                        {{ item.finished.product?.code || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.finished.product?.name || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.finished.product?.weight_metal || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.finished.price_gold || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.finished.labor_fee || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.finished.product?.certificate?.[0] || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.finished.price || '' }}
                      </td>
                    </template>
                  </tr>
                </tbody>
              </template>
            </table>
          </template>

          <template v-if="hasOld || !props.details">
            <table cellspacing="0" class="table-header" style="width: 100%;">
              <thead>
                <tr>
                  <th class="table-header" style=" width:16%;">
                    原条码
                  </th>
                  <th class="table-header" style=" width:16%;">
                    旧料名称
                  </th>
                  <th class="table-header" style=" width:12%;">
                    金重
                  </th>
                  <th class="table-header" style=" width:16%;">
                    回收金价/原单价
                  </th>
                  <th class="table-header" style=" width:auto;">
                    回收工费
                  </th>
                  <th class="table-header" style=" width:16%;">
                    旧料抵值
                  </th>
                </tr>
              </thead>
              <template v-if="props.details">
                <tbody>
                  <tr v-for="(item, index) in props.details.products" :key="index">
                    <template v-if="item.type === 2">
                      <td class="table-body">
                        {{ item.old.product?.code || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.old.product?.name || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.old.product?.weight_metal || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.old.recycle_price_gold || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.old.recycle_price_labor || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.old.product?.recycle_price || '' }}
                      </td>
                    </template>
                  </tr>
                </tbody>
              </template>
            </table>
          </template>

          <template v-if="hasAccessorie || !props.details">
            <table cellspacing="0" class="table-header" style="width:100%;">
              <thead>
                <tr>
                  <th class="table-header" style="width:16%;">
                    配料名称
                  </th>
                  <th class="table-header" style="width:auto;">
                    单价
                  </th>
                  <th class="table-header" style="width:auto;">
                    总计金额
                  </th>
                  <th class="table-header" style="width:16%;">
                    退款金额
                  </th>
                </tr>
              </thead>
              <template v-if="props.details">
                <tbody>
                  <tr v-for="(item, index) in props.details.products" :key="index">
                    <template v-if="item.type === 3">
                      <td class="table-body">
                        {{ item.accessorie.product?.name || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.accessorie.product?.category.label_price || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.accessorie.price || '' }}
                      </td>
                      <td class="table-body">
                        {{ item.accessorie.price || '' }}
                      </td>
                    </template>
                  </tr>
                </tbody>
              </template>
            </table>
          </template>
        </div>
      </template>
    </div>

    <div class="total">
      <div>
        {{ props.details?.price || '实收/实付' }}
      </div>
    </div>

    <div class="bottom">
      <div>
        {{ props.payMethod || '付款方式' }}
      </div>

      <div>
        {{ majorSalesman || '开票人' }}
      </div>

      <div>
        {{ props.details?.member?.name || '顾客姓名' }}
      </div>

      <div>
        {{ props.details?.member?.phone || '顾客电话' }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@media print {
  *,
  html,
  body {
    padding: 0;
    margin: 0;
  }
}

.print {
  position: relative;
  width: var(--size-width);
  height: var(--size-height);
  font-size: var(--size-font-size);

  .base {
    position: absolute;
    font-size: var(--size-font-size);

    width: var(--base-width);
    top: var(--base-top);
    right: var(--base-right);

    div {
      width: 100%;
      margin-bottom: 3.5mm;
      word-break: break-all;
    }
  }

  .phone {
    position: absolute;
    font-size: var(--size-font-size);

    top: var(--phone-top);
    right: var(--phone-right);
  }

  .form {
    position: absolute;
    height: var(--list-height);
    top: var(--list-top);
    right: var(--list-right);
    left: var(--list-left);
    font-size: var(--size-font-size);

    .table-header {
      padding: 1mm 0;
      line-height: 1;
      text-align: left;
      font-weight: bold;
      font-size: 3mm;
      overflow-wrap: break-word;
      word-break: break-all;
    }

    .table-body {
      padding: 1mm 0;
      text-align: left;
      line-height: 1;
      height: auto;
      font-size: 3mm;
      font-weight: normal;
      overflow-wrap: break-word;
      word-break: break-all;
      border-top: none;
    }
  }

  .total {
    position: absolute;
    font-size: var(--size-font-size);

    top: var(--total-top);
    right: var(--total-right);
  }

  .bottom {
    position: absolute;
    font-size: var(--size-font-size);

    bottom: var(--more-bottom);
    right: var(--more-right);
    left: var(--more-left);

    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
