// intlScope: multilineUsages
intl.formatMessage('token 1'
);

intl.formatMessage(
'token 2');

intl.formatMessage(
'token 3'
);

intl.formatMessage('{data} token 1',
{data});

intl.formatMessage(
'{data} token 2', {data});

intl.formatMessage(
'{data} token 3',
{data}
);

intl.formatMessage
(

'{data} token 4'

,

{data}

);

{{formatMessage("jq token 1"
)}}

{{formatMessage(
"jq token 2")}}

{{formatMessage(
"jq token 3"
)}}

{{formatMessage("jq {data} token 1",
{data})}}

{{formatMessage(
"jq {data} token 2", {data})}}

{{formatMessage(
"jq {data} token 3",
{data}
)}}

{{formatMessage(
"jq {data} token 4"
,
{data}
)}}
