(function(){try{var n=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},e=new Error().stack;e&&(n._sentryDebugIds=n._sentryDebugIds||{},n._sentryDebugIds[e]="a91f4d47-a784-430d-9e0e-43c664d09aa6",n._sentryDebugIdIdentifier="sentry-dbid-a91f4d47-a784-430d-9e0e-43c664d09aa6")}catch{}})();const t=Object.freeze({displayName:"JSON with Comments",name:"jsonc",patterns:[{include:"#value"}],repository:{array:{begin:"\\[",beginCaptures:{0:{name:"punctuation.definition.array.begin.json.comments"}},end:"\\]",endCaptures:{0:{name:"punctuation.definition.array.end.json.comments"}},name:"meta.structure.array.json.comments",patterns:[{include:"#value"},{match:",",name:"punctuation.separator.array.json.comments"},{match:"[^\\s\\]]",name:"invalid.illegal.expected-array-separator.json.comments"}]},comments:{patterns:[{begin:"/\\*\\*(?!/)",captures:{0:{name:"punctuation.definition.comment.json.comments"}},end:"\\*/",name:"comment.block.documentation.json.comments"},{begin:"/\\*",captures:{0:{name:"punctuation.definition.comment.json.comments"}},end:"\\*/",name:"comment.block.json.comments"},{captures:{1:{name:"punctuation.definition.comment.json.comments"}},match:"(//).*$\\n?",name:"comment.line.double-slash.js"}]},constant:{match:"\\b(?:true|false|null)\\b",name:"constant.language.json.comments"},number:{match:`(?x)
-?
(?:
0
|
[1-9]
\\d*
)
(?:
(?:
\\.
\\d+
)?
(?:
[eE]
[+-]?
\\d+
)?
)?`,name:"constant.numeric.json.comments"},object:{begin:"\\{",beginCaptures:{0:{name:"punctuation.definition.dictionary.begin.json.comments"}},end:"\\}",endCaptures:{0:{name:"punctuation.definition.dictionary.end.json.comments"}},name:"meta.structure.dictionary.json.comments",patterns:[{comment:"the JSON object key",include:"#objectkey"},{include:"#comments"},{begin:":",beginCaptures:{0:{name:"punctuation.separator.dictionary.key-value.json.comments"}},end:"(,)|(?=\\})",endCaptures:{1:{name:"punctuation.separator.dictionary.pair.json.comments"}},name:"meta.structure.dictionary.value.json.comments",patterns:[{comment:"the JSON object value",include:"#value"},{match:"[^\\s,]",name:"invalid.illegal.expected-dictionary-separator.json.comments"}]},{match:"[^\\s\\}]",name:"invalid.illegal.expected-dictionary-separator.json.comments"}]},objectkey:{begin:'"',beginCaptures:{0:{name:"punctuation.support.type.property-name.begin.json.comments"}},end:'"',endCaptures:{0:{name:"punctuation.support.type.property-name.end.json.comments"}},name:"string.json.comments support.type.property-name.json.comments",patterns:[{include:"#stringcontent"}]},string:{begin:'"',beginCaptures:{0:{name:"punctuation.definition.string.begin.json.comments"}},end:'"',endCaptures:{0:{name:"punctuation.definition.string.end.json.comments"}},name:"string.quoted.double.json.comments",patterns:[{include:"#stringcontent"}]},stringcontent:{patterns:[{match:`(?x)
\\\\
(?:
["\\\\/bfnrt]
|
u
[0-9a-fA-F]{4})`,name:"constant.character.escape.json.comments"},{match:"\\\\.",name:"invalid.illegal.unrecognized-string-escape.json.comments"}]},value:{patterns:[{include:"#constant"},{include:"#number"},{include:"#string"},{include:"#array"},{include:"#object"},{include:"#comments"}]}},scopeName:"source.json.comments"});var o=[t];export{o as default};
//# sourceMappingURL=jsonc.js.map
