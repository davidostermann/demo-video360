define( [
    './OrbitControls',
  ],
function() {
    var _initialized = false;

    var camera, controls, scene, renderer, sphere;

    var $webglEl = $('#sphere');


    var width  = window.innerWidth,
        height = window.innerHeight;

    var webglSupport = (function(){
        try {
            var canvas = document.createElement( 'canvas' );
            return !! (window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch(e) {
            return false;
        }
    })();

    function render () {
        renderer.render(scene, camera);
    }

    function animate () {
        requestAnimationFrame(animate);
        controls.update();
    }

    function onMouseWheel (evt) {
        evt.preventDefault();

        if (evt.wheelDeltaY) { // WebKit
            camera.fov -= evt.wheelDeltaY * 0.05;
        } else if (evt.wheelDelta) {    // Opera / IE9
            camera.fov -= evt.wheelDelta * 0.05;
        } else if (evt.detail) { // Firefox
            camera.fov += evt.detail * 1.0;
        }
        camera.fov = Math.max(20, Math.min(100, camera.fov));
        camera.updateProjectionMatrix();
    }

    function resize () {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        render();
    }

    // http://stackoverflow.com/questions/21548247/clean-up-threejs-webgl-contexts
/** /
    function remove () {
        scene.remove(sphere);
        while ($webglEl.firstChild) {
            $webglEl.removeChild($webglEl.firstChild);
        }
    }
/**/

    var _init = function() {

        camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
        camera.position.x = 0.1;
        camera.position.y = 0;

        controls = new THREE.OrbitControls(camera);
        controls.noPan = false;
        controls.noZoom = true;
        // controls.autoRotate = true;
        // controls.autoRotateSpeed = options.speed || 0.5;
        controls.addEventListener('change', render);

        scene = new THREE.Scene();

        var texture = THREE.ImageUtils.loadTexture('images/bergsjostolen.jpg');
        texture.minFilter = THREE.LinearFilter;

        sphere = new THREE.Mesh(
            new THREE.SphereGeometry(100, 20, 20),
            new THREE.MeshBasicMaterial({
                map: texture
            })
        );

        sphere.scale.x = -1;
        scene.add(sphere);

        renderer = webglSupport ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        renderer.setSize(width, height);

        $webglEl.append(renderer.domElement);

        document.addEventListener('mousewheel', onMouseWheel, false);
        document.addEventListener('DOMMouseScroll', onMouseWheel, false);

        animate();

        $(window).on('resize', resize);

    };



    var _singleton = {
        init: function() {
          if(!_initialized) {
            _init();
            render();
            _initialized = true;
          }
        }
    };
    return _singleton;
});
