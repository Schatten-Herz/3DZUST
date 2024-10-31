import * as THREE from 'three'
import * as Three from "three"
import gsap from 'gsap'
import { OrbitControls } from "three/addons";
import GUI from 'lil-gui'
import geometries from "three/src/renderers/common/Geometries";
import {SRGBColorSpace} from "three";
import * as dat from 'dat.gui'
import { FontLoader} from "three/addons";
import { TextGeometry} from "three/addons";
import {RectAreaLightHelper} from "three/addons";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


/*
Texture
 */
const textureLoader = new THREE.TextureLoader()
// const bakedShadow = textureLoader.load('/src/assets/textures/shadows/bakedShadow.jpg');
// const simpleShadow = textureLoader.load('/src/assets/textures/shadows/simpleShadow.jpg');

// const cubeTextureLoader = new THREE.CubeTextureLoader()

// const matcapTexture = textureLoader.load('/src/assets/textures/matcaps/8.png')

const doorColorTexture = textureLoader.load('/src/assets/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/src/assets/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('/src/assets/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/src/assets/textures/door/normal.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/src/assets/textures/door/ambientOcclusion.jpg')
const doorMetalnessTexture = textureLoader.load('/src/assets/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/src/assets/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/src/assets/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/src/assets/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/src/assets/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/src/assets/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/src/assets/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/src/assets/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/src/assets/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/src/assets/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8,8)
grassAmbientOcclusionTexture.repeat.set(8,8)
grassNormalTexture.repeat.set(8,8)
grassRoughnessTexture.repeat.set(8,8)

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

// const gradientTextures = textureLoader.load('/src/assets/textures/gradients/5.jpg');
// gradientTextures.minFilter = THREE.NearestFilter
// gradientTextures.magFilter = THREE.NearestFilter
// gradientTextures.generateMipmaps = false
//

// const environmentMapTexture = cubeTextureLoader.load([
//     '/src/assets/textures/environmentMaps/1/px.jpg',
//     '/src/assets/textures/environmentMaps/1/nx.jpg',
//     '/src/assets/textures/environmentMaps/1/py.jpg',
//     '/src/assets/textures/environmentMaps/1/ny.jpg',
//     '/src/assets/textures/environmentMaps/1/pz.jpg',
//     '/src/assets/textures/environmentMaps/1/nz.jpg'
// ])
//
doorColorTexture.colorSpace = THREE.SRGBColorSpace
bricksColorTexture.colorSpace = THREE.SRGBColorSpace
grassColorTexture.colorSpace = THREE.SRGBColorSpace



/*
font
 */
// const fontLoader = new FontLoader
//
// fontLoader.load(
//     '/src/assets/font/helvetiker_regular.typeface.json',
//     (font) =>{
//         const textGeometry = new TextGeometry(
//             'Zheng Leyi',
//             {
//                 font: font,
//                 size: 0.5,
//                 height: 0.2,
//                 curveSegment: 12,
//                 bevelEnabled: true,
//                 bevelThickness: 0.03,
//                 bevelSize: 0.02,
//                 bevelOffset: 0,
//                 bevelSegment: 5
//             }
//         )
//         textGeometry.center()
//
//         const material = new THREE.MeshMatcapMaterial()
//         material.matcap = matcapTexture
//         const text = new THREE.Mesh(textGeometry,material)
//         scene.add(text)
//
//         const donutGeometry = new THREE.TorusGeometry(0.3,0.2,20,45)
//
//         for( let i=0 ; i<1000 ; i++){
//             const donut = new THREE.Mesh(donutGeometry,material)
//
//             donut.position.x = (Math.random() - 0.5) * 15
//             donut.position.y = (Math.random() - 0.5) * 15
//             donut.position.z = (Math.random() - 0.5) * 15
//
//             donut.rotation.x = Math.random() * Math.PI
//             donut.rotation.y = Math.random() * Math.PI
//
//             const scale = Math.random()
//             donut.scale.set(scale,scale,scale)
//
//             scene.add(donut)
//
//         }
//
// }
// )


/*
Gui
 */
const gui = new dat.GUI({
    width:300,
    title:'debug UI',
    closeFolders: true,
})
gui.close()
// gui.hide()

window.addEventListener('keydown',() =>{
    if(event.key === `h`)
        gui.show(gui._hidden)
})

const debugObject = {}

console.log(OrbitControls)

//Cursor
const cursor = {
    x:0,
    y:0
}
window.addEventListener('mousemove',(event) => {
    cursor.x = event.clientX / sizes.width -0.5
    cursor.y = event.clientY / sizes.height -0.5
})


console.log(gsap)

//webgl画布
const canvas = document.querySelector('canvas.webgl')

//Scene
const scene = new THREE.Scene()


//fog
const fog = new THREE.Fog('#262837',1,15)
scene.fog = fog


/*
basic
 */
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.transparent = true
// material.alphaMap = doorAlphaTexture


// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 200
// material.specular = new THREE.Color(0xff0000)

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTextures


// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.8,0.8)
// material.alphaMap = doorAlphaTexture
// material.transparent = true


const material = new THREE.MeshStandardMaterial({color:'#8baf71'})
material.metalness = 0
material.roughness = 0.8
// material.envMap = environmentMapTexture

material.side = THREE.DoubleSide

gui.add(material,'metalness').min(0).max(1).step(0.001)
gui.add(material,'roughness').min(0).max(1).step(0.001)
// gui.add(material,'displacementScale').min(0).max(1).step(0.001)

// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5,256,256),
//     material
// )
// sphere.castShadow = true
// sphere.receiveShadow = true
//
// sphere.geometry.setAttribute(              //uv处理
//     'uv2',
//     new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,2)
// )
//
// scene.add(sphere)

// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1,1),
//     material
// )
// cube.castShadow = true
// cube.receiveShadow = true
//
// cube.position.x = -2


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20,256,256),
    new THREE.MeshStandardMaterial(
        {
            map: grassColorTexture,
            aoMap: grassAmbientOcclusionTexture,
            normalMap: grassNormalTexture,
            roughnessMap: grassRoughnessTexture,
        }
    )
)
plane.geometry.setAttribute(              //uv处理
    'uv2',
    new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array,2)
)
plane.rotation.x =- Math.PI / 2
// plane.position.y = -0.5
scene.add(plane)




/*
House
 */
const house = new THREE.Group()
scene.add(house)


const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture,
        })
)
walls.geometry.setAttribute('uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2)
)
walls.position.y = 1.25
house.add(walls)


const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5,2,4),
    new THREE.MeshStandardMaterial({color:'#b35f45'})
)
roof.position.y = 3.25
roof.rotation.y = Math.PI / 4
house.add(roof)


const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2,2,128,128),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale:0.15,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
    })
)
door.geometry.setAttribute('uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2)
    )
door.position.y = 0.9
door.position.z = 2.001
house.add(door)

//Bushes
const bashGeometry = new THREE.SphereGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({color:'#89c854'})

const bush = new THREE.Mesh(bashGeometry,bushMaterial)
bush.scale.set(0.5,0.5,0.5)
bush.position.set(0.8,0.2,2.3)

const bush1 = new THREE.Mesh(bashGeometry,bushMaterial)
bush1.scale.set(0.15,0.15,0.15)
bush1.position.set(-1,0.05,2.7)

const bush2 = new THREE.Mesh(bashGeometry,bushMaterial)
bush2.scale.set(0.25,0.25,0.25)
bush2.position.set(1.4,0.1,2.2)

const bush3 = new THREE.Mesh(bashGeometry,bushMaterial)
bush3.scale.set(0.4,0.4,0.4)
bush3.position.set(-0.8,0.1,2.3)
scene.add(bush,bush2,bush3,bush1)


//Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6,0.8,0.2)
const graveMaterial = new THREE.MeshStandardMaterial({color:'#aa7b7b'})

for( let i = 0; i < 50 ;i++){
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 7;
    const x = Math.sin(angle) * radius
    const y = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry,graveMaterial)
    grave.position.set(x,0.35,y)

    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.1

    grave.castShadow = true
    grave.receiveShadow = true

    graves.add(grave)
}



/*
Lights
 */
const ambientLight = new THREE.AmbientLight('#b9d5ff',0.1)
scene.add(ambientLight)
gui.add(ambientLight,'intensity').min(0.01).max(1).step(0.001)


const directionalLight = new THREE.DirectionalLight('#b9d5ff',0.1)
directionalLight.position.set(4,5,-2)
scene.add(directionalLight)
gui.add(directionalLight,'intensity').min(0.01).max(5).step(0.001)
directionalLight.castShadow = false

directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 10
directionalLight.shadow.camera.top = 3
directionalLight.shadow.camera.right = 3
directionalLight.shadow.camera.bottom = -3
directionalLight.shadow.camera.left = -3
directionalLight.shadow.radius = 5

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)


const doorLight = new THREE.PointLight('#ff7d46', 5,7)
doorLight.position.set(0,2.1,2.7)
scene.add(doorLight)



// const hemisphereLight = new THREE.HemisphereLight(0xff0000,0x0000ff,2)  //顶光和地面光
// scene.add(hemisphereLight)
// gui.add(hemisphereLight,'intensity').min(0.01).max(5).step(0.001)


//pointLight
// const pointLight = new THREE.PointLight(0xffffff,9,20)  //点光源
// pointLight.position.set(0,3,0)
// gui.add(pointLight,'intensity').min(0.01).max(5).step(0.001)
//
// pointLight.castShadow = false
// pointLight.shadow.mapSize.width = 1024
// pointLight.shadow.mapSize.height = 1024
// pointLight.shadow.camera.near = 1
// pointLight.shadow.camera.far = 6
//
// scene.add(pointLight)
//
// const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
// pointLightCameraHelper.visible = false
// scene.add(pointLightCameraHelper)
//
//
// const rectAreaLight = new THREE.RectAreaLight(0x4e00ff,10,3,1)  //面光
// rectAreaLight.position.set(1,2,0)
// scene.add(rectAreaLight)
// rectAreaLight.lookAt(new THREE.Vector3(0,0,1))
// gui.add(rectAreaLight,'intensity').min(0.01).max(10).step(0.001)


//spotlight
// const spotLight = new THREE.SpotLight(0x78ff00,10,15,Math.PI * 0.1,0.25,1)  //聚光灯   penumbra:散光
// spotLight.position.set(0,2,-3)
// spotLight.target.position.x = 0.5
//
// spotLight.castShadow = false
// spotLight.shadow.mapSize.width = 1024
// spotLight.shadow.mapSize.height = 1024
// spotLight.shadow.camera.near = 1
// spotLight.shadow.camera.far = 8
// spotLight.shadow.camera.fov = 60
//
// scene.add(spotLight)
// scene.add(spotLight.target)
//
// const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
// spotLightCameraHelper.visible = false
// scene.add(spotLightCameraHelper)


//LightHelpers
// const hemisphereLighterHelper = new THREE.HemisphereLightHelper(hemisphereLight,0.2)
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,0.2)
// const pointLightHelper = new THREE.PointLightHelper(pointLight,0.2)
// const spotLightHelper = new THREE.SpotLightHelper(spotLight,0.2)
// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
//
// scene.add(hemisphereLighterHelper,directionalLightHelper,pointLightHelper,spotLightHelper,rectAreaLightHelper)

/*
GUI
 */
// const cubeTweaks = gui.addFolder('cube')
// cubeTweaks.close()
//
// cubeTweaks.add(cube1.position,'y')  //物体位置控制gui
//     .min(-3)
//     .max(3)
//     .step(0.01)
//     .name('z')
//
// cubeTweaks.add(cube1,'visible')    //物体可见性gui
//     .name('方块可见')
//
// cubeTweaks.add(cube1.material,'wireframe')
//
// cubeTweaks.addColor(debugObject,'color')        //改变颜色和同步
//     .onChange(() =>{
//         cube1.material.color.set(debugObject.color)
//     })
//
// debugObject.spin = () => {
//     gsap.to(cube1.rotation,{y:cube1.rotation.y + Math.PI * 2})
// }
// cubeTweaks.add(debugObject,'spin')
//
// debugObject.subdivision = 2
// cubeTweaks.add(debugObject,'subdivision')
//     .min(1)
//     .max(20)
//     .step(1)
//     .onFinishChange(() =>{
//         cube1.geometry.dispose()
//         cube1.geometry = new THREE.BoxGeometry(
//             1,1,1,
//             debugObject.subdivision,debugObject.subdivision,debugObject.subdivision
//         )
//     })


/*
Ghost
 */
const ghost = new THREE.PointLight('#ff00ff',10,3)
ghost.position.y = 3
scene.add(ghost)

const ghost2 = new THREE.PointLight('#00ffff',10,3)
ghost2.position.y = 3
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ff0000',10,3)
ghost3.position.y = 3
scene.add(ghost3)



//axes helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)


/*
sizes
 */
const sizes = {
    width:window.innerWidth,
    height:window.innerHeight
}

window.addEventListener('resize',() => {
    //画布更新
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //更新相机
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //更新画布
    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//双击进入，退出全屏
window.addEventListener('dblclick', () => {
    if(!document.fullscreenElement){
        canvas.requestFullscreen()                         //进入全屏
    }else{
        document.exitFullscreen()                          //退出全屏
        console.log('leave fullscreen')
    }
})


/*
camera
 */
const camera = new THREE.PerspectiveCamera(75,sizes.width / sizes.height,0.1,1000)
camera.position.z = 4
camera.position.y = 4
camera.position.x = 4
scene.add(camera)

//相机控制
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/*
Render
 */
const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.antialias = true
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor('#282637')


//Shadow
directionalLight.castShadow = true
doorLight.castShadow = true
ghost.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true

bush.castShadow = true
bush.receiveShadow = true
bush2.castShadow = true
bush2.receiveShadow = true
bush3.castShadow = true
bush3.receiveShadow = true

plane.castShadow = false
plane.receiveShadow = true


// //Time
// let time = Date.now()

//Clock
const clock = new THREE.Clock()

// gsap.to(cube1.position, { duration:1,delay:1,x:2 })
// gsap.to(cube1.position, { duration:1,delay:2,x:0 })


/*
Animations
 */
const tick = () =>{
    //Clock
    const elapsedTime = clock.getElapsedTime()

    //sphere
    // sphere.position.z = Math.sin(elapsedTime * 2)
    // sphere.position.x = Math.cos(elapsedTime * 2)
    // sphere.position.y = Math.abs(Math.sin(elapsedTime * 2))


    //update shadow
    // sphereShadow.position.x = sphere.position.x
    // sphereShadow.position.z = sphere.position.z
    // sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3

    const ghostAngle = elapsedTime * 0.5
    ghost.position.x = Math.cos(ghostAngle) * 4
    ghost.position.z = Math.sin(ghostAngle) * 4
    ghost.position.y = Math.sin(ghostAngle * 3)

    const ghost2Angle = -elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = -elapsedTime * 0.24
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(ghost3Angle * 4) + Math.sin(elapsedTime * 2.5)

    // camera.lookAt(cube1.position)

    //更新控制
    controls.update()

    //Render
    renderer.render(scene,camera)

    window.requestAnimationFrame(tick)
}

tick()