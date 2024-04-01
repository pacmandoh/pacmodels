import type { LocationQueryValue } from 'vue-router'

export const useRouteParams = () => {
  const route = useRoute()

  const getParamsBoolean = (params: LocationQueryValue | LocationQueryValue[]) => {
    if (!params) {
      return params === null ? true : false
    } else {
      return params ? (params === 'false' ? false : true) : true
    }
  }
  const nobutton = getParamsBoolean(route.query.nobutton)
  const nozoom = getParamsBoolean(route.query.nozoom)
  const noshadow = getParamsBoolean(route.query.noshadow)

  return {
    nobutton,
    nozoom,
    noshadow
  }
}
