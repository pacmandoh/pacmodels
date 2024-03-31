export default defineAppConfig({
  // appconfig
  ui: {
    primary: 'sky',
    gray: 'zinc',
    notifications: {
      // Show toasts at the top right of the screen
      position: 'top-0 bottom-auto'
    },
    variables: {
      light: {
        background: '255 255 255',
        foreground: 'var(--color-gray-700)'
      },
      dark: {
        background: 'var(--color-gray-900)',
        foreground: 'var(--color-gray-200)'
      },
      header: {
        height: '4rem'
      }
    },
    icons: {
      dark: 'i-heroicons-moon-20-solid',
      light: 'i-heroicons-sun-20-solid',
      system: 'i-heroicons-computer-desktop-20-solid',
      search: 'i-heroicons-magnifying-glass-20-solid',
      external: 'i-heroicons-arrow-up-right-20-solid',
      chevron: 'i-heroicons-chevron-down-20-solid',
      hash: 'i-heroicons-hashtag-20-solid',
      menu: 'i-heroicons-bars-3-20-solid',
      close: 'i-heroicons-x-mark-20-solid',
      check: 'i-heroicons-check-circle-20-solid',
      engine: 'i-ph-engine-duotone',
      automobile: 'i-ph-car-profile-duotone',
      gm: 'i-simple-icons-generalmotors',
      chevrolet: 'i-simple-icons-chevrolet',
      bugatti: 'i-simple-icons-bugatti',
      audi: 'i-simple-icons-audi',
      ford: 'i-simple-icons-ford',
      nissan: 'i-simple-icons-nissan',
      dodge: 'i-cbi-dodge',
      astonmartin: 'i-simple-icons-astonmartin',
      batman: 'i-carbon-bat',
      landrover: 'i-simple-icons-landrover',
      cube: 'i-ph-cube-duotone'
    },
    presets: {
      button: {
        primary: {
          color: 'white',
          variant: 'solid'
        },
        secondary: {
          color: 'gray',
          variant: 'ghost'
        },
        input: {
          color: 'white',
          variant: 'outline',
          ui: {
            font: '',
            color: {
              white: {
                outline: 'ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:ring-gray-300 dark:hover:ring-gray-700 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400'
              }
            }
          }
        }
      }
    }
  }
})
