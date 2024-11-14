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
import { EXRLoader } from "three/addons";
import {timerDelta} from "three/tsl";


/*
Texture
 */
const loadingManager = new THREE.LoadingManager(
    () => {
        gsap.delayedCall(0.5, ()=>{
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration : 1.5 ,value:0, delay:1 })
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
            }
        )
    },
    (itemUrl,itemsLoaded,itemsTotal) => {
        const progressRatio = itemsLoaded / itemsTotal;
        loadingBarElement.style.transform =`scaleX(${progressRatio})`
        console.log(progressRatio)
    }
)

const textureLoader = new THREE.TextureLoader(loadingManager)

// const bakedShadow = textureLoader.load('/src/assets/textures/shadows/bakedShadow.jpg');
// const simpleShadow = textureLoader.load('/src/assets/textures/shadows/simpleShadow.jpg');

const fontLoader = new FontLoader(loadingManager)

const loadingBarElement = document.querySelector(".loading-bar");



const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

const exrLoader = new EXRLoader(loadingManager)
const gltfLoader = new GLTFLoader(loadingManager);

/*
Gui
 */
const gui = new dat.GUI({
    width:300,
    title:'debug UI',
    closeFolders: true,
})
const global = {}

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



/*
HDRI
 */
const environmentMap = cubeTextureLoader.load(
    [
        'src/assets/textures/environmentMaps/nocloud/px.png',
        'src/assets/textures/environmentMaps/nocloud/nx.png',
        'src/assets/textures/environmentMaps/nocloud/py.png',
        'src/assets/textures/environmentMaps/nocloud/ny.png',
        'src/assets/textures/environmentMaps/nocloud/pz.png',
        'src/assets/textures/environmentMaps/nocloud/nz.png']
)

scene.environment = environmentMap
scene.background = environmentMap

/*
update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child)=>
        {
            if( child.isMesh && child.material.isMeshStandardMaterial){
                child.material.envMap = environmentMap;
                child.material.envMapIntensity = global.envMapIntensity
                child.material.needsUpdate = true;

            }

        }
    )
}

/*
Global Intensity
 */
global.envMapIntensity = 2
gui.add(global,'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials)





/*
Models
 */
let mixer = null

gltfLoader.load(
    'src/assets/ZUST/12-2-applydem.gltf',
    (gltf) => {
        // 全部加载
        const children = [...gltf.scene.children];
        for (const child of children) {
            scene.add(child);
        }

        //
        // mixer = new THREE.AnimationMixer(gltf.scene);
        // const action = mixer.clipAction(gltf.animations[2]);
        // action.play();

        const model = gltf.scene;

        scene.add(model);

        }
        )


/*
POI
 */
const points = [
    {
        position: new THREE.Vector3(580, 50,-400),
        element:document.querySelector('.point-0')
    }
]



//fog
// const fog = new THREE.Fog('#262837',1,15)
// scene.fog = fog


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


// const material = new THREE.MeshStandardMaterial({color:'#8baf71'})
// material.metalness = 0
// material.roughness = 0.8
// // material.envMap = environmentMapTexture
//
// material.side = THREE.DoubleSide
//
// gui.add(material,'metalness').min(0).max(1).step(0.001)
// gui.add(material,'roughness').min(0).max(1).step(0.001)
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


/*
Raycaster
 */

// const raycaster = new THREE.Raycaster()
//
// const rayOrigin = new THREE.Vector3(-3,0,0)
// const rayDirection = new THREE.Vector3(10,0,0)
// rayDirection.normalize()
//
// raycaster.set(rayOrigin,rayDirection)
//
// const intersect = raycaster.intersectObject(cube2)
//
// const intersects = raycaster.intersectObjects([cube,cube2,cube3])
// console.log(intersects)

// const plane = new THREE.Mesh(
//     new THREE.PlaneGeometry(20,20,256,256),
//     new THREE.MeshStandardMaterial(
//         {
//     side: THREE.DoubleSide
    //         map: grassColorTexture,
    //         aoMap: grassAmbientOcclusionTexture,
    //         normalMap: grassNormalTexture,
    //         roughnessMap: grassRoughnessTexture,
//         }
//     )
// )
// plane.geometry.setAttribute(              //uv处理
//     'uv2',
//     new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array,2)
// )
// plane.rotation.x =- Math.PI / 2
// plane.position.y = -0.5
// scene.add(plane)



/*
House
 */


/*
Lights
 */
const ambientLight = new THREE.AmbientLight('#fffff9',2)
scene.add(ambientLight)
gui.add(ambientLight,'intensity').min(0.01).max(5).step(0.001)
//
//
// const directionalLight = new THREE.DirectionalLight('#fdfcf8',2)
// directionalLight.position.set(4,5,-2)
// scene.add(directionalLight)
// // gui.add(directionalLight,'intensity').min(0.01).max(5).step(0.001)
// directionalLight.castShadow = false

// directionalLight.shadow.mapSize.width = 1024
// directionalLight.shadow.mapSize.height = 1024
// directionalLight.shadow.camera.near = 1
// directionalLight.shadow.camera.far = 10
// directionalLight.shadow.camera.top = 3
// directionalLight.shadow.camera.right = 3
// directionalLight.shadow.camera.bottom = -3
// directionalLight.shadow.camera.left = -3
// directionalLight.shadow.radius = 5

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// directionalLightCameraHelper.visible = false
// scene.add(directionalLightCameraHelper)


//
// const doorLight = new THREE.PointLight('#ff7d46', 5,7)
// doorLight.position.set(0,2.1,2.7)
// scene.add(doorLight)



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


//axes helper
const axesHelper = new THREE.AxesHelper()
axesHelper.scale.set(300, 300, 300);
axesHelper.position.set(580,30,-383)
axesHelper.visible = false
scene.add(axesHelper)


/*
OverLay
 */
//video material
const video = document.createElement('video');
video.src = 'src/assets/video/output_vp9.webm';
video.autoplay = true;
video.loop = false;
video.muted = true;
video.playsInline = true;  // 确保在移动设备上可以内嵌播放
video.style.display = 'none';  // 隐藏视频元素
document.body.appendChild(video);  // 将视频元素添加到文档中
video.playbackRate = 1;

video.addEventListener('loadedmetadata', () => {
    video.currentTime = 0;  // 设置视频从第三秒开始播放
});

// 创建视频纹理
const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;  // 线性滤波
videoTexture.magFilter = THREE.LinearFilter;  // 线性滤波
videoTexture.format = THREE.RGBFormat;

const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
    // wireframe: true,
    transparent: true,
    uniforms: {
        uAlpha: {value: 1},
        uVideoTexture: { value: videoTexture }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
    uniform float uAlpha;
        uniform sampler2D uVideoTexture;
        varying vec2 vUv;

        void main() {
            vec4 videoColor = texture2D(uVideoTexture, vUv);
            gl_FragColor = vec4(videoColor.rgb, videoColor.a * uAlpha);
        }
    `,

});

const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);
overlay.position.copy(axesHelper.position);



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
    }
})


/*
camera
 */
const camera = new THREE.PerspectiveCamera(40,sizes.width / sizes.height,0.1,10000)
camera.position.z = -510
camera.position.y = 120
camera.position.x = 400
scene.add(camera)

//相机控制
const controls = new OrbitControls(camera, canvas)
controls.addEventListener('change', () => {
    if (camera.position.y < 50) {
        camera.position.y = 50;
    }
});
controls.enableDamping = true
controls.target.copy(axesHelper.position);
controls.update();




/*
Render
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 设置渲染器的输出编码为 sRGB
renderer.outputColorSpace = THREE.SRGBColorSpace;

// 启用物理正确的光照模式
renderer.physicallyCorrectLights = true;
console.log(THREE.REVISION);
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.setClearColor('#282637')


//Shadow
// directionalLight.castShadow = true
// doorLight.castShadow = true
// ghost.castShadow = true
// ghost2.castShadow = true
// ghost3.castShadow = true
//
// walls.castShadow = true
// walls.receiveShadow = true
//
// bush.castShadow = true
// bush.receiveShadow = true
// bush2.castShadow = true
// bush2.receiveShadow = true
// bush3.castShadow = true
// bush3.receiveShadow = true
//
// plane.castShadow = false
// plane.receiveShadow = true


// //Time
// let time = Date.now()

//Clock
const clock = new THREE.Clock()

// gsap.to(cube1.position, { duration:1,delay:1,x:2 })
// gsap.to(cube1.position, { duration:1,delay:2,x:0 })


/*
Animations
 */
let previousTime = 0

const tick = () =>{

    //Clock
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime


    // update mixer
    if (mixer !== null){
        mixer.update(deltaTime)
    }


    //更新控制
    controls.update()


    for(const point of points){
        const screenPosition = point.position.clone()
        screenPosition.project(camera)

        const translateX = screenPosition.x * sizes.width * 0.5
        const translateY = -screenPosition.y * sizes.height * 0.5
        point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
    }

    //Render
    renderer.render(scene,camera)

    if (video.readyState >= video.HAVE_ENOUGH_DATA) {
        if (video.paused) {
            video.play().catch((error) => {
                console.error('Failed to play the video:', error);
            });
        }
        videoTexture.needsUpdate = true;  // 确保视频纹理更新
    }

    window.requestAnimationFrame(tick)
}

tick()