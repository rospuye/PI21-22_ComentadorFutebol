import React from 'react'

function iframe() {
    return {
        // src = /JaSMIn-master/dist/archive/3D%20Simulation/test25Hz.rpl3d
        // src = src="/JaSMIn-master/dist/embedded-player.html?replay=/JaSMIn-master/dist/archive/3D%20Simulation/test25Hz.rpl3d"
        __html: '<iframe src="/JaSMIn-master/dist/embedded-player.html?replay=/JaSMIn-master/dist/archive/3D%20Simulation/test.replay" width="900px" height="500px"></iframe>'
    }
}

function JasminPlayer() {
    return (
        <div>
            <div dangerouslySetInnerHTML={iframe()} />
        </div>)
}

export default JasminPlayer;