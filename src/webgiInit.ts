import {ParameterUI} from "./ParameterUI";
import {SessionManager} from "./SessionManager";
import {ShapeDiverUpdateHandler} from "./shapeDiverUpdateHandler";
import {
  CoreViewerApp,
  DepthOfFieldPlugin,
  getUrlQueryParam,
  LoadingScreenPlugin,
  mobileAndTabletCheck,
  PickingPlugin,
  ProgressivePlugin
} from "webgi";
import {processModel} from './processModel'
import {setupDebugUi} from './setupDebugUi'

const sceneFile = './ss-0121.vjson';
console.log('MAIN ENTRY LOADED');

// Ticket used when initializing the ShapeDiver session
const DEFAULT_TICKET: string = import.meta.env.VITE_SHAPEDIVER_TICKET || '37fafaf67fc6a773fe8ff107c14357b94b5706472463afc4d91a010f2595b767dde0257ea2ba58addcdc0272c36df2c4ca53827fe23949ab4654de633ddbe3f77269658aff15744d44924abac6b8b5dd2d06c1e3ec2d70616697ed33c00868c5bfccd2b220c4a5-de0650ccf68c7a774cd367c6a0d190c2';

// Global variable to track the current viewer instance
let currentViewer: CoreViewerApp | null = null;
let currentUiPlugin: any = null; // Track the current UI plugin

// Function to clean up all ShapeDiver UI elements
function cleanupShapeDiverUI() {
  console.log('Cleaning up ShapeDiver UI elements...');
  
  // Remove all existing tweakpane containers and UI elements
  document.querySelectorAll('#tweakpaneUiContainer').forEach(el => {
    console.log('Removing tweakpaneUiContainer:', el);
    el.remove();
  });
  
  document.querySelectorAll('.tp-container').forEach(el => {
    console.log('Removing tp-container:', el);
    el.remove();
  });
  
  document.querySelectorAll('.tp-root').forEach(el => {
    console.log('Removing tp-root:', el);
    el.remove();
  });
  
  document.querySelectorAll('.tp-folder').forEach(el => el.remove());
  document.querySelectorAll('.tp-folderv').forEach(el => el.remove());
  document.querySelectorAll('.tp-btnv').forEach(el => el.remove());
  document.querySelectorAll('.tp-sliderv').forEach(el => el.remove());
  document.querySelectorAll('.tp-checkboxv').forEach(el => el.remove());
  document.querySelectorAll('.tp-inputv').forEach(el => el.remove());
  document.querySelectorAll('.tp-colv').forEach(el => el.remove());
  document.querySelectorAll('.tp-rotv').forEach(el => el.remove());
  document.querySelectorAll('.tp-fldv').forEach(el => el.remove());
  document.querySelectorAll('.tp-lblv').forEach(el => el.remove());
  document.querySelectorAll('.tp-sldtxtv').forEach(el => el.remove());
  document.querySelectorAll('.tp-lstv').forEach(el => el.remove());
  document.querySelectorAll('.tp-ckbv').forEach(el => el.remove());
  document.querySelectorAll('.tp-txtv').forEach(el => el.remove());
  document.querySelectorAll('.tp-brkv').forEach(el => el.remove());
  
  // Remove any ShapeDiver specific containers
  document.querySelectorAll('.shapediver-params-container').forEach(el => {
    if (el instanceof HTMLElement) {
      console.log('Clearing shapediver-params-container:', el);
      el.innerHTML = '';
    }
  });
  
  // Remove any duplicate tweakpane containers that might be left
  const allTweakpaneContainers = document.querySelectorAll('[id*="tweakpane"]');
  allTweakpaneContainers.forEach(el => {
    console.log('Removing tweakpane container:', el);
    el.remove();
  });
  
  console.log('ShapeDiver UI cleanup complete');
}

export default async function initWebgi(
  canvas: HTMLCanvasElement,
  paramsDiv: HTMLDivElement,
  setSessionManager?: (sessionManager: any) => void,
  onParameterChange?: (paramId: string, value: string) => void
) {
  console.log('Initializing WebGI viewer...');
  console.log('Canvas element:', canvas);
  console.log('Params div element:', paramsDiv);
  
  // Clean up existing viewer if it exists
  if (currentViewer) {
    try {
      // Remove the UI plugin first
      if (currentUiPlugin) {
        try {
          await currentViewer.removePlugin(currentUiPlugin);
        } catch (error) {
          console.warn('Error removing UI plugin:', error);
        }
        currentUiPlugin = null;
      }
      await currentViewer.dispose();
    } catch (error) {
      console.warn('Error disposing previous viewer:', error);
    }
    currentViewer = null;
    // Remove any leftover UI containers when disposing the viewer
    cleanupShapeDiverUI();
  } else {
    // Ensure the DOM is clean before creating a new viewer
    cleanupShapeDiverUI();
  }

  let ticket = getUrlQueryParam('t');
  const modelViewUrl = getUrlQueryParam('u') || "https://sdeuc1.eu-central-1.shapediver.com";

  // Use localStorage for ticket if not in URL
  if (!ticket) {
    ticket = localStorage.getItem('shapediver_ticket') || '';
  } else {
    // Save ticket from URL to localStorage for next time
    localStorage.setItem('shapediver_ticket', ticket);
  }
  // Fallback to default ticket if still not set
  if (!ticket) {
    ticket = DEFAULT_TICKET;
  }

  console.log('Using ShapeDiver ticket:', ticket ? 'Available' : 'Not available');
  console.log('Model view URL:', modelViewUrl);

  console.log('Creating new viewer instance...');
  const viewer = new CoreViewerApp({canvas});
  currentViewer = viewer; // Store the current viewer instance
  
  console.log('Initializing viewer...');
  await viewer.initialize({})
  
  const loadingScreen = viewer.getPlugin(LoadingScreenPlugin)!;
  loadingScreen.showFileNames = false;
  loadingScreen.logoImage = "";
  loadingScreen.backgroundOpacity = 0;
  loadingScreen.background = "#00000000";
  loadingScreen.minimizeOnSceneObjectLoad = false;
  loadingScreen.backgroundBlur = 0;
  loadingScreen.loadingTextHeader = "Loading...";
  loadingScreen.errorTextHeader = "Error";
  loadingScreen.showProcessStates = false;
  loadingScreen.showProgress = false;
  
  // Set initial camera and scene properties
  viewer.scene.modelRoot.modelObject.scale.set(0.1, 0.1, 0.1);

  const isMobile = mobileAndTabletCheck();

  try {
    // Load the vjson file from the public directory
    console.log('Loading scene file:', sceneFile);
    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
    
    const sceneLoad = await viewer.load(sceneFile);
    console.log('[sceneLoad]', sceneLoad);
    await sceneLoad;
    console.log('Scene loaded successfully!');
    
    // Log scene information
    console.log('Scene objects:', viewer.scene.modelRoot.children.length);
    console.log('Active camera:', viewer.scene.activeCamera);
    
  } catch (error) {
    console.error('Failed to load scene file:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      sceneFile: sceneFile
    });
    throw new Error(`Failed to load scene file: ${sceneFile}. Please ensure the file exists in the public directory.`);
  }

  const materialConfigurator = viewer.getPlugin("MaterialConfiguratorPlugin");
  if (materialConfigurator && 'enabled' in materialConfigurator) {
    (materialConfigurator as any).enabled = false;
  }

  viewer.getPlugin(ProgressivePlugin)!.maxFrameCount = 64;
  viewer.getPlugin(DepthOfFieldPlugin)!.enabled = false;

  // Always set up basic viewer properties
  viewer.renderer.renderScale = Math.min(isMobile ? 1.5: 2, window.devicePixelRatio)
  
  // Force a render to ensure the canvas is updated
  viewer.renderer.render();

  if (ticket) {
    console.log('Setting up ShapeDiver session...');
    try {
      // Use ShapeDiver ticket
      const sessionManager = new SessionManager(ticket, modelViewUrl);
      const updateHandler = await viewer.addPlugin(new ShapeDiverUpdateHandler())
      updateHandler.processModel = processModel
      sessionManager.outputUpdateHandler = updateHandler.outputUpdateHandler;
      
      console.log('Initializing ShapeDiver session...');
      await sessionManager.init();
      console.log('ShapeDiver session initialized successfully');
      
      // Log parameters information
      if (sessionManager.parameters) {
        console.log('ShapeDiver parameters found:', Object.keys(sessionManager.parameters));
        Object.keys(sessionManager.parameters).forEach(paramId => {
          const param = sessionManager.parameters![paramId];
          console.log(`Parameter ${paramId}:`, {
            name: param.name,
            type: param.type,
            defval: param.defval,
            hidden: param.hidden
          });
        });
      } else {
        console.warn('No ShapeDiver parameters found');
      }
      
      // Pass session manager back to React component
      if (setSessionManager) {
        console.log('Passing session manager to React component');
        setSessionManager(sessionManager);
      }
      
      // Create ShapeDiver parameters UI with the correct callback signature
      if (sessionManager.parameters) {
        console.log('Creating ParameterUI...');
        const paramsUi = new ParameterUI(
            sessionManager.parameters,
            sessionManager.customizeSession.bind(sessionManager)
        );
        
        console.log('ParameterUI created, setting up debug UI...');
        // Set up debug UI - this will handle clearing and setting up the UI properly
        await setupDebugUi(viewer, isMobile, paramsUi, paramsDiv)
        
        // Store the UI plugin reference
        currentUiPlugin = viewer.getPlugin('TweakpaneUiPlugin');
        
        console.log('ShapeDiver session setup complete');
        
        // Verify that the UI elements were created
        setTimeout(() => {
          const tweakpaneContainer = document.querySelector('#tweakpaneUiContainer');
          const tpContainer = document.querySelector('.tp-container');
          const tpRoot = document.querySelector('.tp-root');
          
          console.log('UI elements verification:');
          console.log('- tweakpaneUiContainer:', tweakpaneContainer ? 'Found' : 'Not found');
          console.log('- tp-container:', tpContainer ? 'Found' : 'Not found');
          console.log('- tp-root:', tpRoot ? 'Found' : 'Not found');
          
          if (tweakpaneContainer) {
            console.log('- tweakpaneUiContainer children:', tweakpaneContainer.children.length);
          }
        }, 1000);
        
      } else {
        console.error('No parameters available for UI creation');
      }
      
    } catch (error) {
      console.error('Error setting up ShapeDiver session:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  } else {
    console.log('No ShapeDiver ticket found, running in demo mode');
  }
  
  // Hide loading container when everything is loaded
  const loadingContainer = document.getElementById("loading-container");
  if (loadingContainer) {
    loadingContainer.classList.add("hidden");
  }
  document.body.classList.add("loaded");
  
  console.log('WebGI viewer initialization complete');
  return viewer;
} 