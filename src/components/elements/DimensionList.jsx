import React, {Component} from 'react'
import DimensionItem from './DimensionItem';

let dimensions = [
    {id: 'D000125', name: 'Age', selected: "everything selected (6)"},
    {id: 'D000126', name: 'Sex', selected: "everything selected (3)"},
    {id: 'D000127', name: 'Residence Type', selected: "everything selected (3)"},
    {id: 'D000128', name: 'Location', selected: "everything selected (loads)"}
];

export default class DimensionList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const items = dimensions;
        return (
            <ul className="list--neutral">
                {items.map((item, key) => (
                    <DimensionItem key={key} name={item.name} selected={item.selected} id={item.id} />
                ))}
            </ul>
        )
    }
}