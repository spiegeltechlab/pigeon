const { _clone, _objId } = require('./helpers');

function reverse(changes) {
    const reversed = _clone(changes).reverse();

    for (const change of reversed) {
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
            if (lastPart.startsWith('[') && lastPart.endsWith(']')) {
                parts[parts.length - 1] = '0';
                change.path = parts.join('/');
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

    return reversed;
}

module.exports = reverse;
