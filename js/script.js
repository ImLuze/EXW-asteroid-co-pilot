(() => {

  var scene, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;
  var hemisphereLight, shadowLight;
  var asteroidBelt;
  var rocks;

  class AsteroidBelt {
		constructor(options) {
			this.mesh = new THREE.Object3D();
			this.nAsteroids = 50;

			for(let i=0; i<this.nAsteroids; i++) {
				createNewAsteroid(this);
			}
		}
	}

  class Rocks {
    constructor(options) {
      this.mesh = new THREE.Object3D();
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

			const geom = new THREE.IcosahedronGeometry(20);

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

  // class Rock {
  //   constructor(options) {
  //     this.mesh = options;
  //
  //     this.rotationValue = (Math.random() * .03);
  //     this.rotationValue *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
  //     this.moveXValue = (Math.random() * 1);
  //     this.moveXValue *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
  //     this.moveYValue = (Math.random() * 1);
  //     this.moveYValue *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
  //
  //     const rotateRock = () => {
  //       this.mesh.rotation.z += this.rotationValue;
  //       requestAnimationFrame(rotateRock);
  //     }
  //
  //     const moveRock = () => {
  //       this.mesh.position.x += this.moveXValue;
  //       this.mesh.position.y += this.moveYValue;
  //       requestAnimationFrame(moveRock);
  //     }
  //
  //     rotateRock();
  //     moveRock();
  //   }
  // }

  class Rock {
    constructor(options) {

			const geom = new THREE.IcosahedronGeometry(10);

			var mat = new THREE.MeshPhongMaterial({
				color:0x322C23
			});

			this.mesh = new THREE.Mesh(geom, mat);

			this.rotationValue = (Math.random() * .03);
		  this.rotationValue *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
		  this.moveXValue = (Math.random() * 1);
		  this.moveXValue *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
		  this.moveYValue = (Math.random() * 1);
		  this.moveYValue *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

			const rotateRock = () => {
		    this.mesh.rotation.z += this.rotationValue;
		    requestAnimationFrame(rotateRock);
		  }

		  const moveRock = () => {
		    this.mesh.position.x += this.moveXValue;
		    this.mesh.position.y += this.moveYValue;
		    requestAnimationFrame(moveRock);
		  }

		  rotateRock();
		  moveRock();
    }
  }

  const createNewAsteroid = parent => {
    const c = new Asteroid();

    c.mesh.position.z = -400;
    c.mesh.position.x = Math.random() * 1000;
    c.mesh.position.x *= Math.floor(Math.random() *2) == 1 ? 1 : -1;
    c.mesh.position.y = Math.random() * 1000;
    c.mesh.position.y *= Math.floor(Math.random() *2) == 1 ? 1 : -1;

    while(!isOffScreen(c.mesh)) {
      c.mesh.position.x = Math.random() * 1000;
      c.mesh.position.x *= Math.floor(Math.random() *2) == 1 ? 1 : -1;
      c.mesh.position.y = Math.random() * 1000;
      c.mesh.position.y *= Math.floor(Math.random() *2) == 1 ? 1 : -1;
    }

    const s = 1+Math.random()*2;
    c.mesh.scale.set(s, s, s);

    parent.mesh.add(c.mesh);
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

  const detectCollision = (object1, object2) => {
    object1Box = new THREE.Box3().setFromObject(object1);
    object2Box = new THREE.Box3().setFromObject(object2);

    return object1Box.intersectsBox(object2Box);
  }

  const explode = object => {
    for(let i = 0; i < object.children.length; i++) {
      const rock = new Rock(object.children[i]);
      rock.mesh.position.x = object.position.x;
      rock.mesh.position.y = object.position.y;
      rock.mesh.position.z = object.position.z;
      rock.mesh.scale.set(
        object.children[i].scale.x * object.scale.x,
        object.children[i].scale.y * object.scale.y,
        object.children[i].scale.z * object.scale.z
      );
      rocks.mesh.add(rock.mesh);
    }
    asteroidBelt.mesh.remove(object);
  }

  const loop = () => {
    for(let i = 0; i < asteroidBelt.mesh.children.length; i++) {
      if(isOffImaginaryScreen(asteroidBelt.mesh.children[i])) {
        asteroidBelt.mesh.remove(asteroidBelt.mesh.children[i]);
      }
    }

    for(let i = 0; i < rocks.mesh.children.length; i++) {
      if(isOffImaginaryScreen(rocks.mesh.children[i])) {
        rocks.mesh.remove(rocks.mesh.children[i]);
      }
    }

    if(asteroidBelt.mesh.children.length < asteroidBelt.nAsteroids) {
      createNewAsteroid(asteroidBelt);
    }

    for(let i = 0; i < asteroidBelt.mesh.children.length; i++) {
      for(let s = 0; s < asteroidBelt.mesh.children.length; s++) {
        if(i !== s) {
          if(detectCollision(asteroidBelt.mesh.children[i], asteroidBelt.mesh.children[s])) {
            explode(asteroidBelt.mesh.children[i]);
          };
        }
      }
    }

    for(let i = 0; i < asteroidBelt.mesh.children.length; i++) {
      for(let r = 0; r < rocks.mesh.children.length; r++) {
        if(detectCollision(asteroidBelt.mesh.children[i], rocks.mesh.children[r])) {
          rocks.mesh.remove(rocks.mesh.children[r]);
        }
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }

  const createRocks = () => {
    rocks = new Rocks();
    scene.add(rocks.mesh);
  }

  const init = () => {
    createScene();
    createLights();
    createAsteroidBelt();
    createRocks();


    loop();
  }

  init();

})();
