import {filterOptions} from './querying';

/**
 * Renders flattened hierarchy with only single level of depth
 * @param {Object} param
 * @param {Object|Object[]} param.hierarchy - Hierarchy structure
 * @param {Object} param.filter - Hierarchy entry filter
 * @param {number} param.depth - Used to group top level entries
 */
export function renderFlatHierarchy ({ hierarchy, filter = {}, depth = 0 }) {
    const selectedOptions = [];
    if (!hierarchy instanceof Array) {
        hierarchy = [hierarchy];
    }

    if (depth === 0) {
        const parent = { id: "hierarchy-root", name: "Top Level", options: [] };
        parent.options = filterOptions({
            options: hierarchy,
            filter: { selected: true }
        }).map(function (option) {
            delete option.options;
            return option;
        });

        if (parent.options.length > 0) {
            selectedOptions.push(parent);
        }
    }

    hierarchy.forEach(element => {

        if (element.selected)  {
            const option = Object.assign({}, element)
            delete option.options;
            selectedOptions.push(option);
        }

        if (element.options) {
            selectedOptions.push(Object.assign({}, element, {
                options: filterOptions({
                    options: element.options,
                    filter: { selected: true }
                })
            }));

            Array.prototype.push.apply(selectedOptions, renderFlatHierarchy({
                hierarchy: element.options,
                filter,
                depth: depth + 1
            }));
        }
    })
    return selectedOptions;
}


/**
 * Returns hierarchy of options as flat list
 * @param {Object} param
 * @param {Object[]} param.hierarchy - Hierarchy of options
 * @param {string} param.filter - Option filter todo: implement
 * @returns {Object[]}
 */
export function renderFlatListOfOptions ({ hierarchy, filter = {} }) {
    const list = [];
    if (!(hierarchy instanceof Array)) {
        hierarchy = [hierarchy];
    }

    hierarchy.forEach(element => {
        element = Object.assign({}, element);
        const internalHierarchy = element.options || [];
        delete element.options;
        list.push(Object.assign({}, element));
        if (internalHierarchy.length > 0) {
            Array.prototype.push.apply(list, renderFlatListOfOptions({ hierarchy: internalHierarchy, filter }));
        }
    });

    return list;
}