import React from 'react'

const defaultProps = {
    foo: 'bar'
};

export default function App(props) {
    return (
        <div>
            <h3>Hello from the app</h3>
            <div>
                <hr />
                <pre>
                {props.foo}
                </pre>
                <hr />
            </div>


        </div>
    )
}

App.defaultProps = defaultProps;