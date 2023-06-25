import React from "react";
import type { NextPage } from "next";
import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessageRoleEnum as messageRoleEnum,
} from "openai";
import { useAccount } from "wagmi";
import { ImageButton } from "~~/components/ImageButton";
import { LoadingContainer } from "~~/components/LoadingContainer";
import { MetaHeader } from "~~/components/MetaHeader";
import { ImageCard } from "~~/components/imagecontainer/ImageCard";
import SearchEngine from "~~/components/searchengine/SearchEngine";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { NFTMetaData } from "~~/models/models";

// Proompt
const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const initialContext = {
  role: messageRoleEnum.System,
  content: `You will identify a theme based on the user input, and you will generate a list of values related to that theme. Generate 2 values for each trait. For ALL of your responses, do not include anything other than the data model.

  export interface StableDiffusionPayload {
    head: Array<string>;
    glasses: Array<string>;
    body: Array<string>;
    accessories: Array<string>;
  }

  Below is an example of a response following the above payload model. The response should NEVER include anything outside the curly braces. 
  DO NOT WRITE ANYTHING OUTSIDE THE CURLY BRACES. DO NOT REPEAT THE INPUT

  Example: correct output denoted in the & symbols below for input of "materials type of nft":
  &
  {
    "head": ["yarn", "string"],
    "glasses": ["beans", "beads"],
    "body": ["paper art", "plush"],
    "accessories": ["construction paper", "playdoh"]
  }
  &
  &
  {
    "head": ["skin", "spiky"],
    "glasses": ["beans", "beads"],
    "body": ["paper art", "plush"],
    "accessories": ["construction paper", "playdoh"]
  }
  &


  `,
};

const constructPayload = (input: string) => {
  return `{
    "head": ["${input}"],
    "glasses": ["${input}"],
    "body": ["${input}"],
    "accessories": ["${input}"]

    }`;
};

const Home: NextPage = () => {
  const [isAPILoading, setIsAPILoading] = React.useState(false);
  const [activeImage, setActiveImage] = React.useState<string | null>(null);
  const [previewList, setPreviewList] = React.useState<NFTMetaData[]>([]);
  const [isMinted, setIsMinted] = React.useState(false);
  const { address } = useAccount();
  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "ChameleonContract",
    functionName: "safeMint",
    args: [address, previewList.find(img => img.image === activeImage)?.URI ?? ""],
    // For payable functions, expressed in ETH
    //value: "0.01",
    // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
    blockConfirmations: 1,
    // The callback function to execute when the transaction is confirmed.
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash wE DID IT REDDIT", txnReceipt.blockHash);
    },
  });
  const [previewMode, setPreviewMode] = React.useState(true);
  let currentPromptInput = "";

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

  const fetchNFTURLs = async (payload: string) => {
    try {
      const response = await fetch("https://api.chameleon.wtf:14350/generate", {
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
      setIsAPILoading(false);
    } catch (error) {
      setIsAPILoading(false);
      console.error("There was an error!", error);
    }
  };

  const previewBtnHandler = async () => {
    if (previewMode) {
      setPreviewMode(false);
    }
    fetchNFTURLs(constructPayload(currentPromptInput));
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

  currentPromptInput = "";

  return (
    <>
      <MetaHeader />
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="flex flex-col justify-center gap-5">
          <>
            <div className="flex">
              <img src="/assets/nounsmeleon.svg" />
              <img src="/assets/nounsmeleon_wordmark.svg" alt="Nounsmeleon" />
            </div>
            <div style={{ marginTop: "-4rem", marginLeft: "13rem" }}>
              <img src="/assets/motto.svg" alt="Generative NFTs made easy" />
            </div>
          </>

          <></>
          <div className="flex flex-grow p-3">
            <SearchEngine onTextChanged={handleTextChange} />
            <button
              style={{ backgroundImage: "linear-gradient(90deg, #FFE9D0 0%, #FFCAEA 100%)", height: "57px" }}
              className="outline-black outline-1 text-black px-4 py-2 flex items-center"
              onClick={previewBtnHandler}
            >
              <img style={{ marginRight: "8px" }} src="/assets/nounsify.svg" />
              <span>Nounsify!</span>
            </button>
          </div>

          {!isAPILoading ? (
            <>
              {previewMode ? (
                <>
                  <div className="flex justify-center">
                    <ImageButton
                      onClick={() => fetchNFTURLs(constructPayload(""))}
                      text="Surprise Me"
                      imageUrl="/assets/surprise_duck.svg"
                    />
                    <ImageButton onClick={() => {}} text="Guide" imageUrl="/assets/guide_hat.svg" />
                  </div>
                </>
              ) : null}

              <div className="max-w-4xl mx-auto px-3 flex flex-row">
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
              {!previewMode ? (
                <div className="flex flex-row justify-center gap-6">
                  <ImageButton
                    onClick={() => fetchNFTURLs(constructPayload(currentPromptInput))}
                    text="Regenerate"
                    imageUrl="/assets/regenerate.svg"
                  />
                  <ImageButton onClick={() => handleMint()} text="Select to Mint" imageUrl="/assets/tomint.svg" />
                </div>
              ) : null}
            </>
          ) : (
            <LoadingContainer isLoading={isAPILoading} />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
