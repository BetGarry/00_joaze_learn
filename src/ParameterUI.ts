import { IParameterApi } from "@shapediver/viewer.session";
import type {IUiConfigContainer, UiObjectConfig} from "webgi";

/**
 * Uses the parameters of the initial responseDto to create an UI
 *
 * onchange listeners are connected to the provided callback
 */
export class ParameterUI implements IUiConfigContainer{
  readonly parameterValues: { [key: string]: string } = {};

  uiConfig: UiObjectConfig;
  constructor(
    parameters: {
      [id: string]: IParameterApi<unknown>;
    },
    parameterUpdateCallback: (parameters: {
      [key: string]: string;
    }) => Promise<void>
  ) {
    console.log('ParameterUI constructor called with parameters:', parameters);
    console.log('Number of parameters:', Object.keys(parameters).length);

    this.uiConfig = {
      type: "folder",
      label: "parametrai",
      expanded: true,
      children: [],
    }

    let props: {
      [key: string]: any
    } = {};

    for (let p in parameters) {
      // get the parameter and assign the properties
      const parameterObject = parameters[p];
      const description = (parameterObject as any).description as string | undefined;
      
      console.log(`Processing parameter ${p}:`, {
        name: parameterObject.name,
        type: parameterObject.type,
        hidden: parameterObject.hidden,
        defval: parameterObject.defval
      });
      
      if(parameterObject.hidden === true) {
        console.log(`Skipping hidden parameter: ${p}`);
        continue;
      }

      this.parameterValues[parameterObject.id] = parameterObject.defval;
      props[p] = parameterObject.defval;

      if (
        parameterObject.type === "Int" ||
        parameterObject.type === "Float" ||
        parameterObject.type === "Even" ||
        parameterObject.type === "Odd"
      ) {
        // cast to number
        props[p] = +parameterObject.defval;

        // calculate stepSize
        let stepSize = 1;
        if (parameterObject.type === "Int")
          stepSize = 1;
        else if (parameterObject.type === "Even" ||parameterObject.type === "Odd")
          stepSize = 2;
        else
          stepSize = 1 / Math.pow(10, parameterObject.decimalplaces!);

        const sliderConfig = {
          uuid: parameterObject.id,
          type: "slider",
          label: parameterObject.name,
          tooltip: description,
          property: [props, p] as [any, string],
          bounds: [parameterObject.min!, parameterObject.max!],
          stepSize,
          onChange: (ev:any) => {
            console.log(`Slider onChange for ${parameterObject.id}:`, {
              event: ev,
              value: props[p],
              last: ev.last,
              type: typeof ev.last
            });
            
            // Always update the parameter value, not just on last event
            const newValue = parameterObject.decimalplaces !== undefined ? 
              Number(props[p]).toFixed(parameterObject.decimalplaces) : 
              props[p].toString();
            
            this.parameterValues[parameterObject.id] = newValue;
            console.log(`Updated parameter ${parameterObject.id} to:`, newValue);
            
            // Call the update callback
            parameterUpdateCallback(this.parameterValues).catch(error => {
              console.error(`Error updating parameter ${parameterObject.id}:`, error);
            });
          }
        };
        
        console.log(`Adding slider for parameter ${p}:`, sliderConfig);
        this.uiConfig.children?.push(sliderConfig);
        
      } else if (parameterObject.type === "Bool") {
        // cast to bool
        props[p] = parameterObject.defval === "true";

        const checkboxConfig = {
          uuid: parameterObject.id,
          type: "checkbox",
          label: parameterObject.name,
          tooltip: description,
          property: [props, p] as [any, string],
          onChange: () => {
            console.log(`Checkbox onChange for ${parameterObject.id}:`, {
              value: props[p],
              type: typeof props[p]
            });
            
            this.parameterValues[parameterObject.id] = props[p].toString();
            console.log(`Updated parameter ${parameterObject.id} to:`, props[p]);
            
            parameterUpdateCallback(this.parameterValues).catch(error => {
              console.error(`Error updating parameter ${parameterObject.id}:`, error);
            });
          }
        };
        
        console.log(`Adding checkbox for parameter ${p}:`, checkboxConfig);
        this.uiConfig.children?.push(checkboxConfig);
        
      } else if (parameterObject.type === "String") {
        const inputConfig = {
          uuid: parameterObject.id,
          type: "input",
          label: parameterObject.name,
          tooltip: description,
          property: [props, p] as [any, string],
          onChange: () => {
            console.log(`Input onChange for ${parameterObject.id}:`, {
              value: props[p],
              type: typeof props[p]
            });
            
            this.parameterValues[parameterObject.id] = props[p].toString();
            console.log(`Updated parameter ${parameterObject.id} to:`, props[p]);
            
            parameterUpdateCallback(this.parameterValues).catch(error => {
              console.error(`Error updating parameter ${parameterObject.id}:`, error);
            });
          }
        };
        
        console.log(`Adding input for parameter ${p}:`, inputConfig);
        this.uiConfig.children?.push(inputConfig);
        
      } else if (parameterObject.type === "Color") {
        const colorConfig = {
          uuid: parameterObject.id,
          type: "color",
          label: parameterObject.name,
          tooltip: description,
          property: [props, p] as [any, string],
          onChange: (ev: any) => {
            console.log(`Color onChange for ${parameterObject.id}:`, {
              event: ev,
              value: props[p],
              last: ev.last
            });
            
            // Only update on last event for color picker
            if(!ev.last) return;
            
            const newValue = props[p].replace("#", "0x");
            this.parameterValues[parameterObject.id] = newValue;
            console.log(`Updated parameter ${parameterObject.id} to:`, newValue);
            
            parameterUpdateCallback(this.parameterValues).catch(error => {
              console.error(`Error updating parameter ${parameterObject.id}:`, error);
            });
          }
        };
        
        console.log(`Adding color picker for parameter ${p}:`, colorConfig);
        this.uiConfig.children?.push(colorConfig);
        
      } else if (parameterObject.type === "StringList") {
        // cast to number
        props[p] = +parameterObject.defval;

        const children: (UiObjectConfig<any> | (() => UiObjectConfig<any> | UiObjectConfig<any>[]))[] | undefined = [];
        for (let j = 0; j < parameterObject.choices!.length; j++) {
          children.push({
            label: parameterObject.choices![j],
            value: j,
          })
        }

        const dropdownConfig = {
          uuid: parameterObject.id,
          type: "dropdown",
          label: parameterObject.name,
          tooltip: description,
          property: [props, p] as [any, string],
          children,
          onChange: () => {
            console.log(`Dropdown onChange for ${parameterObject.id}:`, {
              value: props[p],
              type: typeof props[p]
            });
            
            this.parameterValues[parameterObject.id] = props[p].toString();
            console.log(`Updated parameter ${parameterObject.id} to:`, props[p]);
            
            parameterUpdateCallback(this.parameterValues).catch(error => {
              console.error(`Error updating parameter ${parameterObject.id}:`, error);
            });
          }
        };
        
        console.log(`Adding dropdown for parameter ${p}:`, dropdownConfig);
        this.uiConfig.children?.push(dropdownConfig);
      }
    }
    
    console.log('Final uiConfig:', this.uiConfig);
    console.log('Number of children in uiConfig:', this.uiConfig.children?.length || 0);
  }
} 