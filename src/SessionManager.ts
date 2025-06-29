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

  public customizationCounter = 0;
  public outputUpdateHandler?: (
    outputApi: IOutputApi,
    materialOutputApi?: IOutputApi
  ) => Promise<void>;

  // #endregion Properties (4)

  // #region Constructors (1)

  /**
   *
   * @param ticket Ticket for embedding, find it in your dashboard on shapediver.com/app
   * @param modelViewUrl model view url, find it in your dashboard on shapediver.com/app
   */
  constructor(readonly ticket: string, readonly modelViewUrl: string) { }

  // #endregion Constructors (1)

  // #region Public Getters And Setters (1)

  public get parameters() {
    return this.sessionApi?.parameters;
  }

  // #endregion Public Getters And Setters (1)

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