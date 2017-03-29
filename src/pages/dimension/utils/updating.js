/**
 * Toggles selected property on all of the options in the hierarchy.
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
 * Updates an option value in a hierarchy.
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
 * Iterates over flat or nested list of options updating dimension stats.
 * @param {Object} dimension
 * @param {Object[]} param.options - Flat or nested list of options
 * @returns {Object}
 */
export function updateDimensionStats(dimension) {
    let optionsCount = 0;
    let selectableCount = 0;
    let selectedCount = 0;

    dimension.options = updateSelectedStatusOfOptions(dimension.options);

    // --- stats
    dimension.optionsCount = optionsCount;
    dimension.selectedCount = selectedCount;
    dimension.selectableCount = selectableCount;
    // ---

    function updateSelectedStatusOfOptions(options) {
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
                option.options = updateSelectedStatusOfOptions(option.options);

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

    return dimension;
}
