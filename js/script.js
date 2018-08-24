(() => {
  var scene,
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane,
    HEIGHT,
    WIDTH,
    renderer,
    camera,
    imaginaryCamera,
    object1Box,
    object2Box,
    container;
  var hemisphereLight, shadowLight;
  var asteroidBelt;
  var rocks;
  var spaceship;
  var bullets;
  const keyMap = [];
  var recognition;

  let optimizationKey = 0;
  let score = 0;
  const scoreContainer = document.querySelectorAll('.score');

  class Bullet {
    constructor(options) {
      const geom = new THREE.BoxGeometry(2, 5, 2, 1, 1, 1);
      this.currentRotation = spaceship.mesh.rotation.z;

      var material = new THREE.MeshPhongMaterial({
        color: 0x6fe7ff
      });

      this.mesh = new THREE.Mesh(geom, material);
      this.mesh.position.x = spaceship.mesh.position.x;
      this.mesh.position.y = spaceship.mesh.position.y;
      this.mesh.position.z = spaceship.mesh.position.z;

      const moveBullet = () => {
        this.mesh.position.y += Math.cos(this.currentRotation) * 10;
        this.mesh.position.x += -(Math.sin(this.currentRotation) * 10);
        this.mesh.rotation.z = this.currentRotation;
        requestAnimationFrame(moveBullet);
        if (isOffImaginaryScreen(this.mesh)) {
          bullets.mesh.remove(this.mesh);
        }
      };

      moveBullet();
    }
  }

  class Spaceship {
    constructor(options) {
      this.mesh = new THREE.Object3D();
      const geomBody = new THREE.BoxGeometry(20, 120, 20, 1, 3, 1);

      geomBody.vertices[0].x += -7;
      geomBody.vertices[0].z += -7;
      geomBody.vertices[1].x += -7;
      geomBody.vertices[1].z += 7;
      geomBody.vertices[8].x += 7;
      geomBody.vertices[8].z += 7;
      geomBody.vertices[9].x += 7;
      geomBody.vertices[9].z += -7;

      geomBody.vertices[6].y += 30;
      geomBody.vertices[6].x += -3;
      geomBody.vertices[6].z += -3;
      geomBody.vertices[7].y += 30;
      geomBody.vertices[7].x += -3;
      geomBody.vertices[7].z += 3;
      geomBody.vertices[14].y += 30;
      geomBody.vertices[14].x += 3;
      geomBody.vertices[14].z += 3;
      geomBody.vertices[15].y += 30;
      geomBody.vertices[15].x += 3;
      geomBody.vertices[15].z += -3;

      var material = new THREE.MeshPhongMaterial({
        color: 0xd52626
      });

      var body = new THREE.Mesh(geomBody, material);

      body.castShadow = true;
      body.receiveShadow = true;
      this.mesh.add(body);

      const geomWing = new THREE.BoxGeometry(20, 40, 10, 2, 1, 1);

      geomWing.vertices[4].y += 20;
      geomWing.vertices[4].x += -4;
      geomWing.vertices[5].y += 20;
      geomWing.vertices[5].x += -4;

      geomWing.vertices[8].z += 2;
      geomWing.vertices[9].z += -2;

      geomWing.vertices[0].y += -30;
      geomWing.vertices[0].z += -4;
      geomWing.vertices[1].y += -30;
      geomWing.vertices[1].z += 4;

      geomWing.vertices[2].y += -10;
      geomWing.vertices[2].z += -5;
      geomWing.vertices[3].y += -10;
      geomWing.vertices[3].z += 5;

      geomWing.vertices[6].y += 5;
      geomWing.vertices[6].x += -3;
      geomWing.vertices[7].y += 5;
      geomWing.vertices[7].x += -3;

      var leftWing = new THREE.Mesh(geomWing, material);
      leftWing.position.x += 20;
      leftWing.position.y += -10;

      leftWing.castShadow = true;
      leftWing.receiveShadow = true;
      this.mesh.add(leftWing);

      var rightWing = new THREE.Mesh(geomWing, material);
      rightWing.rotation.y += 3.2;
      rightWing.position.x += -20;
      rightWing.position.y += -10;

      rightWing.castShadow = true;
      rightWing.receiveShadow = true;
      this.mesh.add(rightWing);

      var topWing = new THREE.Mesh(geomWing, material);
      topWing.rotation.y += 1.7;
      topWing.position.z += -20;
      topWing.position.y += -10;

      topWing.castShadow = true;
      topWing.receiveShadow = true;
      this.mesh.add(topWing);

      var bottomWing = new THREE.Mesh(geomWing, material);
      bottomWing.rotation.y += -1.7;
      bottomWing.position.z += 20;
      bottomWing.position.y += -10;

      bottomWing.castShadow = true;
      bottomWing.receiveShadow = true;
      this.mesh.add(bottomWing);
    }
  }

  class AsteroidBelt {
    constructor(options) {
      this.mesh = new THREE.Object3D();
      this.nAsteroids = 50;

      for (let i = 0; i < this.nAsteroids; i++) {
        createNewAsteroid(this);
      }
    }
  }

  class Rocks {
    constructor(options) {
      this.mesh = new THREE.Object3D();
    }
  }

  class Bullets {
    constructor(options) {
      this.mesh = new THREE.Object3D();
    }
  }

  class Asteroid {
    constructor(options) {
      this.mesh = new THREE.Object3D();
      this.rotationValue = Math.random() * 0.03;
      this.rotationValue *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
      this.moveXValue = Math.random() * 1;
      this.moveXValue *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
      this.moveYValue = Math.random() * 1;
      this.moveYValue *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

      const geom = new THREE.IcosahedronGeometry(20);

      var mat = new THREE.MeshPhongMaterial({
        color: 0x322c23
      });

      const nBlocs = 3 + Math.floor(Math.random() * 5);
      for (let i = 0; i < nBlocs; i++) {
        const m = new THREE.Mesh(geom, mat);
        m.position.x = i * 3;
        m.position.y = Math.random() * 10;
        m.position.z = Math.random() * 10;
        m.rotation.z = Math.random() * Math.PI * 2;
        m.rotation.y = Math.random() * Math.PI * 2;

        const s = 0.1 + Math.random() * 0.9;
        m.scale.set(s, s, s);

        m.castShadow = true;
        m.receiveShadow = true;

        this.mesh.add(m);
      }

      const rotateAsteroid = () => {
        this.mesh.rotation.z += this.rotationValue;
        requestAnimationFrame(rotateAsteroid);
      };

      const moveAsteroid = () => {
        this.mesh.position.x += this.moveXValue;
        this.mesh.position.y += this.moveYValue;
        requestAnimationFrame(moveAsteroid);
      };

      rotateAsteroid();
      moveAsteroid();
    }
  }

  class Rock {
    constructor(options) {
      const geom = new THREE.IcosahedronGeometry(10);

      var mat = new THREE.MeshPhongMaterial({
        color: 0x322c23
      });

      this.mesh = new THREE.Mesh(geom, mat);

      this.rotationValue = Math.random() * 0.03;
      this.rotationValue *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
      this.moveXValue = Math.random() * 1;
      this.moveXValue *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
      this.moveYValue = Math.random() * 1;
      this.moveYValue *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

      const rotateRock = () => {
        this.mesh.rotation.z += this.rotationValue;
        requestAnimationFrame(rotateRock);
      };

      const moveRock = () => {
        this.mesh.position.x += this.moveXValue;
        this.mesh.position.y += this.moveYValue;

        requestAnimationFrame(moveRock);
      };

      rotateRock();
      moveRock();
    }
  }

  const createNewAsteroid = parent => {
    const c = new Asteroid();

    c.mesh.position.z = -400;
    c.mesh.position.x = Math.random() * 1000;
    c.mesh.position.x *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    c.mesh.position.y = Math.random() * 1000;
    c.mesh.position.y *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

    while (!isOffScreen(c.mesh)) {
      c.mesh.position.x = Math.random() * 1000;
      c.mesh.position.x *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
      c.mesh.position.y = Math.random() * 1000;
      c.mesh.position.y *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    }

    const s = 1 + Math.random() * 2;
    c.mesh.scale.set(s, s, s);

    parent.mesh.add(c.mesh);
  };

  const createScene = () => {
    scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0x100e1c, 100, 1300);

    _createCamera();
    _createRenderer();

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);
  };

  const _createRenderer = () => {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setSize(WIDTH, HEIGHT);

    renderer.shadowMap.enabled = true;
  };

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
  };

  const handleWindowResize = () => {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  };

  const createLights = () => {
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
    shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

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
  };

  const createAsteroidBelt = () => {
    asteroidBelt = new AsteroidBelt();
    scene.add(asteroidBelt.mesh);
  };

  const isOffScreen = object => {
    camera.updateMatrix();
    camera.updateMatrixWorld();
    var frustum = new THREE.Frustum();
    frustum.setFromMatrix(
      new THREE.Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      )
    );

    if (frustum.containsPoint(object.position)) {
      return false;
    } else {
      return true;
    }
  };

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
    frustum.setFromMatrix(
      new THREE.Matrix4().multiplyMatrices(
        imaginaryCamera.projectionMatrix,
        imaginaryCamera.matrixWorldInverse
      )
    );

    if (frustum.containsPoint(object.position)) {
      return false;
    } else {
      return true;
    }
  };

  const explode = object => {
    if (object) {
      for (let i = 0; i < object.children.length; i++) {
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
  };

  const detectCollisionBetweenObjects = (object1, object2) => {
    if (object1 && object2) {
      object1Box = new THREE.Box3().setFromObject(object1);
      object2Box = new THREE.Box3().setFromObject(object2);
    }

    return object1Box.intersectsBox(object2Box);
  };

  const detectCollisionBetweenGroups = (group1, group2) => {
    if (group1.mesh.uuid === group2.mesh.uuid) {
      detectOwnGroupCollision(group1, group2);
      return detectOwnGroupCollision(group1, group2);
    } else {
      return detectDifferentGroupCollision(group1, group2);
    }
  };

  const detectOwnGroupCollision = (group1, group2) => {
    for (let i = 0; i < group1.mesh.children.length; i++) {
      for (let a = 0; a < group2.mesh.children.length; a++) {
        if (i !== a) {
          if(detectCollisionBetweenObjects(group1.mesh.children[i], group2.mesh.children[a])) {
            return group2.mesh.children[a];
          }
        }
      }
    }
  }

  const detectDifferentGroupCollision = (group1, group2) => {
    for (let i = 0; i < group1.mesh.children.length; i++) {
      for (let a = 0; a < group2.mesh.children.length; a++) {
        if(detectCollisionBetweenObjects(group1.mesh.children[i], group2.mesh.children[a])) {
          return group2.mesh.children[a];
        }
      }
    }
  }

  const checkOptimization = () => {
    if(optimizationKey === 0) {
      return true;
    } else {
      return false;
    }
  }

  const optimize = factor => {
    // To many functions get called at 60fps, this functions slows those calls down.
    // The higher the factor, the faster the game runs, but the lower the accuracy from the optimized functions.

    optimizationKey++;
    if(optimizationKey >= factor) {
      optimizationKey = 0;
    }
  }

  const scoreUp = amount => {
    score += amount;
    for (let i = 0; i < scoreContainer.length; i++) {
      scoreContainer[i].innerText = score;
    }
  }

  const handleDeath = () => {
    document.querySelector('.death').style.opacity = 1;
    document.querySelector('.alive').style.opacity = 0;
  }

  const checkIfDead = () => {
    if (spaceship.mesh.children.length <= 0) {
      handleDeath();
      return true;
    } else {
      return false;
    }
  }

  const loop = () => {

    optimize(10);

    if (detectCollisionBetweenGroups(bullets, asteroidBelt)) {
      explode(detectCollisionBetweenGroups(bullets, asteroidBelt));
      scoreUp(3);
    };

    if (detectCollisionBetweenGroups(bullets, rocks)) {
      rocks.mesh.remove(detectCollisionBetweenGroups(bullets, rocks));
      scoreUp(1);
    }

    if (checkOptimization()) {

      for (let i = 0; i < asteroidBelt.mesh.children.length; i++) {
        if (isOffImaginaryScreen(asteroidBelt.mesh.children[i])) {
          asteroidBelt.mesh.remove(asteroidBelt.mesh.children[i]);
        }
      }

      for (let i = 0; i < rocks.mesh.children.length; i++) {
        if (isOffScreen(rocks.mesh.children[i])) {
          rocks.mesh.remove(rocks.mesh.children[i]);
        }
      }

      if (isOffScreen(spaceship.mesh)) {
        for(let i = 0; i < spaceship.mesh.children.length; i++) {
          spaceship.mesh.remove(spaceship.mesh.children[i]);
          checkIfDead();
        }
      }

      if (asteroidBelt.mesh.children.length < asteroidBelt.nAsteroids) {
        createNewAsteroid(asteroidBelt);
      }

      if (detectCollisionBetweenGroups(asteroidBelt, asteroidBelt)) {
        explode(detectCollisionBetweenGroups(asteroidBelt, asteroidBelt));
      };

      if (detectCollisionBetweenGroups(asteroidBelt, spaceship)) {
        spaceship.mesh.remove(detectCollisionBetweenGroups(asteroidBelt, spaceship));
        checkIfDead();
      }

      if (detectCollisionBetweenGroups(rocks, spaceship)) {
        spaceship.mesh.remove(detectCollisionBetweenGroups(rocks, spaceship));
        checkIfDead();
      }

      rocks.mesh.remove(detectCollisionBetweenGroups(asteroidBelt, rocks));

    }

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  };

  const createRocks = () => {
    rocks = new Rocks();
    scene.add(rocks.mesh);
  };

  const createSpaceship = () => {
    spaceship = new Spaceship();
    spaceship.mesh.position.z = -400;
    spaceship.mesh.scale.set(0.5, 0.5, 0.5);
    scene.add(spaceship.mesh);
  };

  const forward = () => {
    var loop = setInterval(() => {
      spaceship.mesh.position.y += Math.cos(spaceship.mesh.rotation.z);
      spaceship.mesh.position.x += -Math.sin(spaceship.mesh.rotation.z);
    }, 30);

    setTimeout(() => {
      clearInterval(loop);
    }, 1000);
  };

  const turn = left => {
    var loop = setInterval(() => {
      spaceship.mesh.rotation.z += left ? 0.01 : -0.01;
    }, 30);

    setTimeout(() => {
      clearInterval(loop);
    }, 1000);
  };

  const fire = () => {
    if (!checkIfDead()) {
      const bullet = new Bullet();
      bullets.mesh.add(bullet.mesh);
    }
  };

  const createBullet = () => {
    bullets = new Bullets();
    scene.add(bullets.mesh);
  };

  const voiceCommands = () => {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    let command;
    recognition.onresult = function(event) {

      command = event.results[event.results.length - 1][0].transcript;

      if (command.includes('fire') || command.includes('shoot')) {
        fire();
      }

      if (command.includes('turn')) {
        turn(true);
      }

      if (command.includes('left')) {
        turn(true);
      }

      if (command.includes('right')) {
        turn(false);
      }

      if (command.includes('move') || command.includes('go') || command.includes('forward')) {
        forward();
      }

    };
    recognition.start();
  };

  const init = () => {
    createScene();
    createLights();
    createAsteroidBelt();
    createRocks();
    createSpaceship();
    createBullet();

    voiceCommands();

    loop();
  };

  init();
})();
