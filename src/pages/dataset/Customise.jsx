import React, {Component} from 'react';
import DimmensionList from '../../components/elements/DimensionList'

export default class Customise extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return this.props.params.selectorID === undefined
            ? <DimmensionList />
            : <div className="margin-bottom--double"><h3>Customise details { this.props.params.selectorID }</h3></div>
    }
}
