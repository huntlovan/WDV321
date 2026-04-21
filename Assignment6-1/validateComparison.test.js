// Author: Hunter Lovan
// Date: April 21, 2026

const { expect } = require("chai");
const { validateComparison } = require("../app/validateComparison");

describe("validateComparison()", function () {

    // --- Standard comparisons ---
    it("should return 6 when comparing 5 and 6", function () {
        expect(validateComparison(5, 6)).to.equal(6);
    });

    it("should return 4 when comparing 4 and 3", function () {
        expect(validateComparison(4, 3)).to.equal(4);
    });

    it('should return "The amounts are equal" when both values are 3', function () {
        expect(validateComparison(3, 3)).to.equal("The amounts are equal");
    });

    // --- Invalid Value 1 ---
    it('should return "Please enter a number in Value 1" when Value 1 is "a"', function () {
        expect(validateComparison("a", 5)).to.equal("Please enter a number in Value 1");
    });

    it('should return "Please enter a number in Value 1" when Value 1 is empty string', function () {
        expect(validateComparison("", 5)).to.equal("Please enter a number in Value 1");
    });

    it('should return "Please enter a number in Value 1" when Value 1 is "3/4" (fraction)', function () {
        expect(validateComparison("3/4", 1)).to.equal("Please enter a number in Value 1");
    });

    it('should return "Please enter a number in Value 1" when Value 1 is "5b" (alphanumeric)', function () {
        expect(validateComparison("5b", 3)).to.equal("Please enter a number in Value 1");
    });

    // --- Invalid Value 2 ---
    it('should return "Please enter a number in Value 2" when Value 2 is "a"', function () {
        expect(validateComparison(5, "a")).to.equal("Please enter a number in Value 2");
    });

    it('should return "Please enter a number in Value 2" when Value 2 is empty string', function () {
        expect(validateComparison(5, "")).to.equal("Please enter a number in Value 2");
    });

    it('should return "Please enter a number in Value 2" when Value 2 is "5b" (alphanumeric)', function () {
        expect(validateComparison(3, "5b")).to.equal("Please enter a number in Value 2");
    });

    // --- Negative numbers ---
    it("should return 5 when comparing -1 and 5", function () {
        expect(validateComparison(-1, 5)).to.equal(5);
    });

    it("should return 34 when comparing +34 and -30", function () {
        expect(validateComparison("+34", -30)).to.equal(34);
    });

    it("should return -5 when comparing -5 and -6", function () {
        expect(validateComparison(-5, -6)).to.equal(-5);
    });

    it("should return 5 when comparing 5 and -1", function () {
        expect(validateComparison(5, -1)).to.equal(5);
    });

    // --- Decimal numbers ---
    it("should return 2 when comparing 1.5 and 2", function () {
        expect(validateComparison(1.5, 2)).to.equal(2);
    });

    it("should return 2 when comparing 2 and 1.5", function () {
        expect(validateComparison(2, 1.5)).to.equal(2);
    });
});
