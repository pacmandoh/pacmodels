export const useNavigation = () => {
  const { models } = useSelectModel()
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

  Object.values(models).forEach((group, index) => {
    Object.keys(group).forEach((modelName) => {
      //@ts-ignore
      links[index].children.push({
        label: modelName,
        icon: group[modelName].icon || links[index].icon,
        to: `/?model=${modelName}`,
        target: '_top',
        active: route.query.model ? route.query.model === modelName : modelName === 'Duramax' ? true : false,
        badge: group[modelName].badge ? group[modelName].badge : undefined
      })
    })
  })

  return { links }
}
