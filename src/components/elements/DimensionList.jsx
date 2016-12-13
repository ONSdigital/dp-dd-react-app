import React, {Component} from 'react'
import DimensionItem from './DimensionItem';

let dimensions = [
    {id: 1, name: 'Age', selected: "everything selected (6)"},
    {id: 2, name: 'Sex', selected: "everything selected (3)"},
    {id: 3, name: 'Residence Type', selected: "everything selected (3)"},
    {id: 4, name: 'Location', selected: "everything selected (loads)"}
];

export default class DimensionList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const items = dimensions;
        return (
            <ul className="list--neutral">
                {items.map((item, key) =>
                    <DimensionItem key={key} name={item.name} selected={item.selected} />
                )}
            </ul>
        )
    }
}