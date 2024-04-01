export const useNavigation = () => {
  const { models } = useSelectModel()
  const { routeParams } = useRouteParams()
  const route = useRoute()
  const icons = useAppConfig().ui.icons

  const links = [{
    label: '引擎',
    icon: icons.engine,
    children: []
  }, {
    label: '汽车',
    icon: icons.automobile,
    children: []
  }, {
    label: '杂项',
    icon: icons.cube,
    children: []
  }]

  const getPreRouteParams = (modelName: string, params: Object) => {
    const routeString = []
    routeString.push(`model=${modelName}`)
    Object.keys(params).forEach((key: string) => {
      if (route.query[key] || route.query[key] === null) routeString.push(key)
    })
    return '?' + routeString.join('&')
  }

  Object.values(models).forEach((group, index) => {
    Object.keys(group).forEach((modelName) => {
      //@ts-ignore
      links[index].children.push({
        label: modelName,
        icon: group[modelName].icon || links[index].icon,
        to: getPreRouteParams(modelName, routeParams),
        target: '_top',
        active: route.query.model ? route.query.model === modelName : modelName === 'Duramax' ? true : false,
        badge: group[modelName].badge ? group[modelName].badge : undefined
      })
    })
  })

  return { links }
}
