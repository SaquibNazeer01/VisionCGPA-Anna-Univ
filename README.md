# VisionCGPA - Anna University Marksheet Analyzer

VisionCGPA is an intelligent web application that uses advanced machine learning algorithms to automatically extract grades, credits, and subject names from Anna University (Chennai) marksheets, and precisely calculate your CGPA.

## 🚀 Features

- **Automated Marksheet Analysis:** Upload an image of your marksheet, and the app reads the subjects, credits, and letter grades.
- **Instant CGPA Calculation:** Instantly computes your CGPA based on the standard grade point system (O=10, A+=9, A=8, etc.).
- **Fast and Accurate:** Powered by the Lightning-fast Gemini 2.5 Flash-Lite model.

## 🛠️ Built With

- [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- [Tailwind CSS](https://tailwindcss.com/)
- [@google/genai SDK](https://www.npmjs.com/package/@google/genai)
- [Framer Motion](https://www.framer.com/motion/)

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/visioncgpa.git
   cd visioncgpa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment to Vercel

This project is ready to be deployed on Vercel.

1. Push this code to a new [GitHub repository](https://github.com/new).
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... > Project**.
3. Import your newly created GitHub repository.
4. Expand the **Environment Variables** section and add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `[Your Actual Gemini API Key]`
5. Click **Deploy**! Vercel will automatically build your Vite app and host it.

## 📄 License

This project is for educational and showcase purposes.


# DEVELOPER

- [LinkedIn](https://www.linkedin.com/in/SaquibNazeer01/)
- [GitHub](https://github.com/SaquibNazeer01)
- [Portfolio](https://SaquibNazeer.vercel.app)
- [Email](mailto:bhatsaakib505@gmail.com)
