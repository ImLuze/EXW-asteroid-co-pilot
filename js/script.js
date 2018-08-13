(() => {

  var scene, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;
  var hemisphereLight, shadowLight;
  var asteroidBelt;

  class AsteroidBelt {
		constructor(options) {
			this.mesh = new THREE.Object3D();
			this.nAsteroids = 50;

			for(let i=0; i<this.nAsteroids; i++) {
				createNewAsteroid(this);
			}
		}
	}

  class Asteroid {
		constructor(options) {
			this.mesh = new THREE.Object3D();
      this.rotationValue = (Math.random() * .03);
      this.rotationValue *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
      this.moveXValue = (Math.random() * 1);
      this.moveXValue *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
      this.moveYValue = (Math.random() * 1);
      this.moveYValue *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

			const geom = new THREE.BoxGeometry(20, 20, 20);

			var mat = new THREE.MeshPhongMaterial({
				color:0x322C23
			});

			const nBlocs = 3+Math.floor(Math.random()*5);
			for (let i = 0;i < nBlocs; i++ ) {
				const m = new THREE.Mesh(geom, mat);
				m.position.x = i*3;
				m.position.y = Math.random()*10;
				m.position.z = Math.random()*10;
				m.rotation.z = Math.random()*Math.PI*2;
				m.rotation.y = Math.random()*Math.PI*2;

				const s = .1 + Math.random()*.9;
				m.scale.set(s, s, s);

				m.castShadow = true;
				m.receiveShadow = true;

				this.mesh.add(m);
			}

      const rotateAsteroid = () => {
        this.mesh.rotation.z += this.rotationValue;
        requestAnimationFrame(rotateAsteroid);
      }

      const moveAsteroid = () => {
        this.mesh.position.x += this.moveXValue;
        this.mesh.position.y += this.moveYValue;
        requestAnimationFrame(moveAsteroid);
      }

      rotateAsteroid();
      moveAsteroid();
		}
	}

  const createNewAsteroid = parent => {
    const c = new Asteroid();

    c.mesh.position.x = Math.random() * 1000;
    c.mesh.position.x *= Math.floor(Math.random() *2) == 1 ? 1 : -1;
    c.mesh.position.y = Math.random() * 1000;
    c.mesh.position.y *= Math.floor(Math.random() *2) == 1 ? 1 : -1;
    c.mesh.position.z = -400;

    const s = 1+Math.random()*2;
    c.mesh.scale.set(s, s, s);

    while(!isOffScreen(c.mesh)) {
      c.mesh.position.x = Math.random() * 1000;
      c.mesh.position.x *= Math.floor(Math.random() *2) == 1 ? 1 : -1;
      c.mesh.position.y = Math.random() * 1000;
      c.mesh.position.y *= Math.floor(Math.random() *2) == 1 ? 1 : -1;
    }

    parent.mesh.add(c.mesh);
    console.log('new asteroid');
  }

  const createScene = () => {

    scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0x100e1c, 100, 950);

    _createCamera();
    _createRenderer();

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);
  }

  const _createRenderer = () => {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setSize(WIDTH, HEIGHT);

    renderer.shadowMap.enabled = true;
  }

  const _createCamera = () => {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = 0;
  }

  const handleWindowResize = () => {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  }

  const createLights = () => {
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    shadowLight.position.set(150, 350, 350);

    shadowLight.castShadow = true;

    shadowLight.shadow.camera.left = -400;
	  shadowLight.shadow.camera.right = 400;
	  shadowLight.shadow.camera.top = 400;
	  shadowLight.shadow.camera.bottom = -400;
	  shadowLight.shadow.camera.near = 1;
	  shadowLight.shadow.camera.far = 1000;

    shadowLight.shadow.mapSize.width = 2048;
	  shadowLight.shadow.mapSize.height = 2048;

    scene.add(hemisphereLight);
	  scene.add(shadowLight);
  }

  const createAsteroidBelt = () => {
    asteroidBelt = new AsteroidBelt();
    scene.add(asteroidBelt.mesh);
  }

  const isOffScreen = object => {
    camera.updateMatrix();
    camera.updateMatrixWorld();
    var frustum = new THREE.Frustum();
    frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

    if(frustum.containsPoint(object.position)) {
      return false
    } else {
      return true
    }

  }

  const isOffImaginaryScreen = object => {
    imaginaryCamera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    imaginaryCamera.position.x = 0;
    imaginaryCamera.position.z = 600;
    imaginaryCamera.position.y = 0;

    imaginaryCamera.updateMatrix();
    imaginaryCamera.updateMatrixWorld();
    var frustum = new THREE.Frustum();
    frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(imaginaryCamera.projectionMatrix, imaginaryCamera.matrixWorldInverse));

    if(frustum.containsPoint(object.position)) {
      return false
    } else {
      return true
    }
  }

  const toScreenPosition = obj => {
    var vector = new THREE.Vector3();

    var widthHalf = 0.5*renderer.context.canvas.width;
    var heightHalf = 0.5*renderer.context.canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return {
        x: vector.x,
        y: vector.y
    };

};

  const loop = () => {
    for(let i = 0; i < asteroidBelt.mesh.children.length; i++) {
      if(isOffImaginaryScreen(asteroidBelt.mesh.children[i])) {
        asteroidBelt.mesh.remove(asteroidBelt.mesh.children[i]);
      }
    }

    if(asteroidBelt.mesh.children.length < asteroidBelt.nAsteroids) {
      createNewAsteroid(asteroidBelt);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }

  const init = () => {
    createScene();
    createLights();
    createAsteroidBelt();

    loop();
  }

  init();

})();
