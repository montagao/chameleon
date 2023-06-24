import axios from "axios";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const REQUEST_HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${OPENAI_API_KEY}`,
};

export async function openAiGetWeatherParameters() {
  const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

  const data = {
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "user",
        content: "What is the weather like in Boston?",
      },
    ],
    functions: [
      {
        name: "get_current_weather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
            },
          },
          required: ["location"],
        },
      },
    ],
  };

  try {
    const response = await axios.post(API_ENDPOINT, data, { headers: REQUEST_HEADERS });
    return response.data.choices[0].message.function_call.arguments;
  } catch (error) {
    console.error("Error making OpenAI API request:", error);
    throw error;
  }
}

export async function openAiAskAboutNfts(prompt: string) {
  const API_ENDPOINT = "https://api.openai.com/v1/completions";

  const data = {
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0,
    max_tokens: 1000,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  };

  try {
    const response = await axios.post(API_ENDPOINT, data, { headers: REQUEST_HEADERS });
    let answer = response.data.choices[0].text.trim();

    // Filter out non-NFT related answers
    if (!isNFTRelated(answer)) {
      answer = "Please ask questions related to NFTs.";
    }

    return answer;
  } catch (error) {
    console.error("Error making OpenAI API request:", error);
    return "We encountered a problem while processing your question. Please try again";
  }
}

function isNFTRelated(answer: string) {
  const nftKeywords = [
    "nft",
    "nfts",
    "non-fungible token",
    "cryptoart",
    "cryptocurrencies",
    "blockchain",
    "decentralized",
  ];
  const lowercasedAnswer = answer.toLowerCase();

  for (const keyword of nftKeywords) {
    if (lowercasedAnswer.includes(keyword)) {
      return true;
    }
  }

  return false;
}
