import type { NextPage } from 'next';
import Head from 'next/head';

import { useState } from 'react';
import { bleu, tokenizer, nGramPrecisions, brevityPenalty } from '../lib/text';

const Home: NextPage = () => {
  const [textHypothesis, setHypValue] = useState("this is a pen .");
  const [textReferences, setRefValue] = useState("this is a apple .");
  const bleuN = 4;

  const tokensHyp = tokenizer(textHypothesis);
  const tokensRef = tokenizer(textReferences);

  const precisions = nGramPrecisions(bleuN, tokensHyp, tokensRef);
  const bp = brevityPenalty(tokensHyp.length, tokensRef.length);

  const handleChangeGen = (event: any) => {
    setHypValue(event.target.value);
  };
  const handleChangeRef = (event: any) => {
    setRefValue(event.target.value);
  };

  return (
    <div className="container">
      <Head>
        <title>BLEU計算するやつ</title>
        <meta name="description" content="BLEU計算するやつ" />
        <link rel="icon" href="icon.png" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css" />
      </Head>
      <h1>BLEU計算するやつ</h1>
      <p>半角スペースで区切られた文章を入力するとBLEUを計算します。</p>
      <div>
        生成文:
        <textarea rows={2} value={textHypothesis} onChange={handleChangeGen} />
      </div>
      <div>
        参照文:
        <textarea rows={2} value={textReferences} onChange={handleChangeRef} />
        (N={bleuN})
      </div>
      <table>
        <tbody>
          {Object.keys(precisions).map(i => {
            return <tr key={i}>
              <th>Precision {i}</th>
              <td>{precisions[Number(i)].match}/{precisions[Number(i)].total}</td>
            </tr>;
          })}
          <tr><th>Brevity Penalty</th><td>{bp}</td></tr>
          <tr><th>BLEU</th><td>{bleu(tokenizer(textHypothesis), tokenizer(textReferences), 4)}</td></tr>
        </tbody>
      </table>
      <div>
        <h3>参考文献</h3>
        <ul>
          <li>
            <a href="https://cloud.google.com/translate/automl/docs/evaluate?hl=ja#bleu" target="_blank" rel="noreferrer" >
              モデルの評価  |  AutoML Translation のドキュメント  |  Google Cloud
            </a>
          </li>
          <li><a href="https://en.wikipedia.org/wiki/BLEU" target="_blank">BLEU - Wikipedia</a></li>
        </ul>
        リポジトリ: <a href="https://github.com/s2terminal/nlp-auto-eval-react" target="_blank">s2terminal/nlp-auto-eval-react</a>
      </div>
    </div >
  );
};

export default Home;
