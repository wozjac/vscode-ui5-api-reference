const regex = {
  xmlNamespace: /xmlns\s*:?\s*(\w*)\s*=\s*['"]([\w.:/]+)/gi,
  ui5ObjectComment: /\/\/\s*ui5:\s*([\w.]+)/,
  ui5ObjectInComment: /ui5:\s*([\w.]+)/,
  comments: /(\/\*.*\*\/)|(\/\/.*)/g,
  headingsTags: /(<\/?h)(\d)(>)/gi,
  tagsAttributes: /<(\w+)(.|[\r\n])*?>/g,
  htmlTagsWoHeaders: /<[^>h\d]+>/ig,
  htmlTags: /<[^>]+>/ig,
  jsFilesRegex: /^(?!.*controller\.js).*\.js$/,
  controllerFilesRegex: /\w+.controller.js/
};

const memberGroupFilter = {
  methods: "m",
  properties: "p",
  events: "e",
  aggregations: "a",
  construct: "c"
};

module.exports = {
  pluginLogPrefix: "[VSCode-UI5-API]",
  regex,
  memberGroupFilter
};