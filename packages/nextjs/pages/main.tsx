import React from "react";
import type { NextPage } from "next";
import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessageRoleEnum as messageRoleEnum,
} from "openai";
import { MetaHeader } from "~~/components/MetaHeader";
import { ImageCard } from "~~/components/imagecontainer/ImageCard";
import SearchEngine from "~~/components/searchengine/SearchEngine";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { NFTMetaData, StableDiffusionPayload } from "~~/models/models";

type StableDiffusionPayload = {
  [key: string]: any;
};

// Proompt
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const initialContext = {
  role: messageRoleEnum.System,
  content: `You will identify a theme based on the user input, and you will generate a list of values for each trait related to that theme. Generate 2 values for each trait. For ALL of your responses, do not include anything other than the data modal.

  export interface StableDiffusionPayload {
    head: Array<string>;
    glasses: Array<string>;
    body: Array<string>;
    accessories: Array<string>;
  }

  Below is an example of a response following the above payload model. The response should NEVER include anything outside the curly braces. Do not supply additional info that doesn't follow the payload model.

  {
    "head": ["Santa hat", "Reindeer antlers"],
    "eyes": ["Wreath glasses", "Jingle bell glasses"],
    "body": ["Ugly Christmas sweater", "Santa Claus suit"],
    "accessories": ["Candy cane", "Mistletoe"]
  }
  `,
};

// const imageCards: Array<ImageCardDTO> = Array.from({ length: 4 }, (_, index) => ({
//   imgLink,
//   altText: `Image ${index}`,
//   isActive: false,
//   id: `${index}`,
//   URI: "",
// }));

const Home: NextPage = () => {
  const [activeImage, setActiveImage] = React.useState<string | null>(null);
  const [previewList, setPreviewList] = React.useState<NFTMetaData[]>([]);
  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "ChameleonContract",
    functionName: "safeMint",
    args: [previewList.find(img => img.image === activeImage)?.URI ?? ""],
    // For payable functions, expressed in ETH
    value: "0.01",
    // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
    blockConfirmations: 1,
    // The callback function to execute when the transaction is confirmed.
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash wE DID IT REDDIT", txnReceipt.blockHash);
    },
  });
  const [messageLog, setMessageLog] = React.useState<ChatCompletionRequestMessage[]>([initialContext]);
  const [previewMode, setPreviewMode] = React.useState(false);
  let currentPromptInput = "";

  const previewBtnHandler = async () => {
    console.log("test", currentPromptInput);
    if (!previewMode) {
      setPreviewMode(true);
    }
    const userMessage: ChatCompletionRequestMessage = {
      role: messageRoleEnum.User,
      content: currentPromptInput,
    };
    setMessageLog([...messageLog, userMessage]);
    console.log(messageLog);

    const fetchAndLog = async () => {
      try {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: messageLog,
          max_tokens: 400,
          n: 1,
          stop: undefined,
          temperature: 1,
        });
        const gptResponse = response.data.choices[0].message?.content;
        if (gptResponse) {
          const assistantMessage = {
            role: messageRoleEnum.Assistant,
            content: gptResponse,
          };
          setMessageLog([...messageLog, assistantMessage]);
          fetchNFTURLs(gptResponse);
        }
      } catch (error) {
        console.error(`Error occurred during API call: ${error}. Damn that sucks.`);
      }
    };

    const fetchNFTData = async (urls: string[]): Promise<NFTMetaData[]> => {
      console.log(urls);
      try {
        const fetchPromises = urls.map(url =>
          fetch(url)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              const metaData: NFTMetaData = {
                description: data.description,
                external_url: data.external_url,
                image: data.image,
                name: data.name,
                attributes: data.attributes,
                URI: url,
              };
              return metaData;
            }),
        );

        const nftData: NFTMetaData[] = await Promise.all(fetchPromises);
        return nftData;
      } catch (error) {
        console.error("There was an error!", error);
        return [];
      }
    };

    const fetchNFTURLs = async (payload: StableDiffusionPayload) => {
      try {
        const response = await fetch("http://31.12.82.146:14350/generate", {
          method: "POST", // or 'POST'
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': 'Bearer ' + token, // if you need to send a token
          },
          body: payload.toString(), // if you're sending data
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const nftURLResponse = await response.json();
        const nftURLs = nftURLResponse?.urls ?? [];
        const nftData = await fetchNFTData(nftURLs);
        setPreviewList(nftData);
      } catch (error) {
        console.error("There was an error!", error);
      }
    };
    fetchAndLog();

    currentPromptInput = "";
  };

  const handleTextChange = (text: string) => {
    currentPromptInput = text;
  };

  const imgChosenCallback = (imgLink: string) => {
    setActiveImage(imgLink);
  };

  const handleMint = async () => {
    try {
      await writeAsync();
    } catch (error) {
      console.error(`Error occurred during API call: ${error}. Damn that sucks.`);
    }
  };

  return (
    <>
      <MetaHeader />
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="flex flex-col justify-center gap-5">
          <div className="flex">
            <img src="/assets/nounsmeleon.svg" />
            <img src="/assets/nounsmeleon_wordmark.svg" alt="Nounsmeleon" />
          </div>
          <div style={{marginTop:"-4rem", marginLeft: "13rem"}}>
            <img src="/assets/motto.svg" alt="Generative NFTs made easy" />
          </div>
          <div className="flex flex-grow p-3">
            <SearchEngine onTextChanged={handleTextChange} />
            <button style={{ backgroundImage: "linear-gradient(90deg, #FFE9D0 0%, #FFCAEA 100%)", height: "57px"}} className="outline-black outline-1 text-black px-4 py-2 flex items-center" onClick={previewBtnHandler}>
              <img style={{marginRight: "8px"}} src="/assets/nounsify.svg"/>
              <span>Nounsify!</span>
            </button>
          </div>
          <div className="flex justify-center">
            <button style={{ backgroundImage: "linear-gradient(270deg, #D9FFD3 0%, #D5D7E1 100%)", marginRight: "2rem"}} className="text-black px-4 py-2 flex items-center">
              <img style={{marginRight: "8px"}} src="/assets/surprise_duck.svg"/>
              <span>Surprise Me!</span>
            </button>
            <button style={{ backgroundImage: "linear-gradient(270deg, #D9FFD3 0%, #D5D7E1 100%)"}} className="text-black px-4 py-2 flex items-center">
              <img style={{marginRight: "8px"}} src="/assets/guide_hat.svg"/>
              <span>Guide</span>
            </button>
          </div>
          <div className="max-w-4xl mx-auto flex flex-row">
            {previewList.map((img: NFTMetaData) => (
              <ImageCard
                onImgChosen={imgChosenCallback}
                imgLink={img.image}
                altText={img.name}
                isActive={img.image === activeImage}
                key={img.image}
              />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button onClick={() => handleMint()} className="bg-blue-500 text-white px-4 py-2 rounded-full">
              Mint me!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
