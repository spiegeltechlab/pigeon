const { _clone, _objId } = require('./helpers');

function reverse(changes, history = []) {

    const reversedChanges = _clone(changes).reverse();
    const reversedHistory = _clone(history).reverse();

    for (const change of reversedChanges) {
        if (change.op == 'add') {
            change.op = 'remove';
            const id = _objId(change.value);
            if (id) {
                const parts = change.path.split('/');
                const lastPart = parts[parts.length - 1];

                if (!lastPart.startsWith('[') && !lastPart.endsWith(']')) {
                    // replace '/array/0' with '/array/[objId]'
                    parts[parts.length - 1] = `[${id}]`;
                    change.path = parts.join('/');
                } else if (lastPart.startsWith('[') && lastPart.endsWith(']')) {
                    // replace' /array/[insertBeforeThisId]' with '/array/[objId]'
                    parts[parts.length - 1] = `[${id}]`;
                    change.path = parts.join('/');
                }
            }
        } else if (change.op == 'remove') {
            change.op = 'add';
            const parts = change.path.split('/');
            const lastPart = parts[parts.length - 1];
            let cleanPartId = lastPart;
            if (lastPart.startsWith('[') && lastPart.endsWith(']')) {
                parts[parts.length - 1] = '0';
                change.path = parts.join('/');
                cleanPartId = lastPart.replace(/^\[|\]$/g, '');
            }

            // The remove operation effectively turns into an add, but it doesn’t know what value should be added.
            // That’s why we need to look up the most recent change in the history and use its previous value.
            const lastChangeWithAdd = reversedHistory.find(change =>
                change.diff.some(diffEntry =>
                    diffEntry?.op === 'add' && diffEntry.value.id === cleanPartId
                )
            );
            const addDiffsForRemoveDiff = lastChangeWithAdd?.diff.filter(diffEntry =>
                diffEntry.op === 'add' && diffEntry.value.id === cleanPartId
            );
            if (Array.isArray(addDiffsForRemoveDiff) && addDiffsForRemoveDiff.length === 1 && addDiffsForRemoveDiff[0]?.value) {
                change._prev = addDiffsForRemoveDiff[0].value;
            }
        }

        if ('_prev' in change) {
            var _prev = change._prev;
        }

        if ('value' in change) {
            var _value = change.value;
        }

        if (_prev === undefined) {
            delete change.value;
        } else {
            change.value = _prev;
        }

        if (_value === undefined) {
            delete change._prev;
        } else {
            change._prev = _value;
        }
    }

    return reversedChanges;
}

module.exports = reverse;
