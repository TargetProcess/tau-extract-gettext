module.exports = {
    stringsRules: [
        /intl\.formatMessage\((['`"])([\s\S]+?)\1(?=[,\)])/g,
        /intl\.formatHTMLMessage\((['`"])([\s\S]+?)\1(?=[,\)])/g,
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