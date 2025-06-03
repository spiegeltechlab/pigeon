const diff = require('./diff');
const patch = require('./patch');
const reverse = require('./reverse');
const { _clone, _crc, _configure, _config } = require('./helpers');

let HISTORY_LENGTH = 1000;

const meta = new WeakMap();
const _client_id = _id();

class AutoPigeon {
    constructor() {
        meta.set(this, {
            history: [],
            stash: [],
            warning: null,
            changeIds: {},
        });
    }

    static from(data, clientId = _client_id) {
        let doc = new AutoPigeon();
        meta.get(doc).client_id = clientId;
        doc = AutoPigeon.change(doc, (doc) => Object.assign(doc, data));
        return doc;
    }

    static _forge(data, clientId = _client_id) {
        let doc = new AutoPigeon();
        meta.get(doc).client_id = clientId;
        Object.assign(doc, _clone(data));
        return doc;
    }

    static alias(doc) {
        console.warning(
            'Feature is currently not supported correctly (since primitve array support)'
        );
        let alias = new AutoPigeon();
        meta.set(alias, meta.get(doc));
        Object.assign(alias, doc);
        return alias;
    }

    static init() {
        return AutoPigeon.from({});
    }

    static clone(doc, historyLength = HISTORY_LENGTH) {
        const clone = AutoPigeon._forge(doc);
        meta.get(clone).history = meta.get(doc).history;
        meta.get(clone).changeIds = _clone(meta.get(doc).changeIds);
        AutoPigeon.pruneHistory(meta.get(clone), historyLength);
        return clone;
    }

    static pruneHistory(meta, historyLength) {
        const docHistoryLength = meta.history.length;
        if (docHistoryLength > historyLength) {
            const prunedHistory = meta.history.slice(
                0,
                docHistoryLength - historyLength
            );
            for (const item of prunedHistory) {
                delete meta.changeIds[item.change_id];
            }
        }
        meta.history = meta.history.slice(-historyLength);
    }

    static getChange(left, right) {
        const _diff = diff(left, right);
        const change = {
            diff: _diff,
            client_id: meta.get(left).client_id,
            timestamp_ms: _config.getTimestamp(),
            seq: _seq(),
            change_id: _id(),
        };
        return change;
    }

    static rewindChanges(doc, timestampMs, clientId) {
        const { history } = meta.get(doc);

        while (true) {
            if (history.length <= 1) break;
            const change = history[history.length - 1];
            if (
                change.timestamp_ms > timestampMs ||
                (change.timestamp_ms == timestampMs &&
                    change.client_id > clientId)
            ) {
                const c = meta.get(doc).history.pop();
                patch(doc, reverse(c.diff));
                delete meta.get(doc).changeIds[c.change_id];
                meta.get(doc).stash.push(c);
                continue;
            }
            break;
        }
    }

    static fastForwardChanges(doc) {
        const { stash, history } = meta.get(doc);
        let change;
        while ((change = stash.pop())) {
            patch(doc, change.diff);
            meta.get(doc).changeIds[change.change_id] = 1;
            history.push(change);
        }
    }

    static applyChangeInPlace(doc, change) {
        return AutoPigeon.applyChange(doc, change, true);
    }

    static applyChange(doc, change, inplace) {
        meta.get(doc).warning = null;
        const newDoc = inplace ? doc : AutoPigeon.clone(doc);
        if (meta.get(doc).changeIds[change.change_id]) {
            return newDoc;
        }
        try {
            AutoPigeon.rewindChanges(
                newDoc,
                change.timestamp_ms,
                change.client_id
            );
        } catch (e) {
            meta.get(newDoc).warning = 'rewind failed: ' + e;
        }
        try {
            patch(newDoc, change.diff);
            meta.get(newDoc).changeIds[change.change_id] = 1;
        } catch (e) {
            meta.get(newDoc).warning = 'patch failed: ' + e;
        }
        try {
            AutoPigeon.fastForwardChanges(newDoc);
        } catch (e) {
            meta.get(newDoc).warning = 'forward failed: ' + e;
        }
        const history = meta.get(newDoc).history;
        let idx = history.length;
        while (idx > 1 && history[idx - 1].timestamp_ms > change.timestamp_ms)
            idx--;
        history.splice(idx, 0, change);
        return newDoc;
    }

    static change(doc, fn) {
        const tmp = _clone(doc);
        fn(tmp);
        const change = AutoPigeon.getChange(doc, tmp);
        return AutoPigeon.applyChange(doc, change);
    }

    static getHistory(doc) {
        return meta.get(doc).history;
    }

    static merge(doc1, doc2) {
        let doc = AutoPigeon.from({});
        const history1 = AutoPigeon.getHistory(doc1);
        const history2 = AutoPigeon.getHistory(doc2);
        const changes = [];
        while (history1.length || history2.length) {
            if (!history2.length) {
                changes.push(history1.shift());
            } else if (!history1.length) {
                changes.push(history2.shift());
            } else if (history1[0].change_id === history2[0].change_id) {
                changes.push(history1.shift() && history2.shift());
            } else if (history1[0].timestamp_ms < history2[0].timestamp_ms) {
                changes.push(history1.shift());
            } else if (history1[0].timestamp_ms == history2[0].timestamp_ms) {
                if (history1[0].seq < history2[0].seq) {
                    changes.push(history1.shift());
                } else {
                    changes.push(history2.shift());
                }
            } else {
                changes.push(history2.shift());
            }
        }

        for (const change of changes) {
            doc = AutoPigeon.applyChange(doc, change);
        }
        return doc;
    }

    static getWarning(doc) {
        return meta.get(doc).warning;
    }

    static getMissingDeps(doc) {
        return false;
    }

    static setHistoryLength(len) {
        HISTORY_LENGTH = len;
    }

    static setTimestamp(fn) {
        _config.getTimestamp = fn;
    }

    static crc(doc) {
        return _crc(doc);
    }

    static load(str, historyLength = HISTORY_LENGTH) {
        const { meta: _meta, data } = JSON.parse(str);
        AutoPigeon.pruneHistory(_meta, historyLength);
        const doc = AutoPigeon.from(data);
        Object.assign(meta.get(doc), _meta);
        return doc;
    }

    static save(doc) {
        const { client_id, ..._meta } = meta.get(doc);
        return JSON.stringify({
            meta: _meta,
            data: doc,
        });
    }

    static configure(options) {
        _configure(options);
    }
}

function _id() {
    return Math.random().toString(36).substring(2);
}

let seq = 0;
function _seq() {
    return seq++;
}

module.exports = AutoPigeon;
