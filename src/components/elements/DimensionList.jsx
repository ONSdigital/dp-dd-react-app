import React, {Component} from 'react'
import DimensionItem from './DimensionItem';

function DimensionsList(props) {
    const items = props.dimensions;
    return (
        <ul className="list--neutral">
            {items.map((item) =>
                <DimensionItem key={item.id} name={item.name} selected={item.selected}/>
            )}

        </ul>
    )
}

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

    // DimensionList(props) {
    //     const items = props.dimensions;
    //     return (
    //         <ul className="list--neutral">
    //             {items.map((item) =>
    //                 <DimensionItem name={item.name}/>
    //             )}
    //
    //         </ul>
    //     )
    // }

    // DimensionList(props) {
    //     const items = props.dimensions;
    //     const listItems = items.map((listItem) =>
    //         <DimensionItem name={listItem.name} selected={listItem.selected}/>
    //     );
    //
    //     return (
    //         <ul className="list--neutral">{listItems}</ul>
    //     )
    // }

    render() {

        return (
            <div>
                <DimensionsList dimensions={dimensions}/>
            </div>
        )
    }

}