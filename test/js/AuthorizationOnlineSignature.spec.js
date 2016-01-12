"use strict";

describe("AuthorizationOnlineSignature Test", function () {
  /**
   * @type {IbercheckApi.AuthorizationOnlineSignature}
   */
  var manager;

  beforeEach(function () {
    manager = new IbercheckApi.AuthorizationOnlineSignature("http://www.example.com");
  });

  it("Return model", function (done) {
    var expectedPayload = {id: 1, nest: {id: 2}};

    var testPayload = function (payload) {
      expect(payload).toEqual(expectedPayload);
    };

    var failTest = function (error) {
      expect(error).toBeUndefined();
    };

    manager.waitForResult()
      .then(testPayload)
      .catch(failTest)
      .then(done, done)
    ;

    var messageEvent = new MessageEvent(
      "message",
      {
        origin: "http://www.example.com",
        data: JSON.stringify(expectedPayload)
      }
    );
    window.dispatchEvent(messageEvent);
  });

  it("Return model", function (done) {
    var expectedPayload = {
      type: "http:\/\/www.w3.org\/Protocols\/rfc2616\/rfc2616-sec10.html",
      title: "Internal Server Error",
      status: 500,
      detail: ""
    };
    var expectedError = new IbercheckApi.Errors.ApiLogicError(
      expectedPayload.status,
      expectedPayload.title,
      expectedPayload.detail
    );

    var testError = function (payload) {
      expect(payload).toEqual(expectedError);
    };

    var failTest = function (error) {
      expect(error).toBeUndefined();
    };

    manager.waitForResult()
      .then(failTest)
      .catch(testError)
      .then(done, done)
    ;

    var messageEvent = new MessageEvent(
      "message",
      {
        origin: "http://www.example.com",
        data: JSON.stringify(expectedPayload)
      }
    );
    window.dispatchEvent(messageEvent);
  });
});
