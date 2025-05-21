// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Rational } from "./rational.js";

describe("Rational", () => {
  describe("from", () => {
    it("creates a fresh instance from Rational", () => {
      const r = Rational.from(5n, 1n);
      expect(Rational.from(r).unwrap()).toEqual([5n, 1n]);
      expect(Rational.from(r)).not.toBe(r);
    });

    it("creates from bigint", () => {
      expect(Rational.from(5n).unwrap()).toEqual([5n, 1n]);
      expect(Rational.from(-5n).unwrap()).toEqual([-5n, 1n]);
    });

    it("creates from fraction", () => {
      expect(Rational.from(5n, 2n).unwrap()).toEqual([5n, 2n]);
      expect(Rational.from(-5n, 2n).unwrap()).toEqual([-5n, 2n]);
    });

    it("creates from fraction with negative denominator", () => {
      expect(Rational.from(5n, -2n).unwrap()).toEqual([-5n, 2n]);
      expect(Rational.from(-5n, -2n).unwrap()).toEqual([5n, 2n]);
    });

    it("creates from integer", () => {
      expect(Rational.from(5).unwrap()).toEqual([5n, 1n]);
      expect(Rational.from(-5).unwrap()).toEqual([-5n, 1n]);
    });

    it("creates from string", () => {
      expect(Rational.from("5").unwrap()).toEqual([5n, 1n]);
      expect(Rational.from("0.50").unwrap()).toEqual([1n, 2n]);
      expect(Rational.from("-3.50").unwrap()).toEqual([-7n, 2n]);
      expect(Rational.from("0.3333333333333333").unwrap()).toEqual(
        [3333333333333333n, 10000000000000000n],
      );
    });

    it("creates from decimal with default precision", () => {
      expect(Rational.from(0.5).unwrap()).toEqual([1n, 2n]);
      expect(Rational.from(-0.5).unwrap()).toEqual([-1n, 2n]);
      expect(Rational.from(0.3333333333333333).unwrap()).toEqual(
        [3333333333n, 10000000000n],
      );
    });

    it("creates from decimal with custom precision", () => {
      expect(Rational.from(0.5, 2).unwrap()).toEqual([1n, 2n]);
      expect(Rational.from(0.3333333333333333, 0).unwrap()).toEqual([0n, 1n]);
      expect(Rational.from(0.3333333333333333, 2).unwrap()).toEqual([33n, 100n]);
      expect(Rational.from(0.3333333333333333, 4).unwrap()).toEqual([3333n, 10000n]);
      expect(Rational.from(0.3333333333333333, 6).unwrap()).toEqual([333333n, 1000000n]);
    });

    it("normalizes fractions", () => {
      expect(Rational.from(4n, 2n).unwrap()).toEqual([2n, 1n]);
      expect(Rational.from(-4n, 2n).unwrap()).toEqual([-2n, 1n]);
      expect(Rational.from(4n, -2n).unwrap()).toEqual([-2n, 1n]);
      expect(Rational.from(-4n, -2n).unwrap()).toEqual([2n, 1n]);
    });

    it("throws on invalid numbers", () => {
      expect(() => Rational.from(Infinity)).toThrow("Invalid value");
      expect(() => Rational.from(-Infinity)).toThrow("Invalid value");
      expect(() => Rational.from(Number.NaN)).toThrow("Invalid value");
    });

    it("throws on invalid strings", () => {
      expect(() => Rational.from("")).toThrow("Invalid rational value");
      expect(() => Rational.from("1.2.3")).toThrow("Invalid rational value");
      expect(() => Rational.from("abcd")).toThrow("Invalid rational value");
    });

    it("throws on invalid precision", () => {
      expect(() => Rational.from(0.5, -1)).toThrow("Invalid precision");
      expect(() => Rational.from(0.5, 1.5)).toThrow("Invalid precision");
      expect(() => Rational.from(0.5, 16)).toThrow("Invalid precision");
    });

    it("throws if denominator is zero", () => {
      expect(() => Rational.from(5n, 0n)).toThrow("Denominator cannot be zero");
    });
  });

  describe("setDefaultPrecision", () => {
    it("sets and uses default precision", () => {
      const originalPrecision = (Rational as any).defaultPrecision;
      try {
        Rational.setDefaultPrecision(4);
        expect(Rational.from(0.3333333333333333).unwrap()).toEqual([3333n, 10000n]);
        Rational.setDefaultPrecision(6);
        expect(Rational.from(0.3333333333333333).unwrap()).toEqual([333333n, 1000000n]);
      } finally {
        Rational.setDefaultPrecision(originalPrecision);
      }
    });

    it("throws on invalid precision", () => {
      expect(() => Rational.setDefaultPrecision(-1)).toThrow("Invalid precision");
      expect(() => Rational.setDefaultPrecision(1.5)).toThrow("Invalid precision");
      expect(() => Rational.setDefaultPrecision(16)).toThrow("Invalid precision");
    });
  });

  describe("isInteger", () => {
    it("returns true for integers", () => {
      expect(Rational.from(5n).isInteger()).toBe(true);
      expect(Rational.from(-5n).isInteger()).toBe(true);
      expect(Rational.from(5).isInteger()).toBe(true);
      expect(Rational.from(-5).isInteger()).toBe(true);
    });

    it("returns false for non-integers", () => {
      expect(Rational.from(5n, 2n).isInteger()).toBe(false);
      expect(Rational.from(-5n, 2n).isInteger()).toBe(false);
      expect(Rational.from(0.5).isInteger()).toBe(false);
      expect(Rational.from(-0.5).isInteger()).toBe(false);
    });
  });

  describe("conversion", () => {
    const half = Rational.from(1n, 2n);

    it("toNumber", () => {
      expect(half.toNumber()).toBe(0.5);
    });

    it("toString", () => {
      expect(half.toString()).toBe("0.5");
    });

    it("toFixed", () => {
      expect(half.toFixed(2)).toBe("0.50");
      // eslint-disable-next-line unicorn/require-number-to-fixed-digits-argument
      expect(half.toFixed()).toBe("0");
    });

    it("floor", () => {
      expect(half.floor()).toBe(0n);
      expect(Rational.from(3n, 2n).floor()).toBe(1n);
    });

    it("ceil", () => {
      expect(half.ceil()).toBe(1n);
      expect(Rational.from(3n, 2n).ceil()).toBe(2n);
    });

    it("round", () => {
      expect(half.round()).toBe(1n);
      expect(Rational.from(1n, 4n).round()).toBe(0n);
    });
  });

  describe("comparison", () => {
    const half = Rational.from(1n, 2n);
    const third = Rational.from(1n, 3n);

    it("equality", () => {
      expect(half.eq(Rational.from(1n, 2n))).toBe(true);
      expect(half.eq(third)).toBe(false);
      expect(half.eq(0.5)).toBe(true);
      expect(half.eq(1n)).toBe(false);
    });

    it("inequality", () => {
      expect(half.ne(Rational.from(1n, 2n))).toBe(false);
      expect(half.ne(third)).toBe(true);
    });

    it("greater than", () => {
      expect(half.gt(third)).toBe(true);
      expect(third.gt(half)).toBe(false);
      expect(half.gt(0.5)).toBe(false);
      expect(half.gt(1n)).toBe(false);
    });

    it("less than", () => {
      expect(half.lt(third)).toBe(false);
      expect(third.lt(half)).toBe(true);
      expect(half.lt(0.5)).toBe(false);
      expect(half.lt(1n)).toBe(true);
    });

    it("greater than or equal", () => {
      expect(half.ge(third)).toBe(true);
      expect(third.ge(half)).toBe(false);
      expect(half.ge(0.5)).toBe(true);
      expect(half.ge(1n)).toBe(false);
    });

    it("less than or equal", () => {
      expect(half.le(third)).toBe(false);
      expect(third.le(half)).toBe(true);
      expect(half.le(0.5)).toBe(true);
      expect(half.le(1n)).toBe(true);
    });
  });

  describe("special operations", () => {
    const half = Rational.from(1n, 2n);
    const negHalf = Rational.from(-1n, 2n);

    it("abs", () => {
      expect(half.abs().unwrap()).toEqual([1n, 2n]);
      expect(negHalf.abs().unwrap()).toEqual([1n, 2n]);
    });

    it("neg", () => {
      expect(half.neg().unwrap()).toEqual([-1n, 2n]);
      expect(negHalf.neg().unwrap()).toEqual([1n, 2n]);
    });

    it("inv", () => {
      expect(half.inv().unwrap()).toEqual([2n, 1n]);
      expect(negHalf.inv().unwrap()).toEqual([-2n, 1n]);
      expect(() => Rational.from(0).inv()).toThrow("Cannot invert zero");
    });
  });

  describe("arithmetic", () => {
    const half = Rational.from(1n, 2n);
    const third = Rational.from(1n, 3n);

    it("addition", () => {
      expect(half.add(third).unwrap()).toEqual([5n, 6n]);
      expect(half.add(1).unwrap()).toEqual([3n, 2n]);
      expect(half.add(1.5).unwrap()).toEqual([2n, 1n]);
      expect(half.add(1n).unwrap()).toEqual([3n, 2n]);
    });

    it("subtraction", () => {
      expect(half.sub(third).unwrap()).toEqual([1n, 6n]);
      expect(half.sub(1).unwrap()).toEqual([-1n, 2n]);
      expect(half.sub(1n).unwrap()).toEqual([-1n, 2n]);
    });

    it("multiplication", () => {
      expect(half.mul(third).unwrap()).toEqual([1n, 6n]);
      expect(half.mul(2).unwrap()).toEqual([1n, 1n]);
      expect(half.mul(2.5).unwrap()).toEqual([5n, 4n]);
      expect(half.mul(2n).unwrap()).toEqual([1n, 1n]);
    });

    it("division", () => {
      expect(half.div(third).unwrap()).toEqual([3n, 2n]);
      expect(half.div(2).unwrap()).toEqual([1n, 4n]);
      expect(half.div(2.5).unwrap()).toEqual([1n, 5n]);
      expect(half.div(2n).unwrap()).toEqual([1n, 4n]);
      expect(() => half.div(0)).toThrow("Cannot divide by zero");
    });
  });
});
