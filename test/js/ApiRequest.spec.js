"use strict";

describe("ApiRequest Test", function () {
  var ApiRequest = IbercheckApi.ApiRequest;
  var ApiErrors = IbercheckApi.Errors;

  describe("HTTP verbs works", function () {
    var expectedHeaders = {
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "Authorization": "Bearer access_token",
      "Content-Type": "application/vnd.ibercheck.v1+json"
    };

    beforeEach(function () {
      jasmine.Ajax.install();
    });

    afterEach(function () {
      jasmine.Ajax.uninstall();
    });

    it("GET", function () {
      ApiRequest.get("access_token", "http://example.com/path?query");

      var request = jasmine.Ajax.requests.mostRecent();

      expect(request.url).toBe("http://example.com/path?query");
      expect(request.method).toBe("GET");
    });

    it("POST", function () {
      var url = "http://example.com/path?query";
      var data = {example: 123};

      ApiRequest.post("access_token", url, data);

      var request = jasmine.Ajax.requests.mostRecent();
      expect(request.method).toBe("POST");
      expect(request.url).toBe(url);
      expect(request.requestHeaders).toEqual(expectedHeaders);
      //expect(request.data()).toEqual(data);
    });

    it("PATCH", function () {
      var url = "http://example.com/path?query";
      var data = {example: 123};

      ApiRequest.patch("access_token", url, data);

      var request = jasmine.Ajax.requests.mostRecent();
      expect(request.method).toBe("PATCH");
      expect(request.url).toBe(url);
      expect(request.requestHeaders).toEqual(expectedHeaders);
      //expect(request.data()).toEqual(data);
    });
  });

  describe("When API response with error", function () {
    it("Don't throw exception for non error payloads", function () {
      var response = {
        status: 123,
        title: "generic string"
      };
      ApiRequest.testForLogicalError(response);
    });
    it("Show error detail for generic errors", function () {
      var response = {
        detail: "error message",
        status: 500,
        title: "generic error"
      };
      var expectedError = new ApiErrors.ApiLogicError(
        response.status,
        response.title,
        response.detail
      );
      try {
        ApiRequest.testForLogicalError(response);
        fail("Expected exception not thrown")
      } catch (e) {
        expect(e).toEqual(jasmine.objectContaining(expectedError));
      }
    });
    it("Return the first error message for input validation", function () {
      var response = {
        detail: "Failed Validation",
        status: 422,
        title: "Unprocessable Entity",
        validation_messages: {
          input_param: [
            "generic message"
          ],
          another_param: {
            error_type: "error message"
          }
        }
      };
      var expectedError = new ApiErrors.ValidationError(
        response.status,
        response.title,
        response.detail,
        {
          input_param: "generic message",
          another_param: "error message"
        }
      );
      try {
        ApiRequest.testForLogicalError(response);
        fail("Expected exception not thrown")
      } catch (e) {
        expect(e).toEqual(jasmine.objectContaining({
            code: 422,
            name: "Unprocessable Entity",
            message: "Failed Validation",
            messages: {
              input_param: "generic message",
              another_param: "error message"
            }
          }
        ));
      }
    });
  });
});
