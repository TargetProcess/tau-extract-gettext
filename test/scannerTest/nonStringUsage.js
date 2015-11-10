// intlScope: nonStringUsage
module.exports = {
    name: intl.formatMessage('token'),
    template: [
        '<%! intl.formatMessage(variable) %>'
    ],
    sampleData: {name: 'Open'}
},
{
    template: [
        '',
    ],
    sampleData: {name: 'Name'}
};
