import {
    AssetExporterPlugin,
    BloomPlugin,
    CoreViewerApp,
    DepthOfFieldPlugin,
    DiamondPlugin,
    FileTransferPlugin,
    GroundPlugin,
    HierarchyUiPlugin,
    OutlinePlugin,
    PickingPlugin,
    RandomizedDirectionalLightPlugin,
    SimpleBackgroundEnvUiPlugin,
    SSAOPlugin,
    SSRPlugin,
    TonemapPlugin,
    TweakpaneUiPlugin
} from 'webgi'
import {ParameterUI} from './ParameterUI'

export async function setupDebugUi(
    viewer: CoreViewerApp,
    isMobile: boolean,
    paramsUi: ParameterUI,
    paramsDiv: HTMLDivElement
) {
    console.log('Setting up debug UI...');
    console.log('Params div:', paramsDiv);
    console.log('ParameterUI:', paramsUi);
    
    // Clear any existing UI elements that might have been added before
    const existingUiPlugin = viewer.getPlugin(TweakpaneUiPlugin);
    if (existingUiPlugin) {
        try {
            await viewer.removePlugin(existingUiPlugin);
        } catch (error) {
            console.warn('Error removing existing UI plugin:', error);
        }
    }

    // Remove any leftover Tweakpane containers from previous sessions
    document.querySelectorAll('.tp-container').forEach(el => el.remove());
    document.querySelectorAll('.tp-root').forEach(el => el.remove());
    document.querySelectorAll('.tp-rotv').forEach(el => el.remove());
    document.querySelectorAll('#tweakpaneUiContainer').forEach(el => el.remove());

    // await viewer.addPlugin(new PickingPlugin(BoxSelectionWidget, false, true));
    await viewer.addPlugin(SimpleBackgroundEnvUiPlugin)
    await viewer.addPlugin(FileTransferPlugin)
    await viewer.addPlugin(AssetExporterPlugin)
    await viewer.addPlugin(HierarchyUiPlugin)

    const picking = await viewer.addPlugin(new PickingPlugin());
    picking.enabled = false;
    await viewer.addPlugin(OutlinePlugin)
    viewer.renderer.refreshPipeline()

    // Clear the paramsDiv completely before adding new UI
    paramsDiv.innerHTML = '';
    paramsDiv.className = 'shapediver-params-container';
    
    console.log('Cleared paramsDiv, creating new container...');

    // Create a new container specifically for the ShapeDiver parameters
    const container = document.createElement('div');
    container.id = 'tweakpaneUiContainer';
    container.style.width = '100%';
    container.style.minHeight = '200px';
    container.style.position = 'relative';
    container.style.zIndex = '10';
    paramsDiv.appendChild(container);
    
    console.log('Created tweakpaneUiContainer:', container);

    // Create the UI plugin with specific container targeting
    const uiPlugin = await viewer.addPlugin(new TweakpaneUiPlugin(!isMobile));
    uiPlugin.colorMode = 'white'
    
    console.log('Created TweakpaneUiPlugin:', uiPlugin);
    
    // Append the UI object to the plugin
    console.log('Appending UI object to plugin...');
    uiPlugin.appendUiObject(paramsUi);
    
    console.log('UI plugin created and parameters appended to container');
    
    // Force the UI to render in the correct container
    setTimeout(() => {
        // Move any Tweakpane elements that were created outside our container
        const allTweakpaneElements = document.querySelectorAll('.tp-rotv, .tp-container, .tp-root');
        allTweakpaneElements.forEach(element => {
            if (!container.contains(element) && element.parentElement !== container) {
                console.log('Moving Tweakpane element to container:', element);
                container.appendChild(element);
            }
        });
        
        // Remove any duplicate containers that might have been created
        const allContainers = document.querySelectorAll('#tweakpaneUiContainer');
        if (allContainers.length > 1) {
            console.log('Found duplicate containers, removing extras...');
            for (let i = 1; i < allContainers.length; i++) {
                allContainers[i].remove();
            }
        }
    }, 100);
    
    // Verify the UI was created properly
    setTimeout(() => {
        const container = document.getElementById('tweakpaneUiContainer');
        const tpContainer = container?.querySelector('.tp-container');
        const tpRoot = container?.querySelector('.tp-root');
        const tpRotv = container?.querySelectorAll('.tp-rotv');
        
        console.log('UI verification after setup:');
        console.log('- Container exists:', !!container);
        console.log('- tp-container exists:', !!tpContainer);
        console.log('- tp-root exists:', !!tpRoot);
        console.log('- Number of tp-rotv elements:', tpRotv?.length || 0);
        
        if (tpRotv && tpRotv.length > 0) {
            console.log('Parameter elements found:');
            Array.from(tpRotv).forEach((el, index) => {
                const label = el.querySelector('.tp-lblv_l');
                console.log(`  ${index + 1}. ${label?.textContent || 'Unknown parameter'}`);
            });
        }
        
        // Check for any elements outside our container
        const outsideElements = document.querySelectorAll('body > .tp-rotv, body > .tp-container, body > .tp-root');
        if (outsideElements.length > 0) {
            console.warn('Found Tweakpane elements outside container:', outsideElements.length);
            outsideElements.forEach(el => {
                console.log('Moving outside element to container:', el);
                container?.appendChild(el);
            });
        }
    }, 500);
} 