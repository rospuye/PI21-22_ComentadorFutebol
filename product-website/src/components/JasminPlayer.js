import React from 'react'

function iframe(url) {
    return {
        // src = /JaSMIn-master/dist/archive/3D%20Simulation/test25Hz.rpl3d
        // src = src="/JaSMIn-master/dist/embedded-player.html?replay=/JaSMIn-master/dist/archive/3D%20Simulation/test25Hz.rpl3d"
        __html: `<iframe id="video-game-iframe" src="/JaSMIn-master/dist/embedded-player.html?replay=${url}" width="900px" height="500px"></iframe>`
    }
}

function JasminPlayer({replayUrl}) {
    return (
        <div>
            <div dangerouslySetInnerHTML={iframe(replayUrl)} />
        </div>)
}

export default JasminPlayer;