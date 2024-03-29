export const useNavigation = () => {
  const { models } = useSelectModel()
  const route = useRoute()

  const links = [{
    label: '引擎',
    icon: 'i-ph-engine-duotone',
    children: []
  }]

  // Engine group
  for (const modelName in models.Engine) {
    const Item = {
      label: modelName,
      icon: 'i-ph-engine-duotone',
      target: '_top',
      to: `/?model=${modelName}`,
      active: route.query.model ? route.query.model === modelName : modelName === 'Duramax' ? true : false
    }

    //@ts-ignore
    links[0].children?.push(Item)
  }

  return { links }
}
