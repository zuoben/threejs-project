import * as THREE from '../../../build/three.module.js';
import { OrbitControls } from '../../jsm/controls/OrbitControls.js';
import '../../jsm/libs/hammer.min.js';
import { CSS3DRenderer, CSS3DObject } from '../../jsm/renderers/CSS3DRenderer.js';
import { FBXLoader } from '../../jsm/loaders/FBXLoader.js';
import { RGBELoader } from '../../jsm/loaders/RGBELoader.js';
import { PMREMGenerator } from '../../jsm/pmrem/PMREMGenerator.js';
import { PMREMCubeUVPacker } from '../../jsm/pmrem/PMREMCubeUVPacker.js';



(function(){
var gpcount = 0,
    pg_000, pg_001, pg_002, pg_003, pg_004, pg_005, pg_006, pg_007, pg_008, pg_009, pg_010, pg_011, pg_012, pg_013, pg_014, pg_015, pg_016, pg_017, pg_018, pg_019, pg_020, pg_021, pg_022, pg_023, pg_024, pg_025, planeTest;
var vs_000, fs_000;
var v_000, v_001, v_002, v_003, v_004;
var actionables = [];
var _cubemapSkybox, _cubemapColor, _cubemapMaterials, _customUniformsCubemap;
var _raycaster;
var _clock, _clockDelta, _clockElapsedTime;
var _controls, _isOnFPS, _stdPosition;
var _mouse, _counterClick, _startClick, _checkOnce;
var _touchHammer, _touchHammerEvent;
var _checkForFPS, _FPSAverage;
var _depthTarget, _postDepthScene, _postDepthCamera, _postDepthMaterial, _isOnDepthView, _supportsDepthExtension, _depthMin, _depthFar;
var _clipPlanes, _clipPlanes_objects, _allclipPlanes_helpers;
var _scene;
var _camera;
var _container;
var _renderer, _renderer_rect;
var _renderer_css, _renderer_rect_css;
var _scene_css;
var _Container_css, _css_crop_material;
var at_0, at_1;
var _btn_0, _btn_1;
var objCount = 0,
    txtCount = 0;
var txtrloaded = false,
    objrloaded = false;
init();
animate();
var _script_loader = document.createElement('script');
_script_loader.src = "https://www.youtube.com/iframe_api";
var _script_loader_tag = document.getElementsByTagName('script')[0];
_script_loader_tag.parentNode.insertBefore(_script_loader, _script_loader_tag);
window.onYouTubeIframeAPIReady = function() {
    v_003 = new YT.Player('v_002', {
        events: {}
    });
}

function init() {
    THREE.Cache.enabled = true;
    pg_000 = new THREE.Object3D();
    pg_001 = new THREE.Object3D();
    pg_002 = new THREE.Object3D();
    pg_003 = new THREE.Object3D();
    pg_004 = new THREE.Object3D();
    pg_005 = new THREE.Object3D();
    pg_006 = new THREE.Object3D();
    pg_007 = new THREE.Object3D();
    pg_008 = new THREE.Object3D();
    pg_009 = new THREE.Object3D();
    pg_010 = new THREE.Object3D();
    pg_011 = new THREE.Object3D();
    pg_012 = new THREE.Object3D();
    pg_013 = new THREE.Object3D();
    pg_014 = new THREE.Object3D();
    pg_015 = new THREE.Object3D();
    pg_016 = new THREE.Object3D();
    pg_017 = new THREE.Object3D();
    pg_018 = new THREE.Object3D();
    pg_019 = new THREE.Object3D();
    pg_020 = new THREE.Object3D();
    pg_021 = new THREE.Object3D();
    pg_022 = new THREE.Object3D();
    pg_023 = new THREE.Object3D();
    pg_024 = new THREE.Object3D();
    pg_025 = new THREE.Object3D();
    planeTest = new THREE.Plane(new THREE.Vector3(0, -1, 0), 10000);
    vs_000 = `varying vec2 vUv;
void main(){
vUv = uv;
vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
gl_Position = projectionMatrix * mvPosition;}`;
    fs_000 = `varying vec2 vUv;
uniform float colorInterpolation;
uniform sampler2D mainTexture;
uniform sampler2D backTexture;
void main(void) {
vec3 color1 = texture2D(mainTexture, vUv).rgb;
vec3 color2 = texture2D(backTexture, vUv).rgb;
color1.rgb*=1.0-colorInterpolation;
color2.rgb*=colorInterpolation;
gl_FragColor = vec4(color1.rgb + color2.rgb, 1.0);}`;
    v_001 = false;
    _cubemapColor = 0xFFFFFF;
    _cubemapMaterials = [];
    _customUniformsCubemap = [];
    for (var i = 0; i < 6; i++) {
        _customUniformsCubemap.push({
            colorInterpolation: { value: 1.0 },
            mainTexture: { value: new THREE.TextureLoader().load('files/_cubeTxr.jpg') },
            backTexture: { value: new THREE.TextureLoader().load('files/_cubeTxr.jpg') }
        });
    }
    for (var i = 0; i < 6; i++) {
        _cubemapMaterials.push(new THREE.ShaderMaterial({
            uniforms: _customUniformsCubemap[i],
            vertexShader: vs_000,
            fragmentShader: fs_000
        }));
    }
    var cubemapSkyboxLoader = new FBXLoader().setPath('files/');
    cubemapSkyboxLoader.load('cubemap_threejs.fbx', function(object) {
        var _matCount = 0;
        _scene.add(object);
        _cubemapSkybox = object;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _cubemapMaterials[_matCount];
                _matCount++;
            };
        });
    });
    _raycaster = new THREE.Raycaster();
    _clock = new THREE.Clock();
    _mouse = new THREE.Vector2();
    _counterClick = 0;
    _startClick = false;
    _checkOnce = false;
    _checkForFPS = false;
    _FPSAverage = [];
    _scene = new THREE.Scene();
    _container = document.getElementById('3d-container');
    if (_container == null) {
        _container = document.createElement('div');
        document.body.appendChild(_container);
        _container.setAttribute('style', 'width:100%; height:100vh');
    }
    _scene_css = new THREE.Scene();
    _Container_css = document.getElementById('css-container');
    if (_Container_css == null) {
        _Container_css = document.createElement('div');
        document.body.appendChild(_Container_css);
        _Container_css.setAttribute('style', 'width:100%; height:100vh');
    }
    _css_crop_material = new THREE.MeshPhongMaterial({
        opacity: 0,
        color: new THREE.Color('black'),
        blending: THREE.NoBlending,
        side: THREE.DoubleSide
    });
    _camera = new THREE.PerspectiveCamera(80, _container.clientWidth / _container.clientHeight, 10, 2000000);
    _renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    _renderer.setClearColor(0x1C1C1C, 0);
    _renderer.setPixelRatio(window.devicePixelRatio);
    _renderer.setSize(_container.clientWidth, _container.clientHeight);
    _renderer.outputEncoding = THREE.sRGBEncoding;
    _renderer.gammaFactor = 2.2;
    _renderer.toneMapping = THREE.ACESFilmicToneMapping;
    _renderer.localClippingEnabled = true;
    _container.appendChild(_renderer.domElement);
    _renderer_rect = _renderer.domElement.getBoundingClientRect();
    _renderer_css = new CSS3DRenderer();
    _renderer_css.setSize(_Container_css.clientWidth, _Container_css.clientHeight);
    _renderer_css.domElement.style.position = 'absolute';
    _renderer_css.domElement.style.top = 0;
    _Container_css.appendChild(_renderer_css.domElement);
    _renderer_rect_css = _renderer_css.domElement.getBoundingClientRect();
    _touchHammer = new Hammer(_container);
    _controls = new OrbitControls(_camera, _renderer.domElement);
    _controls.target.set(0, 165, 934);
    _stdPosition = new THREE.Vector3(0, 0, 0);
    _controls.update();
    _controls.enableDamping = true;
    _controls.dampingFactor = 0.1;
    _controls.smoothZoom = true;
    _controls.zoomDampingFactor = 0.05;
    _controls.smoothZoomSpeed = 2;
    _controls.minDistance = 126.9993;
    _controls.maxDistance = 126.9993;
    _controls.minPolarAngle = 0;
    _controls.maxPolarAngle = 1.5708;
    _isOnDepthView = false;
    _supportsDepthExtension = true;
    _depthMin = 100;
    _depthFar = 2500;
    if (!_renderer.extensions.get('WEBGL_depth_texture')) {
        _supportsDepthExtension = false;
        console.log('browser doesnt suppport depth texture extension');
    }
    _depthTarget = new THREE.WebGLRenderTarget(_container.clientWidth, _container.clientHeight);
    _depthTarget.texture.format = THREE.RGBFormat;
    _depthTarget.texture.minFilter = THREE.NearestFilter;
    _depthTarget.texture.magFilter = THREE.NearestFilter;
    _depthTarget.texture.generateMipmaps = false;
    _depthTarget.stencilBuffer = false;
    _depthTarget.depthBuffer = true;
    _depthTarget.depthTexture = new THREE.DepthTexture();
    _depthTarget.depthTexture.type = THREE.UnsignedShortType;
    setupDepthPost();



    window.addEventListener('resize', function(){
            _camera().aspect = _container().clientWidth / _container().clientHeight;
            _camera().updateProjectionMatrix();
            _renderer().setSize(_container().clientWidth, _container().clientHeight);
            _renderer_rect = _renderer().domElement.getBoundingClientRect();
            var dpr = _renderer().getPixelRatio();
            _depthTarget().setSize(_container().clientWidth * dpr, _container().clientHeight * dpr);
            _renderer().setSize(_container().clientWidth, _container().clientHeight);
            _renderer_css().setSize(_container().clientWidth, _container().clientHeight);
    }, false);


    _touchHammer.on('tap', hammerTap);
    initActions();
    _camera.position.set(2.629089, 200.7036, 1055.849);

   
    var textureLoader = new THREE.TextureLoader().setPath('textures/');

    var cubeTextureLoader = new THREE.CubeTextureLoader().setPath('textures/');
    var loaderblock = new FBXLoader().setPath('models/');
    var lmintensity = 1;
    var t0 = textureLoader.load('t0.jpg', countLoadedTexture);
    t0.wrapS = t0.wrapT = THREE.RepeatWrapping;
    t0.encoding = THREE.sRGBEncoding;
    var t1 = textureLoader.load('t1.jpg', countLoadedTexture);
    t1.wrapS = t1.wrapT = THREE.RepeatWrapping;
    t1.encoding = THREE.sRGBEncoding;
    var t2 = textureLoader.load('t2.jpg', countLoadedTexture);
    t2.wrapS = t2.wrapT = THREE.RepeatWrapping;
    t2.encoding = THREE.sRGBEncoding;
    var t3 = textureLoader.load('t3.jpg', countLoadedTexture);
    t3.wrapS = t3.wrapT = THREE.RepeatWrapping;
    t3.encoding = THREE.sRGBEncoding;
    var t3s = textureLoader.load('t3s.jpg', countLoadedTexture);
    t3s.wrapS = t3s.wrapT = THREE.RepeatWrapping;
    var t4 = textureLoader.load('t4.jpg', countLoadedTexture);
    t4.wrapS = t4.wrapT = THREE.RepeatWrapping;
    t4.encoding = THREE.sRGBEncoding;
    var t5 = textureLoader.load('t5.jpg', countLoadedTexture);
    t5.wrapS = t5.wrapT = THREE.RepeatWrapping;
    t5.encoding = THREE.sRGBEncoding;
    var t5_0 = textureLoader.load('t5.jpg');
    t5_0.wrapS = t5_0.wrapT = THREE.RepeatWrapping;
    t5_0.encoding = THREE.sRGBEncoding;
    t5_0.repeat.set(2, 1);
    var t5_1 = textureLoader.load('t5.jpg');
    t5_1.wrapS = t5_1.wrapT = THREE.RepeatWrapping;
    t5_1.encoding = THREE.sRGBEncoding;
    t5_1.repeat.set(2, 1);
    var t6 = textureLoader.load('t6.jpg', countLoadedTexture);
    t6.wrapS = t6.wrapT = THREE.RepeatWrapping;
    t6.encoding = THREE.sRGBEncoding;
    var t6s = textureLoader.load('t6s.jpg', countLoadedTexture);
    t6s.wrapS = t6s.wrapT = THREE.RepeatWrapping;
    var lm0 = textureLoader.load('lm0.jpg', countLoadedTexture);
    lm0.encoding = THREE.sRGBEncoding;
    var lm1 = textureLoader.load('lm1.jpg', countLoadedTexture);
    lm1.encoding = THREE.sRGBEncoding;
    var lmn = textureLoader.load('lmbasic.jpg', countLoadedTexture);
    var envCube = cubeTextureLoader.load([
        'probe0.jpg',
        'probe1.jpg',
        'probe2.jpg',
        'probe3.jpg',
        'probe4.jpg',
        'probe5.jpg',
    ], countLoadedTexture);
    var _m0lm0 = new THREE.MeshStandardMaterial({
        lightMapIntensity: lmintensity,
        map: t0,
        envMap: envCube,
        envMapIntensity: lmintensity,
        metalness: 0,
        roughness: 1,
        lightMap: lm0,
        color: 0xFFFFFF
    });
    var _m1lm0 = new THREE.MeshStandardMaterial({
        lightMapIntensity: lmintensity,
        map: t1,
        envMap: envCube,
        envMapIntensity: lmintensity,
        emissiveMap: t2,
        emissive: 0x262626,
        metalness: 0,
        roughness: 1,
        lightMap: lm0,
        color: 0xFFFFFF
    });
    var _m2lm0 = new THREE.MeshStandardMaterial({
        lightMapIntensity: lmintensity,
        alphaTest: 0.50,
        map: t3,
        alphaMap: t3s,
        envMap: envCube,
        envMapIntensity: lmintensity,
        metalness: 0,
        roughness: 1,
        lightMap: lm0,
        color: 0xFFFFFF
    });
    var _m3lm0 = new THREE.MeshStandardMaterial({
        lightMapIntensity: lmintensity,
        map: t0,
        envMap: envCube,
        envMapIntensity: lmintensity,
        emissiveMap: t0,
        emissive: 0xFFFFFF,
        metalness: 0,
        roughness: 1,
        lightMap: lm0,
        color: 0xFFFFFF
    });
    var _m4lm0 = new THREE.MeshStandardMaterial({
        lightMapIntensity: lmintensity,
        map: t4,
        envMap: envCube,
        envMapIntensity: lmintensity,
        metalness: 0,
        roughness: 1,
        lightMap: lm0,
        color: 0xFFFFFF
    });
    var _m5lm1 = new THREE.MeshStandardMaterial({
        lightMapIntensity: lmintensity,
        map: t5_0,
        envMap: envCube,
        envMapIntensity: lmintensity,
        emissiveMap: t5_0,
        emissive: 0xB9B9B9,
        metalness: 0,
        roughness: 1,
        lightMap: lm1,
        color: 0xFFFFFF
    });
    var _m0lm1 = new THREE.MeshStandardMaterial({
        lightMapIntensity: lmintensity,
        map: t0,
        envMap: envCube,
        envMapIntensity: lmintensity,
        metalness: 0,
        roughness: 1,
        lightMap: lm1,
        color: 0xFFFFFF
    });
    var _m6 = new THREE.MeshStandardMaterial({
        lightMapIntensity: lmintensity,
        alphaTest: 0.50,
        map: t6,
        alphaMap: t6s,
        envMap: envCube,
        envMapIntensity: lmintensity,
        metalness: 0,
        roughness: 1,
        lightMap: lmn,
        color: 0x307093
    });
    var _m7 = new THREE.MeshStandardMaterial({
        lightMapIntensity: lmintensity,
        envMap: envCube,
        envMapIntensity: lmintensity,
        emissive: 0x03C0BA,
        metalness: 0,
        roughness: 1,
        lightMap: lmn,
        color: 0x03C0BA
    });
    var _m8 = new THREE.MeshStandardMaterial({
        lightMapIntensity: lmintensity,
        envMap: envCube,
        envMapIntensity: lmintensity,
        metalness: 0,
        roughness: 1,
        lightMap: lmn,
        color: 0x040404
    });
    loaderblock.load('_m0lm0.fbx', function(object) {
        countLoadedModel();
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m0lm0;
            };
        });
        _scene.add(object);
    });
    loaderblock.load('_m1lm0.fbx', function(object) {
        countLoadedModel();
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m1lm0;
            };
        });
        _scene.add(object);
    });
    loaderblock.load('_m2lm0.fbx', function(object) {
        countLoadedModel();
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m2lm0;
            };
        });
        // _scene.add(object);
    });
    loaderblock.load('_m3lm0.fbx', function(object) {
        countLoadedModel();
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m3lm0;
            };
        });
        _scene.add(object);
    });
    loaderblock.load('_m4lm0.fbx', function(object) {
        countLoadedModel();
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m4lm0;
            };
        });
        _scene.add(object);
    });
    loaderblock.load('_m5lm1.fbx', function(object) {
        countLoadedModel();
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m5lm1;
            };
        });
        _scene.add(object);
    });
    loaderblock.load('_m0lm1.fbx', function(object) {
        countLoadedModel();
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m0lm1;
            };
        });
        _scene.add(object);
    });
    loaderblock.load('_m8.fbx', function(object) {
        countLoadedModel();
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m8;
            };
        });
        _scene.add(object);
    });
    _scene.add(pg_000)
    pg_000.position.set(0, 100, -1000)
    pg_000.attach(pg_001);
    pg_001.position.set(22.99994, 34, 2420)
    pg_000.attach(pg_002);
    pg_002.position.set(9, 44.00001, 132)
    pg_002.attach(pg_003);
    pg_003.position.set(-9.49267, -4.83588, 0.7164001)
    pg_002.attach(pg_004);
    pg_004.position.set(-282.9889, -4.83588, 0.7164001)
    pg_002.attach(pg_005);
    pg_005.position.set(279.4067, -4.83588, 0.7164001)
    _scene.add(pg_006)
    pg_006.position.set(0, 0, 0)
    _scene.add(pg_007)
    pg_007.position.set(0, 0, 0)
    pg_007.attach(pg_008);
    pg_008.position.set(-3, 286, -467)
    pg_007.attach(pg_009);
    pg_009.position.set(-828, 101.7, 1)
    pg_007.attach(pg_010);
    pg_010.position.set(-515, 101.7, 1)
    pg_007.attach(pg_011);
    pg_011.position.set(-200, 101.7, 1)
    pg_007.attach(pg_012);
    pg_012.position.set(826.2, 101.7, 1)
    pg_007.attach(pg_013);
    pg_013.position.set(505.1, 101.7, 1)
    pg_007.attach(pg_014);
    pg_014.position.set(195, 101.7, 1)
    pg_007.attach(pg_015);
    pg_015.position.set(-3, 160, -224)
    pg_007.attach(pg_016);
    pg_016.position.set(-3, 160, 75)
    pg_007.attach(pg_017);
    pg_017.position.set(-3, 160, 289)
    pg_007.attach(pg_018);
    pg_018.position.set(-3, 160, 489)
    pg_007.attach(pg_019);
    pg_019.position.set(-3, 160, 715)
    pg_007.attach(pg_020);
    pg_020.position.set(-3, 160, 964.0001)
    pg_007.attach(pg_021);
    pg_021.position.set(0, 0, 0)
    pg_007.attach(pg_022);
    pg_022.position.set(0, 0, 0)
    pg_007.attach(pg_023);
    pg_023.position.set(0, 0, 0)
    pg_007.attach(pg_024);
    pg_024.position.set(0, 0, 0)
    pg_007.attach(pg_025);
    pg_025.position.set(4, 399, -839.0001)
    loaderblock.load('gp_001_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_001.attach(child);
        });
        pg_001.attach(object);
    });
    loaderblock.load('gp_003_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_003.attach(child);
        });
        pg_003.attach(object);
    });
    loaderblock.load('gp_003_m7.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m7;
            };
            pg_003.attach(child);
        });
        pg_003.attach(object);
    });
    loaderblock.load('gp_004_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_004.attach(child);
        });
        pg_004.attach(object);
    });
    loaderblock.load('gp_004_m7.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m7;
            };
            pg_004.attach(child);
        });
        pg_004.attach(object);
    });
    loaderblock.load('gp_005_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_005.attach(child);
        });
        pg_005.attach(object);
    });
    loaderblock.load('gp_005_m7.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m7;
            };
            pg_005.attach(child);
        });
        pg_005.attach(object);
    });
    loaderblock.load('gp_008_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_008.attach(child);
        });
        pg_008.attach(object);
    });
    loaderblock.load('gp_009_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_009.attach(child);
        });
        pg_009.attach(object);
    });
    loaderblock.load('gp_010_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_010.attach(child);
        });
        pg_010.attach(object);
    });
    loaderblock.load('gp_011_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_011.attach(child);
        });
        pg_011.attach(object);
    });
    loaderblock.load('gp_012_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_012.attach(child);
        });
        pg_012.attach(object);
    });
    loaderblock.load('gp_013_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_013.attach(child);
        });
        pg_013.attach(object);
    });
    loaderblock.load('gp_014_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_014.attach(child);
        });
        pg_014.attach(object);
    });
    loaderblock.load('gp_015_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_015.attach(child);
        });
        pg_015.attach(object);
    });
    loaderblock.load('gp_016_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_016.attach(child);
        });
        pg_016.attach(object);
    });
    loaderblock.load('gp_017_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_017.attach(child);
        });
        pg_017.attach(object);
    });
    loaderblock.load('gp_018_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_018.attach(child);
        });
        pg_018.attach(object);
    });
    loaderblock.load('gp_019_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_019.attach(child);
        });
        pg_019.attach(object);
    });
    loaderblock.load('gp_020_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_020.attach(child);
        });
        pg_020.attach(object);
    });
    loaderblock.load('gp_025_m6.fbx', function(object) {
        countLoadedModel();
        gpcount++;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.material = _m6;
            };
            pg_025.attach(child);
        });
        pg_025.attach(object);
    });
    v_002 = {};
    createCssObj(v_002, '960px', '540px', 1, '#737373', -0.3623679, 458.5718, -875, 0, 0, 0, 0.9354166, 0.9354166, _scene_css, 898, 505.125, _scene);
    addIframeContent(v_002, 'http://127.0.0.1:8848/lingjing-site/video.html', 'v_002');
    v_004 = new Date();
}

function animate() {
    if (_customUniformsCubemap[0].colorInterpolation.value < 1) {
        for (var i = 0; i < 6; i++) {
            _customUniformsCubemap[i].colorInterpolation.value += _clockDelta;
        }
        if (_customUniformsCubemap[0].colorInterpolation.value >= 1) {
            for (var i = 0; i < 6; i++) {
                _customUniformsCubemap[i].mainTexture.value = _customUniformsCubemap[i].backTexture.value;
                _customUniformsCubemap[i].colorInterpolation.value = 1;
            }
        }
    }
    checkControlsFPSChange(_controls);
    updateActions();
    _clockDelta = _clock.getDelta();
    _controls.update();
    if (_startClick == true) {
        _counterClick += _clockDelta;
    }
    if (_checkForFPS) {
        checkFPSSpeed();
    }
    if (_isOnDepthView == true && _supportsDepthExtension == true) {
        _renderer.setRenderTarget(_depthTarget);
        _renderer.render(_scene, _camera);
        _renderer.setRenderTarget(null);
        _renderer.render(_postDepthScene, _postDepthCamera);
    }
    _renderer.render(_scene, _camera);
    _renderer.setAnimationLoop(animate);
    _renderer_css.render(_scene_css, _camera);
}
//debug here
function windowResize() {
    _camera.aspect = _container.clientWidth / _container.clientHeight;
    _camera.updateProjectionMatrix();
    _renderer.setSize(_container.clientWidth, _container.clientHeight);
    _renderer_rect = _renderer.domElement.getBoundingClientRect();
    var dpr = _renderer.getPixelRatio();
    _depthTarget.setSize(_container.clientWidth * dpr, _container.clientHeight * dpr);
    _renderer.setSize(_container.clientWidth, _container.clientHeight);
    _renderer_css.setSize(_container.clientWidth, _container.clientHeight);
}

function checkControlsFPSChange(tarControl) {
    if (_isOnFPS == false) {
        {
            if (tarControl.onFPSView == true) {
                _isOnFPS = true;
                onControlsFPSChange(tarControl, true);
            }
        }
    } else {
        if (tarControl.onFPSView == false) {
            _isOnFPS = false;
            onControlsFPSChange(tarControl, false);
        }
    }
}

function onControlsFPSChange(tarControl, fpsActive) {
    if (fpsActive == true) {
        pg_006.visible = true;
    }
    if (fpsActive == false) {
        pg_006.visible = false;
    }
}
// document.getElementById('first-person-view').onclick = function() {
//     ZoomTo(_controls, 0, 165, 703.0001, 0);
// }
// document.getElementById('default-3d-view').onclick = function() {
//     ZoomOut(_controls);
// }

function hammerTap(e) {
    _touchHammerEvent = e;
    _mouse.x = ((e.center.x - _renderer_rect.left) / _renderer_rect.width) * 2 - 1;
    _mouse.y = -((e.center.y - _renderer_rect.top) / _renderer_rect.height) * 2 + 1;
    if (_touchHammerEvent.tapCount == 1) {
        simpleClick();
    }
}

function loadActions() {
    setTimeout(loadAfterTime, 2000);
    pg_002.visible = false;
    pg_002.scale.set(0.001, 0.001, 0.001);
 
    loadExpoTalk();
    v_001 = true;
}

function initActions() {
    _LoadCubemapTextures(['./files/v_000.jpg', './files/v_000.jpg', './files/v_000.jpg', './files/v_000.jpg', './files/v_000.jpg', './files/v_000.jpg'], _ChangeCubeMapTextures);
}

function updateActions() {}
//end Debug
function simpleClick() {
    _raycaster.setFromCamera(_mouse, _camera);
    var at_1 = _raycaster.intersectObjects(pg_000.children, true);
    if (at_1.length > 0) {
        if (at_1[0].object.parent == pg_005) {
            loadExpoTalk();
        }
        if (at_1[0].object.parent == pg_004) {
            if (v_003 != null) {
                if (v_003.pauseVideo != null) {
                    v_003.pauseVideo();
                }
            }
        }
        if (at_1[0].object.parent == pg_003) {
            if (v_003 != null) {
                if (v_003.playVideo != null) {
                    v_003.playVideo();
                }
            }
        }
        // if (at_1[0].object.parent == pg_001) {
        //     //window.open('https://mexicoteamo.azurewebsites.net/ferias/expo_concaem_2020/', '_self');
        // }
    } else {
        _raycaster.setFromCamera(_mouse, _camera);
        var at_0 = _raycaster.intersectObjects(pg_007.children, true);
        if (at_0.length > 0) {
            if (at_0[0].object.parent == pg_008) {
                ZoomTo(_controls, -3, 286, -467, 0);
            }
            if (at_0[0].object.parent == pg_009) {
                ZoomTo(_controls, -828, 101.7, 1, 0);
            }
            if (at_0[0].object.parent == pg_010) {
                ZoomTo(_controls, -515, 101.7, 1, 0);
            }
            if (at_0[0].object.parent == pg_011) {
                ZoomTo(_controls, -200, 101.7, 1, 0);
            }
            if (at_0[0].object.parent == pg_013) {
                ZoomTo(_controls, 505.1, 101.7, 1, 0);
            }
            if (at_0[0].object.parent == pg_012) {
                ZoomTo(_controls, 826.2, 101.7, 1, 0);
            }
            if (at_0[0].object.parent == pg_014) {
                ZoomTo(_controls, 195, 101.7, 1, 0);
            }
            if (at_0[0].object.parent == pg_015) {
                ZoomTo(_controls, -3, 160, -224, 0);
            }
            if (at_0[0].object.parent == pg_016) {
                ZoomTo(_controls, -3, 160, 75, 0);
            }
            if (at_0[0].object.parent == pg_017) {
                ZoomTo(_controls, -3, 160, 289, 0);
            }
            if (at_0[0].object.parent == pg_018) {
                ZoomTo(_controls, -3, 160, 489, 0);
            }
            if (at_0[0].object.parent == pg_019) {
                ZoomTo(_controls, -3, 160, 715, 0);
            }
            if (at_0[0].object.parent == pg_020) {
                ZoomTo(_controls, -3, 160, 964.0001, 0);
            }
        }
    }

};

function loadAfterTime() {
    setTimeout(loadAfterTimeRemove, 1200);
    document.getElementsByClassName('loading-screen')[0].style.opacity = '0';
};

function loadAfterTimeRemove() {
    document.getElementsByClassName('loading-screen')[0].style.display = 'none';
};

function loadExpoTalk() {
    // After Date (UTC): 3/25/2021 6:00:00 AM
    // Before Date (UTC): 3/25/2021 8:00:00 AM
    //v_004 = new Date();
    // if (v_004.getTime() >= 1616652000000 && v_004.getTime() < 1616659200000) {
    //     if (v_003 != null) {
    //         setTimeout(() => {
    //             v_003.cueVideoById('YvudM4I2LFM', Math.floor(((v_004.getTime() - 1616652000000) / 1000)));
    //             if (v_003.playVideo != null) {
    //                 v_003.playVideo();
    //             }
    //         }, 1000);
    //     }
    //     pg_002.visible = true;
    //     pg_002.scale.set(1, 1, 1);
    // }
    // After Date (UTC): 3/25/2021 4:00:00 PM
    // Before Date (UTC): 3/26/2021 2:00:00 AM
    // if (v_004.getTime() >= 1616688000000 && v_004.getTime() < 1616724000000) {
    //     if (v_003 != null) {
    //         setTimeout(() => {
    //             v_003.cueVideoById('5Y7cT_Od2ts', Math.floor(((v_004.getTime() - 1616688000000) / 1000)));
    //             if (v_003.playVideo != null) {
    //                 v_003.playVideo();
    //             }
    //         }, 1000);
    //     }
    //     pg_002.visible = true;
    //     pg_002.scale.set(1, 1, 1);
    // }
};

function _ChangeCubeMapTextures(textures) {
    _cubemapSkybox.visible = true;
    for (var i = 0; i < 6; i++) {
        _customUniformsCubemap[i].colorInterpolation.value = 0;
        _customUniformsCubemap[i].backTexture.value = textures[i];
    }
}

function ZoomTo(tarControl, x, y, z, yoffset = 0) {
    if (tarControl.zoomOut) {
        tarControl.zoomOut = false;
        tarControl.inverseRotate = true;
        tarControl.targetZoomTo.set(x, y + yoffset, z);
        tarControl.isZooming = true;
        tarControl.zoomOnce = true;
    } else {
        tarControl.resetZoomCounter(1);
        tarControl.targetZoomTo.set(x, y + yoffset, z);
        tarControl.isZooming = true;
        tarControl.zoomOnce = true;
    }
}

function ZoomOut(tarControl) {
    if (!tarControl.zoomOut) {
        tarControl.isZooming = true;
        tarControl.zoomOnce = true;
        tarControl.zoomOut = true;
        tarControl.inverseRotate = false;
    } else {
        ZoomTo(tarControl, _stdPosition.x, _stdPosition.y, _stdPosition.z);
    }
}

function checkFPSSpeed() {
    if (_FPSAverage.length < 90) {
        if (_clockDelta < 1) {
            _FPSAverage.push(_clockDelta)
        }
    } else {
        _checkForFPS = false;
        var sum = 0;
        for (var i = 1; i < _FPSAverage.length; i++) {
            sum += _FPSAverage[i];
        }
        var av = sum / (_FPSAverage.length - 1);
        if (av > 0.05) {
            setRenderDeviceRatio(0.5);
        } else if (av > 0.033) {
            setRenderDeviceRatio(0.75);
        }
    }
}

function setRenderDeviceRatio(value) {
    _renderer.setPixelRatio(window.devicePixelRatio * value);
    _renderer.setSize(_container.clientWidth, _container.clientHeight);
}

function post_vert_shader() {
    return `varying vec2 vUv;
void main(){
vUv = uv;
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`
}

function post_frag_shader() {
    return `#include <packing>
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;
float readDepth(sampler2D depthSampler, vec2 coord){
float fragCoordZ = texture2D(depthSampler, coord).x;
float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
}
void main()
{
float depth = readDepth(tDepth, vUv);
gl_FragColor.rgb = 1.0 - vec3(depth);
gl_FragColor.a = 1.0;
}`
}

function setupDepthPost() {
    _postDepthCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    _postDepthMaterial = new THREE.ShaderMaterial({
        vertexShader: post_vert_shader(),
        fragmentShader: post_frag_shader(),
        uniforms: {
            cameraNear: { value: _depthMin },
            cameraFar: { value: _depthFar },
            tDiffuse: { value: _depthTarget.texture },
            tDepth: { value: _depthTarget.depthTexture }
        }
    });
    var postPlane = new THREE.PlaneBufferGeometry(2, 2);
    var postQuad = new THREE.Mesh(postPlane, _postDepthMaterial);
    _postDepthScene = new THREE.Scene();
    _postDepthScene.add(postQuad);
}

function createPlaneStencilGroup(geometry, plane, renderOrder) {
    var group = new THREE.Group();
    var baseMat = new THREE.MeshBasicMaterial();
    baseMat.depthWrite = false;
    baseMat.depthTest = false;
    baseMat.colorWrite = false;
    baseMat.stencilWrite = true;
    baseMat.stencilFunc = THREE.AlwaysStencilFunc;
    var mat0 = baseMat.clone();
    mat0.side = THREE.BackSide;
    mat0.clippingPlanes = [plane];
    mat0.stencilFail = THREE.IncrementWrapStencilOp;
    mat0.stencilZFail = THREE.IncrementWrapStencilOp;
    mat0.stencilZPass = THREE.IncrementWrapStencilOp;
    var mesh0 = new THREE.Mesh(geometry, mat0);
    mesh0.renderOrder = renderOrder;
    group.add(mesh0);
    var mat1 = baseMat.clone();
    mat1.side = THREE.FrontSide;
    mat1.clippingPlanes = [plane];
    mat1.stencilFail = THREE.DecrementWrapStencilOp;
    mat1.stencilZFail = THREE.DecrementWrapStencilOp;
    mat1.stencilZPass = THREE.DecrementWrapStencilOp;
    var mesh1 = new THREE.Mesh(geometry, mat1);
    mesh1.renderOrder = renderOrder;
    group.add(mesh1);
    return group;
}

function createStencil(geometry, planes, parent = _scene, offsetPosition = new THREE.Vector3(0, 0, 0)) {
    var planeObjResult = [];
    var planeGeom = new THREE.PlaneBufferGeometry(3000, 3000);
    for (var i = 0; i < planes.length; i++) {
        var poGroup = new THREE.Group();
        var plane = planes[i];
        var stencilGroup = createPlaneStencilGroup(geometry, plane, i + 1);
        var planeMat = new THREE.MeshStandardMaterial({
            color: 0xE91E63,
            metalness: 0.1,
            roughness: 0.75,
            clippingPlanes: planes.filter(p => p !== plane),
            stencilWrite: true,
            stencilRef: 0,
            stencilFunc: THREE.NotEqualStencilFunc,
            stencilFail: THREE.ReplaceStencilOp,
            stencilZFail: THREE.ReplaceStencilOp,
            stencilZPass: THREE.ReplaceStencilOp,
        });
        var po = new THREE.Mesh(planeGeom, planeMat);
        //po.onAfterRender = function(renderer )
        //{
        //renderer.clearStencil();
        //};
        po.renderOrder = i + 1.1;
        stencilGroup.position.add(offsetPosition);
        parent.add(stencilGroup);
        poGroup.add(po);
        planeObjResult.push(po);
        poGroup.position.add(offsetPosition);
        parent.add(poGroup);
    }
    return planeObjResult;
}

function updateStencil() {
    for (var i = 0; i < _clipPlanes_objects.length; i++) {
        for (var j = 0; j < _clipPlanes_objects[i].length; j++) {
            var plane = _clipPlanes[j];
            var po = _clipPlanes_objects[i][j];
            plane.coplanarPoint(po.position);
            po.lookAt(
                po.position.x - plane.normal.x,
                po.position.y - plane.normal.y,
                po.position.z - plane.normal.z,
            );
        }
    }
}

function createStencilMaterial(mat) {
    var newmat = mat.clone();
    newmat.clipShadows = true;
    newmat.clippingPlanes = _clipPlanes;
    newmat.shadowSide = THREE.DoubleSide;
    return newmat;
}

function _LoadCubemapTextures(cubeTextures, onLoaded) {
    var finalTextures = new Array(6);
    var manager = new THREE.LoadingManager(function() {
        if (onLoaded && typeof onLoaded === 'function') {
            onLoaded(finalTextures);
        }
    });
    var loader = new THREE.TextureLoader(manager);
    loader.load(cubeTextures[0], function(texture) { finalTextures[0] = texture });
    loader.load(cubeTextures[1], function(texture) { finalTextures[1] = texture });
    loader.load(cubeTextures[2], function(texture) { finalTextures[2] = texture });
    loader.load(cubeTextures[3], function(texture) { finalTextures[3] = texture });
    loader.load(cubeTextures[4], function(texture) { finalTextures[4] = texture });
    loader.load(cubeTextures[5], function(texture) { finalTextures[5] = texture });
}

function createCssObj(cssobj, cssreswidth, cssresheight, cssopacity, csscolor, cssposx, cssposy, cssposz, cssrotx, cssroty, cssrotz, cssscalewidth, cssscaleheight, cssscene, geowidth, geoheight, webglscene) {
    cssobj.div = document.createElement('div');
    cssobj.div.style.width = cssreswidth;
    cssobj.div.style.height = cssresheight;
    cssobj.div.style.opacity = cssopacity;
    cssobj.div.style.background = csscolor;
    cssobj.dom = new CSS3DObject(cssobj.div);
    cssobj.dom.position.set(cssposx, cssposy, cssposz);
    cssobj.dom.rotation.set(cssrotx, cssroty, cssrotz);
    cssobj.dom.scale.set(cssscalewidth, cssscaleheight, 1);
    cssscene.add(cssobj.dom);
    cssobj.geo = new THREE.PlaneGeometry(geowidth, geoheight);
    cssobj.mesh = new THREE.Mesh(cssobj.geo, _css_crop_material);
    cssobj.mesh.position.copy(cssobj.dom.position);
    cssobj.mesh.rotation.copy(cssobj.dom.rotation);
    cssobj.mesh.castShadow = false;
    cssobj.mesh.receiveShadow = true;
    webglscene.add(cssobj.mesh);
}

function addCssContent(cssobj, csscontent, csseditable) {
    cssobj.div.textContent = csscontent;
    cssobj.div.setAttribute('contenteditable', csseditable);
}

function addIframeContent(cssobj, iframepage, iframeid) {
    cssobj.iframe = document.createElement('iframe');
    cssobj.iframe.style.width = cssobj.div.style.width;
    cssobj.iframe.style.height = cssobj.div.style.height;
    cssobj.iframe.style.border = '0px';
    cssobj.iframe.src = iframepage;
    cssobj.iframe.id = iframeid;
    cssobj.iframe.allow = 'autoplay';
    cssobj.div.appendChild(cssobj.iframe);
}

function countLoadedTexture() {
    txtCount += 1;
    if (txtCount == 13) {
        txtrloaded = true;
        onLoadedTextures();
        if (objrloaded == true)
            onLoaded();
    }
}

function onLoadedTextures() {
    console.log('finished loading textures');
}

function countLoadedModel() {
    objCount += 1;
    if (objCount == 29) {
        objrloaded = true;
        onLoadedModels();
        if (txtrloaded == true)
            onLoaded();
    }
}

function onLoadedModels() {
    console.log('finished loading models');
}

function onLoaded() {
    console.log('finished loading');
    setTimeout(function() { _checkForFPS = true; }, 3000);
    loadActions();
}
})();