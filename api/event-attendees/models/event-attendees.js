"use strict";

/**
 * Lifecycle callbacks for the `event-attendees` model.
 */

const request = require("request");

const axios = require("axios");

const fetch = require("node-fetch");
global.Headers = fetch.Headers;
const btoa = require("btoa");

const site_url = 'https://admin.topceo.me'
// const site_url = 'http://127.0.0.1:1337/'

module.exports = {
  // Before saving a value.
  // Fired before an `insert` or `update` query.
  // beforeSave: async (model, attrs, options) => {},

  // After saving a value.
  // Fired after an `insert` or `update` query.
  afterSave: async (model, response, options) => {

    if (model.attributes.Email != null && model.attributes.Email != "") {

       axios({
        method: "get",
        url: site_url+"api-settings",
        responseType: "json"
      })
        .then(response => {

          var API_data = response.data[0];
          let url = API_data["APIURL"] +"/subscribers/" +API_data["AttendeeFormListID"] +".json?email=" +model.attributes.Email;
          var username = API_data["APIKey"];
          var password = API_data["APIPassword"];
          var myHeaders = new Headers();

          myHeaders.append(
            "Authorization",
            "Basic " + btoa(username + ":" + password)
          );
          myHeaders.append("Content-type", "application/json; charset=UTF-8");
          var Data = {
            EmailAddress: model.attributes.Email,
            name: model.attributes.First_Name + " " + model.attributes.LastName,
            CustomFields: [
              { key: "First Name", value: model.attributes.First_Name },
              { key: "Last Name", value: model.attributes.LastName },
              { key: "Company Name", value: model.attributes.Company },
              { key: "Address", value: model.attributes.Address },
              { key: "Country of Origin", value: model.attributes.Country },
              { key: "Phone Number", value: model.attributes.MobileNumber },
              { key: "Ticket Code", value: model.attributes.InviteCode },
              { key: "Invite Code Type", value: model.attributes.InviteCodeType },
              { key: "Ticket Code Used",  value: model.attributes.Invite_Code_Used},
              { key: "Position", value: model.attributes.Title },
              { key: "Industry", value: model.attributes.Industry }
            ],
            Resubscribe: true,
            RestartSubscriptionBasedAutoresponders: true,
            ConsentToTrack: "Yes"
          };

          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            redirect: "follow",
            body: JSON.stringify(Data)
          };

          fetch(url, requestOptions)
            .then(result => {
              console.log(result);
            })
            .catch(error => {
              console.log(error);
              console.log("error");
            });
        })

        .catch(err => {
          console.log(err);
          console.log("Error");
        });
    }
  }

  // Before fetching a value.
  // Fired before a `fetch` operation.
  // beforeFetch: async (model, columns, options) => {},

  // After fetching a value.
  // Fired after a `fetch` operation.
  // afterFetch: async (model, response, options) => {},

  // Before fetching all values.
  // Fired before a `fetchAll` operation.
  // beforeFetchAll: async (model, columns, options) => {},

  // After fetching all values.
  // Fired after a `fetchAll` operation.
  // afterFetchAll: async (model, response, options) => {},

  // Before creating a value.
  // Fired before an `insert` query.
  // beforeCreate: async (model, attrs, options) => {},

  // After creating a value.
  // Fired after an `insert` query.
  // afterCreate: async (model, attrs, options) => {},

  // Before updating a value.
  // Fired before an `update` query.
  // beforeUpdate: async (model, attrs, options) => {},

  // After updating a value.
  // Fired after an `update` query.
  // afterUpdate: async (model, attrs, options) => {},

  // Before destroying a value.
  // Fired before a `delete` query.
  // beforeDestroy: async (model, attrs, options) => {},

  // After destroying a value.
  // Fired after a `delete` query.
  // afterDestroy: async (model, attrs, options) => {}
};
