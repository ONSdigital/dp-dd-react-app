import naturalSort from 'object-property-natural-sort';

export function parseDimension(dimension) {
    let optionsCount = 0;
    let selectableCount = 0;
    let selectedCount = 0;

    dimension.options = parseOptions(dimension.options);
    dimension.optionsCount = optionsCount;
    dimension.selectedCount = selectedCount;
    dimension.selectableCount = selectableCount;
    return dimension;

    function parseOptions(options, selectedStatus = true) {

        const t0 = performance.now();

        let newOptions = options.map(option => {
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

        newOptions = newOptions.sort(naturalSort('name'));

        const t1 = performance.now();
        // console.log('Took', (t1 - t0).toFixed(4), 'seconds to parse dimension');


        console.log(newOptions);
        return newOptions
    }
}

// todo: reimplement for geography
export function parseGeographyDimension(dimension) {
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