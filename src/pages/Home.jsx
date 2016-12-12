import React from 'react';
import { Link } from 'react-router'

export default () => {
    return (
        <div>
            <h2>Home</h2>
            <h3>Datasets</h3>
            <ul>
                <li><Link to="/dataset/AF001EW/">Members of the Armed Forces</Link></li>
                <li><Link to="/dataset/G39/">House Price Statistics for Small Areas</Link></li>
            </ul>
        </div>
    )
}