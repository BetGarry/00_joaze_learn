import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Slider } from './components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { ChevronRight, Play, Download, Eye, ShoppingCart, Settings, CreditCard, Mail, Package, RotateCcw, Info, Sparkles, Zap, Star, Heart, Diamond, Palette, Ruler, Weight, Shield } from 'lucide-react'
import WebgiViewer from './WebgiViewer'
import { productConfigurator } from './data/productConfigurator'
import { learningSteps } from './data/learningSteps'
import { LearningStep } from './types'
import './App.css'

function ProductConfiguratorComponent() {
  const [config, setConfig] = useState<Record<string, string | number>>({
    metal: "silver",
    purity: "585",
    stones: 3,
    size: 18,
    comfort: "standard"
  })
  const [isShapeDiverActive, setIsShapeDiverActive] = useState(false)
  const [isShapeDiverLoading, setIsShapeDiverLoading] = useState(true)
  const [shapeDiverError, setShapeDiverError] = useState<string | null>(null)
  const [currentWeight, setCurrentWeight] = useState<number | null>(null)
  const paramsRef = useRef<HTMLDivElement>(null)
  const sessionManagerRef = useRef<any>(null)

  // Callback to handle ShapeDiver initialization
  const handleShapeDiverInit = useCallback((sessionManager: any) => {
    console.log('ShapeDiver initialized, setting active state');
    sessionManagerRef.current = sessionManager;
    
    // Set up weight update handler
    if (sessionManager) {
      sessionManager.weightUpdateHandler = (weight: number) => {
        console.log('Weight update received:', weight);
        setCurrentWeight(weight);
      };
    }
    
    // Check if the session manager actually has parameters
    if (sessionManager && sessionManager.parameters && Object.keys(sessionManager.parameters).length > 0) {
      console.log('ShapeDiver has parameters, activating');
      setIsShapeDiverActive(true);
      setIsShapeDiverLoading(false);
      setShapeDiverError(null);
    } else {
      console.log('ShapeDiver initialized but no parameters found, using fallback');
      setIsShapeDiverActive(false);
      setIsShapeDiverLoading(false);
      setShapeDiverError('ShapeDiver initialized but no parameters available. Using fallback configuration.');
    }
  }, []);

  // Effect to handle session manager updates
  useEffect(() => {
    if (sessionManagerRef.current) {
      console.log('Session manager available:', sessionManagerRef.current);
      // Double-check if parameters are actually available
      if (sessionManagerRef.current.parameters && Object.keys(sessionManagerRef.current.parameters).length === 0) {
        console.log('Session manager has no parameters, switching to fallback');
        setIsShapeDiverActive(false);
        setShapeDiverError('No ShapeDiver parameters found. Using fallback configuration.');
      }
    }
  }, [sessionManagerRef.current]);

  // Effect to handle ShapeDiver loading timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isShapeDiverActive && isShapeDiverLoading) {
        console.log('ShapeDiver loading timeout - falling back to React parameters');
        setIsShapeDiverLoading(false);
        setShapeDiverError('ShapeDiver parameters failed to load. Using fallback configuration.');
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isShapeDiverActive, isShapeDiverLoading]);



  const getWeight = () => {
    // If we have a state weight from ShapeDiver, use it
    if (currentWeight !== null && currentWeight !== undefined) {
      return currentWeight;
    }
    
    // If ShapeDiver is active and we have weight data, use it
    if (isShapeDiverActive && sessionManagerRef.current?.weight !== null && sessionManagerRef.current?.weight !== undefined) {
      return sessionManagerRef.current.weight;
    }
    
    // Fallback to calculated weight based on configuration
    let baseWeight = productConfigurator.baseWeight;
    productConfigurator.parameters.forEach(param => {
      if (param.options) {
        const selectedOption = param.options.find(opt => opt.value === config[param.id])
        if (selectedOption && selectedOption.weightModifier) {
          baseWeight += selectedOption.weightModifier;
        }
      } else if (param.id === 'stones') {
        baseWeight += ((config.stones as number) - 1) * (param.weightPerStone ?? 0);
      } else if (param.id === 'size') {
        // Adjust weight based on ring size (larger size = more material)
        const sizeDiff = (config.size as number) - 18; // 18mm is base size
        baseWeight += sizeDiff * 0.1;
      }
    });
    
    // Round to 3 decimal places
    return Math.round(baseWeight * 1000) / 1000;
  }

  const updateConfig = (paramId: string, value: string | number) => {
    setConfig(prev => {
      const newVal = typeof prev[paramId] === 'number' ? Number(value) : value
      return { ...prev, [paramId]: newVal }
    })
    
    // Update WebGI model if session manager is available
    if (sessionManagerRef.current) {
      const parameters: { [key: string]: string } = {}
      parameters[paramId] = value.toString()
      sessionManagerRef.current.customizeSession(parameters)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Preview */}
      <div className="space-y-6">
        <Card className="overflow-hidden bg-slate-800 border-slate-700">
          <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800">
            <WebgiViewer paramsRef={paramsRef} setSessionManager={handleShapeDiverInit} />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">{productConfigurator.name}</h3>
                <p className="text-slate-300">Individualiai konfigūruojamas</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-amber-400">{getWeight()}g</div>
                <div className="text-sm text-slate-400">svoris</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="fix-1a2b3c">
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="w-5 h-5 text-amber-400" />
              Svoris keičiasi realiu laiku
            </CardTitle>
          </CardHeader>
          <CardContent className="fix-1a2b3c">
            <p className="text-slate-300">
              Svoris automatiškai atnaujinamas pagal jūsų pasirinkimus ir 3D modelio geometriją.
              Tikslus svoris priklauso nuo pasirinktų parametrų ir medžiagų.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Panel */}
      <div className="space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="fix-1a2b3c">
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="w-5 h-5 text-amber-400" />
              Konfigūratorius
            </CardTitle>
            <CardDescription className="text-slate-300">
              {isShapeDiverLoading 
                ? "Kraunami ShapeDiver parametrai..."
                : isShapeDiverActive 
                ? "ShapeDiver parametrai - keiskite 3D modelį realiu laiku"
                : "Pritaikykite žiedą pagal savo pageidavimus. Spustelėkite info piktogramas daugiau informacijos."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ShapeDiver parameters container */}
            <div ref={paramsRef} className="shapediver-params-container" />
            
            {/* Loading state */}
            {isShapeDiverLoading && (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
                <span className="ml-3 text-slate-300">Kraunami parametrai...</span>
              </div>
            )}
            
            {/* Error state */}
            {shapeDiverError && (
              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{shapeDiverError}</p>
              </div>
            )}
            
            {/* Fallback React parameters - only show when ShapeDiver is not active */}
            {!isShapeDiverActive && !isShapeDiverLoading && productConfigurator.parameters.map((param) => (
              <div key={param.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="text-amber-400">{param.icon}</div>
                  <span className="font-medium text-white">{param.name}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-300 hover:text-white hover:bg-slate-700">
                          <Info className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs bg-slate-800 border-slate-600 text-white">
                        <p>{param.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-300 hover:text-white hover:bg-slate-700">
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-slate-800 border-slate-600">
                      <DialogHeader className="fix-1a2b3c">
                        <DialogTitle className="flex items-center gap-2 text-white">
                          <div className="text-amber-400">{param.icon}</div>
                          {param.name}
                        </DialogTitle>
                        <DialogDescription className="text-slate-300">
                          {param.detailedInfo}
                        </DialogDescription>
                      </DialogHeader>
                      {param.options && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-white">Galimi pasirinkimai:</h4>
                          {param.options.map((option) => (
                            <div key={option.value} className="p-3 border border-slate-600 rounded-lg bg-slate-700">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium text-white">{option.label}</div>
                                  <div className="text-sm text-slate-300">{option.description}</div>
                                </div>
                                {/* Weight information could be added here if needed */}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>

                {param.options ? (
                  <Select value={config[param.id]} onValueChange={(value: string) => updateConfig(param.id, value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {param.options.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                          <div className="flex justify-between items-center w-full">
                            <span>{option.label}</span>
                            {/* Weight information could be added here if needed */}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-300">
                        {param.id === 'stones' ? `${config[param.id]} ${config[param.id] === 1 ? 'akmuo' : 'akmenys'}` : 
                         param.id === 'size' ? `${config[param.id]} mm` : config[param.id]}
                      </span>
                      {param.id === 'stones' && Number(config[param.id]) > 1 && (
                        <Badge variant="secondary" className="bg-amber-500 text-slate-900">+{(Number(config[param.id]) - 1) * (param.weightPerStone ?? 0.3)}g</Badge>
                      )}
                    </div>
                    <Slider
                      value={[config[param.id]]}
                      defaultValue={[config[param.id]]}
                      onValueChange={(value: any) => updateConfig(param.id, value[0])}
                      min={param.min}
                      max={param.max}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{param.min}</span>
                      <span>{param.max}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Button variant="default" size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Įdėti į krepšelį - {getWeight()}g
        </Button>
        
        {/* Debug section */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="fix-1a2b3c">
            <CardTitle className="text-white">Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-slate-300">
              <p><strong>ShapeDiver Active:</strong> {isShapeDiverActive ? 'Yes' : 'No'}</p>
              <p><strong>ShapeDiver Loading:</strong> {isShapeDiverLoading ? 'Yes' : 'No'}</p>
              <p><strong>Session Manager:</strong> {sessionManagerRef.current ? 'Available' : 'Not available'}</p>
              <p><strong>Current Weight:</strong> {getWeight()}g</p>
              <p><strong>ShapeDiver Weight:</strong> {sessionManagerRef.current?.weight ? `${sessionManagerRef.current.weight}g` : 'Not available'}</p>
              <p><strong>Parameters Container:</strong> {paramsRef.current ? 'Found' : 'Not found'}</p>
              {paramsRef.current && (
                <p><strong>Container Children:</strong> {paramsRef.current.children.length}</p>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={() => {
                console.log('=== DEBUG INFO ===');
                console.log('ShapeDiver Active:', isShapeDiverActive);
                console.log('ShapeDiver Loading:', isShapeDiverLoading);
                console.log('Session Manager:', sessionManagerRef.current);
                console.log('Current Weight:', getWeight());
                console.log('ShapeDiver Weight:', sessionManagerRef.current?.weight);
                console.log('Params Ref:', paramsRef.current);
                
                if (paramsRef.current) {
                  console.log('Container children:', paramsRef.current.children);
                  console.log('Container HTML:', paramsRef.current.innerHTML);
                }
                
                const tweakpaneContainer = document.querySelector('#tweakpaneUiContainer');
                const tpContainer = document.querySelector('.tp-container');
                const tpRoot = document.querySelector('.tp-root');
                const tpRotv = document.querySelectorAll('.tp-rotv');
                
                console.log('DOM Elements:');
                console.log('- tweakpaneUiContainer:', tweakpaneContainer);
                console.log('- tp-container:', tpContainer);
                console.log('- tp-root:', tpRoot);
                console.log('- tp-rotv count:', tpRotv.length);
                
                if (tpRotv.length > 0) {
                  console.log('Parameter elements:');
                  Array.from(tpRotv).forEach((el, index) => {
                    const label = el.querySelector('.tp-lblv_l');
                    console.log(`  ${index + 1}. ${label?.textContent || 'Unknown'}`);
                  });
                }
              }}
            >
              Log Debug Info
            </Button>
            
            {/* Test parameter update button */}
            {sessionManagerRef.current && (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => {
                  console.log('=== TESTING PARAMETER UPDATE ===');
                  const testParams = {
                    plotis: '5.5',
                    storis: '2.0',
                    aukstis: '3.0'
                  };
                  console.log('Testing with parameters:', testParams);
                  
                  sessionManagerRef.current.customizeSession(testParams)
                    .then(() => {
                      console.log('Parameter update test successful');
                    })
                    .catch((error: any) => {
                      console.error('Parameter update test failed:', error);
                    });
                }}
              >
                Test Parameter Update
              </Button>
            )}
            
            {/* Test weight setting button */}
            {sessionManagerRef.current && (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => {
                  console.log('=== TESTING WEIGHT SETTING ===');
                  // Set the weight from your ShapeDiver output
                  sessionManagerRef.current.setWeight(11.260800155639647);
                  console.log('Weight set to 11.261g');
                }}
              >
                Set Test Weight (11.261g)
              </Button>
            )}
            
            {/* Test weight update callback */}
            {sessionManagerRef.current && (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => {
                  console.log('=== TESTING WEIGHT UPDATE CALLBACK ===');
                  // Simulate weight update through callback
                  if (sessionManagerRef.current.weightUpdateHandler) {
                    sessionManagerRef.current.weightUpdateHandler(11.260800155639647);
                  }
                }}
              >
                Test Weight Callback
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function App() {
  const [selectedStep, setSelectedStep] = useState(1)
  const [viewMode, setViewMode] = useState('guide') // 'guide', 'overview', 'configurator'

  const currentStep = learningSteps.find(step => step.id === selectedStep)

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <header className="bg-slate-800/95 backdrop-blur-sm shadow-lg border-b border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-slate-900 font-bold text-xl">J</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    JOAZE.LT
                  </h1>
                  <p className="text-sm text-slate-300">Interaktyvus vartotojo vadovas</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'overview' ? 'default' : 'outline'}
                  size="default"
                  className={viewMode === 'overview' ? 'bg-amber-500 hover:bg-amber-600 text-slate-900' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
                  onClick={() => setViewMode('overview')}
                >
                  Apžvalga
                </Button>
                <Button
                  variant={viewMode === 'guide' ? 'default' : 'outline'}
                  size="default"
                  className={viewMode === 'guide' ? 'bg-amber-500 hover:bg-amber-600 text-slate-900' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
                  onClick={() => setViewMode('guide')}
                >
                  Detalūs žingsniai
                </Button>
                <Button
                  variant={viewMode === 'configurator' ? 'default' : 'outline'}
                  size="default"
                  className={viewMode === 'configurator' ? 'bg-amber-500 hover:bg-amber-600 text-slate-900' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
                  onClick={() => setViewMode('configurator')}
                >
                  Konfigūratorius
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {viewMode === 'overview' && (
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-white text-center">Mokymosi Vadovo Apžvalga</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningSteps.map((step: LearningStep) => (
                  <Card 
                    key={step.id} 
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-slate-800 border-slate-700 hover:border-amber-500/50 hover:bg-slate-750"
                    onClick={() => {
                      setSelectedStep(step.id);
                      setViewMode('guide');
                    }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">{step.id}. {step.title}</CardTitle>
                      <div className="text-amber-400">{step.icon}</div>
                    </CardHeader>
                    <CardContent className="fix-1a2b3c">
                      <p className="text-sm text-slate-300">{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button 
                  variant="default"
                  size="lg" 
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                  onClick={() => {
                    // Create a comprehensive text file with all learning steps
                    const guideContent = `JOAZE.LT - Interaktyvus Vartotojo Vadovas
==================================================

${learningSteps.map((step: LearningStep) => `
${step.id}. ${step.title}
${'='.repeat(step.title.length + 3)}

${step.description}

${step.content}

Video: ${step.videoUrl || 'Nėra vaizdo įrašo'}

${'='.repeat(50)}
`).join('\n')}

© ${new Date().getFullYear()} JOAZE.LT. Visos teisės saugomos.`;

                    const blob = new Blob([guideContent], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'JOAZE_Vartotojo_Vadovas.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                    <Download className="w-5 h-5 mr-2" />
                  Atsisiųsti Vadovą (TXT)
                </Button>
              </div>
            </div>
          )}

          {viewMode === 'guide' && currentStep && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sidebar Navigation */}
              <aside className="lg:col-span-1">
                <Card className="sticky top-24 bg-slate-800 border-slate-700">
                  <CardHeader className="fix-1a2b3c">
                    <CardTitle className="text-white">Mokymosi Žingsniai</CardTitle>
                  </CardHeader>
                  <CardContent className="fix-1a2b3c">
                    <nav>
                      <ul className="space-y-2">
                        {learningSteps.map((step: LearningStep) => (
                          <li key={step.id}>
                            <Button
                              variant={selectedStep === step.id ? 'default' : 'ghost'}
                              size="lg"
                              className={`w-full justify-start ${
                                selectedStep === step.id 
                                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-900' 
                                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                              }`}
                              onClick={() => setSelectedStep(step.id)}
                            >
                              {step.id}. {step.title}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </CardContent>
                </Card>
              </aside>

              {/* Step Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="fix-1a2b3c">
                    <CardTitle className="text-2xl font-bold text-white">{currentStep.id}. {currentStep.title}</CardTitle>
                    <CardDescription className="text-slate-300">{currentStep.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {currentStep.videoUrl && (
                      <div className="video-responsive rounded-lg overflow-hidden shadow-xl">
                        <iframe
                          src={currentStep.videoUrl}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={currentStep.title}
                        ></iframe>
                      </div>
                    )}

                    <div className="prose prose-invert max-w-none">
                      <p className="text-slate-200 leading-relaxed">{currentStep.content}</p>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                        onClick={() => setSelectedStep(prev => prev - 1)}
                        disabled={selectedStep === 1}
                      >
                        <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                        Ankstesnis žingsnis
                      </Button>
                      <Button 
                        variant="default"
                        size="lg"
                        className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                        onClick={() => setSelectedStep(prev => prev + 1)}
                        disabled={selectedStep === learningSteps.length}
                      >
                        Kitas žingsnis
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {viewMode === 'configurator' && (
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-white text-center">Produkto Konfigūratorius</h2>
              <ProductConfiguratorComponent />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8 mt-12 border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-slate-300">&copy; {new Date().getFullYear()} JOAZE.LT. Visos teisės saugomos.</p>
            <p className="text-sm text-slate-400 mt-2">Sukurta su meile ir AI</p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App


