const Parse = require("parse/node");

class Subscription extends Parse.Object {
  constructor() {
    super("Subscription");
  }
}

module.exports = Subscription;
