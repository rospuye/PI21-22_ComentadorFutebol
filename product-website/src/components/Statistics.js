import React from 'react'
import { Container, Row,Col } from 'react-bootstrap'
import StatisticLine from './StatisticLine'
import '../components/components_css/Statistics.css';

//conditions, results A and results B are arrays

function Statistics({nameOfTeamA,nameOfTeamB,conditions,resultsA,resultsB}) {
  return (
    <Container>
        <Row>
            <Col>
                <h4 className='titleH4'>{nameOfTeamA}</h4>
            </Col>
            <Col>
            
            </Col>
            <Col>
                <h4 className='titleH4'>{nameOfTeamB}</h4>
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
        {conditions.map((cond,i) => (
        <StatisticLine paramA={resultsA[i]} condition={cond} paramB={resultsB[i]}/>))}
        
    </Container>
  )
}

export default Statistics