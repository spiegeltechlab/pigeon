const assert = require('assert');
const suite = require('./index');

const AutoPigeon = require('../auto');

suite('rewindChanges', (test) => {
     test("replace without _prev", async () => {
        let document = AutoPigeon.from({
            notifications: [
                {
                    id: "same_title_seo_title",
                    title: "Der Titel und SEO-Titel sind gleich."
                },
                {
                    id: "heading_min_length",
                    title: "Ungültige Dachzeile"
                },
            ],
            updated_at: 1756468994,
        });
        const timestamp = Date.now();

        AutoPigeon.applyChangeInPlace(document, {
            type: "change",
            diff: [
                {
                    op: "replace",
                    path: "/notifications/[same_title_seo_title]/title",
                    value: "#1"
                },
            ],
            timestamp_ms: timestamp + 100,
            client_id: _id(),
            change_id: _id(),
        });

        AutoPigeon.applyChangeInPlace(document, {
            type: "change",
            diff: [
                {
                    op: "replace",
                    path: "/notifications/[same_title_seo_title]/title",
                    value: "#3"
                },
            ],
            timestamp_ms: timestamp + 300,
            client_id: _id(),
            change_id: _id(),
        });

        AutoPigeon.applyChangeInPlace(document, {
            type: "change",
            diff: [
                {
                    op: "replace",
                    path: "/notifications/[same_title_seo_title]/title",
                    value: "#2"
                },
            ],
            timestamp_ms: timestamp + 200,
            client_id: _id(),
            change_id: _id(),
        });

        AutoPigeon.applyChangeInPlace(document, {
            type: "change",
            diff: [
                {
                    op: "replace",
                    path: "/updated_at",
                    value: 1756469012,
                },
            ],
            timestamp_ms: timestamp + 250,
            client_id: _id(),
            change_id: _id(),
        });

        AutoPigeon.applyChangeInPlace(document, {
            type: "change",
            diff: [
                {
                    op: "replace",
                    path: "/updated_at",
                    value: 1756469015,
                }
            ],
            timestamp_ms: timestamp + 300,
        });

        assert.deepEqual(document, {
            notifications: [
                {
                    id: "same_title_seo_title",
                    title: "#3"
                },
                {
                    id: "heading_min_length",
                    title: "Ungültige Dachzeile"
                },
            ],
            updated_at: 1756469015,
        });
    });

    test("add/remove without _prev", async () => {
        let document = AutoPigeon.from({
            notifications: [
                {
                    id: "same_title_seo_title",
                    type: "textinfo",
                    label: "warning",
                    title: "Der Titel und SEO-Titel sind gleich."
                },
                {
                    id: "heading_min_length",
                    type: "textinfo",
                    label: "info",
                    title: "Ungültige Dachzeile"
                },
            ],
            last_modified: 1756468994,
            seo_title: "",
            slug: "slug",
            social_title: "Titel",
            title: "Titel",
            updated_at: 1756468994,
        });
        const timestamp = Date.now();

        AutoPigeon.applyChangeInPlace(document, {
            type: "change",
            diff: [
                {
                    op: "replace",
                    path: "/slug",
                    value: "",
                },
                {
                    op: "replace",
                    path: "/social_title",
                    value: "",
                },
            ],
            timestamp_ms: timestamp + 0,
            client_id: _id(),
            change_id: _id(),
        });

        AutoPigeon.applyChangeInPlace(document, {
            type: "change",
            diff: [
                {
                    op: "add",
                    path: "/notifications/0",
                    value: {
                        id: "seo_title_min_length",
                        type: "textinfo",
                        label: "warning",
                        title: "Ungültige SEO-Titellänge",
                    },
                },
                {
                    op: "remove",
                    path: "/notifications/[same_title_seo_title]",
                },
            ],
            timestamp_ms: timestamp + 100,
            client_id: _id(),
            change_id: _id(),
        });

        AutoPigeon.applyChangeInPlace(document, {
            type: "change",
            diff: [
                {
                    op: "replace",
                    path: "/seo_title",
                    value: "Titel",
                },
                {
                    op: "replace",
                    path: "/social_title",
                    value: "Titel",
                },
            ],
            timestamp_ms: timestamp + 200,
            client_id: _id(),
            change_id: _id(),
        });

        AutoPigeon.applyChangeInPlace(document, {
            type: "change",
            diff: [
                {
                    op: "add",
                    path: "/notifications/0",
                    value: {
                        id: "same_title_seo_title",
                        type: "textinfo",
                        label: "warning",
                        title: "Der Titel und SEO-Titel sind gleich."
                    },
                },
                {
                    op: "remove",
                    path: "/notifications/[seo_title_min_length]",
                },
            ],
            timestamp_ms: timestamp + 300,
            client_id: _id(),
            change_id: _id(),
        });

        AutoPigeon.applyChangeInPlace(document, {
            type: "change",
            diff: [
                {
                    op: "replace",
                    path: "/updated_at",
                    value: 1756469012,
                },
                {
                    op: "replace",
                    path: "/last_modified",
                    value: 1756469012,
                },
            ],
            timestamp_ms: timestamp + 250,
            client_id: _id(),
            change_id: _id(),
        });

        AutoPigeon.applyChangeInPlace(document, {
            type: "change",
            diff: [
                {
                    op: "replace",
                    path: "/updated_at",
                    value: 1756469015,
                },
                {
                    op: "replace",
                    path: "/last_modified",
                    value: 1756469015,
                },
            ],
            timestamp_ms: timestamp + 300,
        });

        assert.deepEqual(document, {
            notifications: [
                {
                    id: "same_title_seo_title",
                    type: "textinfo",
                    label: "warning",
                    title: "Der Titel und SEO-Titel sind gleich."
                },
                {
                    id: "heading_min_length",
                    type: "textinfo",
                    label: "info",
                    title: "Ungültige Dachzeile"
                },
            ],
            last_modified: 1756469015,
            seo_title: "Titel",
            slug: "",
            social_title: "Titel",
            title: "Titel",
            updated_at: 1756469015,
        });
    });
});

function _id() {
    return Math.random().toString(36).substring(2);
}
