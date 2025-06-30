# JOAZE Learning Guide

This directory contains an example React + WebGI project used to demonstrate how JOAZE.LT loads a 3D model and provides an interactive manual for customers.

## Project Purpose

The project combines a WebGI viewer with a step‑by‑step guide so users can explore jewellery configurations and follow instructions about the purchasing flow. The viewer loads a `.vjson` scene and, if a ShapeDiver ticket is supplied, connects to a ShapeDiver session for parameter control.

## 🚀 Features

- **Interactive 3D Viewer**: WebGI-powered 3D model visualization
- **ShapeDiver Integration**: Real-time parameter control for 3D models
- **Learning Guide**: Step-by-step tutorial system with video integration
- **Product Configurator**: Interactive jewelry customization interface
- **Responsive Design**: Mobile-friendly interface with adaptive layouts
- **Performance Monitoring**: Built-in performance tracking and optimization
- **TypeScript Support**: Full type safety and IntelliSense support

## 📋 Prerequisites

- Node.js 18.17.0 or higher
- npm, yarn, or pnpm package manager
- Modern web browser with WebGL support

## 🛠️ Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd 00_joaze-learning-guide
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your ShapeDiver ticket:
   ```env
   VITE_SHAPEDIVER_TICKET=your_actual_ticket_here
   ```

## 🚀 Development

### Starting the Dev Server

Run the Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### ShapeDiver Tickets

`src/webgiInit.ts` retrieves a ticket from the query parameter `t` or from `localStorage`, falling back to a built‑in `DEFAULT_TICKET` if none is supplied. Tickets are stored in `localStorage` for reuse:

```ts
let ticket = getUrlQueryParam('t');
const modelViewUrl = getUrlQueryParam('u') || "https://sdeuc1.eu-central-1.shapediver.com";
if (!ticket) {
  ticket = localStorage.getItem('shapediver_ticket') || '';
} else {
  localStorage.setItem('shapediver_ticket', ticket);
}
if (!ticket) {
  ticket = DEFAULT_TICKET;
}
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_SHAPEDIVER_TICKET` | ShapeDiver authentication ticket | Required |
| `VITE_SHAPEDIVER_URL` | Custom ShapeDiver server URL | `https://sdeuc1.eu-central-1.shapediver.com` |
| `VITE_APP_TITLE` | Application title | `JOAZE Learning Guide` |
| `VITE_ENABLE_DEBUG_UI` | Enable debug UI components | `true` |
| `VITE_ENABLE_PERFORMANCE_MONITORING` | Enable performance tracking | `false` |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # Shadcn/ui components
├── data/               # Static data and configurations
│   ├── productConfigurator.ts
│   └── learningSteps.ts
├── hooks/              # Custom React hooks
│   └── use-mobile.ts   # Mobile detection hook
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── performance.ts  # Performance monitoring
├── App.tsx             # Main application component
├── WebgiViewer.tsx     # 3D viewer wrapper
├── webgiInit.ts        # WebGI initialization
└── main.tsx            # Application entry point
```

## 🎯 Usage

### Viewer and Manual

The WebGI viewer is initialised in `webgiInit.ts`, which also handles ShapeDiver session creation and moves the parameter UI into the React component. The main user manual lives in `src/App.tsx` and renders an "Interaktyvus vartotojo vadovas" header as part of the guide:

```tsx
<h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
  JOAZE.LT
</h1>
<p className="text-sm text-slate-300">Interaktyvus vartotojo vadovas</p>
```

### View Modes

The application supports three main view modes:

1. **Overview** (`/overview`) - Quick overview of all learning steps
2. **Guide** (`/guide`) - Detailed step-by-step tutorial
3. **Configurator** (`/configurator`) - Interactive product configuration

### Performance Monitoring

Enable performance monitoring by setting `VITE_ENABLE_PERFORMANCE_MONITORING=true` in your environment variables. This will track:

- Component render times
- WebGI initialization performance
- User interaction response times

Access metrics in the browser console:
```javascript
// Log all performance metrics
window.perf.logMetrics()

// Get specific metrics
window.perf.getMetrics('webgi-init')
```

## 🔒 Security

### Known Vulnerabilities

The project includes some security vulnerabilities in ShapeDiver dependencies. These are being addressed through:

- Package resolution overrides in `package.json`
- Regular dependency updates
- Security audit monitoring

To check for vulnerabilities:
```bash
npm audit
```

To attempt automatic fixes:
```bash
npm audit fix
```

## 🐛 Troubleshooting

### Common Issues

1. **VJSON file not loading**
   - Ensure the file exists in `public/` directory
   - Check browser console for specific error messages
   - Verify Vite configuration includes vjson plugin

2. **ShapeDiver connection issues**
   - Verify your ticket is valid and not expired
   - Check network connectivity to ShapeDiver servers
   - Review browser console for authentication errors

3. **Performance issues**
   - Enable performance monitoring to identify bottlenecks
   - Check for memory leaks in WebGI viewer
   - Consider reducing model complexity for mobile devices

### Debug Mode

Enable debug UI by setting `VITE_ENABLE_DEBUG_UI=true` in your environment variables. This provides:

- Additional console logging
- UI debugging tools
- Performance metrics display

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary to JOAZE.LT. All rights reserved.

## 🆘 Support

For technical support or questions about this project, please contact the development team or create an issue in the project repository.

