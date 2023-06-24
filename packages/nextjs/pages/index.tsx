import React from "react";
import type { NextPage } from "next";
import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessageRoleEnum as messageRoleEnum,
} from "openai";
import { MetaHeader } from "~~/components/MetaHeader";
import SearchEngine from "~~/components/searchengine/SearchEngine";

const configuration = new Configuration({
  apiKey: "",
});

const openai = new OpenAIApi(configuration);

const initialContext = {
  role: messageRoleEnum.System,
  content: `You are providing context to an image generating API using text input from the user. The goal is to arrive at a detailed prompt that will generate an image that matches the user's intent, drilling down progressively by identifying a specific theme the user wants to create generative art with. Try to identify a theme based on the user's feedback. Every time the user sends feedback, respond with 3 variations of the theme identified. For example, if the message is '''CryptoPunks as disney characters''' you might respond with '1. CryptoPunks in the art style of Mickey Mouse 2. CryptoPunks as disney princesses 3. CryptoPunks if they were in Tarzan'. You are not having a conversation with the user, but are mimicking them and trying to create 3 versions of their idea every time a message is sent. The assistant response will ALWAYS follow this format: '1. [variation 1] 2. [variation 2] 3. [variation 3]' with no other information. Here is an example of a successful conversation:
  User: CryptoPunks as samurais
  Assistant: [
    CryptoPunks reimagined as samurais from the Edo period,
    CryptoPunks as futuristic samurais in a cyberpunk world,
    CryptoPunks stylized in the aesthetic of a traditional Japanese samurai scroll painting,
  ]
  User: CryptoPunks as futuristic samurais in a cyberpunk world
  Assistant: [
    CryptoPunks as samurais wielding high-tech weaponry in a neon-lit, cyberpunk cityscape.
    CryptoPunks as robotic samurais in a dystopian cyberpunk universe.
    CryptoPunks as samurais in a VR-induced, matrix-like cyberpunk world
  ]
  `,
};

const Home: NextPage = () => {
  const [previewMode, setPreviewMode] = React.useState(false);
  const messageLog: ChatCompletionRequestMessage[] = [initialContext];
  let currentPromptInput = "";

  const previewBtnHandler = () => {
    if (!previewMode) {
      setPreviewMode(true);
    }
    const userMessage: ChatCompletionRequestMessage = {
      role: messageRoleEnum.User,
      content: currentPromptInput,
    };
    messageLog.push(userMessage);

    const fetchAndLog = async () => {
      try {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: messageLog,
          max_tokens: 80,
          n: 1,
          stop: undefined,
          temperature: 1,
        });
        const gptResponse = response.data.choices[0].message?.content;
        if (gptResponse) {
          messageLog.push({
            role: messageRoleEnum.Assistant,
            content: gptResponse,
          });
        }
        console.log(gptResponse);
      } catch (error) {
        console.error(`Error occurred during API call: ${error}`);
      }
    };
    fetchAndLog();
    currentPromptInput = "";
  };

  const handleTextChange = (text: string) => {
    currentPromptInput = text;
  };

  return (
    <>
      <MetaHeader />
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="flex flex-col justify-center">
          <div className="flex">
            <div className="flex p-8">
              <SearchEngine onTextChanged={handleTextChange} />
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full" onClick={previewBtnHandler}>
              Generate Preview
            </button>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Image Cards */}
              <div className="max-w-sm rounded overflow-hidden shadow-lg m-2">
                <div className="aspect-w-1 aspect-h-1">
                  <img className="w-full object-cover" src="image1.jpg" alt="Image 1" />
                </div>
              </div>
              <div className="max-w-sm rounded overflow-hidden shadow-lg m-2">
                <div className="aspect-w-1 aspect-h-1">
                  <img className="w-full object-cover" src="image2.jpg" alt="Image 2" />
                </div>
              </div>
              <div className="max-w-sm rounded overflow-hidden shadow-lg m-2">
                <div className="aspect-w-1 aspect-h-1">
                  <img className="w-full object-cover" src="image3.jpg" alt="Image 3" />
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mt-8">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-full">Generate a contract</button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="bg-base-300 w-full px-4 py-6">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contract
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <SparklesIcon className="h-8 w-8 fill-secondary" />
              <p>
                Experiment with{" "}
                <Link href="/example-ui" passHref className="link">
                  Example UI
                </Link>{" "}
                to build your own UI.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div> */}
    </>
  );
};

export default Home;
