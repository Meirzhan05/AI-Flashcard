
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { NextApiRequest, NextApiResponse } from "next";
// export const config = {
//   api: {
//     bodyParser: true,
//   },
// };

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`

export async function POST(request: Request) {
  const data = await request.json();
  const description = data.description;
  const groq = new Groq({apiKey: process.env.NEXT_PUBLIC_GROQ_API});
  const completion = await groq.chat.completions.create({
      messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: description},
      ],
      model: "mixtral-8x7b-32768",
      response_format: {type: "json_object"}
  })

  const content = JSON.parse(JSON.stringify(completion.choices[0].message.content));
  const flashcards = JSON.parse(content || '');
  return Response.json({flashcards});
}
