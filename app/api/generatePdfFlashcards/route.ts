import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Groq from "groq-sdk";
import pdf from 'pdf-parse';
import Flashcards from '@/components/flashcard';

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
}`

export async function POST(request: Request) {
    console.log("Request received");
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    // Extract text from PDF
    let pdfText = '';
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        console.log('ArrayBuffer:', arrayBuffer);
        const pdfData = await pdf(buffer);
        pdfText = pdfData.text;
        const groq = new Groq({apiKey: process.env.NEXT_PUBLIC_GROQ_API});
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: pdfText},
            ],
            model: "mixtral-8x7b-32768",
            response_format: {type: "json_object"}
        })
        const content = JSON.parse(JSON.stringify(completion.choices[0].message.content));
        const flashcards = JSON.parse(content || '');
        return NextResponse.json({ flashcards: flashcards }, { status: 200 });
    } catch (pdfError) {
        console.error('Error extracting PDF text:', pdfError);
        return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 });
    }

}