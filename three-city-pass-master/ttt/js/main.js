
import * as THREE from './libs/three.min'

require('./libs/OrbitControls');
//let ctx   = canvas.getContext('2d')


/**
 * 游戏主函数
 */
export default class Main {
    constructor() {
        // 维护当前requestAnimationFrame的id
        this.start()

    }
    start(){
        this.scene =  new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
        this.camera.position.z = 400;
        //this.camera.position.set( 30, 30, 100 );
        //this.camera.lookAt(this.scene.position ); // webGL渲染
        // 同时指定canvas为小游戏暴露出来的canvas
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });

        //var geometry = new THREE.CubeGeometry(1, 1, 1);
        var geometry = new THREE.BoxBufferGeometry( 100, 100, 100 );
        //var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });


        var material = new THREE.ShaderMaterial( {
            vertexShader: [
                'void main() {',
                '   vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );',
                '   gl_Position = projectionMatrix * mvPosition;',

                '}'
            ].join( '\n' ),
            fragmentShader: [
               'void main() {',
               '    gl_FragColor = vec4(1.0,0.0,0.0,1.0);',
               '}',
            ].join('\n')

        
        } );


        this.cube = new THREE.Mesh(geometry, material); 
        this.scene.add(this.cube);

        //this.renderer.setSize(window.innerWidth, window.innerHeight);
        //this.renderer.setPixelRatio( window.devicePixelRatio );

        var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
        this.scene.add( ambientLight );
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
            //directionalLight.position.set( - 1, 1, 1 );
        this.scene.add( directionalLight );


        var controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        //controls.maxPolarAngle = Math.PI * 0.495;
        //controls.target.set( 0, 10, 0 );
        //controls.minDistance = 40.0;
        //controls.maxDistance = 200.0;
        this.camera.lookAt( controls.target );

        //var material = new THREE.Mesh(new THREE.SphereGeometry(2,20,20));
        //this.scene.add(material);
        window.requestAnimationFrame(this.loop.bind(this), canvas);

    }
    update(){
        this.cube.rotation.x += 0.005;
        this.cube.rotation.y += 0.01;
    }
    
    loop() {
        this.update()
        
        this.renderer.render(this.scene, this.camera);
        //this.renderer.render(this.sceneUI,this.cameraUI);

   //      if(this.canvas){
   //       let openDataContext = wx.getOpenDataContext();
      //    let sharedCanvas = openDataContext.canvas;  
      //    //let canvas = wx.createCanvas();    

      //    this.canvas.getContext('2d').drawImage(sharedCanvas, 0, 0);
      //    sharedCanvas.width = 400
            // sharedCanvas.height = 200

   //      }
        


        window.requestAnimationFrame(this.loop.bind(this), canvas);
    }
  
}
