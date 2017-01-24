import React from 'react';
import { Link } from 'react-router'

export default () => {
    return (
        <div className="wrapper">
            <h2>Home</h2>
            <h3>Datasets</h3>
            <ul>
                <li><Link to="/dd/datasets/AF001EW/">Members of the Armed Forces</Link></li>
                <li><Link to="/dd/datasets/CPI15/">CPI15 Consumer Prices Index (COICOP).</Link></li>
            </ul>
        </div>
    )
}