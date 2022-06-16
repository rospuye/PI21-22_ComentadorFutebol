import React from "react"
import StatisticsPoints from "./StatisticsPoints"

import Img from '../images/Field2.jpg'


const GameFormation = ({formationA, formationB}) => {

    // formation = "5:4:2"

    const IMG_HEIGHT = 350
    const X_WEIGHT = 5
    const Y_WEIGHT = 3.75
    const N_PLAYERS_WEIGHT = 5
    const DESLOCATION_WEIGHT = 0.13
    // const MAX_PLAYERS = 5

    const HALF_X_WEIGHT = 0.5

    const generatePoints = (formation, color="red", offsetX=0, halfX=HALF_X_WEIGHT) => {
        let points = []

        formation.split(":").map((nPlayers, xDistance) => {
            let newWeight = Y_WEIGHT/nPlayers * N_PLAYERS_WEIGHT


            for (let i = 1; i <= nPlayers/1; i++) {
                // let yVal = newWeight * i + ((MAX_PLAYERS - nPlayers) * newWeight) / 2
                let yVal = newWeight * i + ((nPlayers - 4) * DESLOCATION_WEIGHT * newWeight)
                let half = (nPlayers/1+1)/2
                let diference = Math.abs(i - half)

                points.push(
                    <StatisticsPoints
                        x={X_WEIGHT * (xDistance+1) + offsetX + diference * halfX * diference/2}
                        y={yVal}
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
            {generatePoints(formationB, "blue", 18.75, -HALF_X_WEIGHT)}

            
        </>
    )
}

export default GameFormation