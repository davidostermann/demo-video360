define( [
  ],
function() {
    var _initialized = false;

        // init renderer
    var renderer    = new THREE.WebGLRenderer({
        antialias   : true,
    });

    document.body.appendChild( renderer.domElement );
    var updateFcts  = [];
    var scene   = new THREE.Scene();
    var camera  = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100 );

    //////////////////////////////////////////////////////////////////////////////////
    //      add an object and make it move                  //
    //////////////////////////////////////////////////////////////////////////////////
    // find out which file formats i can read
    var canPlayMp4  = document.createElement('video').canPlayType('video/mp4') !== '' ? true : false;
    var canPlayOgg  = document.createElement('video').canPlayType('video/ogg') !== '' ? true : false;
    var url;

    // create the videoTexture
    var videoTexture, video;

    // use the texture in a THREE.Mesh
    var geometry;
    var material;
    var mesh;

    //var stats = new Stats();

    var lastTimeMsec= null;

    var _init = function() {

        renderer.setClearColor(new THREE.Color('lightgrey'), 1);
        renderer.setSize( window.innerWidth, window.innerHeight );
        camera.position.z = 3;

        if( canPlayMp4 ){
            url = 'videos/sintel.mp4';
        }else if( canPlayOgg ){
            url = 'videos/sintel.ogv';
        }else {
            alert('cant play mp4 or ogv');
        }

        videoTexture = new THREEx.VideoTexture(url);
        video   = videoTexture.video;

        updateFcts.push(function(delta, now){
            videoTexture.update(delta, now);
        });

        material = new THREE.MeshBasicMaterial({
            map : videoTexture.texture
        });

        geometry = new THREE.CubeGeometry(1,1,1);
        mesh = new THREE.Mesh( geometry, material );







        scene.add( mesh );

        updateFcts.push(function(delta){
            mesh.rotation.x += 1 * delta;
            mesh.rotation.y += 2 * delta;
        });

        //////////////////////////////////////////////////////////////////////////////////
        //      render the scene                        //
        //////////////////////////////////////////////////////////////////////////////////
        // init Stats

        /** /
        document.body.appendChild( stats.domElement );
                stats.domElement.style.position = 'absolute';
                stats.domElement.style.left = '0px';
                stats.domElement.style.bottom   = '0px';
                updateFcts.push(function(){
                    stats.update();
                });
        /**/

        updateFcts.push(function(){
            renderer.render( scene, camera );
        });

        //////////////////////////////////////////////////////////////////////////////////
        //      loop runner                         //
        //////////////////////////////////////////////////////////////////////////////////

        requestAnimationFrame(function animate(nowMsec){
            // keep looping
            requestAnimationFrame( animate );
            // measure time
            lastTimeMsec    = lastTimeMsec || nowMsec-1000/60;
            var deltaMsec   = Math.min(200, nowMsec - lastTimeMsec);
            lastTimeMsec    = nowMsec;
            // call each update function
            updateFcts.forEach(function(updateFn){
                updateFn(deltaMsec/1000, nowMsec/1000);
            });
        });
    };



    // function onVideoPlayButtonClick(){
    //     video.play();
    // }
    // function onVideoPauseButtonClick(){
    //     video.pause();
    // }

    //////////////////////////////////////////////////////////////////////////////////
    //      Camera Controls                         //
    //////////////////////////////////////////////////////////////////////////////////
    // var mouse    = {x : 0, y : 0}
    // document.addEventListener('mousemove', function(event){
    //  mouse.x = (event.clientX / window.innerWidth ) - 0.5
    //  mouse.y = (event.clientY / window.innerHeight) - 0.5
    // }, false)
    // updateFcts.push(function(delta, now){
    //  camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3)
    //  camera.position.y += (mouse.y*5 - camera.position.y) * (delta*3)
    //  camera.lookAt( scene.position )
    // })






    var _singleton = {
        init: function() {
          if(!_initialized) {
            _init();
            _initialized = true;
          }
        }
    };
    return _singleton;
});
