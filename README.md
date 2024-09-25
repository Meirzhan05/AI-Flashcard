# FlashAI: AI-Powered Flashcard Learning

<p align="center">
  <a href="#live-demo">Live Demo</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

---

## Live Demo

Experience FlashAI in action! Visit our live demo at [https://flashai-mauve.vercel.app/](https://flashai-mauve.vercel.app/)


## Key Features

- 🧠 **AI-Powered Learning**: Harness the power of artificial intelligence to create personalized learning experiences.
- 🚀 **Accelerated Progress**: Learn faster and more efficiently with adaptive learning algorithms.
- 📚 **PDF to Flashcards**: Automatically generate flashcards from uploaded PDF documents.
- 💾 **Efficient Storage**: Utilize Pinecone vector database for handling large volumes of data.
- 🔒 **Secure Authentication**: Implement user authentication and protected routes with Clerk.
- 💳 **Flexible Pricing**: Seamless subscription management with Stripe integration.
- 📱 **Responsive Design**: Enjoy a consistent experience across all devices.

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/Meirzhan05/flashai.git
   ```

2. Install dependencies:
   ```
   cd flashai
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   NEXT_PUBLIC_GROQ_API=your_groq_api_key
   NEXT_PUBLIC_PINECONE_API_KEY=your_pinecone_api_key
   NEXT_PUBLIC_PINECONE_ENVIRONMENT=your_pinecone_environment
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **PDF Upload**: Users upload PDF documents containing study material.
2. **Text Extraction**: The system extracts text from the PDF using pdf-parse.
3. **Vector Embedding**: Text chunks are converted into vector embeddings.
4. **Semantic Search**: Pinecone vector database is used for efficient storage and retrieval of relevant information.
5. **Flashcard Generation**: AI models generate concise and effective flashcards from the extracted information.
6. **Interactive Learning**: Users engage with the generated flashcards through an intuitive interface.

## Tech Stack

- **Frontend**: Next.js, React, Material-UI
- **Backend**: Node.js, Next.js API Routes
- **Database**: Pinecone (Vector Database), Firebase Firestore
- **Authentication**: Clerk
- **AI/ML**: Groq, OpenAI
- **Payment Processing**: Stripe
- **PDF Processing**: pdf-parse
- **Styling**: Emotion, Framer Motion

<p align="center">
  Made with ❤️ by Meirzhan
</p>
