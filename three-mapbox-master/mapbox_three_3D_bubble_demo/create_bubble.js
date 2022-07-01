    var map = window.map;

    var json = getjson(),resultJson = [];

    //自定义地图坐标、海拔高度、比例尺等要素
    var modelOrigin = [104.035249,30.581058];
    var modelAltitude = 0;
    var modelRotate = [Math.PI / 2, 0, 0];
    var modelScale =  5.41843220338983e-8;

    for (var i = 0;i < json.features.length;i++) {
        var features = json.features;
        var coordinates = features[i].geometry.coordinates;
        var value = features[i].properties.value;

        var modelTransform = {
            id: features[i].properties.id,
            name: features[i].properties.name,
            value: value,
            translateX: mapboxgl.MercatorCoordinate.fromLngLat(coordinates, value).x,
            translateY: mapboxgl.MercatorCoordinate.fromLngLat(coordinates, value).y,
            translateZ: mapboxgl.MercatorCoordinate.fromLngLat(coordinates, value).z,
            rotateX: modelRotate[0],
            rotateY: modelRotate[1],
            rotateZ: modelRotate[2],
            scale: modelScale
        };
        resultJson.push(modelTransform);
    }
    // 添加canvas文字
    function addContext(title,message) {
        //用canvas生成图片
        let canvas = document.createElement('canvas')
        canvas.id = "canvas_message";
        let ctx = canvas.getContext('2d')
        canvas.width = 300;
        canvas.height = 115;
        //制作矩形
        ctx.fillStyle = "#325f7c";
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        //设置文字
        ctx.fillStyle = "#ccc";
        ctx.font = 'normal 28pt "楷体"'
        ctx.fillText(title, 15, 50);
        let textWord = message;
        //文字换行
        let len = parseInt(textWord.length / 10)
        for (let i = 0; i < (len + 1); i++) {
            let space = 10
            if (i === len) {
                space = textWord.length - len * 10
            }
            let word = textWord.substr(i * 10, space)
            ctx.fillText(word, 15, 90*(i + 1))
        }
        
        let url = canvas.toDataURL('image/png');
        return url;
    }
        
    var THREE = window.THREE;
    var camera,scene;
    // 用THREE.JS创建mapbox图层
    var customLayer = {
        id: '3d-model',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function(map, gl) {
            //初始化场景和相机
            this.camera = new THREE.Camera();
            this.scene = new THREE.Scene();
            camera = this.camera,scene = this.scene;
            // 光源1
            var directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(0, -70, 100).normalize();
            this.scene.add(directionalLight);
            // 光源2
            var directionalLight2 = new THREE.DirectionalLight(0xffffff);
            directionalLight2.position.set(0, 70, 100).normalize();
            this.scene.add(directionalLight2);

            //设置纹理图片贴到3D模型上
            var textureLoader = new THREE.TextureLoader();
            var texture = textureLoader.load('img/e1.jpg');

            //图片水平反转
            texture.flipY = false;

            for (var i = 0;i < json.features.length;i++) {
                 //设置属性
                var name = features[i].properties.name;
                var userData = features[i].properties.value;
                var url = addContext(name,userData + '');
                let geometry1 = new THREE.PlaneGeometry(30, 30);
                let texture2 = THREE.ImageUtils.loadTexture(url, null, function (t) {})

                //(半径、经线数、纬线数)
                var sphereGeometry = new THREE.SphereBufferGeometry(20,30,30);
                //灯光位置变化
                sphereGeometry.scale(-1,-1,1);
                //启用场景雾化(颜色、远光距离、近光距离)
                this.scene.fog = new THREE.Fog(0xd3d3d3,100,-50000);
                var sphereMaterial = new THREE.MeshLambertMaterial({
                    color: features[i].properties.color,
                    color: 0xffffff,
                    wireframe: false,
                    map: texture,  //设置纹理贴图
                    transparent:true,
                    opacity: 0.1    //透明度
                });
                sphereMaterial.depthWrite = false;

                var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
                sphere.geometry.verticesNeedUpdate = true;
                sphere.geometry.normalsNeedUpdate = true;
                //sphere.position.x = 0;
                //sphere.position.y = 0;
                //sphere.position.z = 0;

                //放大倍数（官方翻译为缩放向量）
                this.scene.scale.multiplyScalar(1.5);
                sphere.name = name;
                sphere.userData = userData;
                this.scene.add(sphere);

                //标题牌
                var sphereMaterial2 = new THREE.MeshBasicMaterial({
                    map: texture2,
                    transparent:true,
                    opacity: 0.8    //透明度
                });
                sphereMaterial2.depthWrite = false;
                let rect = new THREE.Mesh(geometry1, sphereMaterial2);
                rect.name = name + "rect";
                rect.position.set(43, 0, 0)
                this.scene.add(rect);
            };
        
            this.map = map;
            
            // use the Mapbox GL JS map canvas for three.js
            this.renderer = new THREE.WebGLRenderer({
                canvas: map.getCanvas(),
                context: gl,
                antialias: true, //抗锯齿开启
                preserveDrawingBuffer: true //开启预渲染缓存
            });
            
            this.renderer.autoClear = false;
        },
        render: function(gl, matrix) {
            for (var i = 0;i < resultJson.length;i++) {
                var modelTransform = resultJson[i];
                var rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), modelTransform.rotateX);
                var rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), modelTransform.rotateY);
                var rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), modelTransform.rotateZ);

                // 
                var sphere = this.scene.getObjectByName(modelTransform.name),
                    sphere_rect = this.scene.getObjectByName(modelTransform.name + "rect");
    
                var m = new THREE.Matrix4().fromArray(matrix);
                var l = new THREE.Matrix4().makeTranslation(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ)
                                            .scale(new THREE.Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale))
                                            .multiply(rotationX)
                                            .multiply(rotationY)
                                            .multiply(rotationZ);
                

                //球体旋转转速 '+='向右  '-='向左
                if (sphere && sphere_rect) {
                    sphere.rotation.y += .005; 
                    sphere_rect.rotation.y += .00005;
                } else {
                    console.log("sphere,sphere_rect 不存在！");
                    return false;
                } 
                
                //三维动画上升效果 
                if (sphere.position.y < 100) {
                    sphere.position.y += .05;   //上升速度
                    sphere_rect.position.y += .05;
                } else {
                    sphere.position.y = .2;
                    sphere_rect.position.y = .2;
                }

                this.camera.projectionMatrix.elements = matrix;
                this.camera.projectionMatrix = m.multiply(l);
                this.renderer.state.reset();
                this.renderer.render(this.scene, this.camera);
            }
            
            //地图重复绘制每一帧
            this.map.triggerRepaint();
        }
    };


    map.on('load', function () {
        map.addSource('maine', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [[]]
                }
            }
        });
            map.addLayer({
                'id': 'maine',
                'type': 'fill',
                'source': 'maine',
                'layout': {},
                'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.8
            }
        });

        map.addLayer(customLayer, 'maine');
    });
