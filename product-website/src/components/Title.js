import React from 'react';
import './components_css/Title.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Title(props) {
    return <div>
        <h1 className='titleH1'>{props.title}</h1>
        <h4 className='titleH4'>{props.subtitle}</h4>
    </div>;
}

export default Title;