'use strict';

describe('HalLink Test', function () {
  var halLink = IbercheckApi.Helper.HalLink;

  describe('does not return links when empty', function () {
    var data = {
      _links: {}
    };

    it('not has payment URI', function () {
      expect(halLink.hasLink(data, "payment")).toBe(false);
    });

    it('throw exception if try to get the payment URI', function () {
      expect(function () {
        halLink.getLink(data, "payment");
      }).toThrow(
        new Error("There is no link with the desired relational. Use hasLink() to test this")
      );
    });
  });

  describe('return the payment URI when available', function () {
    var data = {
      _links: {
        payment: {
          href: "http://example.com/payment"
        }
      }
    };

    it('has payment URI', function () {
      expect(halLink.hasLink(data, "payment")).toBe(true);
    });

    it('returns the URI', function () {
      expect(halLink.getLink(data, "payment").href).toBe("http://example.com/payment");
    });
  });
});
