import React, {Component} from 'react'

import CustomComponent from './CustomComponent'

const defaultProps = {
    foo: 'bar'
};

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
        return (
            <div>
                <CustomComponent/>
            </div>
        )
    }
}


App.defaultProps = defaultProps;