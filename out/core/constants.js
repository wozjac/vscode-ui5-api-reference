"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginLogPrefix = exports.memberGroupFilter = exports.regex = void 0;
exports.regex = {
    xmlNamespace: /xmlns\s*:?\s*(\w*)\s*=\s*['"]([\w.:/]+)/gi,
    ui5ObjectComment: /\/\/\s*ui5:\s*([\w.]+)/,
    ui5ObjectInComment: /ui5:\s*([\w.]+)/,
    comments: /(\/\*.*\*\/)|(\/\/.*)/g,
    headingsTags: /(<\/?h)(\d)(>)/gi,
    tagsAttributes: /<(\w+)(.|[\r\n])*?>/g,
    htmlTagsWoHeaders: /<[^>h\d]+>/gi,
    htmlTags: /<[^>]+>/gi,
    jsFilesRegex: /^(?!.*controller\.js).*\.js$/,
    controllerFilesRegex: /\w+.controller.js/,
};
exports.memberGroupFilter = {
    methods: "m",
    properties: "p",
    events: "e",
    aggregations: "a",
    construct: "c",
};
exports.pluginLogPrefix = "[VSCode-UI5-API]";
//# sourceMappingURL=constants.js.map