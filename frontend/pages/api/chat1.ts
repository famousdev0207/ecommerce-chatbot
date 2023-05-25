import { VectorDBQAChain, loadQAChain } from 'langchain/chains';
import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PromptTemplate } from 'langchain/prompts';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PineconeClient } from '@pinecone-database/pinecone';
import { OpenAI } from 'langchain/llms/openai';

const _DEFAULT_TEMPLATE = `Ignore all the instructions before this one. You're an Expert Marketing Advisor. You have been an advisor for international and big brands for 20 years. Your task is now analyze my customers reviews and give me :
 - 10 problems highlighted list\n
 - 10 benefits highlighted list\n
 - 10 advices to solve or improves theses problems\n
 - 10 advices to put these benefits in my business’s advantage\n

Please note that my business is an {business} based on Shopify and we are selling {product}.
Give me your results in {language}.

{context}

This is the reviews :`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const temp = req.body.question.split('/');
    console.log('temp', temp);
    const template = `Give me your results in {language}. note that my business is an {business} based on Shopify and we are selling {product}. Extract list of 10 issues raised and 10 advantages highlighted and  10 tips to solve or improve problems. And also generate list of 10 tips to take advantage of these advantages. And finally generate summary of analysis and advice.`;
    const promptA = PromptTemplate.fromTemplate(_DEFAULT_TEMPLATE);
    // We can use the `format` method to format the template with the given input values.
    // const responseA = await promptA.format({
    //   // business: req.body.business,
    //   // product: req.body.product,
    //   // language: req.body.language,
    // });
    // console.log('responseA---------', responseA);

    const client = new PineconeClient();
    await client.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? '', //this is in the dashboard
      apiKey: process.env.PINECONE_API_KEY ?? '',
    });
    const pineconeIndex = client.Index(process.env.PINECONE_INDEX_NAME || '');

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      {
        pineconeIndex,
        textKey: 'text',
        namespace: process.env.PINECONE_NAME_SPACE,
      },
    );

    /* Search the vector DB independently with meta filters */
    const model = new OpenAI();
    // const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    //   k: 10,
    //   returnSourceDocuments: true,
    // });
    const vectordata = await vectorStore.similaritySearch(
      `my business is an ${temp[0]} based on Shopify and we are selling ${temp[1]}`,
      6,
    );
    console.log(vectordata);

    const chain = loadQAChain(model, {
      prompt: promptA,
    });

    const response = await chain.call({
      input_documents: vectordata,
      business: temp[0],
      product: temp[1],
      language: temp[2],
    });
    console.log('response----------------------', response);
    // sendData(JSON.stringify({ data: result.text }));
    res.status(200).json({ data: response.text });
    // res.write(response.text);
    console.log('result-----', response.text);
  } catch (error) {
    console.log('error', error);
  } finally {
    res.end();
  }
}
