import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

// function Robot(props) {
//     // This reference gives us direct access to the THREE.Mesh object
//     const ref = useRef()
//     // Hold state for hovered and clicked events
//     const [hovered, hover] = useState(false)
//     const [clicked, click] = useState(false)
//     // Subscribe this component to the render-loop, rotate the mesh every frame
//     useFrame((state, delta) => (ref.current.rotation.x += 0.01))
//     // Return the view, these are regular Threejs elements expressed in JSX
//     return (
//         <mesh
//             {...props}
//             ref={ref}
//             scale={clicked ? 1.5 : 1}
//             onClick={(event) => click(!clicked)}
//             onPointerOver={(event) => hover(true)}
//             onPointerOut={(event) => hover(false)}>
//             <boxGeometry args={[1, 1, 1]} />
//             <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//         </mesh>
//     )
// }

// function Scene() {
//     return (
//         <Canvas style={{ width: '80%', height: '300px', marginTop: '13%' }} >
//             <color attach="background" args={["white"]} />
//             <ambientLight />
//             <pointLight position={[10, 10, 10]} />
//             <Robot position={[-1.2, 0, 0]} />
//             <Robot position={[1.2, 0, 0]} />
//         </Canvas>
//     )
// }

function iframe() {
    return {
        // src = /JaSMIn-master/dist/archive/3D%20Simulation/test25Hz.rpl3d
        __html: '<iframe src="/graphic_model/index.html" width="100%" height="300px" style="border-radius:6px"></iframe>'
    }
}


function ThreeJSCanvas() {
    return (
        <div >
            <div dangerouslySetInnerHTML={iframe()} />
        </div>)
    // return Scene();
}

export default ThreeJSCanvas
