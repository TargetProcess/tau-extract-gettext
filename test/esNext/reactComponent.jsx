// intlScope: esNextFeaturesInJsx
/* global document: false, window: false */

import React, { PropTypes, Component } from 'react';
//import ReactDOM from 'react-dom';

export class ActionResult extends Component {
    static propTypes = {
        action: PropTypes.func.isRequired,
    };

    componentWillMount() {
        this.props.action();
    }

    render() {
        const tokenName = intl.formatMessage('intl.formatMessage in method');
        return <div role="action">{tokenName}</div>;
    }
}

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

const getAuthor = () => {
    const params = getQueryParams();
    const decode = param => decodeURIComponent(param || '');

    return {
        firstName: decode(params.firstname),
        lastName: decode(params.lastname),
        email: decode(params.email),
    };
};

const parseOptions = () => {
    /* eslint-disable camelcase */
    const params = getQueryParams();
    const options = (params.options || '').split(',');
    const product_id = options.shift();
    const [default_request_type, top_requests_count] = options.slice(6, 8);

    const [
        show_top_requests,
        show_request_types,
        show_description,
        show_attachments,
        show_email,
    ] = (options || '').map(p => !!parseInt(p, 10));
    /* eslint-enable camelcase */

    return {
        product_id,
        show_top_requests,
        top_requests_count,
        show_request_types,
        show_description,
        show_attachments,
        show_email,
        default_request_type,

        ...params,
    };
};

export const jsxMessage = intl.formatMessage('intl.formatMessage in const');

export const renderInfo = ({ text = 'default', ...props }) => {
    return (
        <div>
            <p>{text}</p>
            {props.children}
        </div>
    );
};

export const renderWidgetInfo = () => {
    const options = parseOptions();
    const getOption = option => {
        let value = options[option];
        if (typeof value === 'boolean') {
            return value;
        }

        value = (value || '').toLowerCase();
        return value === 'true' || value === '1';
    };

    return (
        <div>
            <FormattedMessage message="Text in FormattedMessage" />
            author={getAuthor()}
            productId={options.product_id}
            showTopRequests={getOption('show_top_requests')}
            topRequestsCount={options.top_requests_count}
            showRequestTypes={getOption('show_request_types')}
            showDescription={getOption('show_description')}
            showAttachments={getOption('show_attachments')}
            defaultRequestType={options.default_request_type}
            showEmail={getOption('show_email')}
        </div>
    );
};
