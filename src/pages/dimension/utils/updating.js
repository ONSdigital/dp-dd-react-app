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