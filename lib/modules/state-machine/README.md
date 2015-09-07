State Machine
=============

This is the state machine proposal, inspired in the Erlang gen_fsm and Akka
FSMand Akka FSM.
It seems to be an optimal implementation, adding a simple state machine object, 
and Astro automatically decouple the states and events. 

The state manchine goes smoothly with Astronomy approach. 
Below an example on how to configure and use it.

```
Account = Astro.Class({
  name: 'Account',
  collection: Accounts,
  fields: {
    credentials: 'string',
    createdAt: 'date',
    owner: 'string',
    balance: 'number'
  },
  methods: {
    withdrawl: function(amount) {
      this.balance = this.balance - amount;
    },
    deposit: function(amount) {
      this.balance = this.balance + amount;
    }
  }
  state_machine: {
		initialState: "uninitialized",
		states: {
			"uninitialized": {
				"initialize": function() {
					this.transition( "unauthorized" );
				}
			},
			"unauthorized": {
				onEnter: function() {
					console.log("Please enter your account and PIN.");
				},
				"*": function() {
					console.log("You must authenticate first.");
				},
				authorize: function( credentials ) {
					if (credentials == "1234") ) {
						this.transition("authorized");
					}
					console.log("Invalid Account and/or PIN.");
				}
			},
			"authorized": {
				onEnter: function() {
					console.log("Authorized");
				},
				deposit: function( amount ) {
          var result = this.deposit( amount );
          console.log("Thanks for depositing: " + amount);
          return result;
				},
				withdrawal: function( amount ) {
          var result = this.withdrawal( amount );
          console.log("Thanks for withdrawing: " + amount);
          return result;
				},
				deauthorize: function() {
					this.transition( "unauthorized" );
				}
			}
		}
  }
});

/**
 * Usage
 */

var account = new Account({
  owner: 'jim',
  balance: 1000
});

account.state  //  unauthorized
account.withdrawl(100);  // You must authenticate first
account.authorize("1234");
account.state  //  authorized
account.deposit(1000);

