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


/* -------------- [ geography querying tools ] ----------------- */

/*
 // leaf types is the set of types to list for the user
 // when they click on a given leaf type:
 const leafType = 'MD';
 const optionSet = tree.levelTypeMap.get(leafType);
 const topLevelItems = getBrowseList(optionSet);
 const checkBoxItems = getEntriesOfType(leafType, topLevelItems)
 const expandingItems = getEntriesWithLeafType(leafType, topLevelItems)
 // when they click on an expanding item:
 debugger;
 const item = expandingItems[0];
 const children = new Set(item.options);
 const checkBoxItems2 = getEntriesOfType(leafType, children)
 const expandingItems2 = getEntriesWithLeafType(leafType, children);
 */

/**
 * Given a set of entries (of a particular levelType), identify the top-level list of entries to display
 * @param {Set} entries - nested entry hierarchy
 * @param {number} maxListSize - maximum number of entries that can be displayed without grouping
 * @returns {Set}
 */
export function getBrowseList(entries, maxListSize = 20) {
    if (entries.size <= maxListSize) {
        return entries;
    }

    const parentMap = new Map();
    entries.forEach(entry => {
        // get the parent if there is one
        parents.add(entry.parent==null ? entry : entry.parent);
        // record how many entries are children of this parent
        let children = parentMap.get(parent);
        if (children == null) {
            children = new Set();
            parentMap.set(parent, children);
        }
        children.add(entry)
    });

    // if a parent has only one child in entries, retain the entry instead - don't walk too far back up the tree
    const parents = new Set();
    for (let parent in parentMap.keys) {
        if (parentMap.get(parent).size == 1) {
            parents.add(parentMap.get(parent));
        } else {
            parents.add(parent);
        }
    }

    // check they don't all belong to the same parent, or have no parents
    if (parents.size <= 1  || parents.size == entries.size) {
        return entries;
    }
    return getBrowseList(parents);
}

/**
 * Given a set of entries, return those with the requested levelType (i.e. those that should have a check box)
 * @param {string} levelTypeID - level type ID
 * @param {Set} entries - nested entry hierarchy
 * @returns {Set}
 */
export function getEntriesOfType(levelTypeID, entries) {
    const matches = new Set();
    entries.forEach(entry => {
        if (entry.levelType.id == levelTypeID) {
            matches.add(entry);
        }
    });
    return matches;
}

/**
 * Given a set of entries, return those with children of the requested type
 * (i.e. those that should be have a link to show a list of their children)
 * @param {string} levelTypeID - level type ID
 * @param {Set} entries - nested entry hierarchy
 * @returns {Set}
 */
export function getEntriesWithLeafType(levelTypeID, entries) {
    const matches = new Set();
    entries.forEach(entry => {
        if (entry.leafTypes.has(levelTypeID)) {
            matches.add(entry);
        }
    });
    return matches;
}
