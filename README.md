
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
-   **Responsive Design**: A fully responsive interface that works seamlessly across desktop and mobile devices.
-   **Zero-Build Setup**: Runs directly in the browser using modern JavaScript (ES Modules) and CDNs, requiring no complex build tools or installations.

## How It Works

The application operates entirely on the client-side, making it fast and easy to deploy.

1.  **Input**: The user provides content through the text area, a file upload, or by using their device's camera.
2.  **Classification**: The application first classifies the input type (e.g., URL, Plain Text, Image, PDF Document).
3.  **Prompt Engineering**: Based on the input type, a highly specific prompt is constructed. This prompt instructs the Gemini model to adopt a specific persona (e.g., "You are a cybersecurity analyst...") and perform a targeted analysis.
4.  **Structured Output**: The request to the Gemini API includes a strict `responseSchema`. This forces the AI to return its findings in a predictable JSON format, ensuring data consistency and reliability.
5.  **API Call**: The request is sent to the Google Gemini Pro model (`gemini-2.5-flash`).
6.  **Rendering**: The front-end receives the structured JSON response, parses it, and dynamically renders the detailed analysis report card and updates the history panel.

## Tech Stack

-   **Core Language**: JavaScript (ESM)
-   **Markup & Styling**: HTML5, Tailwind CSS
-   **AI Engine**: **Google Gemini API** (`@google/genai`) for all content analysis.
-   **Client-Side Libraries**:
    -   **pdf.js**: For parsing and extracting text from PDF files directly in the browser.
    -   **mammoth.js**: For converting `.docx` files to raw text.
-   **Deployment**: Can be hosted on any static web hosting service (e.g., Vercel, Netlify, GitHub Pages) or run locally.

---

## Running the Application Locally

Follow these steps to get SECURO/SAFE running on your local machine.

### Prerequisites

1.  **A Modern Web Browser**: Chrome, Firefox, Safari, or Edge.
2.  **Google Gemini API Key**: You need an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  **A Local Web Server**: Since the app uses ES Modules, it must be served over HTTP/HTTPS. A simple way to do this is with Python's built-in server or the `Live Server` extension in VS Code.

### Step 1: Clone the Repository

Open your terminal and clone this repository to your local machine:

```bash
git clone <repository_url>
cd <repository_folder>
```

### Step 2: Configure Your API Key

1.  Open the `index.html` file in a text editor.
2.  Find the following line (around line 300):

    ```javascript
    const API_KEY = "YOUR_GEMINI_API_KEY_HERE";
    ```

3.  Replace the placeholder string `"YOUR_GEMINI_API_KEY_HERE"` with your actual Google Gemini API key.

    ```javascript
    // IMPORTANT: Replace with your own key
    const API_KEY = "YOUR_GEMINI_API_KEY_HERE";
    ```
    > **Security Note**: This method is suitable for local development only. For a production application, never expose your API key on the client-side. It should be handled through a secure backend server.

### Step 3: Serve the Application

You can use any local web server. The simplest is Python's built-in module.

1.  Open your terminal in the project's root directory (the one containing `index.html`).
2.  Run one of the following commands:

    **For Python 3:**
    ```bash
    python3 -m http.server
    ```
    **For Python 2:**
    ```bash
    python -m SimpleHTTPServer
    ```

3.  The server will start, typically on port `8000`. You'll see a message like `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)`.

### Step 4: Access SECURO/SAFE

Open your web browser and navigate to:

[http://localhost:8000](http://localhost:8000)

The application should now be running, and you can start analyzing content!

---

## File Structure

-   `index.html`: The main entry point of the application. It contains all the HTML structure, CSS (via CDN and inline styles), and the core application logic in a `<script type="module">` tag.
-   `metadata.json`: Provides metadata about the application, including required permissions like camera access.
-   `README.md`: This file.
