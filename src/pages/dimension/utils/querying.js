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