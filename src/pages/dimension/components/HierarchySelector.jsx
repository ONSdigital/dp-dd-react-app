import React, {Component} from 'react';

export default class HierarchySelector extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <fieldset className="hierarchy">
                <legend>Select alcoholic beverages and tobacco</legend>
                <ul className="nested-list">
                    <li className="nested-list--option">
                        <input className="checkbox__input" type="checkbox" id="checkbox-01" name="checkbox" value="value-01" />
                            <label className="font-size--19 checkbox__label" htmlFor="checkbox-01">
                                02 Alcoholic beverages and tobacco
                            </label>
                    </li>
                    <li className="nested-list--children">
                        <ul>
                            <li className="nested-list--option">
                                <input className="checkbox__input" type="checkbox" id="checkbox-01" name="checkbox" value="value-01" />
                                    <label className="font-size--19 checkbox__label" htmlFor="checkbox-01">
                                        02.1 Alcoholic beverages
                                    </label>
                            </li>
                            <li className="nested-list--children">
                                <ul>
                                    <li className="nested-list--option">
                                        <input className="checkbox__input" type="checkbox" id="checkbox-01" name="checkbox" value="value-01" />
                                            <label className="font-size--19 checkbox__label" htmlFor="checkbox-01">
                                                02.1.1 Spirits
                                            </label>
                                    </li>
                                    <li className="nested-list--option">
                                        <input className="checkbox__input" type="checkbox" id="checkbox-01" name="checkbox" value="value-01" />
                                            <label className="font-size--19 checkbox__label" htmlFor="checkbox-01">
                                                02.1.2 Wine
                                            </label>
                                    </li>
                                    <li className="nested-list--option">
                                        <input className="checkbox__input" type="checkbox" id="checkbox-01" name="checkbox" value="value-01" />
                                            <label className="font-size--19 checkbox__label" htmlFor="checkbox-01">
                                                02.1.3 Beer
                                            </label>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <ul>
                            <li className="nested-list--option">
                                <input className="checkbox__input" type="checkbox" id="checkbox-01" name="checkbox" value="value-01" />
                                    <label className="font-size--19 checkbox__label" htmlFor="checkbox-01">
                                        02.2 Tobacco
                                    </label>
                            </li>
                            <li className="nested-list--children">
                                <ul>
                                    <li className="nested-list--option">
                                        <input className="checkbox__input" type="checkbox" id="checkbox-01" name="checkbox" value="value-01" />
                                            <label className="font-size--19 checkbox__label" htmlFor="checkbox-01">
                                                02.2.0 Tobacco
                                            </label>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </fieldset>
        )
    }
}