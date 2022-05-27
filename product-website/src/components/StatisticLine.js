import React from 'react'
import { Row,Col } from 'react-bootstrap'
import '../components/components_css/Statistics.css';

function StatisticLine({paramA,condition,paramB}) {
  return (
    <Row>
        <Col>
            <h3 className='statisticsH3'>{paramA}</h3>
        </Col>
        <Col>
            <p id='statisticLineP'>{condition}</p>
        </Col>
        <Col>
            <h3 className='statisticsH3'>{paramB}</h3>
        </Col>
    </Row>
  )
}

export default StatisticLine