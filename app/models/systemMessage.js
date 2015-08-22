//TODO NOT KPK BUT DONT CARE
var SystemMessageModule = (function () {
    var SystemMessage = (function () {
        function SystemMessage(id, text) {
            this.id = id;
            this.text = text;
        };

        SystemMessage.prototype.getText = function () {
            return this.text;
        }

        SystemMessage.prototype.setText = function (value) {
            if (value.length === 0) {
                throw 'Trying to create a message without message text!';
            }

            this.text = value;
        }

        return SystemMessage;
    }());

    var InviteMessage = (function (parent) {
        InviteMessage.prototype = parent.prototype;

        function InviteMessage(id, text, teamSender, receiver) {
            parent.call(this, id, text);
            this.teamSender = teamSender;
            this.receiver = receiver;
            this.accept = false;
            this.type = 'invite';
        }

        InviteMessage.prototype.setAccept = function(value) {
            if (value !== false && value !== true) {
                throw 'Trying to set non boolean value to invite message accept';
            }

            this.accept = value;
        }
        InviteMessage.prototype.getAccept = function () {
            return this.accept;
        }

        return InviteMessage;
    }(SystemMessage));

    return {
        InviteMessage: function (id, text, teamSender, receiver) {
            return new InviteMessage(id, text, teamSender, receiver);
        }
    }
}());
module.exports = SystemMessageModule;
