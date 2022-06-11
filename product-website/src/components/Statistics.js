import React from 'react'
import { Container, Row,Col } from 'react-bootstrap'
import StatisticLine from './StatisticLine'
import '../components/components_css/Statistics.css';

//conditions, results A and results B are arrays

function Statistics({nameOfTeamA, nameOfTeamB, stats}) {

    const conditions = ["Goals", "Shots", "% Ball"]
    let maxTimestamp = 0

    for (const [timestamp, _] of Object.entries(stats)) {
        if (timestamp/1 > maxTimestamp) {
            maxTimestamp = timestamp
        }
    }

    let teams = stats[maxTimestamp].teams
    
    return (
        <Container>
            <Row style={{marginTop:'2%'}}>
                <Col>
                    <h4 className='statisticsH4'>{nameOfTeamA}</h4>
                </Col>
                <Col>
                
                </Col>
                <Col>
                    <h4 className='statisticsH4'>{nameOfTeamB}</h4>
                </Col>
            </Row>
            <hr
            style={{
                color: 'white',
                backgroundColor: 'white',
                height: 5,
                borderRadius: 5,
            }}
        />
            {/* <StatisticLine paramA={resultsA[i]} condition={"Goals"} paramB={resultsB[i]}/>))} */}
            <StatisticLine
                paramA={teams.A.goals}
                condition={"Goals"}
                paramB={teams.B.goals}
            />
            <StatisticLine
                paramA={teams.A.shots}
                condition={"Shots"}
                paramB={teams.B.shots}
            />
            <StatisticLine
                paramA={Math.round(teams.A.ball_pos * 100)/100}
                condition={"Ball Possession (%)"}
                paramB={Math.round(teams.B.ball_pos * 100)/100}
            />
            
        </Container>
    )
}

export default Statistics