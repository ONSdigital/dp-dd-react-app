export function parseDimension(dimension) {
    let optionsCount = 0;
    let selectableCount = 0;
    let selectedCount = 0;

    dimension.options = parseOptions(dimension.options);
    dimension.optionsCount = optionsCount;
    dimension.selectedCount = selectedCount;
    dimension.selectableCount = selectableCount;
    return dimension;

    function parseOptions(options) {

        return options.map(option => {
            optionsCount ++;
            if (!option.empty) {
                selectableCount ++;
            }

            // flat dimension values might have id only, hierarchical values have code
            if (option.code) {
                option.id = option.code;
            }

            if (option.empty) {
                option.selected = false;
            } else if (option.selected === undefined) {
                option.selected = true;
            }

            selectedCount += option.selected ? 1 : 0;
            if (option.options && option.options.length > 0) {
                option.options = parseOptions(option.options);

                if (option.totalSelectables !== undefined) {
                    return option;
                }

                option.totalSelectables = 1 + option.options.reduce((sum, option) => {
                    if (option.totalSelectables) {
                        return sum + option.totalSelectables + 1;
                    }
                    return sum + (option.empty ? 0 : 1);
                }, 0);
            }
            return option;
        });
    }
}

/**
 * Toggles selected property on all of the options in the hierarchy
 * @param {Object} param
 * @param {Object[]} param.options - Hierarchy of options
 * @param {boolean} param.selected - Option ID
 * @returns {Object[]}
 */
export function toggleSelectedOptions ({options, selected = true}) {
    return options.map(option => {
        option.selected = option.empty ? false : selected;
        if (option.options && option.options.length > 0) {
            option.options = toggleSelectedOptions({ options: option.options, selected });
        }
        return option;
    });
}

/**
 * Updates an option value in a hierarchy
 * @param {Object} param
 * @param {Object[]} param.options - Hierarchy of options
 * @param {string} param.id - Updated option ID
 * @param {Object} param.update - New option value
 * @returns {Object}
 */
export function updateOption ({options, id, update}) {
    let retOption = null;
    let index = 0;

    if (!update instanceof Object) {
        throw new Error("Update property is expected to be an object");
    }

    while (!retOption && index < options.length) {
        const option = options[index];
        if (option.id == id) {
            options[index] = Object.assign({}, option, update);
            retOption = option;
        }
        if (option.options) {
            retOption = updateOption({ options: option.options, id, update});
        }
        index++;
    }

    return retOption;
}

/**
 * Finds and returns option from the hierarchy. Returns null if option is not found.
 * @param {Object} param
 * @param {Object[]} param.options - Hierarchy of options
 * @param {string} param.id - Option ID
 * @returns {Object|null}
 */
export function findOptionByID ({options, id}) {
    let retOptions = null;
    let index = 0;

    while (!retOptions && index < options.length) {
        const option = options[index];
        if (option.id === id) {
            return option;
        }
        if (option.options) {
            retOptions = findOptionByID({ options: option.options, id });
        }
        index++;
    }

    return retOptions;
}

export function filterOptions({options, filter = {}}) {
    const keys = Object.keys(filter);
    return options.filter(option => {
        let matches = true;
        keys.forEach(key => {
            if (option[key] !== filter[key]) {
                matches = false;
            }
        });
        return matches;
    }).map(option => {
        option = Object.assign({}, option);
        delete option.options;
        return option;
    });
}

/**
 * Searches hierarchy of options for term in option names and returns an array of options
 * @param {Object} param
 * @param {Object[]} param.options - Hierarchy of options
 * @param {string} param.term - Searched string
 * @returns {Object[]}
 */
export function searchOptions({options, term = ''}) {
    let list = [];
    options.forEach(option => {
        const termIndex = option.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
        if (termIndex && !option.empty) {
            list.push({
                id: option.id,
                name: option.name,
                selected: option.selected,
                levelType: option.levelType
            })
        }

        if (option.options) {
            let parentName = option.name;
            let matchingOptions = searchOptions({
                options: option.options,
                term
            }).map(option => Object.assign({}, option, {
                name: !option.found ? `${option.name}` : option.name,
                note: option.levelType ? option.levelType.name : parentName,
                found: true
            }));
            Array.prototype.push.apply(list, matchingOptions);
        }
    });
    return list;
}

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