import React, { Component } from 'react';

export default class Layout extends Component {

    render() {
        return (
            <div>
                <h3>Layout</h3>
                {this.props.children}
            </div>
        );
    }
}