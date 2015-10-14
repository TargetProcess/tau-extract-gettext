module.exports = {
    stringsRules: [
        /intl\.formatMessage\([\s\S]+?['`"](?=[,\)])/g,
        /intl\.formatHTMLMessage\([\s\S]+?['`"](?=[,\)])/g,
        /\{\{formatMessage\([\s\S]+?['"`](?=[,\)])/g,
        /\{\{formatHTMLMessage\([\s\S]+?['"`](?=[,\)])/g
    ],
    scopeRules: [
        /\/\/\s*intlScope:\s*([\-\w\.]+)/g,
        /^<!--[\s\S]*intlScope:\s*([\-\w\.]+)\s*-->/g

    ],
    scopeFileName: '.scope.json',
    searchDeepScopeFile: 5,
    scopeProperty: 'intl',
    defaultScope: 'none'
};