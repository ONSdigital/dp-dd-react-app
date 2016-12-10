import React from 'react';
import { Link } from 'react-router'

export default () => {
    return (
        <div>
            <h2>Home</h2>

            <ul>
                <li><Link to="/dataset">Dataset</Link></li>
            </ul>
        </div>
    )
}