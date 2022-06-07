import React from 'react'

function iframe(fstate, cstate) {
    // console.log(fstate)
    // console.log(cstate)

    return {
        __html: '<iframe src="/graphic_model/index.html?fstate=' + fstate + '&cstate=' + cstate + '" width="100%" height="300px" style="border-radius:6px"></iframe>'
    }
}


function ThreeJSCanvas(props) {
    // console.log(props.fstate)
    // console.log(props.cstate)

    return (
        <div >
            <div dangerouslySetInnerHTML={iframe(props.fstate, props.cstate)} />
        </div>)
}

export default ThreeJSCanvas
