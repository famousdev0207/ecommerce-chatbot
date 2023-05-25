import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { PineconeClient } from '@pinecone-database/pinecone';
import * as path from 'path';
import { cwd } from 'process';
import { NextApiRequest, NextApiResponse } from 'next';

/* Name of directory to retrieve your files from */
const filePath = 'docs';

const run = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    /*load raw docs from the all files in the directory */
    const csvFilePath = path.resolve(
      cwd(),
      `pages/api/upload/${req.body.name}.csv`,
    );
    const loader = new CSVLoader(csvFilePath, 'review');
    // const loader = new PDFLoader(filePath);
    const rawDocs = await loader.load();
    let temp: any = '';
    rawDocs.forEach((item) => {
      temp += item.pageContent;
    });
    console.log('temp---------', temp);
    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 0,
    });

    const texts: any = await textSplitter.splitText(temp);
    // console.log('split docs', docs);

    console.log('creating vector store...');
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();

    const pinecone = new PineconeClient();

    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? '', //this is in the dashboard
      apiKey: process.env.PINECONE_API_KEY ?? '',
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME || ''); //change to your own index name

    await index.delete1({
      deleteAll: true,
      namespace: process.env.PINECONE_NAME_SPACE,
    });
    await PineconeStore.fromTexts(texts, [], embeddings, {
      pineconeIndex: index,
      namespace: process.env.PINECONE_NAME_SPACE,
      textKey: 'text',
    });
  } catch (error) {
    console.log('error', error);
  }
};

export default run;
