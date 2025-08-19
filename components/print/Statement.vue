<template>
  <div>
    <div class="text-center text-[18px] font-semibold">
      销售报表
    </div>
    <div>
      <common-cell label="网点:xxxx名称" label-color="#000" value="收银员:全部" val-color="#000" />
      <common-cell label="品牌:xxx名称" label-color="#000" value="开始时间:2025-08-18 00:00:00" lcol="col-5" rcol="col-7" val-color="#000" />
      <common-cell label="打印人:xxxx名称" label-color="#000" value="结束时间:2025-08-18 00:00:00" lcol="col-5" rcol="col-7" val-color="#000" />
    </div>
    <div>
      <table class="w-full fixed-table">
        <thead>
          <tr>
            <th>汇总项</th>
            <th>分项</th>
            <th>收入</th>
            <th>支出</th>
            <th>实收</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>销售应收：0</td>
            <td>成品应收：0</td>
            <td>汇总：0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>销售退款：0</td>
            <td>成品件数：0</td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td>销售实收：0</td>
            <td>订金抵扣：0</td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td>其他收入：0</td>
            <td>旧料抵值：0</td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td>其他支出：0</td>
            <td>旧料件数：0</td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td>订金收入：0</td>
            <td>旧料金重：0</td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td>订金退款：0</td>
            <td>旧转成件数：0</td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td />
            <td>旧转成抵值：0</td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td />
            <td>旧转成金重：0</td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td />
            <td>配件金额：0</td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td />
            <td>配件件数：0</td>
            <td />
            <td />
            <td />
          </tr>
        </tbody>
      </table>
      <div class="row">
        <div class="flex">
          <div>成品</div>
          <div class="min-w-[20px]">
            {{ }}
          </div>
        </div>
        <div class="flex">
          <div>大类品类工艺</div>
          <div class="min-w-[20px]">
            {{ }}
          </div>
        </div>
        <div class="flex">
          <div>销售</div>
          <div class="min-w-[20px]">
            {{ }}
          </div>
        </div>
        <div class="flex">
          <div>标签价</div>
          <div class="min-w-[20px]">
            {{ }}
          </div>
        </div>
        <div class="flex">
          <div>金重</div>
          <div class="min-w-[20px]">
            {{ }}
          </div>
        </div>
        <div class="flex">
          <div>工费</div>
          <div class="min-w-[20px]">
            {{ }}
          </div>
        </div>
        <div class="flex">
          <div>件数</div>
          <div class="min-w-[20px]">
            {{ }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex">
          <div>成品(退货)</div>
          <div class="min-w-[20px]">
            {{ }}
          </div>
        </div>
        <div class="flex">
          <div>大类品类工艺</div>
          <div class="min-w-[20px]">
            {{ }}
          </div>
        </div>
        <div class="flex">
          <div>退货金额</div>
          <div class="min-w-[20px]">
            {{ }}
          </div>
        </div>
        <div class="flex">
          <div>标签价</div>
          <div class="min-w-[20px]">
            {{ }}
          </div>
        </div>
        <div class="flex">
          <div>金重</div>
          <div class="min-w-[20px]">
            {{ }}
          </div>
        </div>
        <div class="flex">
          <div>工费</div>
          <div class="min-w-[20px]">
            {{ }}
          </div>
        </div>
        <div class="flex">
          <div>件数</div>
          <div class="min-w-[20px]">
            {{ }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fixed-table {
  table-layout: fixed;
  border-collapse: collapse; // 关键：合并边框，去除间隙
  thead {
    tr {
      th {
        border-top: 1px solid #000;
        border-bottom: 1px solid #000;
      }
    }
  }
  th,
  td {
    text-align: center;
    padding: 6px 0;
    word-break: break-all;
  }
}
.row {
  display: flex;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  padding: 4px 0;
  margin-bottom: 20px;
}
</style>
