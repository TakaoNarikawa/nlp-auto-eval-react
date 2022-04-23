import type { NextPage } from 'next';
import Head from 'next/head';

import { useState } from 'react';
import { bleu, tokenizer, nGramPrecisions, brevityPenalty } from '../lib/text';

const Home: NextPage = () => {
  const [textHypothesis, setHypValue] = useState("this is a pen");
  const [textReferences, setRefValue] = useState("this is a apple");
  const bleuN = 4;

  const tokensHyp = tokenizer(textHypothesis);
  const tokensRef = tokenizer(textReferences);

  const precisions = nGramPrecisions(bleuN, tokensHyp, tokensRef);
  const bp = brevityPenalty(tokensHyp.length, tokensRef.length);

  const handleChangeGen = (event) => {
    setHypValue(event.target.value);
  };
  const handleChangeRef = (event) => {
    setRefValue(event.target.value);
  };

  return (
    <div className="container">
      <Head>
        <title>BLEU計算するやつ</title>
        <meta name="description" content="BLEU計算するやつ" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <h1>BLEU計算するやつ</h1>
      <div>
        生成文:
        <input type="text" value={textHypothesis} onChange={handleChangeGen} />
      </div>
      <div>
        参照文:
        <input type="text" value={textReferences} onChange={handleChangeRef} />
      </div>
      <p>
        <ul>
          <li>(N={bleuN})</li>
          <li>BLEU score:{bleu(tokenizer(textHypothesis), tokenizer(textReferences), 4)}</li>
          <li>BP={bp}</li>
        </ul>
        <table>
          {Object.keys(precisions).map(index => {
            return <tr>
              <th>{index}</th>
              <td>{precisions[index].match}/{precisions[index].total}</td>
            </tr>
          })}
        </table>
      </p>
      <div>
        <h3>参考文献</h3>
        <ul>
          <li>
            <a href="https://cloud.google.com/translate/automl/docs/evaluate?hl=ja#bleu">
              モデルの評価  |  AutoML Translation のドキュメント  |  Google Cloud
            </a>
          </li>
        </ul>
      </div>
    </div >
  );
};

export default Home;
