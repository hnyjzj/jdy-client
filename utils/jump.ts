/**
 * 路由跳转
 * @param path 路由地址
 * @param pamars 路由参数
 */
export default async function (path: string, pamars: { [key: string]: any } = {}) {
  await navigateTo({
    path,
    query: { ...pamars },
  })
}
