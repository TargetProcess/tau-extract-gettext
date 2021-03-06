// intlScope: esNextFeaturesInJs
export const tokenName = intl.formatMessage('intl.formatMessage in const');

const getQueryParams = () => window.location.search
    .replace(/^\?/, '')
    .split('&')
    .reduce((params, q) => {
        const [param, value] = q.split('=');

        return {
            ...params,
            [param.toLowerCase()]: value,
        };
    }, {});

const spreadFn = (params) => {
    const fieldName = intl.formatMessage('intl.formatMessage in arrow fn');
    return {
        ...params,
        [fieldName.toLowerCase()]: fieldName,
    };
};

export class EsClass {
    static staticPropertyInitializer = {
        message: intl.formatMessage('intl.formatMessage in static property')
    };

    someMethod() {
        return `Template string ${intl.formatMessage('intl.formatMessage in template string')}`;
    }

    somePropertyMethod = () => {
        return intl.formatMessage('intl.formatMessage in class property method');
    }

    otherPropertyMethod = () => intl.formatMessage('intl.formatMessage in class property method without braces')
}

export default spreadFn;
