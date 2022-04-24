import type { NextPage } from 'next';
import Head from 'next/head';

import { useState } from 'react';
import { bleu, tokenizer, nGramPrecisions, brevityPenalty } from '../lib/text';

const Home: NextPage = () => {
  const [textHypothesis, setHypValue] = useState("this is a pen .");
  const [textReferences, setRefValue] = useState("this is a apple .");
  const [bleuN, setBleuN] = useState(4);

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
  const handleChangeN = (event: any) => {
    setBleuN(Math.max(1, Number(event.target.value)));
  }
  const handleChangeDefaultButton = (n: number) => {
    return (_e: any) => {
      switch (n) {
        case 1:
          setHypValue("This is a pen .");
          setRefValue("This is an apple .");
          break;
        case 2:
          setHypValue("A NASA rover is fighting a massive storm on Mars .");
          setRefValue("The NASA Opportunity rover is battling a massive dust storm on Mars .");
          break;
        case 3:
          setHypValue("吾輩 は 猫 で ある 。 名前 は まだ 無い 。");
          setRefValue("私 は 猫 です 。 名前 は まだ あり ませ ん 。");
          break;
      }
    }
  }

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
        n-gram: <input type="number" value={bleuN} onChange={handleChangeN} />
        <div>
          生成文:
          <textarea rows={2} value={textHypothesis} onChange={handleChangeGen} />
        </div>
        <div>
          参照文:
          <textarea rows={2} value={textReferences} onChange={handleChangeRef} />
        </div>
        <p>
          <a onClick={handleChangeDefaultButton(1)} >例1</a>,
          <a onClick={handleChangeDefaultButton(2)} >例2</a>,
          <a onClick={handleChangeDefaultButton(3)} >例3</a>
        </p>
        (N={bleuN})
      </div>
      <table>
        <tbody>
          {Object.keys(precisions).map(i => {
            return <tr key={i}>
              <th>Precision {i}</th>
              <td>
                {precisions[Number(i)].match}/{precisions[Number(i)].total}
                {precisions[Number(i)].match === 0 && "※"}
              </td>
            </tr>
          })}
          <tr><th>Brevity Penalty</th><td>{bp}</td></tr>
          <tr><th>BLEU</th><td>{bleu(tokenizer(textHypothesis), tokenizer(textReferences), 4)}</td></tr>
        </tbody>
      </table>
      <p>※n-gramの一致数がゼロになっている場合、BLEUは適切でない数値になります。</p>
      <div>
        <h3>参考文献</h3>
        <ul>
          <li>
            <a href="https://cloud.google.com/translate/automl/docs/evaluate?hl=ja#bleu" target="_blank" rel="noreferrer" >
              モデルの評価  |  AutoML Translation のドキュメント  |  Google Cloud
            </a>
          </li>
          <li><a href="https://en.wikipedia.org/wiki/BLEU" target="_blank" rel="noreferrer">BLEU - Wikipedia</a></li>
        </ul>
        リポジトリ: <a href="https://github.com/s2terminal/nlp-auto-eval-react" target="_blank" rel="noreferrer">s2terminal/nlp-auto-eval-react</a>
      </div>
    </div >
  );
};

export default Home;
