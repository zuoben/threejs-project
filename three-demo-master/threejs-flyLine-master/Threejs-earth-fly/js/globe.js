var log = console.log.bind(console);

var globeObj = (function () {
  'use strict';


  var container, stats;
  var camera, scene, renderer;
  var group;
  var mouseX = 0,
    mouseY = 0;
  var winWth = window.innerWidth,
    winHgt = window.innerHeight;

  // 获取position
  function getPosition(lng, lat, alt) {
    var phi = (90 - lat) * (Math.PI / 180),
      theta = (lng + 180) * (Math.PI / 180),
      radius = alt + 200,
      x = -(radius * Math.sin(phi) * Math.cos(theta)),
      z = (radius * Math.sin(phi) * Math.sin(theta)),
      y = (radius * Math.cos(phi));
    return {
      x: x,
      y: y,
      z: z
    };
  }

  // 飞机
  function plane() {

    // 飞机标记
    var planeMarkers = {};

    // 飞机形状
    var planeShape = new THREE.Shape();
    planeShape.moveTo(0, 0);
    planeShape.lineTo(0.2, -0.2);
    planeShape.lineTo(0.2, -1.3);
    planeShape.lineTo(1.6, -2.7);
    planeShape.lineTo(1.6, -3);
    planeShape.lineTo(0.2, -2.1);
    planeShape.lineTo(0.2, -3);
    planeShape.lineTo(0.5, -3.4);
    planeShape.lineTo(0.5, -3.7);
    planeShape.lineTo(0, -3.3);
    planeShape.lineTo(-0.5, -3.7);
    planeShape.lineTo(-0.5, -3.4);
    planeShape.lineTo(-0.2, -3);
    planeShape.lineTo(-0.2, -2.1);
    planeShape.lineTo(-1.6, -3);
    planeShape.lineTo(-1.6, -2.7);
    planeShape.lineTo(-0.2, -1.3);
    planeShape.lineTo(-0.2, -0.2);
    var planeGeometry = new THREE.ShapeGeometry(planeShape);
    // 飞机材质
    var planeMaterial = new THREE.MeshPhongMaterial({
      color: 0x0FB4DD,
      side: THREE.DoubleSide,
      depthTest: true
    });
    // 添加飞机
    function addPlane(item) {
      if (item.anum && item.lng && item.lat) {
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        // 旋转
        plane.rotation.z = THREE.Math.degToRad(item.ang);
        // 定位
        var position = getPosition(item.lng, item.lat, 5);
        plane.position.set(position.x, position.y, position.z);
        // 显示/隐藏
        // plane.visible = false;
        // 保存
        planeMarkers[item.anum] = plane;
        // 添加到场景
        group.add(plane);
        // 绘制历史轨迹
        drawHistoryTrack(item.anum);
      }
    }

    // 时间段
    var curTime = Date.parse(new Date()) / 1000;
    var depTime = curTime - 30 * 60;
    // 轨迹线质
    var trackMaterial = new THREE.LineBasicMaterial({
      color: 0x1B94B1
    });
    // 绘制历史轨迹
    function drawHistoryTrack(anum) {
      socket.emit("fullPath", anum, depTime, curTime, function (status, data) {
        if (status) {
          var dLength = data.length;
          if (dLength >= 2) {
            var trackCoordArr = [];
            for (var i = 0; i < dLength; i++) {
              if (data[i].lng && data[i].alt) {
                trackCoordArr.push({
                  lng: data[i].lng,
                  lat: data[i].lat
                });
              }
            }

            var tcaLength = trackCoordArr.length;
            if (tcaLength >= 2) {
              var tcaHalfLength = Math.ceil(tcaLength / 2),
                tcaRemainLength = tcaLength - tcaHalfLength,
                vertexArr = [];

              /* 所有点
              for(var j=0; j<tcaHalfLength; j++) {
              var p1 = getPosition(trackCoordArr[j].lng, trackCoordArr[j].lat, j*0.05);
              vertexArr.push(new THREE.Vector3(p1.x, p1.y, p1.z)); 
              }
              for(var k=tcaRemainLength; k>0; k--) {
              var p2 = getPosition(trackCoordArr[tcaLength-k].lng, trackCoordArr[tcaLength-k].lat, k*0.05);
              vertexArr.push(new THREE.Vector3(p2.x, p2.y, p2.z)); 
              }
              
              var trackCurve = new THREE.CatmullRomCurve3(vertexArr);
              */

              // 三个点
              var p1 = getPosition(trackCoordArr[0].lng, trackCoordArr[0].lat, 0),
                p2 = getPosition(trackCoordArr[tcaHalfLength].lng, trackCoordArr[tcaHalfLength].lat, tcaLength * 0.01),
                p3 = getPosition(trackCoordArr[tcaLength - 1].lng, trackCoordArr[tcaLength - 1].lat, 0);

              var trackCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(p1.x, p1.y, p1.z),
                new THREE.Vector3(p2.x, p2.y, p2.z),
                new THREE.Vector3(p3.x, p3.y, p3.z)
              ]);

              var trackGeometry = new THREE.Geometry(),
                verticesArr = trackCurve.getPoints(tcaLength);

              trackGeometry.vertices = verticesArr;

              var trackLine = new THREE.Line(trackGeometry, trackMaterial);
              group.add(trackLine);

              // 动画点
              addLightPoint(p1, tcaLength, verticesArr);
            }
          }
        }
      });
    }

    // 点动画
    var pointGeometry = new THREE.SphereGeometry(0.2, 20, 20);
    var pointMaterial = new THREE.MeshBasicMaterial({
      color: 0x40E0D0
    });

    function addLightPoint(pos, coordsNum, verArr) {
      var pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
      pointMesh.position.set(pos.x, pos.y, pos.z);
      group.add(pointMesh);

      var index = 0;

      function pointAnimate() {
        index++;
        if (index > coordsNum) {
          index = 0;
        }
        pointMesh.position.set(verArr[index].x, verArr[index].y, verArr[index].z);
        requestAnimationFrame(pointAnimate);
      }
      pointAnimate();

      /*var curveGeometry = new THREE.Geometry(); 
      var curveData = new THREE.CatmullRomCurve3(verArr.slice(0, 10)); 
      curveGeometry.vertices = curveData.getPoints(10);

      var curveMaterial = new THREE.LineBasicMaterial({color: 0x40E0D0});
      var curveLine = new THREE.Line(curveGeometry, curveMaterial);
      group.add(curveLine);

      var index = 0;
      function lineAnimate() {
      index++;
      if(index>coordsNum-10) {
       index = 0;
      }
      var offsetData = verArr.slice(index, 10+index);
      if(offsetData.length > 0) {
       curveData = new THREE.CatmullRomCurve3(offsetData); 
       curveLine.geometry.vertices = curveData.getPoints(10);
       curveLine.geometry.verticesNeedUpdate = true;
      }
      requestAnimationFrame(lineAnimate);
      }
      lineAnimate();*/
    }

    // 监听数据(添加并更新)
    // socket.on('~', function (res) {
    //   if ($.isEmptyObject(planeMarkers)) {
    //     $.each(res, function (i, item) {
    //       addPlane(item);
    //     });
    //   } else {
    //     $.each(res, function (i, item) {
    //       if (planeMarkers[item.anum]) {
    //         if (item.lng && item.lat) {
    //           var pos = getPosition(item.lng, item.lat, 5);
    //           planeMarkers[item.anum].position.set(pos.x, pos.y, pos.z);
    //         }
    //       } else {
    //         addPlane(item);
    //       }
    //     });
    //   }
    // });
  }

  // 地球
  function globe() {
    var globeTextureLoader = new THREE.TextureLoader();
    globeTextureLoader.load('../three.js绘制地球飞机与轨迹的效果示例/images/earth.jpg', function (texture) {
      var globeGgeometry = new THREE.SphereGeometry(200, 100, 100);
      var globeMaterial = new THREE.MeshStandardMaterial({
        map: texture
      });
      var globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
      group.add(globeMesh);
      group.rotation.x = THREE.Math.degToRad(35);
      group.rotation.y = THREE.Math.degToRad(170);
    });
  }

  // 星点
  function stars() {
    var starsGeometry = new THREE.Geometry();
    for (var i = 0; i < 2000; i++) {
      var starVector = new THREE.Vector3(
        THREE.Math.randFloatSpread(2000),
        THREE.Math.randFloatSpread(2000),
        THREE.Math.randFloatSpread(2000)
      );
      starsGeometry.vertices.push(starVector);
    }
    var starsMaterial = new THREE.PointsMaterial({
      color: 0x888888
    })
    var starsPoint = new THREE.Points(starsGeometry, starsMaterial);
    group.add(starsPoint);
  }

  // 光
  function lights() {
    var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 2);
    hemisphereLight.position.x = 0;
    hemisphereLight.position.y = 0;
    hemisphereLight.position.z = -200;
    group.add(hemisphereLight);
  }

  // 初始化
  function init() {
    container = document.getElementById('zh_globe_container');

    scene = new THREE.Scene();
    var bgTexture = new THREE.TextureLoader().load("../three.js绘制地球飞机与轨迹的效果示例/images/starfield.jpg");
    scene.background = bgTexture;

    camera = new THREE.PerspectiveCamera(50, winWth / winHgt, 1, 2000);
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 400;
    camera.lookAt(0, 0, 0);

    group = new THREE.Group();
    scene.add(group);

    // 地球 
    globe();

    // 飞机
    plane();

    // 星点
    stars();

    // 半球光
    lights();

    // 渲染器
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(winWth, winHgt);
    container.appendChild(renderer.domElement);

    // 盘旋控制
    var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControl.minDistrance = 20;
    orbitControl.maxDistrance = 50;
    orbitControl.maxPolarAngle = Math.PI / 2;

    // 性能测试
    // stats = new Stats();
    // container.appendChild(stats.dom);

    // resize事件
    window.addEventListener('resize', onWindowResize, false);
  }

  // 窗口大小改变
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // 渲染
  function render() {
    group.rotation.y -= 0.0005;
    renderer.render(scene, camera);
  }

  // 动画
  function animate() {
    requestAnimationFrame(animate);
    render();
    // stats.update();
  }

  init();
  animate();
})();