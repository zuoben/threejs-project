    var map = window.map;
    var highlighted = [];
    map.on('load', function () {

        // Initialize threebox
        window.threebox = new Threebox(map);
        var threebox = window.threebox;
        threebox.setupDefaultLights();

        var lng = 104.070606;
        var lat = 30.611274;

        for(x=1;x<10;x++){
            for(y=1;y<=10;y++){
                var greenMaterial = new THREE.BoxGeometry(500, 500, 0);
                 var geometry = new THREE.CylinderGeometry(5,5,60,64,1,false);
                 
                    var greenMaterial = new THREE.MeshPhongMaterial( {color: 0xaaffaa, side: THREE.DoubleSide});
                    var redMaterial = new THREE.MeshPhongMaterial( {color: 0xff0000, side: THREE.DoubleSide});


                    var cube = new THREE.Mesh(greenMaterial, redMaterial);
                    cube.rotation.y += 0.5;
                    cube.userData.name = "Red cube";
                    threebox.addAtCoordinate(cube, [lng + (x/1000), lat + (y/1000), 1000], {preScale: 5.41843220338983e-8});
            }
        }

    });
  
    map.on('mousemove', function(e){

        raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();

        // Clear old objects
        highlighted.forEach(function(h) {
            h.material = redMaterial;
        });
        highlighted.length = 0;

        // scale mouse pixel position to a percentage of the screen's width and height
        mouse.x = ( e.point.x / window.threebox.map.transform.width ) * 2 - 1;
        mouse.y = -( ( e.point.y) / window.threebox.map.transform.height ) * 2 + 1;

        raycaster.setFromCamera(mouse, window.threebox.camera);

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(window.threebox.world.children, true);
        if (!intersects[0]) return
        var nearestObject = intersects[0].object;
        //console.log(nearestObject);
        nearestObject.material = greenMaterial;
        highlighted.push(nearestObject)
        
    });

    //map.showCollisionBoxes = true;