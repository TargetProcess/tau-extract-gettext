module.exports = {
    stringsRules: [
            /intl\.formatMessage\s*?\(\s*?(['`"])([\s\S]+?)\1\s*?(?=[,\)])/g,
        /intl\.formatHTMLMessage\s*?\(\s*?(['`"])([\s\S]+?)\1\s*?(?=[,\)])/g,
              /\{\{formatMessage\s*?\(\s*?(['`"])([\s\S]+?)\1\s*?(?=[,\)])/g,
          /\{\{formatHTMLMessage\s*?\(\s*?(['`"])([\s\S]+?)\1\s*?(?=[,\)])/g
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