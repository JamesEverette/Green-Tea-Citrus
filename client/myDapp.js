import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './myDapp.html';

//This code is for referencing the contract
//global variables
var MyToken = web3.eth.contract([{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"killContract","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"mintedAmount","type":"uint256"}],"name":"mintToken","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"frozenAccount","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"freeze","type":"bool"}],"name":"freezeAccount","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"decimalUnits","type":"uint8"},{"name":"tokenSymbol","type":"string"},{"name":"centralMinter","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"target","type":"address"},{"indexed":false,"name":"frozen","type":"bool"}],"name":"FrozenFunds","type":"event"}]);
var everetteCoin = MyToken.at("0xdbdEB17b37a5618357Cc2Cefe142d86f6FF1b1e4");
result = 0;

//Grabbing the number of commits from the github api
//Relatively hardcoded at this point
$.get( "https://api.github.com/repos/JamesEverette/MyFirstApp/stats/contributors", function ( resp ) {
    result = resp["0"].total;
});

//This is used to make sure the value is used only after being correctly updated by ajax
//Asynchronous
$(document).ajaxStop(function () {
      displayCommits();
      //We can put functions in here that require the github results
  });

function displayCommits () {
  console.log(result);
}

//Hide the interface elements after timeout
function expireFunction() {
    document.getElementById("logout-button").style.display = "none";
    document.getElementById("coin-button").style.display = "none";
    document.getElementById("login-button").style.display = "block";
}

//I've no idea what this line is for
document.evaluate(".//h2", document.body, null, XPathResult.ANY_TYPE, null);

//Confusing meteor stuff? Confusing javascript stuff?
Template.info.onCreated(function loginOnCreated() {
  this.counter = new ReactiveVar(everetteCoin.balanceOf(web3.eth.accounts[0]).c / 100);
  this.commits = new ReactiveVar(result);//result from the github api
});

//More of the same
Template.info.helpers({
  counter() {
    return Template.instance().counter.get();
  },
  commits() {
    return Template.instance().commits.get();
  },
});

//When the login button is pressed
//Start timeout counter
//Display relevant objects, hide others
Template.login.events({
  'click button'(event, instance) {
    setTimeout(expireFunction, 20000);
    document.getElementById("coin-button").style.display = "block";
    document.getElementById("logout-button").style.display = "block";
    document.getElementById("login-button").style.display = "none";
  },
});

//Logout button
Template.logout.events({
  'click button'(event, instance) {
    document.getElementById("logout-button").style.display = "none";
    document.getElementById("coin-button").style.display = "none";
    document.getElementById("login-button").style.display = "block";
  },
});

//Earn coin button
Template.info.events({
  'click button'(event, instance) {

    //displaying coin
    instance.counter.set(everetteCoin.balanceOf(web3.eth.accounts[0]).c / 100);//need to display this with 2 decimal places.
    everetteCoin.transfer.sendTransaction(web3.eth.accounts[0], 1, {from: "0x83B70CC06B84Bec5c78e5fD2B8646ffab9bE5B07"})//transferring coin

    document.getElementById("secret-Image").style.display = "block";
    document.getElementById("show-counter").style.display = "block";
    instance.commits.set(result);//commits from github
  },
});
