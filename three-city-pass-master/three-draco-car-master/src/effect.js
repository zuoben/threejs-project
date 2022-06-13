import {
    FBXLoader
} from 'three/examples/jsm/loaders/FBXLoader'
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader'
import {
    DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader'
import {
    RGBELoader
} from 'three/examples/jsm/loaders/RGBELoader.js';

import * as THREE from 'three'

class effectInitial {
    constructor(scene, render, colorOptions) {
        this.scene = scene;
        this.color = colorOptions;

        this.coatNames = ['EXT_Carpaint', 'INT_OCC_Carpaint'];
        this.skinNames = ['INT_OCC_Skin_GREY2'];
        this.interiorNames = ['INT_OCC_alcantara',
            'INT_Decals_Chrome_Aluminium'
        ];
        this.group = new THREE.Group();
        this.render = render;
        this.init()

        this.scene.add(this.group);
    }

    init() {

        this.pmremGenerator = new THREE.PMREMGenerator(this.render);
        this.pmremGenerator.compileEquirectangularShader();

        // const materials = ["材质", "材质.001", "smallminer_bake1_chair", "材质.004", "Mat.2"]
        const materials = ["EXT_Lights_Chrome", "EXT_Logo", "EXT_Lights_Plastic", "EXT_Rubber", "EXT_Glass", "Mirror", "EXT_Chrome", "04 - Default", "EXT_RearLight_Beam", "EXT_Calipers", "black", "EXT_Disc", "EXT_Rim", "EXT_Carpaint", "EXT_Details", "EXT_PLATE_plastic", "INT_Grid_Rear", "EXT_Plastic_Black", "EXT_FrontLight_Beam", "aagla", "INT_Decals_Flat_alfa_NM", "INT_Seams", "INT_Decals_Plastic_Base", "INT_Decals_Rubber", "INT_OCC_Carbon", "INT_OCC_Skin_GREY", "INT_OCC_Speakers", "INT_Decals_Chrome_Aluminium", "INT_OCC_Carpaint", "INT_OCC_Plastic_GREY", "INT_Decals_Flat_NM", "INT_Decals_Chrome_Alfa", "INT_Decals_Chrome_needle", "INT_Glass", "INT_Decals_Plastic_alfa_NM", "INT_OCC_Fabric_Roof", "INT_OCC_carpet_base", "INT_LCD", "GEO_Decals", "INT_OCC_alcantara", "INT_OCC_Plastic_Detail_GREY", "INT_OCC_Carpets", "INT_OCC_Plastic_Black_REF", "INT_MiniGrid_Dials", "INT_SeatBelts", "INT_OCC_SkinShift_GREY", "INT_Seam_Shift", "INT_Gauges", "INT_Decals_Plastic_REF", "INT_Decals_Metal_Alfa", "ant", "EXT_Glass_rear_Light", "EXT_Glass_flat", "02 - Default", "22 - Default", "radiar", "INT_OCC_Skin_GREY2"]
        const names = [{
                name: 'Base_Color.jpg',
                key: 'map'
            },
            {
                name: 'Mixed_AO.jpg',
                key: 'aoMap'
            },
            {
                name: 'Normal.jpg',
                key: 'normalMap'
            },
            {
                name: 'Height.jpg',
                key: 'bumpMap'
            },
            {
                name: 'Roughness.jpg',
                key: 'roughnessMap'
            },
            {
                name: 'Metallic.jpg',
                key: 'metalnessMap'
            },
        ]
        const textLoader = new THREE.TextureLoader();
        const ms = [];
        new RGBELoader()
            .setDataType(THREE.UnsignedByteType)
            .setPath('./textures/')
            .load('royal_esplanade_1k.hdr', (texture) => {

                const envMap = this.pmremGenerator.fromEquirectangular(texture).texture;

                // this.scene.background = envMap;
                this.scene.environment = envMap;

                texture.dispose();
                this.pmremGenerator.dispose();

                this.loader().then(object => {
                    this.group.add(object)
                    object.traverse((child) => {
                        if (child.name === 'Plane001') {
                            child.visible = false;
                        }
                        this.handelMaterial(child.material, (material, index) => {
                            /*    if (!ms.includes(material)) {
                                   ms.push(material.name)
                               }
                                */
                            const maps = {};
                            names.forEach((name) => {
                                maps[name.key] = textLoader.load('./map/' + material.name + '_' + name.name);
                            }); 
                            if (this.coatNames.includes(material.name)) {
                                material.color.setStyle(this.color.coat)
                            }
                            if (this.skinNames.includes(material.name)) {
                                material.color.setStyle(this.color.skin)
                            }
                            if (this.interiorNames.includes(material.name)) {
                                material.color.setStyle(this.color.interior)
                            }

                            const physical = new THREE.MeshPhysicalMaterial({
                                name: material.name,
                                color: material.color,
                                transparent: material.transparent,
                                opacity: material.opacity,
                                side: material.side,
                                aoMapIntensity: 0.3,
                                envMap: envMap,
                                clearcoat: 0.7,
                                clearcoatRoughness: 0.7,
                                ...maps
                            });

                            if (materials.includes(material.name)) {
                                if (!Array.isArray(child.material)) {
                                    child.material.dispose();
                                    child.material = physical;

                                } else {
                                    child.material[index] = physical;
                                }

                                if (physical.name === 'EXT_Glass') {
                                    physical.opacity = 0.5;
                                    physical.transparent = true;
                                    physical.side = 2;
                                }

                            } else {

                            }
                        })
                    })

                });
            });
    }

    loadTexture() {

    }

    // 外观
    setCoatColor(c) {
        // 需要替换的颜色 
        const color = new THREE.Color(c);
        this.group.traverse(child => {
            this.handelMaterial(child.material, (material, index) => {
                if (this.coatNames.includes(material.name)) {
                    material.color.copy(color);
                }
            })
        })
    }
    // 内饰颜色
    setInteriorColor(c) {
        // 需要替换的颜色
        const materialName = ['INT_OCC_alcantara',
            'INT_Decals_Chrome_Aluminium'
        ];
        const color = new THREE.Color(c);
        this.group.traverse(child => {
            this.handelMaterial(child.material, (material, index) => {
                if (this.interiorNames.includes(material.name)) {
                    material.color.copy(color);
                }
            })
        })
    }
    // 方向盘等颜色
    setSkinColor(c) {
        // 需要替换的颜色 
        const color = new THREE.Color(c);
        this.group.traverse(child => {
            this.handelMaterial(child.material, (material, index) => {
                if (this.skinNames.includes(material.name)) {
                    material.color.copy(color);
                }
            })
        })
    }

    loader() {


        return new Promise((resolve, reject) => {
            try {
                const loader = new FBXLoader();



                loader.load("./model/car.fbx", (object) => {
                    this.zoomModel(object);
                    resolve(object)
                });
                /* 
                                const loader1 = new GLTFLoader();

                                const dracoLoader = new DRACOLoader();
                                dracoLoader.setDecoderPath('./');


                                loader1.setDRACOLoader(dracoLoader);
                                loader1.load("./model/car.gltf", (gltf) => {
                                    const object = gltf.scene;

                                    this.zoomModel(object);
                                    resolve(object) 
                                });  */
            } catch (e) {
                reject(e)
            }
        })

    }

    zoomModel(object) {
        // 获取box的大小 
        object.updateWorldMatrix();

        const box = new THREE.Box3();

        box.expandByObject(object);

        const size = new THREE.Vector3();
        box.getSize(size)

        // 获取size中最大的值

        let max = size.x;
        max = size.y > max ? size.y : max;
        max = size.z > max ? size.z : max;

        const value = 1000;
        const scale = value / max;

        object.scale.set(scale, scale, scale)
    }

    handelMaterial(materials, callback) {
        if (!materials) return false;
        if (Array.isArray(materials)) {
            materials.forEach((mat, i) => {
                callback(mat, i)
            })
        } else {
            callback(materials, 0)
        }
    }
}

export default effectInitial;