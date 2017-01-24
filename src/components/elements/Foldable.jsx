import React, {Component, PropTypes} from 'react';

const propTypes = {
    header: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    expanded: PropTypes.bool
}

const defaultProps = {
    expanded: false
}

export default class Foldable extends Component {
    constructor(props) {
        super(props);
        this.initialProps = props;
        this.state = {
            expanded: props.expanded,
        }
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    render() {
        const {
            id,
            header,
            children,
        } = this.props;

        const {
            expanded
        } = this.state;

        return (
            <div className="show-hide show-hide--light border-top--abbey-sm border-top--abbey-md border-top--abbey-lg  js-show-hide">
                <div className="js-show-hide__title is-shown">

                    <button className="js-show-hide__button" type="button" aria-expanded={expanded} aria-controls={id} onClick={this.onClick}>
                        <h3 className="margin-top-sm--0 margin-top-md--0 margin-bottom-sm--0 margin-bottom-md--0">{header}</h3>
                    </button>
                </div>
                <div className="js-show-hide__content" id={id} aria-hidden={!expanded}>
                    <div className="col-wrap margin-left-sm--0 margin-left-md--0">{children}</div>
                </div>
            </div>
        )
    }
}

Foldable.propTypes = propTypes;
Foldable.defaultProps = defaultProps;