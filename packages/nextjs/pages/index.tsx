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
import { ImageCardDTO } from "~~/models/models";

// Proompt
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

// Placeholder stuff
const imgLink =
  "https://images.unsplash.com/photo-1496070242169-b672c576566b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1643&q=80";

const imageCards: Array<ImageCardDTO> = Array.from({ length: 4 }, (_, index) => ({
  imgLink,
  altText: `Image ${index}`,
  isActive: false,
  id: `${index}`,
}));

const Home: NextPage = () => {
  const [previewMode, setPreviewMode] = React.useState(false);
  const [previewList, setPreviewList] = React.useState<ImageCardDTO[]>(imageCards);
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
      } catch (error) {
        console.error(`Error occurred during API call: ${error}. Damn that sucks.`);
      }
    };
    fetchAndLog();
    currentPromptInput = "";
  };

  const handleTextChange = (text: string) => {
    currentPromptInput = text;
  };

  const imgChosenCallback = (imgID: string) => {
    const newPreviewList = previewList.map(img => {
      return { ...img, isActive: img.id === imgID };
    });
    setPreviewList(newPreviewList);
  };

  return (
    <>
      <MetaHeader />
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="flex flex-col justify-center gap-5">
          <div className="flex flex-grow p-3">
            <SearchEngine onTextChanged={handleTextChange} />
          </div>
          <div className="flex justify-around">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full" onClick={previewBtnHandler}>
              Nounify
            </button>
          </div>
          <div className="max-w-4xl mx-auto flex flex-row">
            {previewList.map(image => (
              <ImageCard
                onImgChosen={imgChosenCallback}
                imgLink={image.imgLink}
                altText={image.altText}
                isActive={image.isActive}
                key={image.id}
                id={image.id}
              />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full">Mint me!</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
