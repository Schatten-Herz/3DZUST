import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from "three/addons";
import GUI from 'lil-gui'
import geometries from "three/src/renderers/common/Geometries";
import {Raycaster, SRGBColorSpace} from "three";
import * as dat from 'dat.gui'
import { FontLoader} from "three/addons";
import { TextGeometry} from "three/addons";
import {RectAreaLightHelper} from "three/addons";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EXRLoader } from "three/addons";
import {timerDelta} from "three/tsl";
import index from "dat.gui";
import * as http from "node:http";

/*
*
 Minio
*/
// const Minio = require('minio');
//
// let minioClient;
//
// function initMinio(host, port, useSSL = false, accessKey, secretKey, option = {}) {
//     // 检查参数是否为空
//     if (!host || !port || !accessKey || !secretKey) {
//         throw new Error('Please provide all required parameters: host, port, accessKey, and secretKey.');
//     }
//
//     // 初始化 MinIO 客户端
//     minioClient = new Minio.Client({
//         endPoint: host, // 主机域名或 IP 地址
//         port: port, // 使用 MinIO 对象存储的端口，通常是 9000
//         useSSL: useSSL, // 根据需求设置是否启用 SSL
//         accessKey: accessKey, // MinIO 的访问密钥
//         secretKey: secretKey, // MinIO 的秘密密钥
//         ...option
//     });
//
//     return minioClient;
// }
//
// // 使用示例
// const host = '8.154.34.149';
// const port = 9000; // 修改为对象存储的正确端口
// const useSSL = false; // 如果您不需要 HTTPS，则为 false
// const accessKey = process.env.MINIO_ACCESS_KEY || '7s82Kx7yqqQAdaZmMMCM';
// const secretKey = process.env.MINIO_SECRET_KEY || 'qMq1mPEtcpjfwHEpYq3UT2gQM9dKUDJ1kbibVt0z';
//
// minioClient = initMinio(host, port, useSSL, accessKey, secretKey);



/*
Texture
 */
const loadingManager = new THREE.LoadingManager(
    () => {
        gsap.delayedCall(0.5, ()=>{
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration : 1.5,
                value:0,
                delay:1,
                onComplete: () => {
                    const pointElements = document.querySelectorAll('.point');
                    pointElements.forEach(point => {
                        point.style.display = 'block';
                    });
                }
            })



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

const infoPanelElement = document.querySelector("#info-panel");

const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
cubeTextureLoader.setCrossOrigin('anonymous')

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
gui.hide()

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
        'http://8.154.34.149:9000/three/assets/textures/environmentMaps/nocloud/px.png',
        'http://8.154.34.149:9000/three/assets/textures/environmentMaps/nocloud/nx.png',
        'http://8.154.34.149:9000/three/assets/textures/environmentMaps/nocloud/py.png',
        'http://8.154.34.149:9000/three/assets/textures/environmentMaps/nocloud/ny.png',
        'http://8.154.34.149:9000/three/assets/textures/environmentMaps/nocloud/pz.png',
        'http://8.154.34.149:9000/three/assets/textures/environmentMaps/nocloud/nz.png']
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
    'http://8.154.34.149:9000/three/assets/ZUST/12-2-applydem.gltf',
    (gltf) => {
        // 全部加载
        const children = [...gltf.scene.children];
        for (const child of children) {
            scene.add(child);
        }
        // mixer = new THREE.AnimationMixer(gltf.scene);
        // const action = mixer.clipAction(gltf.animations[2]);
        // action.play();

        // const model = gltf.scene;
        //
        // scene.add(model);
        })



//fog
// const fog = new THREE.Fog('#262837',1,15)
// scene.fog = fog


/*
Lights
 */
const ambientLight = new THREE.AmbientLight('#fffff9',2)
scene.add(ambientLight)
gui.add(ambientLight,'intensity').min(0.01).max(5).step(0.001)

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
//    })


//axes helper
const axesHelper = new THREE.AxesHelper()
axesHelper.scale.set(300, 300, 300);
axesHelper.position.set(600,30,-400)
axesHelper.visible = false
scene.add(axesHelper)



/*
OverLay
 */
//video material
const video = document.createElement('video');
video.src = 'http://8.154.34.149:9000/three/assets/video/output_vp9.webm';
video.crossOrigin = 'anonymous';
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
camera.position.z = -405
camera.position.y = 60
camera.position.x = 375
scene.add(camera)

//相机控制
const controls = new OrbitControls(camera, canvas)
controls.addEventListener('change', () => {
    if (camera.position.y < 20) {
        camera.position.y = 20;
    }
});
controls.enableDamping = true
controls.target.copy(axesHelper.position);
controls.minDistance = 5;
controls.update();



/*
POI
 */
const points = [
    {
        position: new THREE.Vector3(620, 30, -425),
        element: document.querySelector('.point-0'),
        cameraPosition: new THREE.Vector3(656, 20, -450), // 摄像机移动到的位置
        lookAt: new THREE.Vector3(610, 25, -425) // 摄像机朝向的位置
    }
];

const points0Position = gui.addFolder('Points0');

if (points[0].position) {
    points0Position.add(points[0].position, 'x').min(-1000).max(1000).step(0.01);
    points0Position.add(points[0].position, 'y').min(-1000).max(1000).step(0.01);
    points0Position.add(points[0].position, 'z').min(-1000).max(1000).step(0.01);
} else {
    console.error("Position is not defined properly.");
}


points.push({
    position: new THREE.Vector3(650, 40, -520),
    element: document.querySelector('.point-1'),
    cameraPosition: new THREE.Vector3(575,45,-525),
    lookAt: new THREE.Vector3(630, 30, -506)
});

const points1Position = gui.addFolder('Points1');

if (points[1].position) {
    points1Position.add(points[1].position, 'x').min(-1000).max(1000).step(0.01);
    points1Position.add(points[1].position, 'y').min(-1000).max(1000).step(0.01);
    points1Position.add(points[1].position, 'z').min(-1000).max(1000).step(0.01);
} else {
    console.error("Position for the second point is not defined properly.");
}


points.push({
    position: new THREE.Vector3(560, 35, -395),
    element: document.querySelector('.point-2'),
    cameraPosition: new THREE.Vector3(527,30,-507),
    lookAt: new THREE.Vector3(560, 35, -395)
});

const points2Position = gui.addFolder('Points2');

if (points[2].position) {
    points2Position.add(points[2].position, 'x').min(-1000).max(1000).step(0.01);
    points2Position.add(points[2].position, 'y').min(-1000).max(1000).step(0.01);
    points2Position.add(points[2].position, 'z').min(-1000).max(1000).step(0.01);
} else {
    console.error("Position for the second point is not defined properly.");
}

// Info Panel

function closeInfoPanel() {
    const infoPanel = document.getElementById('info-panel');
    if (infoPanel) {
        infoPanel.style.transform = 'translateX(100%)';
        infoPanel.style.display = 'none';
    } else {
        console.error("Info panel not found.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const pointsInfo = [
        {
            title: '学生活动中心',
            description: '学生活动中心 \n' + '\n' +
                'Student Activity Center \n' + '\n' +
                'Zentrum für studentische Aktivitäten.'
        },
        {
            title: '教务处',
            description: '教务处 \n' + '\n' +
                'Academic Affairs Office \n' + '\n' +
                'Büro für akademische Angelegenheiten'
        },
        {
            title: '水晶剧院',
            description: '水晶剧院 \n' + '\n' +
                'Crystal Theater \n' + '\n' +
                'Kristalltheater'
        }
    ];
    const infoDescription = document.getElementById('info-description');
    infoDescription.textContent = pointsInfo[0].description;

    // 绑定事件处理程序到每个兴趣点
    const pointElements = document.querySelectorAll('.point');
    pointElements.forEach(point => {
        point.addEventListener('click', () => {
            const index = point.getAttribute('data-index');
            console.log(`Point clicked: ${index}`);

            if (points[index] && points[index].cameraPosition && points[index].lookAt) {
                moveCamera(points[index].cameraPosition, points[index].lookAt);
            }

            // 面板
            showInfoPanel(index);
        });
    });

    // 绑定关闭按钮事件
    const closeButton = document.getElementById('close-button');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            console.log("Close button clicked");
            closeInfoPanel();
        });
    }

    // 显示信息面板
    function showInfoPanel(pointIndex) {
        const infoPanel = document.getElementById('info-panel');
        const infoDescription = document.getElementById('info-description');
        const infoTitle = infoPanel.querySelector('h2');

        if (infoPanel && infoTitle && infoDescription) {
            // 更新标题和描述
            infoTitle.textContent = pointsInfo[pointIndex].title;
            infoDescription.textContent = pointsInfo[pointIndex].description;

            infoPanel.style.transform = `scaleX(100%)`;
            // 显示信息面板
            infoPanel.style.display = 'block';
        } else {
            console.error("Info panel elements not found.");
        }
    }


    // 相机移动函数
    function moveCamera(targetPosition, lookAtPosition) {
        const duration = 2; // 移动的持续时间，单位为秒
        const startTime = performance.now();
        const initialPosition = camera.position.clone();
        const initialTarget = controls.target.clone();

        controls.enabled = false;

        function animateCamera(time) {
            const elapsed = (time - startTime) / 1000; // 计算经过的时间（秒）
            const t = Math.min(elapsed / duration, 1); // 归一化时间

            // 使用 lerpVectors 实现相机位置插值
            camera.position.lerpVectors(initialPosition, targetPosition, t);

            // 更新相机的朝向
            const currentTarget = new THREE.Vector3().lerpVectors(initialTarget, lookAtPosition, t);
            controls.target.copy(currentTarget);
            controls.update();

            if (t < 1) {
                requestAnimationFrame(animateCamera);
            } else {
                // 保持朝向目标
                controls.target.copy(lookAtPosition);
                controls.update();

                controls.enabled = true;
            }
        }

        requestAnimationFrame(animateCamera);
    }
});


//camera back
const initialCameraPosition = new THREE.Vector3(375,60,-405);
const initialTargetPosition = axesHelper.position.clone();

// 键盘事件监听
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
        // 当按下 Esc 键时，移动相机到初始位置并朝向 axesHelper
        resetCamera();
        closeInfoPanel();
    }
});

// 重置相机函数
function resetCamera() {
    const duration = 2; // 持续时间，单位为秒
    const startTime = performance.now();
    const initialPosition = camera.position.clone();
    const initialTarget = controls.target.clone();

    controls.enabled = false;

    function animateResetCamera(time) {
        const elapsed = (time - startTime) / 1000;
        const t = Math.min(elapsed / duration, 1);

        camera.position.lerpVectors(initialPosition, initialCameraPosition, t);

        //指向 axesHelper
        controls.target.lerpVectors(initialTarget, initialTargetPosition, t);
        controls.update();

        if (t < 1) {
            requestAnimationFrame(animateResetCamera);
        } else {
            controls.target.copy(initialTargetPosition);
            controls.update();

            controls.enabled = true;
        }
    }

    requestAnimationFrame(animateResetCamera);
}



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

    console.log(`Camera position: x=${camera.position.x.toFixed(2)}, y=${camera.position.y.toFixed(2)}, z=${camera.position.z.toFixed(2)}`);

    // update mixer
    if (mixer !== null){
        mixer.update(deltaTime)
    }


    //更新控制
    controls.update()

    const raycaster = new Raycaster()
    for(const point of points){
        const screenPosition = point.position.clone()
        screenPosition.project(camera)

        raycaster.setFromCamera(screenPosition,camera)
        const intersects = raycaster.intersectObjects(scene.children,true)

        // if(intersects.length === 0)
        // {
        //     point.element.classList.add('visible')
        // }else
        // {
        //     const intersectionDistance = intersects[0].distance
        //     point.element.classList.remove('visible')
        // }

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