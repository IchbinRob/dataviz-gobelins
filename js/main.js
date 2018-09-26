let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000)
camera.position.set(0, 0, 0)

const scene = new THREE.Scene()

document.addEventListener('mousemove', onDocumentMouseMove, false)

var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2(), INTERSECTED

let light = new THREE.SpotLight(0xFFFFFF, 1.5, 0, Math.PI / 2, 1)
light.position.set(4000, 4000, 1500)
light.target.position.set(1000, 3800, 1000)

let planet = new THREE.Object3D()

scene.add(light)

const textureMap = new THREE.TextureLoader().load( 'textures/mapi.png' )

let geoEarth = new THREE.SphereGeometry(30, 100, 100)
let matEarth = new THREE.MeshPhongMaterial({
    transparent: false,
    map: textureMap

})

const textureMapLimit = new THREE.TextureLoader().load('textures/contour.png')

let geoMapLimit = new THREE.SphereGeometry(30, 100, 100)
let matMapLimit = new THREE.MeshPhongMaterial({
    color: 0x0,
    specular: 0xbd9f73,
    transparent: true,
    map: textureMapLimit,
    emissive: 0xc58f3f,
    shininess: 0
})

const textureCo2 = new THREE.TextureLoader().load('textures/lueurs.png')

let geoCo2 = new THREE.SphereGeometry(33, 100, 100)
let matCo2 = new THREE.MeshPhongMaterial({
    transparent: true,
    map: textureCo2,
    opacity: 1,
    shininess: 0

})

//lonLatToVector3(9.59396, 8.105306)
let point = new THREE.BoxGeometry(1, 1, 1)
let matPoint = new THREE.MeshPhongMaterial({
    transparent: false,
    opacity: 1,
    shininess: 0

})

let pointMesh = new THREE.Mesh(point, matPoint)
let positions = lonLatToVector3(2.349014, 48.864716, 30)
pointMesh.position.set(positions.x, positions.y, positions.z)
pointMesh.name = "pointMesh"
pointMesh.userData.description = "un point random";
//matEarth.flatShading = true

let earthMesh = new THREE.Mesh(geoEarth, matEarth)
earthMesh.position.set(-1, 0, 0)


let mapLimitMesh = new THREE.Mesh(geoMapLimit, matMapLimit)
mapLimitMesh.position.set(-1, 0, 0)


let mapCo2Mesh = new THREE.Mesh(geoCo2, matCo2)
mapCo2Mesh.position.set(-1, 0, 0)


planet.add(mapCo2Mesh)
planet.add(earthMesh)
planet.add(mapLimitMesh)
planet.add(pointMesh)

planet.position.set(-200,0,0)

scene.add(planet)

camera.lookAt(earthMesh.position)


const renderer = new THREE.WebGLRenderer({
        antialiasing: true
})



renderer.domElement.style.position = 'relative'
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.autoClear = false
renderer.shadowMap.enabled = true


var animate = function () {
    requestAnimationFrame(animate)

    planet.rotation.y += 0.01


    // find intersections

    raycaster.setFromCamera(mouse, camera)

    var intersects = raycaster.intersectObjects([planet.getObjectByName("pointMesh")])

    if (intersects.length > 0) {

        if (INTERSECTED != intersects[0].object) {

            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)

            INTERSECTED = intersects[0].object
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
            INTERSECTED.material.emissive.setHex(0xff0000)
            console.log(document.body)
            
            document.body.classList.toggle("cursor")

        }

    } else {

        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)

        INTERSECTED = null

    }

    renderer.render(scene, camera)
}


function lonLatToVector3(lon, lat, radius) {
    var phi = (90 - lat) * (Math.PI / 180),
        theta = (lon + 180) * (Math.PI / 180),
        x = -((radius) * Math.sin(phi) * Math.cos(theta)),
        z = ((radius) * Math.sin(phi) * Math.sin(theta)),
        y = ((radius) * Math.cos(phi))

    return new THREE.Vector3(x, y, z)


}


//9.59396" N, 8.105306" E
//lonLatToVector3(9.59396, 8.105306)

animate()

function onDocumentMouseMove(event) {

    event.preventDefault()

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1

}

