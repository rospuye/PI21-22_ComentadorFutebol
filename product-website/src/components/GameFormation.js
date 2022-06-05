import React from "react"
import StatisticsPoints from "./StatisticsPoints"

import Img from '../images/Field2.jpg'


const GameFormation = ({formationA, formationB}) => {

    // formation = "5:4:2"

    const IMG_HEIGHT = 350
    const X_WEIGHT = 5
    const Y_WEIGHT = 3.75
    const MAX_PLAYERS = 5

    const generatePoints = (formation, color="red", offsetX=0) => {
        let points = []

        formation.split(":").map((nPlayers, xDistance) => {
            for (let i = 1; i <= nPlayers/1; i++) {
                points.push(
                    <StatisticsPoints
                        x={X_WEIGHT * (xDistance+1) + offsetX}
                        y={Y_WEIGHT * i + ((MAX_PLAYERS - nPlayers) * Y_WEIGHT) / 2}
                        color={color}
                    />
                )
            }
        })

        return points
    }

    return (
        <>
            <img
                alt='Field'
                src={Img}
                className='img-thumbnail'
                style={{height: `${IMG_HEIGHT}px`}}
            />
            {generatePoints(formationA)}
            {generatePoints(formationB, "blue", 17)}

            
        </>
    )
}

export default GameFormation