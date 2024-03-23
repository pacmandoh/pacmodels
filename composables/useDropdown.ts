export const useDropdown = () => {
  const { models } = useSelectModel()
  const route = useRoute()

  const dropdownItems = [
    [],
    [{
      label: 'PacDocs',
      icon: 'i-heroicons-cursor-arrow-rays-16-solid',
      target: '_blank',
      to: 'https://crybabyaq.love'
    }]
  ]
  for (const modelName in models) {
    const dropdownItem = {
      label: modelName,
      icon: 'i-ph-engine-duotone',
      target: '_top',
      to: `/?model=${modelName}`,
      disabled: route.query.model ? route.query.model === modelName : modelName === 'duramax' ? true : false
    }

    dropdownItems[0].unshift(dropdownItem)
  }

  return { dropdownItems }
}
