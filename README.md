## 3D Models for [PacDocs](https://crybabyaq.love)
It's cool to add a 3D model to your own web personal project, but it also faces a memory leak caused by the 3D model, and the memory leak is a very painful thing for me, a rookie, and it can't be investigated at all. Looking at the document example of Three.js, I found that the force is embedded through `<iframe />`, so this 3D model project for iframe embedding was created by combining Nuxt and three.js.

## How to use 🔧
You can select the car engine model you want through routing parameters, whether to display the selection, full screen, and color mode buttons.

### Parameters include:

#### group (string) (Optional)
This parameter **doesn't need to be filled in!** The model parameter you input will automatically recognize its group.
- Engine (default)
- ...
- To be added

#### model (string) (!case-sensitive ⚠️)
- Duramax (default)
- AudiS8
- CarEngine1
- CarEngine2
- CarEngine3
- BugattiW16
- ChevroletCorvetteV8
- CumminsX15Truck
- DodgeChallengerV8
- FordMotorEngine
- IndustrialDiesel
- NissanAltimaHybrid4Cylinder
- V12CarEngine
- V8CarEngine

#### navigation (boolean) (case-insensitive)
This parameter determines whether to display the sidebar navigation.
- true (default)
- false

#### button (boolean) (case-insensitive)
This parameter determines whether to display the bottom buttons.
- true (default)
- false

## examples 📃
You can view the model by visiting the website directly.
[https://model.crybabyaq.love/?model=AudiS8&navigation=false&button=false](https://model.crybabyaq.love/?model=AudiS8&navigation=false&button=false)

Similarly, you can also embed it in your personal website or web project through `<iframe />`:
```html
<iframe
  width="100%"
  height="100%"
  src="https://model.crybabyaq.love/?model=audiS8&needDropdown=false&needBottomButton=false"
  title="Audi S8 V8 Engine"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;"
  style="color-scheme: light;"
/>
```

## Credits 💗
- [nuxt](https://github.com/nuxt/nuxt)
- [nuxt/ui](https://github.com/nuxt/ui)
- [three.js](https://github.com/mrdoob/three.js)

All car engine models are downloaded or purchased from [Sketchfab](https://sketchfab.com).

**Made with Love ❤️**

## LICENSE

[MIT](./LICENSE)

