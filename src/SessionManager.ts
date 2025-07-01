import { createSession, IOutputApi, ISessionApi } from '@shapediver/viewer.session';

/**
 * The SessionManager contains functionality to interpret
 * the information resulting from calls to the
 * ShapeDiver Viewer API (headless version).
 */
export class SessionManager {
  // #region Properties (4)

  private loadedOutputVersions: { [key: string]: string | undefined } = {};
  private sessionApi?: ISessionApi;
  private currentWeight: number | null = null;

  public customizationCounter = 0;
  public outputUpdateHandler?: (
    outputApi: IOutputApi,
    materialOutputApi?: IOutputApi
  ) => Promise<void>;
  public weightUpdateHandler?: (weight: number) => void;

  // #endregion Properties (4)

  // #region Constructors (1)

  /**
   *
   * @param ticket Ticket for embedding, find it in your dashboard on shapediver.com/app
   * @param modelViewUrl model view url, find it in your dashboard on shapediver.com/app
   */
  constructor(readonly ticket: string, readonly modelViewUrl: string) { }

  // #endregion Constructors (1)

  // #region Public Getters And Setters (2)

  public get parameters() {
    return this.sessionApi?.parameters;
  }

  public get weight() {
    return this.currentWeight;
  }

  public setWeight(weight: number) {
    this.currentWeight = Math.round(weight * 1000) / 1000;
    console.log("Weight manually set to:", this.currentWeight);
  }

  // #endregion Public Getters And Setters (2)

  // #region Public Methods (2)

  /**
   * Customize the session using the provided parameter set
   *
   * @param parameters Key value pairs of parameter id and stringified parameter value
   */
  public async customizeSession(parameters: { [key: string]: string }) {
    console.log("SessionManager.customizeSession called with parameters:", parameters);
    const customizationCounter = ++this.customizationCounter;

    try {
      if (!this.sessionApi) {
        console.error("Session API not available");
        return;
      }

      console.log("Calling sessionApi.customize with parameters:", parameters);
      await this.sessionApi.customize(parameters);
      console.log("Session customization completed successfully");

      /**
       * If another customization request has been made, we stop our progress and
       * abort this request.
       * Additionally, you could change requests to get all results.
       */
      if (this.customizationCounter !== customizationCounter) {
        console.log("Customization request superseded, aborting");
        return;
      }

      console.log("Processing output updates...");
      await this.processOutputUpdates(false);
      console.log("Output updates processed successfully");
      
    } catch (error) {
      console.error("Error in customizeSession:", error);
      throw error;
    }
  }

  /**
   * Creates a session with the model identified by the ticket,
   * and processes the default output versions.
   */
  public async init() {
    this.sessionApi = await createSession({
      ticket: this.ticket,
      modelViewUrl: this.modelViewUrl,
    });
    await this.processOutputUpdates(true);
  }

  // #endregion Public Methods (2)

  // #region Private Methods (1)

  /**
   * Extract weight from output API data
   */
  private extractWeightFromOutput(outputApi: IOutputApi): number | null {
    try {
      console.log("Extracting weight from output:", outputApi);
      
      if (!outputApi.content || outputApi.content.length === 0) {
        console.log("No content in output");
        return null;
      }

      // Look for data format output
      for (const contentItem of outputApi.content) {
        console.log("Processing content item:", contentItem);
        
        if (contentItem.format === 'data' && contentItem.data) {
          console.log("Found data format, processing data array:", contentItem.data);
          
          // Navigate through the data structure to find svoris
          for (const dataItem of contentItem.data) {
            console.log("Processing data item:", dataItem);
            
            if (dataItem.branch && Array.isArray(dataItem.branch)) {
              console.log("Found branch array:", dataItem.branch);
              
              for (const branchItem of dataItem.branch) {
                console.log("Processing branch item:", branchItem);
                
                // Check for direct svoris property
                if (branchItem.svoris !== undefined) {
                  console.log("Found direct svoris:", branchItem.svoris);
                  const roundedWeight = Math.round(branchItem.svoris * 1000) / 1000;
                  console.log("Rounded weight:", roundedWeight);
                  return roundedWeight;
                }
                
                // Check for nested AUKSAS object with svoris
                if (branchItem.AUKSAS && branchItem.AUKSAS.svoris !== undefined) {
                  console.log("Found AUKSAS.svoris:", branchItem.AUKSAS.svoris);
                  const roundedWeight = Math.round(branchItem.AUKSAS.svoris * 1000) / 1000;
                  console.log("Rounded weight:", roundedWeight);
                  return roundedWeight;
                }
                
                // Check for any nested object with svoris
                for (const key in branchItem) {
                  const nestedObj = branchItem[key];
                  if (nestedObj && typeof nestedObj === 'object' && nestedObj.svoris !== undefined) {
                    console.log(`Found svoris in ${key}:`, nestedObj.svoris);
                    const roundedWeight = Math.round(nestedObj.svoris * 1000) / 1000;
                    console.log("Rounded weight:", roundedWeight);
                    return roundedWeight;
                  }
                }
              }
            }
          }
        }
      }
      
      console.log("No svoris found in output data");
      return null;
    } catch (error) {
      console.error("Error extracting weight from output:", error);
      return null;
    }
  }

  /**
   * Processing of output updates. Compares versions of outputs and
   * calls the handler for output updates in case of changes.
   * @param forceUpdate Whether calling the output update handler should be forced
   */
  private async processOutputUpdates(forceUpdate: boolean) {
    if (!this.sessionApi) return;

    /** iterate output ids and check for new versions */
    for (const outputId in this.sessionApi.outputs) {
      const outputApi = this.sessionApi.outputs[outputId];
      console.log("Output =", outputApi)

      const outputVersion = outputApi.version
      const prevOutputVersion = this.loadedOutputVersions[outputId];

      // Always extract weight from the output, regardless of version changes
      const weight = this.extractWeightFromOutput(outputApi);
      if (weight !== null) {
        this.currentWeight = weight;
        console.log("Extracted weight:", weight);
        
        // Notify weight update handler if available
        if (this.weightUpdateHandler) {
          this.weightUpdateHandler(weight);
        }
      }

      /**
       * here we check the output version
       * if the version is the same as the previous one,
       * the data of the output stays the same
       */
      if (
        this.outputUpdateHandler &&
        (forceUpdate || outputVersion !== prevOutputVersion)
      ) {
        this.loadedOutputVersions[outputId] = outputVersion;

        /**
         * call the handler using the updated output,
         * and the optional output which defines its default materials
         */
        this.outputUpdateHandler(
          outputApi,
          outputApi.material ? this.sessionApi.outputs[outputApi.material] : undefined
        );
      }
    }
  }

  // #endregion Private Methods (1)
} 