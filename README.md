## 3D Models for [PacDocs](https://crybabyaq.love)
It's cool to add a 3D model to your own web personal project, but it also faces a memory leak caused by the 3D model, and the memory leak is a very painful thing for me, a rookie, and it can't be investigated at all. Looking at the document example of Three.js, I found that the force is embedded through `<iframe />`, so this 3D model project for iframe embedding was created by combining Nuxt and three.js. Furthermore, it serves as an exhibitor as well.

## How to use 🔧
You can select the models you want through routing parameters, whether to display the selection, full screen, and color mode buttons. Alternatively, you can consider using it as a showcase or a glTF viewer.

### Parameters include:

#### group (string) (Optional)
This parameter **doesn't need to be filled in!** The model parameter you input will automatically recognize its group.
- Engines (default)
- Automobiles
- Misc
- To be added...

#### model (string) (!case-sensitive ⚠️)
- Engines
  - Duramax (default)
  - AudiS8
  - AudiR8
  - AstonMartinV12
  - BugattiW16
  - ChevroletCorvetteV8
  - CumminsX15Truck
  - DodgeChallengerV8
  - DodgeMagnumV10
  - FordMotorEngine
  - IndustrialDiesel
  - MarinePropulsion
  - NissanAltimaHybrid4Cylinder
  - CarEngine1
  - CarEngine2
  - CarEngine3
  - V12CarEngine
  - V8CarEngine

- Automobiles
  - Batmobile
  - DefenderWorksV8
  - Defender90Prep
  - Defender90V8
  - RangeRover

- Misc
  - NASAShuttleLaunchPad
  - PacmanArcadePocket

#### button (boolean) (case-insensitive)
This parameter determines whether to display the bottom buttons. (including navigation)
- true (default)
- false

#### zoom (boolean) (case-insensitive)
This parameter determines the feasibility of model scaling
- true (default)
- false

## examples 📃
You can view the model by visiting the website directly.
[https://model.crybabyaq.love/?model=AudiS8&button=false](https://model.crybabyaq.love/?model=AudiS8&button=false)

Similarly, you can also embed it in your personal website or web project through `<iframe />`:
```html
<iframe
  width="100%"
  height="100%"
  src="https://model.crybabyaq.love/?model=audiS8&button=false"
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

## TODO 📝

[] Supporting the glTF viewer, allowing for the preview of locally uploaded glTF files

[] To enhance individual models, the addition of a ground surface can be incorporated

[] Add a notification to provide an indication when the model file is large in size

[] Display the original author of the model and a Sketchfab link at the top when showcasing the model

## LICENSE

[MIT](./LICENSE)

