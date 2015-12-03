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
      detail: "error message",
      status: 500,
      title: "generic error"
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
