import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { getStore } from '../config/store';
import CustomComponent from './CustomComponent';


// export default function (props) => {(
//     <div>
//         <CustomComponent />
//     </div>
// )}

export default class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var store = getStore();
        return (
            <Provider store={store}>
                <CustomComponent/>
            </Provider>
        )
    }
}