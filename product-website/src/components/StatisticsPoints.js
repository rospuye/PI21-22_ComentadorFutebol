import React from "react";
import "./components_css/StatisticsPoints.css"

const StatisticsPoints = ({x=0, y=0, color="red"}) => {

    return (
        <>
            <div className="point" style={{backgroundColor: color, marginTop: `${-y}em`, marginLeft: `${x}em`}}>
            </div>
        </>
    )
}

export default StatisticsPoints