let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000)
camera.position.set(0, 0, 0)

const scene = new THREE.Scene()

let light = new THREE.SpotLight(0xFFFFFF, 1.5, 0, Math.PI / 2, 1)
light.position.set(4000, 4000, 1500)
light.target.position.set(1000, 3800, 1000)

let planet = new THREE.Object3D()

scene.add(light)

const textureMap = new THREE.TextureLoader().load( 'textures/mapi.png' )

let geoEarth = new THREE.SphereGeometry(30, 400, 400)
let matEarth = new THREE.MeshPhongMaterial({
    transparent: false,
    map: textureMap

})

const textureMapLimit = new THREE.TextureLoader().load('textures/contour.png')

let geoMapLimit = new THREE.SphereGeometry(30, 400, 400)
let matMapLimit = new THREE.MeshPhongMaterial({
    color: 0x0,
    specular: 0xbd9f73,
    transparent: true,
    map: textureMapLimit,
    emissive: 0xc58f3f,
    shininess: 0
})

const textureCo2 = new THREE.TextureLoader().load('textures/lueurs.png')

let geoCo2 = new THREE.SphereGeometry(33, 400, 400)
let matCo2 = new THREE.MeshPhongMaterial({
    transparent: true,
    map: textureCo2,
    opacity: 1,
    shininess: 0

})


//matEarth.flatShading = true

let earthMesh = new THREE.Mesh(geoEarth, matEarth)
earthMesh.position.set(-100, 0, 0)


let mapLimitMesh = new THREE.Mesh(geoMapLimit, matMapLimit)
mapLimitMesh.position.set(-100, 0, 0)


let mapCo2Mesh = new THREE.Mesh(geoCo2, matCo2)
mapCo2Mesh.position.set(-100, 0, 0)


planet.add(mapCo2Mesh)
planet.add(earthMesh)
planet.add(mapLimitMesh)

planet.position.set(-50,0,0)

scene.add(planet)

camera.lookAt(earthMesh.position)


const renderer = new THREE.WebGLRenderer({
        antialiasing: true
    })

//const controls = new THREE.OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
// controls.dampingFactor = 0.25
// controls.screenSpacePanning = false
// controls.minDistance = 20
// controls.maxDistance = 500
// controls.maxPolarAngle = Math.PI / 2


renderer.domElement.style.position = 'relative'
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.autoClear = false
renderer.shadowMap.enabled = true



var animate = function () {
    requestAnimationFrame(animate)

    //planet.rotation.x += 0.01
    earthMesh.rotation.y += 0.01
    mapCo2Mesh.rotation.y += 0.01
    mapLimitMesh.rotation.y += 0.01
    //planet.rotateY += 0.01
    ///controls.update()
    renderer.render(scene, camera)
}

function latLongToVector3(lat, lon, radius, heigth) {
    var phi = (lat) * Math.PI / 180
    var theta = (lon - 180) * Math.PI / 180

    var x = -(radius + heigth) * Math.cos(phi) * Math.cos(theta)
    var y = (radius + heigth) * Math.sin(phi)
    var z = (radius + heigth) * Math.cos(phi) * Math.sin(theta)

    return new THREE.Vector3(x, y, z)
}

function addDensity(data) {

    // the geometry that will contain all our cubes
    var geom = new THREE.Object3D()
    // material to use for each of our elements. Could use a set of materials to
    // add colors relative to the density. Not done here.
    var cubeMat = new THREE.MeshLambertMaterial({
        color: 0x000000,
        opacity: 1,
        emissive: 0xffffff
    })
    for (var i = 0; i < 1; i++) {

        //get the data, and set the offset, we need to do this since the x,y coordinates
        //from the data aren't in the correct format
        var x = parseInt(data[i][0]) + 180
        var y = parseInt((data[i][1]) - 84) * -1
        var value = parseFloat(data[i][2])

        // calculate the position where we need to start the cube
        var position = latLongToVector3(y, x, 31, 2)

        // create the cube
        var cube = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 1 + value / 8, 1, 1, 1, cubeMat))

        // position the cube correctly
        cube.position = position
        cube.lookAt(new THREE.Vector3(0, 0, 0))

        // merge with main model
        geom.add(cube)
    }

    // and add the total mesh to the scene
    scene.add(geom)
}
addDensity(['102','1','0.0003149387'])

animate()