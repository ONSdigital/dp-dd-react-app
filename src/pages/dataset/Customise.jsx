import React, { Component } from 'react'
import { connect } from 'react-redux'
import { requestDimensions } from './actions'
import { Link } from 'react-router'
import DimensionList from '../../components/elements/DimensionList'
import DimensionSelector from '../../components/elements/DimensionSelector'

class Customise extends Component {

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        const dispatch = this.props.dispatch;
        dispatch(requestDimensions(this.props.params.id));
    }

    render() {
        const { dimensions, params } = this.props;
        const selectedDimensions = dimensions.map((dimension) => {
            return Object.assign({}, dimension, {
                selected: 'nothing selected'
            })
        })

        const page = {}
        if (this.props.params.selectorID === undefined) {
            page.title = "Customise this dataset"
            page.parentPath = '/dd/dataset/AF001EW/customise/'
            page.component = <DimensionList dimensions={selectedDimensions} />
        } else {
            const options =  [
                {
                    id: "DO000161",
                    name: "All categories: Residence Type"
                },
                {
                    id: "DO000162",
                    name: "Lives in a household"
                },
                {
                    id: "DO000163",
                    name: "Lives in a communal establishment"
                }
            ]
            page.title = ""
            page.parentPath = '/dd/dataset/AF001EW/customise/'
            page.component = <DimensionSelector options={options}/>
        }

        return (
            <div>
                <div className="margin-top--2">
                    <Link to={page.parentPath} className="btn--everything">Back</Link>
                    <h1 className="margin-top--half margin-bottom">{page.title}</h1>
                </div>
                {page.component}
            </div>
        )
    }
}

function mapStateToProps(state) {
    const props = {
        dimensions: state.dataset.dimensions
    }

    return props
}

export default connect(mapStateToProps)(Customise)