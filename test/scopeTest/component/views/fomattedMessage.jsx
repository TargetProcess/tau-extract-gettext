var addNewRule = this.props.model.isEditable ?
    <div className="add-link" onClick={this._addNewRule}>
        <span className="tau-icon-general tau-icon-plus"></span>
        <FormattedMessage message="Add rule FormattedMessage" />
    </div> :
    '';
module.exports = React.createClass({
    render() {
        return <div><FormattedMessage
            prop="fdsad"
            message="test {FormattedMessage}"
            name="test"
            />
            <FormattedMessage
                prop="fdsad"
                message="test {FormattedMessage2}"
                name="test"
                />
        </div>
    }
});

