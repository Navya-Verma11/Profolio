# Profolio: Portfolio Builder

## Introduction
Profolio is a user-friendly portfolio builder designed to simplify the process of creating professional portfolios. With an intuitive drag-and-drop interface, real-time preview, and easy export functionality, Profolio makes portfolio creation accessible to everyone, regardless of technical expertise.

**Live Demo:** [View ProFolio on Vercel](https://profolio-flax-six.vercel.app)

## Problem Statement
Many existing portfolio creation tools suffer from:
- Complex interfaces requiring technical knowledge
- Overwhelming configuration options
- Lack of true drag-and-drop functionality
- Time-consuming setup processes

Profolio addresses these issues by providing a streamlined, visual approach to portfolio creation.

## Features

### Core Features
- **Visual Drag-and-Drop Editor**: Easily place and arrange elements on your portfolio canvas
- **Real-Time Preview**: See changes as you make them
- **PDF Export**: Generate professional-quality PDF portfolios with one click
- **Simple Authentication**: Quick and secure login process

## Technology Stack

### Frontend
- React.js
- react-dnd (Drag and Drop)
- react-rnd (Resizable and Draggable)
- html2canvas
- jsPDF
- React Router

### Backend
- Nhost Authentication
- PostgreSQL Database
- GraphQL API

## Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation
1. Clone the repository
```bash
git clone https://github.com/Navya-Verma11/Profolio
cd profolio
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory and add:
```env
REACT_APP_NHOST_SUBDOMAIN=your-nhost-subdomain
REACT_APP_NHOST_REGION=your-nhost-region
```

4. Start the development server
```bash
npm start
```

## Usage
1. Create an Account: Sign up using email or social authentication
2. Create a New Portfolio: Start with a blank canvas or template
3. Add Elements: Drag and drop text, images, and other elements onto your canvas
4. Customize: Edit properties, colors, and styles of each element
5. Preview: See a real-time preview of your portfolio
6. Export: Generate a professional PDF of your portfolio

## Development Timeline
- December: Planning and Prototyping
- January: Frontend Development
- February: Backend Integration
- March: Final Testing and Deployment

## Future Scope

### Immediate Goals
- Shape elements library
- Multi-page thumbnail preview
- Prebuilt theme templates
- Enhanced element styling

### Long-Term Vision
- Template marketplace
- AI-driven suggestions

## Contributing
We welcome contributions to Profolio! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Team
- [Navya Verma](https://github.com/Navya-Verma11) - Developer  
- [Tanya Singh](https://github.com/TanyaSingh103) - Developer 

## Acknowledgments
Special thanks to the Women Engineers Program for their support and guidance throughout this project.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

*"Simplifying portfolio creation for everyone"*
