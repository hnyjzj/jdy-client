export const usePageShow = async (fn: () => void | boolean | Promise<boolean>) => {
  const { data: loading } = await useAsyncData(async () => {
    await fn()
    return true
  })
  return loading
}
