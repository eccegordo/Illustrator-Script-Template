//////////////////////////////////////////////////////////////////////////////// 
// NAME: Measurement
// PURPOSE: Measure selection on screen and place marks indicating measurement
// CREATOR: gordon@gordonpotter.com
// LICENSE: MIT 
// Copyright (c) 2010 Gordon Potter
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
////////////////////////////////////////////////////////////////////////////////


function theScript() {
///////////////////////////////////////////////////
// BEGIN THE SCRIPT
//=================================================



////////////////////////////////////////////////////////////////////////////////
// INITIAL REQUIREMENTS
////////////////////////////////////////////////////////////////////////////////

// Require open document
try {
	if (app.documents.length > 0 ) {
        
        // OK to proceed to arguments setup and run main function
        
     var args = {};   
         args.SCRIPT_NAME = "MEASUREMENT";
         args.DOC_REF = app.activeDocument;
         args.SELECTION = args.DOC_REF.selection;
         args.ACTIVE_LAYER = args.DOC_REF.activeLayer;
         args.ACTIVE_LAYER_NAME = args.ACTIVE_LAYER.name;       
      
     // Call the main function
     main(args);

	}
	else {
        throw new Error('There are no documents open!');
	}
}
catch(e) {
	alert( e.message, "Script Alert", true);
}

////////////////////////////////////////////////////////////////////////////////
// SCRIPT MAIN PROCESS
////////////////////////////////////////////////////////////////////////////////
// Main Process
// The beginning of the script starts here
// Add main logic routine to this function

function main(args){

    var selectedItem = args.DOC_REF.selection[0];
    var selectionName;
    
    if (selectedItem.name) {
        // Use name
        selectionName = selectedItem.name;
    }
    else {
        // Use type because name property is empty
        selectionName = selectedItem.typename;        
    }
        


 var myDialog = sfDialogFactory(mainDialog(selectionName));
 
 myDialog.show();
}

////////////////////////////////////////////////////////////////////////////////
// SCRIPT SUPPORTING FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
// Supporting Functions
// Include functions that offer partial functionality
// These functions are called and acted upon within the mainProcess function

function objReflection(obj, display) {
    // Function for easy object reflection
    // USAGE EXAMPLE:
    // var objectInfo = objReflection(someObject, "none");
    // or    
    // objReflection(someObject, "alert");

    var KVOs = [];
    for(var member in obj){ 
        KVOs.push("\n" + member + ":" + obj[member]);
    };

    switch(display)
    {
        case "alert":
            alert("Object Reflection: " + KVOs); 
        break;
        case "none":
        break;        
        default:
            return undefined;                       
    }
    return KVOs;
}

function sfDialogFactory(dialog) {
  
    // A factory method for creating dialog screens
    
    // Dialog Window
    var d = new Window("dialog", dialog.title);

    // alert("Number of Inputs" + dialog.inputs.length);
    // alert("Number of Options" + dialog.options.length);

    var i; // counter 
    var len; // length of array elements

    // Generate Groups
    if (dialog.groups.length > 0) {
           
        len = dialog.groups.length;
        for (i = 0; i < len; i++ ) 
        {
            var currentGroup = dialog.groups[i];
            var inputGroup = d.add ("panel", undefined, currentGroup.title);
                inputGroup.alignChildren = ["fill","fill"];                

            if (currentGroup.elements.length > 0) {
                // Add Elements                
                var ii;
                var elemLen = currentGroup.elements.length;
                for (ii = 0; ii < elemLen; ii++ ) 
                {
                    var currentElement = currentGroup.elements[ii];

                    var el = inputGroup.add(currentElement.type, undefined, currentElement.value);

                    // Additional properties added for future reflection
                    el.elName = currentElement.name;
                    el.elIndex = ii;   

                    switch(currentElement.type)
                    {
                        case "statictext":
                            el.visible = currentElement.visible;
                        break;
                        case "edittext":
                            el.visible = currentElement.visible;                           
                        break; 
                        case "dropdownlist":
                            el.visible = currentElement.visible;
                            el.selection = currentElement.selection;
                            el.onChange = currentElement.onChange;
                        break;                         
                        default:
                        throw new Error('Unknown Dialog Element Type');                        
                    }

                }                
            }
        }
    }

    function getControlValues(set) {
        var elementsData = {};
        elementsData.controls = [];      
        // TO DO Add more types

        var giLen = set.children.length;
        for (var gi = 0; gi < giLen; gi++ ) 
        {
            var child = set.children[gi];
            // alert(objReflection(child, "none", false));
            // alert(child.type);    
            var control = {};
                control.name = child.elName;
                control.index = child.elIndex;                
                control.type = child.type;
                control.visible = child.visible;
            switch(child.type)
            {
                case "statictext":
                    control.value = child.text;                
                break;
                case "edittext":
                    control.value = child.text;                   
                break; 
                case "dropdownlist":                 
                    control.value = child.selection.text; 
                break;                         
                default:
                throw new Error('Unknown Dialog Element Type');                        
            }
            elementsData.controls.push(control);
            // alert(objReflection(control, "none", false));
        }   
        return elementsData;
    }


  // Buttons Group
  var buttonGroup = d.add("group");
  var bOK = buttonGroup.add("button", undefined, "Continue"); 
  var bCANCEL = buttonGroup.add("button", undefined, "Cancel");

      // Button Click Handlers
      bOK.onClick = function(){
          d.close();
          dialog.callback("continue", getControlValues(inputGroup));
          return true;
      }; 
      bCANCEL.onClick = function (){
          d.close();
          dialog.callback("cancel");
          return false;            
      };

  return d;
}

function mainDialog(selectionName) {

// Main Dialog

  var dialogObj = {};

  dialogObj.groups = [];  // An array of dialog groups
  dialogObj.title = "Measurement";

  var group1 = {};
  group1.title = "Take Measurement";
  
  //  Add Elements using JSON shorthand syntax
  group1.elements = [
    {
        "name":"MeasureSelectedItem",
        "type":"statictext",
        "value":"Measure Selected Item?",
        "visible":true        
    },
    {
        "name":"Selected",        
        "type":"statictext",
        "value":"Selected: " + selectionName,
        "visible":true
    },
    {
        "name":"UnitOfMeasurement",          
        "type":"statictext",
        "value":"Unit of Measurement",
        "visible":true
    },
    {
        "name":"UnitType",           
        "type":"dropdownlist",
        "value":["inches","points","millimeters","centimeters","picas","pixels"], 
        "visible":true,        
        "selection":0,         
        // "onChange":function(){ alert("My Drop Downdown change"); return true;}
    },
    {
        "name":"ScreenDPI",          
        "type":"statictext",
        "value":"Screen DPI (if measuring in pixels)",
        "visible":true
    },
    {
        "name":"ScreenDPIValue",
        "type":"edittext",
        "value":150,
        "visible":true        
    },
    {
        "name":"ColorOfMeasurement",         
        "type":"statictext",
        "value":"Color Of Measurement Lines",
        "visible":true
    },
    {
        "name":"ColorType",            
        "type":"dropdownlist",
        "value":["MAGENTA","CYAN","RED","WHITE","BLACK"], 
        "visible":true,        
        "selection":0,         
        // "onChange":function(){ alert("My Drop Downdown change"); return true;}
    },
    {
        "name":"ColorModeOfMeasurement",         
        "type":"statictext",
        "value":"Color Mode",
        "visible":true
    },
    {
        "name":"ColorMode",            
        "type":"dropdownlist",
        "value":["CMYK","RGB"], 
        "visible":true,        
        "selection":0,         
        // "onChange":function(){ alert("My Drop Downdown change"); return true;}
    },
    {
        "name":"MarkerOffset",         
        "type":"statictext",
        "value":"Amount to offset measurement marks",
        "visible":true
    },
    {
        "name":"MarkerOffsetValue",            
        "type":"dropdownlist",
        "value":[0,5,10,20], 
        "visible":true,        
        "selection":1,         
        // "onChange":function(){ alert("My Drop Downdown change"); return true;}
    }

  ];


  // Add to group list
  dialogObj.groups.push(group1);    
  
  dialogObj.callback = function(type, formData) {
    if (type === "continue"){
        var unit;
        var screenDPI;
        var color;
        var colorMode;
        var markerOffset;

      // Do something with formData values here 
        var cLen = formData.controls.length;
        var formValues = '';
        for (var c = 0; c < cLen; c++ ) 
        {
            if (formData.controls[c].name === "UnitType") {
                unit = formData.controls[c].value;
            }
            if (formData.controls[c].name === "ScreenDPIValue") {
                screenDPI = formData.controls[c].value;
            }        
            if (formData.controls[c].name === "ColorType") {
                color = formData.controls[c].value;
            }
            if (formData.controls[c].name === "ColorMode") {
                colorMode = formData.controls[c].value;
            }    
            if (formData.controls[c].name === "MarkerOffsetValue") {
                markerOffset = formData.controls[c].value;
            }            
        }            
      takeMeasurement(args.DOC_REF, unit, screenDPI, color, colorMode, markerOffset);
    }
    else {
      // Cancel
      return false;
    }    
  }
  
  return dialogObj;
}


function findLayerContext(obj) {

    // alert("findLayerContext: \n" + obj.name + "\n" + obj.typename); 
    var theContext = undefined;     

    if (obj.layers) {
       // alert("USING OBJECT FOR LAYER CONTEXT..."); 
       theContext = obj;
    }
    else {
        // alert("SEARCHING PARENTS FOR LAYER..."); 
        theContext = findLayerContext(obj.parent);
    }
    return theContext;
}    

function takeMeasurement(doc_ref, unit, screenDPI, colorName, colorMode, markerOffset) {

    //  alert("takeMeasurement: \n" + "[markerOffset] " + markerOffset);  

    var selectedItem = doc_ref.selection[0];
    
    if (selectedItem) {
        var referenceContext = findLayerContext(selectedItem);         
    }
    else {    
        alert("You must select an item before taking a measurement.");        
        return false;        
    }

    var myBounds = selectedItem.geometricBounds;

    // Set up X and Y co-ordinates
    var x1 = myBounds[0];
    var x2 = myBounds[2];
    var y1 = myBounds[1];
    var y2 = myBounds[3];

    // Set up data for the Measurements
    var ptWidth = myBounds[2] - myBounds[0];
    var ptHeight = myBounds[1] - myBounds[3];

    // The default unit is points
    // Default values
    var tmpWidth = ptWidth;
    var tmpHeight = ptHeight;
    var unitSuffix = "pts";
    var unitSuffixSingular = "pt";

    // Convert the unit of measure depending on the setting.
    // Adobe Illustrator Measures everything in Points. Use the following conversion formulas
    //
    // Unit Conversion formula
    //  centimeters   28.346 points   = 1 centimeter
    //  inches	    72 points       = 1 inch
    //  millimeters   2.834645 points = 1 millimeter
    //  picas	     12 points       = 1 pica
    //  Qs	        1 Q (1 Q equals 0.23 millimeter)
    //  pixels conversion 
    //      points = (pixels / 150) * 72    assuming 150dpi system

    switch(unit)
    {
        case "points":
            tmpWidth = ptWidth;
            tmpHeight = ptHeight;            
            unitSuffix = "pts";
            unitSuffixSingular = "pt";
          break;
        case "millimeters":
            tmpWidth = Math.round(ptWidth / 0.02834645);
            tmpHeight = Math.round(ptHeight / 0.02834645);
            unitSuffix = "mm";
            unitSuffixSingular = "mm";            
          break;
        case "centimeters":
            tmpWidth = Math.round(ptWidth / 0.2834645);
            tmpHeight = Math.round(ptHeight / 0.2834645);
            unitSuffix = "cm";
            unitSuffixSingular = "cm";            
          break;
        case "picas":
            tmpWidth = Math.round(ptWidth / 0.12);
            tmpHeight = Math.round(ptHeight / 0.12);
            unitSuffix = "picas";
            unitSuffixSingular = "pica";            
          break;
        case "inches":
            tmpWidth = Math.round(ptWidth / 0.72);
            tmpHeight = Math.round(ptHeight / 0.72);
            unitSuffix = "inches";
            unitSuffixSingular = "inch";            
          break;

        case "pixels":
            tmpWidth = Math.round(ptWidth / 0.72);
            tmpHeight = Math.round(ptHeight / 0.72);
            var dpi = parseInt(screenDPI);            
            tmpWidth = tmpWidth * dpi;            
            tmpHeight = tmpHeight * dpi;            
            unitSuffix = "pixels (" + dpi + " dpi)";
            unitSuffixSingular = "pixel (" + dpi + " dpi)";            
          break;

        default:
            tmpWidth = ptWidth;
            tmpHeight = ptHeight;
            unitSuffix = "pts";
            unitSuffixSingular = "pt";            
    }

    var finalWidth = tmpWidth / 100;
    var finalHeight = tmpHeight / 100;

    // Find Centre of Object
    var xCentre = x1 + (ptWidth / 2);
    var yCentre = y1 - (ptHeight / 2);

    var colorObj = getColorByName(colorMode, colorName);         
     
    // Make the dimension lines 
    makeDimensions(doc_ref, myBounds, referenceContext, colorObj, markerOffset);

    function makeDimensions(doc_ref, objBounds, context, measurementColor, lineOffset) {

        // alert("makeDimensions: \n" + "[lineOffset] " + lineOffset);  
        var x1 = objBounds[0];
        var x2 = objBounds[2];
        var y1 = objBounds[1];
        var y2 = objBounds[3];


        // Create Measurements Layer
        var measurementLayerName = "MEASUREMENT OF ";
        
        if (selectedItem.name) {
            // Use name
            measurementLayerName = measurementLayerName + selectedItem.name;
        }
        else {
            // Use type because name property is empty
            measurementLayerName = measurementLayerName + selectedItem.typename;        
        }
            
        var theMeasurementLayer = measurementLayerCreate(context, measurementLayerName);

        // Create groups for Measurements
        var yMeasure = theMeasurementLayer.groupItems.add();
            yMeasure.name = "Height";

        var xMeasure = theMeasurementLayer.groupItems.add();
            xMeasure.name = "Width";

        var xLineOffset = parseInt(lineOffset);
        var yLineOffset = parseInt(lineOffset);

        var xLabelOffset = xLineOffset + 15;
        var yLabelOffset = yLineOffset + 3;

        // X Measurement Line and Endpoints
        var xLine1 = xMeasure.pathItems.add();
            xLine1.stroked = true;
            xLine1.strokeColor = measurementColor;
            xLine1.setEntirePath ([[x1,y1 + xLineOffset],[xCentre - 30,y1 + xLineOffset]]);

        var xLine2 = xMeasure.pathItems.add();
            xLine2.stroked = true;
            xLine2.strokeColor = measurementColor;            
            xLine2.setEntirePath ([[xCentre + 30,y1 + xLineOffset],[x2,y1 + xLineOffset]]);

        var xLineEnd1 = xMeasure.pathItems.add();
            xLineEnd1.stroked = true; 
            xLineEnd1.strokeColor = measurementColor;            
            xLineEnd1.setEntirePath ([[x1,y1 + (xLineOffset + 4)],[x1,y1 + (xLineOffset - 4)]]);

        var xLineEnd2 = xMeasure.pathItems.add();
            xLineEnd2.stroked = true;
            xLineEnd2.strokeColor = measurementColor;            
            xLineEnd2.setEntirePath ([[x2,y1 + (xLineOffset + 4)],[x2,y1 + (xLineOffset - 4)]]);

        // Y Measurement Line and Endpoints
        var yLine1 = yMeasure.pathItems.add();  
            yLine1.stroked = true;
            yLine1.strokeColor = measurementColor;            
            yLine1.setEntirePath ([[x2 + yLineOffset,y1],[x2 + yLineOffset,yCentre + 30]]);

        var yLine2 = yMeasure.pathItems.add();
            yLine2.stroked = true;
            yLine2.strokeColor = measurementColor;            
            yLine2.setEntirePath ([[x2 + yLineOffset,yCentre - 30],[x2 + yLineOffset,y2]]);

        var yLineEnd1 = yMeasure.pathItems.add();
            yLineEnd1.stroked = true;
            yLineEnd1.strokeColor = measurementColor;            
            yLineEnd1.setEntirePath ([[x2 + (yLineOffset - 4),y1],[x2 + (yLineOffset + 4),y1]]);

        var yLineEnd2 = yMeasure.pathItems.add();
            yLineEnd2.stroked = true;
            yLineEnd2.strokeColor = measurementColor;            
            yLineEnd2.setEntirePath ([[x2 + (yLineOffset - 4),y2],[x2 + (yLineOffset + 4),y2]]);



        // Create Text for X Measurement
        var xText = xMeasure.textFrames.add();
            if (finalWidth === 1) {
                xText.contents = finalWidth + " " + unitSuffixSingular;            
            }
            else {
                xText.contents = finalWidth + " " + unitSuffix;            
            }
            xText.top = y1 + xLabelOffset;            
            xText.left = xCentre;
            xText.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;

            for (i=0;i<xText.textRange.characters.length;i++) {
                xText.characters[i].characterAttributes.fillColor = measurementColor;
            }


        // Create Text for Y Measurement
        var yText = yMeasure.textFrames.add();
            if (finalHeight === 1) {
                yText.contents = finalHeight + " " + unitSuffixSingular;               
            }
            else {
                yText.contents = finalHeight + " " + unitSuffix;      
            }        
            yText.rotate (-90); //, true, false, false, false, Transformation.CENTER);
            yText.top = yCentre;
            yText.left = x2 + yLabelOffset;
            yText.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
            
            for (i=0;i<yText.textRange.characters.length;i++) {
                yText.characters[i].characterAttributes.fillColor = measurementColor;
            }
    }


    function measurementLayerCreate(context, layerName) {
        var measurementLayer = context.layers.add();
        measurementLayer.name = layerName;
        return measurementLayer;        
    }

} // END takeMeasurement()   


function getColorByName(type, name) {

   var color = undefined;

    // Color Type
    
    if (type == undefined) {       
        alert("ERROR: getColorByName[type not specified]");   
        return undefined;
    }
    else
    {
        if (type == "CMYK") {
            color = new CMYKColor();
            color = getCMYKColorByName(name);
            return color;
        }
        else if (type == "RGB") {
            color = new RGBColor();
            color = getRGBColorByName(name);
            return color;            
        }
        else {
            alert("ERROR: getColorByName[unknown type] " + type);               
            return undefined; 
        }
    }   
}   


function getCMYKColorByName(name) {

    // "MAGENTA","CYAN","RED","WHITE","BLACK"

   var colorDef = undefined;  
   switch(name)
   {     
        case "MAGENTA":
            colorDef = {C:0, M:100, Y:0, K:0};        
            break;       
        case "CYAN":
            colorDef = {C:100, M:0, Y:0, K:0};        
            break;
        case "RED":
            colorDef = {C:0, M:100, Y:100, K:0};        
            break; 
        case "WHITE":
            colorDef = {C:0, M:0, Y:0, K:0};        
            break;             
        case "BLACK":
            colorDef = {C:0, M:0, Y:0, K:100};        
            break;
        default:
            colorDef = {C:0, M:0, Y:0, K:100};               
   }

   var color = new CMYKColor();   
       color.cyan = colorDef.C; 
       color.magenta = colorDef.M; 
       color.yellow = colorDef.Y; 
       color.black = colorDef.K;   
       
   return color; 
}

function getRGBColorByName(name) {

    // "MAGENTA","CYAN","RED","WHITE","BLACK"
   var colorDef = undefined;  
   switch(name)
   {     
        case "MAGENTA":
            colorDef = {R:236, G:0, B:140};        
            break; 
        case "CYAN":
            colorDef = {R:0, G:174, B:239};        
            break;             
        case "RED":
            colorDef = {R:255, G:0, B:0};        
            break; 
        case "WHITE":
            colorDef = {R:255, G:255, B:255};   
            break;             
        case "BLACK":
            colorDef = {R:0, G:0, B:0};           
            break;
        default:
           colorDef = {R:0, G:0, B:0}; 
   }

   var color = new RGBColor();   
       color.red = colorDef.R; 
       color.green = colorDef.G; 
       color.blue = colorDef.B; 
       
   return color; 
}



//=================================================
// END THE SCRIPT
///////////////////////////////////////////////////
}

theScript();
