const assert = require('assert');
const suite = require("./index");

const AutoPigeon = require("../auto");

suite("forward", (test) => {
    test("apply in place -> rewind changes", async () => {
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
            timestamp_ms: 1756469010874,
            client_id: "cg40da6rfzu",
            seq: 9,
            change_id: "1kqpo59re54i",
            msg_id: "cg40da6rfzu-1kqpo59re54i"
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
            timestamp_ms: 1756469010877,
            client_id: "documentagent",
            seq: 0,
            change_id: "w3gwjfhnznxj",
            msg_id: "documentagent-w3gwjfhnznxj",
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
            timestamp_ms: 1756469012165,
            client_id: "cg40da6rfzu",
            seq: 17,
            change_id: "a1f5tnv06yu",
            msg_id: "cg40da6rfzu-a1f5tnv06yu"
        });

        AutoPigeon.applyChangeInPlace(document, {
            type: "change",
            diff: [
                {
                    op: "replace",
                    path: "/slug",
                    value: "slug",
                },
            ],
            timestamp_ms: 1756469012168,
            client_id: "cg40da6rfzu",
            seq: 19,
            change_id: "gmar24cmu3",
            msg_id: "cg40da6rfzu-gmar24cmu3"
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
            timestamp_ms: 1756469012173,
            client_id: "documentagent",
            seq: 0,
            change_id: "p563wfmujx77",
            msg_id: "documentagent-p563wfmujx77",
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
            timestamp_ms: 1756469012094,
            client_id: "datastore",
            seq: 0,
            change_id: "mee3q8con2nz",
            msg_id: "datastore-mee3q8con2nz",
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
            timestamp_ms: 1756469015022,
            client_id: "datastore",
            seq: 0,
            change_id: "iryciez3cymp",
            msg_id: "datastore-iryciez3cymp",
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
            slug: "slug",
            social_title: "Titel",
            title: "Titel",
            updated_at: 1756469015,
        });
    });
});
