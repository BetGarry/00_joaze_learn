# JOAZE.LT Learning Guide - Bolt.new Compatible

This is a simplified version of the JOAZE.LT learning guide project, optimized to run on bolt.new environment without complex WebGI dependencies.

## Features

- **Interactive Learning Guide**: Step-by-step tutorials for using JOAZE.LT platform
- **Product Configurator**: Interactive jewelry configuration with real-time pricing
- **3D Viewer Placeholder**: Simulated 3D viewer with basic controls
- **Responsive Design**: Works on all device sizes
- **Modern UI**: Built with Tailwind CSS and Radix UI components

## Project Structure

- **Learning Steps**: 8 comprehensive tutorials covering the entire JOAZE.LT workflow
- **Product Configuration**: Interactive jewelry customization with parameters like metal type, purity, stones, size, and comfort
- **Real-time Pricing**: Dynamic price calculation based on selected options
- **Video Integration**: Embedded YouTube tutorials for each learning step

## Key Components

### Learning Guide
- Registration/Login process
- Store navigation
- Configuration explanations
- Real-time pricing demonstration
- Cart and checkout process
- Order confirmation and tracking

### Product Configurator
- Metal selection (Silver, Gold variants)
- Purity options (585, 750)
- Stone count (1-7 stones)
- Ring size (15-22mm)
- Comfort fit options

### 3D Viewer Simulation
- Interactive placeholder with rotation and zoom controls
- Simulates the original WebGI 3D viewer functionality
- Responsive design with proper aspect ratios

## Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons
- **Vite** for build tooling

## Getting Started

The project is ready to run on bolt.new. Simply start the development server and explore the interactive learning guide and product configurator.

## Original Project Context

This is a simplified version of a complex 3D jewelry visualization platform that originally used:
- WebGI for 3D rendering
- ShapeDiver for parametric modeling
- Complex material and lighting systems
- Real-time 3D model updates

The bolt.new version maintains the core functionality and user experience while using simulated 3D interactions.