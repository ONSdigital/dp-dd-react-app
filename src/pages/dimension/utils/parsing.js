import naturalSort from 'object-property-natural-sort';
import { updateDimensionStats } from './updating';

export function parseHierarchicalDimension(dimension) {
    dimension.options = dimension.options.sort(naturalSort('name'));
    dimension = updateDimensionStats(dimension);
    return dimension;
}

export function parseGeographyDimension(dimension) {
    dimension.options = dimension.options.sort(naturalSort('name'));
    dimension = updateDimensionStats(dimension);

    const entryMap = new Map();
    const levelTypeMap = new Map();
    const optionTypeMap = prepareTree(dimension.options, null, entryMap, levelTypeMap);

    dimension = Object.assign(dimension, {
        entryMap,
        levelTypeMap,
        optionTypeMap
    });
    return dimension;
}

/**
 * Recurse through sparse tree, creating:
 * - Map of hierarchy entries by code (code=entry)
 * - Set of hierarchy entries for each level type (levelType=[entry1,entry2...])
 * While recursing, add the following information to each entry:
 * - parent
 * - childTypes (a set of the levelTypes of immediate children)
 * - leafTypes (a set of the levelTypes of all non-empty descendants)
 *
 * @param {Array} options
 * @param {Object} parent
 * @param {Map} entryMap - updated key value where entryMap[code] = entry
 * @param {Map} levelTypeMap - updated key value levelTypeMap[levelType] = [entry1, entry2, entry3]
 * @returns {Map}
 */
function prepareTree(options, parent, entryMap, levelTypeMap) {
    const optionTypeMap = new Map();

    options.forEach(option => {
        const childOptions = option.options == undefined ? [] : option.options;
        const childOptionTypes = prepareTree(childOptions, option, entryMap, levelTypeMap);
        childOptionTypes.forEach(childOptionType => optionTypeMap.set(childOptionType.id, childOptionType));
        option.parent = parent;
        if (!option.empty) {
            optionTypeMap.set(option.levelType.id, option.levelType);
        }
    });

    if (parent != null) {
        parent.leafTypes = new Map([...optionTypeMap]);
        const combinedEntryId = parent.hierarchy_id + ':' + parent.code
        entryMap.set(combinedEntryId, parent);

        let levelEntries = levelTypeMap.get(parent.levelType.id);
        if (levelEntries == null) {
            levelEntries = new Set();
            levelTypeMap.set(parent.levelType.id, levelEntries);
        }
        levelEntries.add(parent);
        if (!parent.empty) {
            optionTypeMap.set(parent.levelType.id, parent.levelType);
        }
    }
    return optionTypeMap;
}