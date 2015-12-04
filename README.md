# Ibercheck API SDK for JavaScript

[Ibercheck page](https://www.ibercheck.com) |
[API Documentation page](https://www.ibercheck.com/docs/api/) |
[API Playground page](https://www.ibercheck.com/docs/api/playground)

This SDK provides a friendly interface for performing requests and decode responses.

This library provides a [Promises/A+-conformant][1] interface.
We strongly recommend that you use promises instead of callbacks. Requests made
using the promise interface are RESTful. Using promises also gives you elegant
error handling and easy chaining.


## Installing

You can user [Bower](http://bower.io/) for install this SDK in your site.

```bash
bower install --save ibercheck-javascript-sdk
```

then add the asset in the source of your webpage.

```html
<script href="bower_components/ibercheck-javascript-sdk/dist/js/ibercheck-sdk.js"></script>
```


## Contents

This library content the following JS objects:

### IbercheckApi.ApiRequest

This class provide methods for create HTTP requests.

Example:

```js
  var oauth2_token = ".....";

  function successAction(ApiResponse) {
    // Custom code
  }

  function errorAction(ApiError) {
    // Custom code
  }

  // Perform a GET request
  IbercheckApi.ApiRequest.get(oauth2_token, "https://api_dev.ibercheck.net/sale/9999")
    .then(successAction, errorAction)
  ;

  // Perform a POST request
  IbercheckApi.ApiRequest.post(oauth2_token, "https://api_dev.ibercheck.net/user", {"field": "value"})
    .then(successAction, errorAction)
  ;

  // Perform a PATCH request
  IbercheckApi.ApiRequest.post(oauth2_token, "https://api_dev.ibercheck.net/user/9999", {"field": "newValue"})
    .then(successAction, errorAction)
  ;

  // Upload a file
  // <input type="file" name="file1" id="file1">
  var fileElement = document.getElementById("file1");
  IbercheckApi.ApiRequest.upload(oauth2_token, "https://api_dev.ibercheck.net/user/9999", fileElement)
    .then(successAction, errorAction)
  ;
```

### IbercheckApi.AuthorizationOnlineSignature

This class notifies your application with the result of the report request after the user gives his authorization.

Note: Invoke `waitForResult()` method before set the iframe SRC otherwise you may lose important notifications.

Example:

```js
  // apiHost only contains the API domain.
  var apiHost = "https://api_dev.ibercheck.net";

  var authorizationOnlineSignatureHref = "https://api_dev.ibercheck.net/..../example"

  function successAction(ApiResponse) {
    // Custom code
  }

  function errorAction(ApiError) {
    // Custom code
  }

  var onlineSignature = new IbercheckApi.AuthorizationOnlineSignature(apiHost);
  onlineSignature.waitForResult()
    .then(successAction, errorAction)
  ;

  // Then load the iframe.
  // <iframe id="signature"></iframe>
  document.getElementById("signature").setAttribute("src", authorizationOnlineSignatureHref);
```


### IbercheckApi.Helper.HalLink

This class makes easy to retrieve the hypermedia links provided in the API models.

Example:

```js
  var oauth2_token = ".....";

  function firstAction(ApiResponse) {
    // Check if the model has the link `fooLink`
    if (IbercheckApi.Helper.HalLink.hasLink(ApiResponse, "fooLink")) {
      // Retrieve the link `fooLink`
      var fooLink = IbercheckApi.Helper.HalLink.getLink(ApiResponse, "fooLink");

      return IbercheckApi.ApiRequest.get(oauth2_token, fooLink.href);
    }
  }

  function chainedAction(fooLink_Response) {
    // fooLink_Response is the result of the operation done in firstAction
  }

  IbercheckApi.ApiRequest.get(oauth2_token, "https://api_dev.ibercheck.net/sale/9999")
    .then(firstAction)
    .then(chainedAction)
  ;
```


## License

Distributed under the [MIT license](LICENSE)



[1]: https://promisesaplus.com/
