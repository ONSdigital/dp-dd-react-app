import React from 'react';
import { Link } from 'react-router'

export default () => {
    return (
        <div>
            <h2>Home</h2>
            <h3>Datasets</h3>
            <ul>
                <li><Link to="/dd/dataset/AF001EW/">Members of the Armed Forces</Link></li>
            </ul>
        </div>
    )
}