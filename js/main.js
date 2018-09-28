let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000)
//camera.position.set(-35, 0, 110)
camera.position.set(0, 40, 50)
let cameraPositionInfo = new THREE.Vector3(-35, 0, 110)
started = false;
const scene = new THREE.Scene()

document.addEventListener('mousemove', onDocumentMouseMove, false)

let currentDate = "1990"


// document.getElementById('selectDate').addEventListener('change', ()=> {
//     currentDate = document.getElementById('selectDate').options[document.getElementById('selectDate').selectedIndex].value
//     matCo2.opacity = (currentDate === "1990") ? 0.3 : 0.9,
//     console.log(currentDate);
//     updatePoints()
// })

var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2(), INTERSECTED

let light = new THREE.SpotLight(0xFFFFFF, 0.8, 0, Math.PI / 2, 1)
light.position.set(50, 0, 500)
light.target.position.set(1000, 3800, 1000)

let light2 = new THREE.SpotLight(0xFFFFFF, 1.5, 0, Math.PI / 2, 0.282, 2)
light2.position.set(- 700, 500, -1000)
light2.target.position.set(1000, 3800, 1000)

let planet = new THREE.Object3D()

scene.add(light)
scene.add(light2)

const textureMap = new THREE.TextureLoader().load( 'textures/mapi.png' )

let geoEarth = new THREE.SphereGeometry(30, 100, 100)
let matEarth = new THREE.MeshPhongMaterial({
    transparent: false,
    map: textureMap,
    shininess: 0.99

})

const textureMapLimit = new THREE.TextureLoader().load('textures/contour.png')

let geoMapLimit = new THREE.SphereGeometry(30.2, 100, 100)
let matMapLimit = new THREE.MeshPhongMaterial({
    color: 0x0,
    specular: 0xbd9f73,
    transparent: true,
    map: textureMapLimit,
    emissive: 0xc58f3f,
    shininess: 0.99
})

const textureCo2 = new THREE.TextureLoader().load('textures/lueurs.png')

let geoCo2 = new THREE.SphereGeometry(33, 100, 100)
let matCo2 = new THREE.MeshPhongMaterial({
    transparent: true,
    // side: THREE.DoubleSide,
    map: textureCo2,
    opacity: (currentDate === "1990") ? 0.3 : 0.9,
    shininess: 0,
    depthWrite: false,
    depthTest: true,

})

const iconCo2 = new THREE.TextureLoader().load('textures/co2.png')

let matPoint = new THREE.MeshPhongMaterial({
    transparent: true,
    opacity: 1,
    shininess: 0,
    map: iconCo2,
    side: THREE.DoubleSide,
    // depthWrite: false,
    // depthTest: false,

})

let point = new THREE.PlaneGeometry(1, 1)
let pointMeshes = new THREE.Object3D()
let pointMesh = []
let i = 0
let dataset
let max = 10291926.9

var xhr = new XMLHttpRequest()
xhr.open('GET', "data/co2.json")
xhr.setRequestHeader('Content-Type', 'application/json')
xhr.onload = () => {
    if (xhr.status === 200) {
        dataset = JSON.parse(xhr.responseText);
        displayco2(dataset)
    }
}
xhr.send()

function displayco2(dataset) {
    dataset.forEach(data => {
       let size = 0
        if (data[currentDate] < 30000) {
            size = (data[currentDate] / max) * 1000
        }
        else if (data[currentDate] < 100000 && data[currentDate] >= 30000) {

            size = (data[currentDate] / max) * 500

        } else if (data[currentDate] < 600000 && data[currentDate] >= 100000) {
            size = (data[currentDate] / max) * 45
        } else {
            size = (data[currentDate] / max) * 10
        }
        pointMesh[i] = new THREE.Mesh(point, matPoint)
        pointMesh[i].scale.x = pointMesh[i].scale.y = size
        //pointMesh[i].materials = matPoint
        let positions = latLonToVector3(parseFloat(data.longlat.split(', ')[1]), parseFloat(data.longlat.split(', ')[0]), 34)
        pointMesh[i].position.set(positions.x, positions.y, positions.z)
        pointMesh[i].name = `pointMeshes`
        pointMesh[i].userData.pays = `${data.Pays}`
        pointMesh[i].userData.conso = `${data[currentDate]}`

        pointMeshes.add(pointMesh[i])
        i++
    });
}

function updatePoints() {
    console.log(currentDate);
    let i = 0
    dataset.forEach(data => {
        if (data[currentDate] < 30000) {
            size = (data[currentDate] / max) * 1000
        }
        else if (data[currentDate] < 100000 && data[currentDate] >= 30000){
            
            size = (data[currentDate] / max) * 500

        } else if (data[currentDate] < 600000 && data[currentDate] >= 100000) {
            size = (data[currentDate] / max) * 45
        } else {
            size = (data[currentDate] / max) * 10
        }
        
        pointMesh[i].scale.x = pointMesh[i].scale.y = size

        pointMesh[i].userData.conso = `${data[currentDate]}`
        i++
    })
}

//planet.add(pointMeshes)

let earthMesh = new THREE.Mesh(geoEarth, matEarth)
earthMesh.position.set(0, 0, 0)


let mapLimitMesh = new THREE.Mesh(geoMapLimit, matMapLimit)
mapLimitMesh.position.set(0, 0, 0)


let mapCo2Mesh = new THREE.Mesh(geoCo2, matCo2)
mapCo2Mesh.position.set(0, 0, 0)


planet.add(mapCo2Mesh)
planet.add(earthMesh)
planet.add(mapLimitMesh)

planet.position.set(0,0,0)

scene.add(planet)


const renderer = new THREE.WebGLRenderer({
        antialiasing: true,
        alpha: true
})



renderer.domElement.style.position = 'relative'
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.autoClear = false
renderer.shadowMap.enabled = true


let rotation =  true
let speedrotate = false

var animate = function () {
    window.requestAnimationFrame(animate)
    

    if(rotation) {
        planet.rotation.y += 0.003
    }

    if (speedrotate) {
        planet.rotation.y += 0.01
    }
    
   // pointMeshes.children[0].lookAt(camera.position)
    for (let i = 0; i < pointMeshes.children.length; i++) {
        pointMeshes.children[i].lookAt(camera.position)
        
    }

    // find intersections
    if (started) {
        camera.position.x += (cameraPositionInfo.x - camera.position.x) * 0.03;
        camera.position.y += (cameraPositionInfo.y - camera.position.y) * 0.03;
        camera.position.z += (cameraPositionInfo.z - camera.position.z) * 0.03;
    }

    raycaster.setFromCamera(mouse, camera)

    var intersects = raycaster.intersectObjects(pointMeshes.children)    

    if (intersects.length > 0) {

        if (INTERSECTED != intersects[0].object) {
            
            INTERSECTED = intersects[0].object
            console.log('on')
            if (!document.getElementById('info')) {
                document.body.classList.add("cursor")
                let info = document.createElement('div')
                info.id = "info"
                info.style.position = "absolute"
                info.style.left = "25vw"
                info.style.top = "25vh"
                info.style.display = "none"
                document.body.appendChild(info)

                let title = document.createElement('h3')
                title.innerText = `${INTERSECTED.userData.pays}`
                title.classList.add('pays')
                info.appendChild(title)

                let content = document.createElement('p')
                content.innerText = `${INTERSECTED.userData.conso} co² (kt)`
                content.classList.add('conso')
                info.appendChild(content)
            }
        }

    } else {
        console.log('off')
        if (document.getElementById('info')) {
            
            document.getElementById('info').remove()
            document.body.classList.remove("cursor")
        }
        INTERSECTED = null

    }
//console.log(planet.getObjectByName("pointMeshes"));
    renderer.render(scene, camera)
}


function latLonToVector3(lat, lon, radius) {
   
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
    let info = document.getElementById('info')
    if (info) {
        info.style.left = `${event.clientX - 150}px`
        info.style.top = `${event.clientY - 100}px`
        info.style.display = "block"
    }

}

document.getElementById('next1').addEventListener('click', function() {
    //camera.position.set(-35, 0, 110)
    //cameraPositionInfo = new THREE.Vector3(-35, 0, 110)
    started = true

    document.getElementById('home').style.transform = "translateY(-100vh)"
    document.getElementById('page1').style.transform = "translateY(0vh)"

    document.querySelector('#next1 img').classList.add('btn-active')
})

document.getElementById('next2').addEventListener('click', function () {
    document.getElementById('page1').style.transform = "translateY(-100vh)"
    document.getElementById('page2').style.transform = "translateY(0vh)"
    document.querySelector('#next2 img').classList.add('btn-active')
    speedrotate = true
    rotation = false
    setTimeout(()=> {
        speedrotate = false
        rotation = true
    }, 1200)
    started = false
})


document.getElementById('next3').addEventListener('click', function () {
    document.getElementById('page2').style.transform = "translateY(-100vh)"
    document.getElementById('main').style.transform = "translateY(0vh)"
    document.querySelector('#next3 img').classList.add('btn-active')
    speedrotate = true
    rotation = false
    setTimeout(() => {
        planet.add(pointMeshes)
        speedrotate = false
        rotation = true
    }, 1200)
})

document.getElementById('next4').addEventListener('click', function () {
    document.getElementById('main').style.transform = "translateY(-100vh)"
    document.getElementById('graph1').style.transform = "translateY(0vh)"
    document.querySelector('#next4 img').classList.add('btn-active')
    planet.remove(pointMeshes)
    cameraPositionInfo = new THREE.Vector3(-100, 0, 110)
    started = true
    speedrotate = true
    rotation = false
    setTimeout(() => {
        speedrotate = false
        rotation = true
    }, 1200)
})

document.getElementById('1990').addEventListener('click', function () {

    if (!document.getElementById('1990').classList.contains('selected')) {
        document.getElementById('1990').classList.add('selected')
        document.getElementById('2014').classList.remove('selected')

        document.getElementById('data1990').classList.add('data-selected')
        document.getElementById('1990').parentNode.classList.add('date-selected')
        document.getElementById('data2014').classList.remove('data-selected')
        document.getElementById('2014').parentNode.classList.remove('date-selected')

        currentDate = 1990
        matCo2.opacity = 0.3,
        updatePoints()
    }
})

document.getElementById('2014').addEventListener('click', function () {

    if (!document.getElementById('2014').classList.contains('selected')) {
        document.getElementById('2014').classList.add('selected')
        document.getElementById('1990').classList.remove('selected')

        document.getElementById('data2014').classList.add('data-selected')
        document.getElementById('2014').parentNode.classList.add('date-selected')
        document.getElementById('data1990').classList.remove('data-selected')
        document.getElementById('1990').parentNode.classList.remove('date-selected')

        currentDate = 2014
        matCo2.opacity = 0.9,
        updatePoints()
    }
})

