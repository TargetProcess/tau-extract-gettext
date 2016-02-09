import intl from 'intl'

export function render() {
    return <div>{intl.formatMessage('test jsx with import')}</div>;
}
