var addNewRule = this.props.model.isEditable ?
    <div className="add-link" onClick={this._addNewRule}>
        <MyComponent message="MyComponent message before first FormattedMessage" />
        <span className="tau-icon-general tau-icon-plus"></span>
        <FormattedMessage message="FormattedMessage message" />
        <FormattedMessage message="FormattedMessage message" />
    </div> :
    '';

var otherComponentWithMessageProps = this.props.model.isEditable ?
    <div className="add-link" onClick={this._addNewRule}>
        <span className="tau-icon-general tau-icon-plus"></span>
        <MyComponent message="MyComponent message after FormattedMessage" />
    </div> :
    '';

module.exports = React.createClass({
    render() {
        return (
            <div>
                <FormattedMessage
                    message="test {FormattedMessage}"
                    name="test"
                />
                <FormattedMessage
                    prop="fdsad"
                    message="test {FormattedMessage2}"
                    name="test"
                />
                <FormattedMessage
                    message="Help Desk Portal URL {example}"
                    example={<FormattedMessage message="(Ex: http://helpdesk.yourdomain.com)" className="note" key="example" />}
                />
                <FormattedMessage
                    hint={<FormattedMessage key="hint" className="note" message="(type the new password if you want to change it)" />}
                    message="Password {hint}"
                />
            </div>
        );
    }
});
