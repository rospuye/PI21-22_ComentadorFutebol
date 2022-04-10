import React, {Component} from 'react';
import './components_css/Title.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Title(props) {
    return <div>
        <h1>Commentator</h1>
        <h4>{props.subtitle}</h4>
    </div>;
}

export default Title;