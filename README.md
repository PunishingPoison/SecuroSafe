
# SECURO/SAFE - AI-Powered Threat Analysis Tool

<img width="1898" height="1079" alt="Screenshot 2025-09-13 000223" src="https://github.com/user-attachments/assets/705b806b-2a54-4493-b036-073fbf27730e" />

**SECURO/SAFE** is a sophisticated, AI-powered web application designed to analyze digital content for potential threats, misinformation, and credibility issues. It provides users with a detailed, actionable report and educational tips to enhance their digital literacy, all wrapped in a futuristic, hacker-themed interface.

## Core Features

-   **Multi-Format Analysis**: Scrutinizes URLs, raw text, video links, documents (`.txt`, `.pdf`, `.docx`), and images.
-   **AI-Powered Insights**: Leverages the Google Gemini API to perform deep content analysis, acting as a specialized cybersecurity analyst, fact-checker, or visual expert depending on the input.
-   **Detailed Reporting**: Generates a comprehensive report card for each analysis, including:
    -   A **Credibility Score** (0-100).
    -   A clear **Threat Level** assessment (Safe, Questionable, Dangerous).
    -   A concise **Analysis Summary**.
    -   A **Detailed Explanation** of the findings.
    -   Actionable **Educational Tips** to help users identify similar threats in the future.
-   **Image & Document Intelligence**: Extracts text from various document formats and analyzes images for signs of AI generation or misinformation.
-   **Session History**: Keeps a log of recent analyses in the browser's local storage for easy review and comparison.
-   **Component-Based Architecture**: Built with React and TypeScript for a scalable and maintainable codebase.

## How It Works

The application is built as a modern single-page application (SPA).

1.  **Input**: The user interacts with the `InputForm` component to provide content via the text area, a file upload, or their device's camera.
2.  **State Management**: The main `App.tsx` component manages the application's state, including loading status, analysis results, and history.
3.  **API Service**: When an analysis is triggered, the app calls the `geminiService.ts`. This service classifies the input, constructs a highly specific, persona-driven prompt, and defines a strict JSON schema for the response.
4.  **AI Analysis**: The service sends the request to the Google Gemini API (`gemini-2.5-flash`), which returns a structured JSON object.
5.  **Render Results**: The `App` component receives the structured data, updates its state, and renders the `ResultCard` component with the detailed analysis. The `History` component is also updated.

## Tech Stack

-   **Core Framework**: **React**
-   **Language**: **TypeScript**
-   **Styling**: **Tailwind CSS**
-   **AI Engine**: **Google Gemini API** (`@google/genai`)
-   **Build Tool**: Assumes a standard React setup like **Vite** or **Create React App**.
-   **Client-Side Libraries**:
    -   **pdf.js**: For parsing and extracting text from PDF files.
    -   **mammoth.js**: For converting `.docx` files to raw text.

---

## Running the Application Locally

Follow these steps to get the project running on your local machine.

### Prerequisites

-   **Node.js**: Version 18.x or later.
-   **npm** or **yarn**: A package manager for Node.js.
-   **Git**: For cloning the repository.
-   **Google Gemini API Key**: You must have an active API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Step 1: Clone the Repository

Open your terminal and clone this repository to your local machine:

```bash
git clone <repository_url>
cd <repository_folder>
```

### Step 2: Install Dependencies

Install all the required npm packages.

```bash
npm install
# or
yarn install
```

### Step 3: Configure Environment Variables

1.  In the root of the project, create a new file named `.env.local`.
2.  Add your Google Gemini API key to this file. The variable name must match the one used in the code (e.g., `VITE_GEMINI_API_KEY` for a Vite project).

    ```.env.local
    VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```

    > **Important**: This file is included in `.gitignore` by default to prevent you from accidentally committing your secret key.

### Step 4: Run the Development Server

Start the local development server.

```bash
npm run dev
# or
yarn dev
```

This will launch the application, typically on `http://localhost:5173` (for Vite) or `http://localhost:3000` (for Create React App). The exact URL will be shown in your terminal.

### Step 5: Access SECURO/SAFE

Open your web browser and navigate to the URL provided in your terminal. The application should now be running!

---

## Project Structure

```
/
├── public/                # Static assets (favicon, etc.)
├── src/
│   ├── components/        # Reusable React components
│   │   ├── icons/         # SVG icon components
│   │   ├── EducationalContent.tsx
│   │   ├── Header.tsx
│   │   ├── History.tsx
│   │   ├── InputForm.tsx
│   │   └── ResultCard.tsx
│   │
│   ├── services/          # API interaction logic
│   │   └── geminiService.ts
│   │
│   ├── App.tsx            # Main application component and state logic
│   ├── index.css          # Global styles (Tailwind directives)
│   ├── index.tsx          # Root entry point of the React app
│   └── types.ts           # TypeScript type definitions
│
├── .env.local             # Local environment variables (API Key)
├── .gitignore             # Files to ignore for version control
├── index.html             # The HTML template for the SPA
├── package.json           # Project dependencies and scripts
├── README.md              # This file
└── tsconfig.json          # TypeScript compiler options
```
