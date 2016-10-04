module.exports = {
    stringsRules: [
        /(?:intl\.|\{\{)format(?:HTML)?Message\s*?\(\s*?(['`"])([\s\S]+?)\1\s*?(?=[,\)])/g
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
