//////////////////////////////////////////////////////////////////////////////// 
// NAME: Template
// PURPOSE: Do Some Action...
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
     // 
     //    args.SCRIPT_NAME = "TEMPLATE";
     //    args.DOC_REF = app.activeDocument;
     //    args.SELECTION = args.DOC_REF.selection;
     //    args.ACTIVE_LAYER = args.DOC_REF.activeLayer;
     //    args.ACTIVE_LAYER_NAME = args.ACTIVE_LAYER.name;       
     // 
     //    // Call the main function
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
 var myDialog = sfDialogFactory(testDialog());
 
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
            alert("Object Relection: " + KVOs); 
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


function testDialog() {

// TEST CASE

  var dialogObj = {};

  dialogObj.groups = [];  // An array of dialog groups
  dialogObj.title = "Simple Dialog";

  var group1 = {};
  group1.title = "Some Group";
  
  //  Add Elements using JSON shorthand syntax
  group1.elements = [
    {
        "type":"statictext",
        "value":"Test 1",
        "visible":true        
    },
    {
        "type":"edittext",
        "value":"Test 2",
        "characters":20,
        "visible":true
    },
    {
        "type":"statictext",
        "value":"Test 2",        
        "visible":true        
    },
    {
        "type":"dropdownlist",
        "value":[1,2,3,4,5], 
        "visible":true,        
        "selection":0,         
        "onChange":function(){ alert("My Drop Downdown change"); return true;}
    },
    {
        "type":"statictext",
        "value":"Test 4",
        "visible":true        
    },
    {
        "type":"statictext",
        "value":"Test 5",
        "visible":true        
    },
    {
        "type":"statictext",
        "value":"Test 6",        
        "visible":true        
    },
    {
        "type":"statictext",
        "value":"Test 7",   
        "visible":true        
    },
    {
        "type":"statictext",
        "value":"Test 8",        
        "visible":true        
    },
  ];

  // Add to group list
  dialogObj.groups.push(group1);    
  
  dialogObj.callback = function(type, formData){

    alert("Callback FUNCTION: " + objReflection(formData, "none", false));

    if (type === "continue"){
        
      // Do something with formData values here 
        var cLen = formData.controls.length;
        var formValues = '';
        for (var c = 0; c < cLen; c++ ) 
        {
            formValues = formValues + formData.controls[c].type + ":" + formData.controls[c].value + "\n";
        }    

        alert("Continue Button Clicked.\n" + "Values Returned: \n" + formValues);

    }
    else {
      // Cancel
      return false;
    }
    
  }
  
  return dialogObj;
}


//=================================================
// END THE SCRIPT
///////////////////////////////////////////////////
}

theScript();