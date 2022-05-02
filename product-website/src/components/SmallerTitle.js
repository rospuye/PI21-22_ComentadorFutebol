import React, {Component} from 'react';
import './components_css/Title.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function SmallerTitle(props) {
    return <div>
        <h3>{props.title}</h3>
    </div>;
}

export default SmallerTitle;