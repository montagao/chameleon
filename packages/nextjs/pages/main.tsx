import React, { useState } from "react";
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
import TitleComponent from "~~/components/titlecontainer/TItleContainer";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { NFTMetaData } from "~~/models/models";

// Proompt
// const configuration = new Configuration({
//   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);
// const initialContext = {
//   role: messageRoleEnum.System,
//   content: `You will identify a theme based on the user input, and you will generate a list of values related to that theme. Generate 2 values for each trait. For ALL of your responses, do not include anything other than the data model.

//   export interface StableDiffusionPayload {
//     head: Array<string>;
//     glasses: Array<string>;
//     body: Array<string>;
//     accessories: Array<string>;
//   }

//   Below is an example of a response following the above payload model. The response should NEVER include anything outside the curly braces.
//   DO NOT WRITE ANYTHING OUTSIDE THE CURLY BRACES. DO NOT REPEAT THE INPUT

//   Example: correct output denoted in the & symbols below for input of "materials type of nft":
//   &
//   {
//     "head": ["yarn", "string"],
//     "glasses": ["beans", "beads"],
//     "body": ["paper art", "plush"],
//     "accessories": ["construction paper", "playdoh"]
//   }
//   &
//   &
//   {
//     "head": ["skin", "spiky"],
//     "glasses": ["beans", "beads"],
//     "body": ["paper art", "plush"],
//     "accessories": ["construction paper", "playdoh"]
//   }
//   &

//   `,
// };

const constructPayload = (input: string) => {
  return `{
    "head": ["${input}"],
    "glasses": ["${input}"],
    "body": ["${input}"],
    "accessories": ["${input}"]
    }`;
};

const Home: NextPage = () => {
  const [lastSearchTerm, setLastSearchTerm] = useState("");
  const [isAPILoading, setIsAPILoading] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [previewList, setPreviewList] = useState<NFTMetaData[]>([]);
  const [isMinted, setIsMinted] = useState(false);
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
      console.log("Successful Block Tx", txnReceipt.blockHash);
      setIsMinted(true);
    },
    onError: error => {
      console.log("Block Tx failed", error);
      setIsMinted(false);
    },
  });
  const [previewMode, setPreviewMode] = useState(true);

  const fetchNFTData = async (urls: string[]): Promise<NFTMetaData[]> => {
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
    setIsAPILoading(true);
    try {
      const response = await fetch("https://api.chameleon.wtf:14350/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload.toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const nftURLResponse = await response.json();
      const nftURLs = nftURLResponse?.urls ?? [];
      const nftData = await fetchNFTData(nftURLs);
      const firstImage = nftData?.[0].URI;
      setActiveImage(firstImage);
      setPreviewList(nftData);
      setIsAPILoading(false);
    } catch (error) {
      setIsAPILoading(false);
      console.error("There was an error!", error);
    }
  };

  const handleSearch = async (inputValue: string) => {
    if (!isAPILoading && !isLoading && !isMining) {
      if (previewMode) {
        setPreviewMode(false);
      }
      const payload = constructPayload(inputValue);
      fetchNFTURLs(payload);
      setLastSearchTerm(inputValue);
    }
  };

  const imgChosenCallback = (imgLink: string) => {
    setActiveImage(imgLink);
  };

  const returnToLoopState = () => {
    setIsMinted(false);
    setActiveImage(null);
    setPreviewList([]);
  };

  const handleMint = async () => {
    try {
      if (!!activeImage) {
        writeAsync();
      } else {
        setIsMinted(false);
      }
    } catch (error) {
      console.error(`Error occurred during API call: ${error}.`);
    }
  };

  return (
    <>
      <MetaHeader />
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="flex flex-col justify-center gap-5">
          <TitleComponent />
          {isMinted && activeImage !== null ? (
            <div className="flex flex-col items-center justify-center">
              <ImageCard imgLink={activeImage} altText="Minted Image" onImgChosen={imgChosenCallback} isActive={true} />
              <h2 className="text-2xl mt-4">Here is your shiny new Noun!</h2>
              <ImageButton
                onClick={returnToLoopState}
                text="Generate more!"
                imageUrl="/assets/crystalball.svg"
              ></ImageButton>
            </div>
          ) : (
            <>
              <div className="flex flex-grow p-3">
                <SearchEngine handleSearch={handleSearch} />
              </div>

              {!isAPILoading ? (
                <>
                  {previewMode ? (
                    <>
                      <div className="flex justify-center gap-4">
                        <ImageButton
                          onClick={() => handleSearch("")}
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
                        onClick={() => handleSearch(lastSearchTerm)}
                        text="Regenerate"
                        imageUrl="/assets/regenerate.svg"
                        tooltipText="Regenerate will always use whatever you searched for in the last API call"
                      />
                      <ImageButton onClick={handleMint} text="Mint" imageUrl="/assets/tomint.svg" />
                    </div>
                  ) : null}
                </>
              ) : (
                <LoadingContainer isLoading={isAPILoading} />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
