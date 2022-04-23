import { tokenizer, nGram, nGramPrecision, bleu } from "./text";

it("tokenizer", () => {
  expect(tokenizer("this is a pen")).toStrictEqual(["this", "is", "a", "pen"]);
});

it("nGram", () => {
  expect(nGram(["this", "is", "a", "pen"], 2)).toStrictEqual([
    ["this", "is"],
    ["is", "a"],
    ["a", "pen"]
  ]);
  expect(nGram(["this", "is", "a", "pen"], 3)).toStrictEqual([
    ["this", "is", "a"],
    ["is", "a", "pen"]
  ]);
});

it("nGramPrecision", () => {
  expect(
    nGramPrecision(["this", "is", "a", "pen"], ["this", "is", "a", "apple"], 2)
  ).toBe(2);
});

it("bleu", () => {
  expect(
    bleu(["this", "is", "a", "pen"], ["this", "is", "a", "apple"], 4)
  ).toBeCloseTo(0.7071);
  expect(
    bleu(["a", "a", "a", "a"], ["this", "is", "a", "apple"], 4)
  ).toBeCloseTo(0.7071);
  expect(bleu(["a"], ["this", "is", "a", "apple"], 4)).toBeCloseTo(0.0498);
});
