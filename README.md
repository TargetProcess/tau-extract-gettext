tau-extract-gettext
===================

[![Build Status](https://travis-ci.org/TargetProcess/tau-extract-gettext.svg?branch=master)](https://travis-ci.org/TargetProcess/tau-extract-gettext)

Forked from https://github.com/mvhenten/extract-gettext

Message is properly extracted in following cases:

- `intl.formatMessage('message')` - string literal enclosed in one of \` ' " quote types
- `intl.formatMessage('message1' + 'message2')` - string concatenation

Message is not extracted in following cases:

- `intl.formatMessage(nonStringExpression)` - any non-string argument, including var/const reference and function call

Message is not properly extracted in following cases:

- `intl.formatMessage('message' + "message ')")` - concatenation of strings with different quotes when second string contains quote from first string followed by comma or closing parenthesis
