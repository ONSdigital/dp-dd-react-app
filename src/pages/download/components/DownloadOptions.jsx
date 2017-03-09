import React, { Component, PropTypes } from 'react';

import Checkbox from '../../../components/elements/Checkbox';
import FileTypesHelp from '../../../components/elements/FileTypesHelp';

const propTypes = {
    onSave: PropTypes.func.isRequired
}

export default class DownloadOptions extends Component {

    constructor(props) {
        super(props);

        this.cacheOption = this.cacheOption.bind(this);
        this.saveOptions = this.saveOptions.bind(this);

        this.state = {
            options: [
                { id: 'xls', label: 'XLS', value: 'XLS', selected: false, disabled: true },
                { id: 'csv', label: 'CSV', value: 'CSV', selected: false },
                { id: 'json', label: 'JSON', value: 'JSON', selected: false, disabled: true}
            ],
            selectedOptions: [],
            errorMessage: ''
        };
    }

    cacheOption({id, checked}) {
        const options = this.state.options.map((option) => {
            option.selected = option.id === id ? checked : option.selected;
            return option;
        });

        const errorMessage = '';

        this.setState({options, errorMessage});
    }

    saveOptions(e) {
        e.preventDefault();
        if (!this.isSelectionValid()) {
            this.setState({errorMessage: "Select at least one option"});
            return;
        }

        const options = this.state.options;
        const selectedOptions = [];

        options.map(option => {
            if (option.selected) {
                selectedOptions.push(option.value);
            }
        });

        this.state.selectedOptions = selectedOptions; // this might not be needed once we are getting the files back from the server, for the moment it still lets us only show links for the formats they chose once they're 'ready for download
        this.props.onSave(selectedOptions);
    }

    isSelectionValid() {
        return (this.state.options).some(option => {
            return option.selected;
        });
    }

    render() {
        const options = this.state.options;
        const errorMessage = this.state.errorMessage;

        return (
            <div>
                <h1 className="margin-top--4 margin-bottom">Download options</h1>
                <p className="flush">Choose the file type(s) you want to download.</p>

                <FileTypesHelp/>

                <div className={(errorMessage.length > 0) && "error__group"}>
                    <div className={(errorMessage.length > 0) && "error__message"}>{errorMessage}</div>
                    {
                        options.map((props, index) => {
                            props['key'] = index;
                            props['checked'] = props.selected;
                            if (props.disabled) {
                                props['disabled'] = true;
                            }
                            return <Checkbox {...props} onChange={this.cacheOption}/>
                        })
                    }
                </div>

                <div className="margin-top--3">
                    <a className="btn btn--primary btn--thick btn--wide btn--big margin-right--half"
                       onClick={this.saveOptions}>Generate files</a><br/>
                </div>
            </div>
        )
    }
}


DownloadOptions.proptypes = propTypes;