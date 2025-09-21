# AvikonAI - AI Profile Picture Generator

AvikonAI is a powerful web application that creates stunning, personalized profile pictures using advanced AI technology. Built with Next.js and powered by Google's Gemini AI, it offers a seamless experience for generating high-quality profile pictures with various styles and customization options.

## ✨ Features

- **AI-Powered Generation**: Advanced AI models create unique profile pictures tailored to user preferences
- **Multiple Styles**: Choose from professional, artistic, gaming, and creative styles
- **Lightning Fast**: Generate high-quality images in seconds with optimized AI processing
- **High Resolution**: Download crisp, high-resolution images perfect for any platform
- **Batch Generation**: Create multiple variations to find the perfect profile picture
- **Privacy First**: Images are processed privately and stored locally
- **Image Upload**: Use reference images as inspiration for generation
- **Gallery Management**: Browse and manage generated images with search and filter capabilities
- **Responsive Design**: Beautiful, responsive interface with dark/light theme support

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.5.3, React 19.1.0, TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion animations
- **UI Components**: Custom components with Headless UI, Lucide React icons
- **AI Integration**: Google Gemini 2.5 Flash Image Preview model
- **Image Processing**: Local storage with automatic saving
- **Development**: ESLint, PostCSS, Turbopack

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Google Gemini API key ([Get one here](https://ai.google.dev/gemini-api/docs/api-key))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Avikonai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**

   Copy `.env.local.example` to `.env.local` and configure:
   ```env
   # Required: Google Gemini API Configuration
   GEMINI_API_KEY=your_gemini_api_key_here

   # Optional: Pixo Editor Integration
   NEXT_PUBLIC_PIXO_API_KEY=your_pixo_api_key

   # Optional: Auth0 Configuration
   AUTH0_SECRET=your_auth0_secret
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_ISSUER_BASE_URL=your_auth0_domain
   AUTH0_CLIENT_ID=your_auth0_client_id
   AUTH0_CLIENT_SECRET=your_auth0_client_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 User Workflow

### 1. **Home Page**
- Landing page with feature overview and call-to-action
- Navigation to generation and gallery pages

### 2. **Image Generation**
- **Describe**: Enter a detailed description of desired profile picture
- **Style Selection**: Choose from multiple preset styles (Professional, Artistic, Gaming, Creative)
- **Reference Image**: Optionally upload a reference image for inspiration
- **Generate**: Click to create AI-generated profile picture
- **Editing**: Enter the Image Editor interface to edit your image
- **Preview & Download**: View completed image, save it to your gallery, and download high-resolution version

### 3. **Gallery Management**
- **Browse**: View all generated images in grid or list format
- **Search**: Find images by prompt or description
- **Filter**: Sort by style or generation date
- **Download**: Re-download any previously generated image

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   └── generate-image/ # Image generation endpoint
│   ├── gallery/           # Gallery page
│   ├── generate/          # Generation page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── features/          # Feature-specific components
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── api.ts            # API client functions
│   ├── gemini.ts         # Gemini AI integration
│   └── storage/          # Local storage utilities
└── types/                # TypeScript type definitions
```

## 🔧 Configuration

### Gemini AI Setup
1. Get API key from [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
2. Add to `.env.local` as `GEMINI_API_KEY`
3. The app uses Gemini 2.5 Flash Image Preview model for generation

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## 🛡️ Privacy & Security

- Images are processed client-side when possible
- No permanent storage of user images on servers
- Local browser storage for gallery persistence

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [Next.js Documentation](https://nextjs.org/docs)
- Review [Gemini AI Documentation](https://ai.google.dev/docs)

---

**AvikonAI** - Transform your online presence with AI-powered profile pictures.