let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000)
camera.position.set(0, 0, 0)

const scene = new THREE.Scene()

let light = new THREE.SpotLight(0xFFFFFF, 1, 0, Math.PI / 2, 1)
light.position.set(4000, 4000, 1500)
light.target.position.set(1000, 3800, 1000)

let planet = new THREE.Object3D()

scene.add(light)

let geoEarth = new THREE.SphereGeometry(20, 40, 40)
let matEarth = new THREE.MeshPhongMaterial()
matEarth.transparent = true
matEarth.opacity = 0.9
matEarth.color = new THREE.Color(0x2194ce)
matEarth.flatShading = true

let earthMesh = new THREE.Mesh(geoEarth, matEarth)
earthMesh.position.set(-100, 0, 0)
earthMesh.rotation.y = 5

scene.add(earthMesh)

var xhr = new XMLHttpRequest()
xhr.open('GET', "countries_states.geojson")
xhr.setRequestHeader('Content-Type', 'application/geojson')
xhr.onload = () => {
    if (xhr.status === 200) {
        drawThreeGeo(JSON.parse(xhr.responseText), 30, 'sphere', {
            color: 0x80FF80
        }, planet)
    }
}
xhr.send()


// drawThreeGeo(json, 10, 'sphere', {
//     color: 0x80FF80
// })

//cene.add(planet)

camera.lookAt(earthMesh.position);


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

    //earth.rotation.x += 0.01
   // earth.rotation.y += 0.01
    renderer.render(scene, camera)
}

animate()