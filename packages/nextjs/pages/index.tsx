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
  content: `You will identify a theme based on the user input, and you will generate a list of values for each trait related to that theme. Generate 12 values for each trait. For ALL of your responses, do not include anything other than the data modal. Never add information describing your response that isn't part of the data model, such as 'Sure! Here are 12 values for each trait related to the theme of Christmas:'. I defined the data model as a JSON object for the assistant response below.
  {
    head: Array<string>,
    eyes: Array<string>,
    body: Array<string>,
    background: Array<string>,
  }

  Below is an example of a successful user-assistant interaction:
  User: christmas
  Assistant: 
  {
    "head": ["Santa hat", "Reindeer antlers", "Elf hat", "Snowman top hat", "Christmas tree headband", "Candy cane headband", "Light-up tree headband", "Gingerbread man headband", "Angel halo", "Star headband", "Nutcracker headband", "Grinch headband"],
    "eyes": ["Wreath glasses", "Christmas tree glasses", "Santa glasses", "Elf glasses", "Reindeer glasses", "Snowman glasses", "Candy cane glasses", "Holly glasses", "Angel wing glasses", "Grinch glasses", "Jingle bell glasses", "Penguin glasses"],
    "body": ["Ugly Christmas sweater", "Santa Claus suit", "Elf costume", "Reindeer onesie", "Snowman outfit", "Mrs. Claus dress", "Gingerbread man suit", "Christmas tree dress", "Nutcracker outfit", "Angel costume", "Grinch jumpsuit", "Christmas pajamas"],
    "background": ["Snowy landscape", "Christmas tree farm", "Living room with stockings", "Gingerbread house", "Sleigh ride in the moonlight", "Ice skating on a frozen pond", "Christmas market", "Candy cane forest", "North Pole workshop", "Roasting chestnuts on an open fire", "Decorating the Christmas tree", "A cozy fireplace"]
  }
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
          max_tokens: 400,
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
        console.log(messageLog);
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
