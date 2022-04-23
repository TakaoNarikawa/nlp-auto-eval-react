export const tokenizer = (text: string) => {
  return text.split(" ");
};

export const nGram = (tokens: string[], n: number) => {
  const ret = [];
  for (let i = 0; i < tokens.length - (n - 1); i++) {
    const bag = [];
    for (let j = 0; j < n; j++) {
      bag.push(tokens[i + j]);
    }
    ret.push(bag);
  }
  return ret;
};

export const nGramPrecision = (
  hypothesis: string[],
  references: string[],
  n: number
) => {
  const referenceNGram = nGram(references, n);
  return nGram(hypothesis, n).reduce((count, genBag) => {
    // 一致するのがあるかどうか
    const refIndex = referenceNGram.findIndex((refBag) => {
      return JSON.stringify(genBag) === JSON.stringify(refBag);
    });
    if (refIndex >= 0) {
      count += 1;
      // 一度使った要素は削除
      referenceNGram.splice(refIndex, refIndex);
    }
    return count;
  }, 0);
};

const brevityPenalty = (hypLength: number, refLength: number) => {
  if (hypLength > refLength) {
    return 1;
  }
  return Math.exp(1 - refLength / hypLength);
};

export const bleuFromPn = (pn: number[], bp: number, n: number) => {
  const product = pn.reduce((acc, p) => {
    // https://github.com/nltk/nltk/blob/3.2.5/nltk/translate/bleu_score.py#L487-L493
    if (p > 0) {
      // TODO: 警告を出す方が良い
      acc *= p;
    }
    return acc;
  }, 1);

  return bp * product ** (1 / n);
};

export const bleu = (
  hypothesis: string[],
  references: string[],
  n: number = 4
) => {
  const rangeN = Array.from({ length: n }, (_v, k) => k + 1);
  const pn = rangeN.map(
    (i) =>
      nGramPrecision(hypothesis, references, i) / (hypothesis.length - (i - 1))
  );
  const bp = brevityPenalty(hypothesis.length, references.length);
  return bleuFromPn(pn, bp, n);
};
