export function parseDimension(dimension) {
    let optionsCount = 0;
    let selectableCount = 0;
    let selectedCount = 0;

    dimension.options = parseOptions(dimension.options);
    dimension.optionsCount = optionsCount;
    dimension.selectedCount = selectedCount;
    dimension.selectableCount = selectableCount;
    dimension.edited = selectedCount > 0

    return dimension;

    function parseOptions(options, selectedStatus = true) {

        return options.map(option => {
            optionsCount ++;
            if (!option.empty) {
                selectableCount ++;
            }

            // todo: we should always use code, requires refactoring across whole app
            if (option.code) {
                option.id = option.code;
            } else {
                console.error('Code value is missing');
            }

            if (!option.empty) {
                option.selected = option.selected === false ? false : selectedStatus;
            } else {
                option.selected = false;
            }

            selectedCount += option.selected ? 1 : 0;
            if (option.options && option.options.length > 0) {
                option.options = parseOptions(option.options, selectedStatus);
            }
            return option;
        });
    }
}

export function findOptionsByType ({options, type}) {
    return options.filter(option => {
        return option.type === type
    });
}

export function toggleSelectedOptions ({options, selected = true}) {
    return options.map(option => {
        option.selected = option.empty ? false : selected;
        if (option.options && option.options.length > 0) {
            option.options = toggleSelectedOptions({ options: option.options, selected });
        }
        return option;
    });
}

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

export function searchOptions({options, term = ''}) {
    let list = [];
    options.forEach(option => {
        const termIndex = option.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
        if (termIndex && !option.empty) {
            list.push({
                id: option.id,
                name: option.name,
                selected: option.selected
            })
        }

        if (option.options) {
            let parentName = option.name;
            if (option.levelType) {
                parentName = option.levelType.name;
            }
            let matchingOptions = searchOptions({
                options: option.options,
                term
            }).map(option => Object.assign({}, option, {
                name: !option.found ? `${option.name}` : option.name,
                note: `found in ${parentName}`,
                found: true
            }));
            Array.prototype.push.apply(list, matchingOptions);
        }
    })
    return list;
}

/**
 * @param hierarchy dimension options or dimension option options
 * @param filter option field with value
 * @param depth
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