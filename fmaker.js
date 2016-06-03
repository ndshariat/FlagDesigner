//fmaker.js
//Nima Shariat
//Owen Thomas
//Aren Williams
//ART 101 - S16
//Final
//Here is the javascript file for the flag maker. It handles all the canvas
//drawing as well as all of the input handling.


//*****************************NOTES TO SELF************************************
//May want to handle BiBar and uniform color within checkered by
//having biBar be cases where either row or column is 2 and uniform would be 1.
//Important thing about this though is that with this kind of implementation we
//would lose the ability to fine tune the ratio between the bars (not a problem
//obviously for the uniform)
//A solution to this would be extending the range of the tricolor to allow for
//a 0 for height or width, making the ratio be between only two values.
//I'm going to try this before going to the trouble of adding biBar on its own



//+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=
//==========================GLOBAL VARIABLES====================================
//+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=

//********************************GENERAL***************************************



var canvas;
var ctx;

//canvas width [int]
var canvasW = 400; //set to 400 for 1:1
//canvas height [int]
var canvasH = 400; //set to 400 for 1:1

//holds the color values. Color 1 and 2 are what is chosen when there are only
//two colors, such as BiBar [int, int, int]
var colorOne = "rgb(255, 0, 0)"; //initialized as red
var colorOneH = rgb2hex(colorOne); //hex version
console.log(colorOneH);
var colorTwo = "rgb(0, 255, 0)"; //initialized as green
var colorTwoH = rgb2hex(colorTwo); //hex version
console.log(colorTwoH);
var colorThree = "rgb(0, 0, 255)"; //initialized as blue
var colorThreeH = rgb2hex(colorThree); //hex version
console.log(colorThreeH);

//handles the type of background chosen:
//   0: checkered
//   1: tricolor horizontal
//   2: tricolor vertical
//   3: bibar horizontal
//   4: bibar vertical
//   5:
//   6:
var backgroundType = 0; //default of checkered


//object constructor for overlay.
function overlay() {
  /*if(type!=undefined){this.type = type; } //objectType object [default 0]
  if(rendered!=undefined){this.rendered = rendered; } //binaryof if object is rendered 0 = not, 1 = rendered [default not]
  if(index!=undefined){this.index = index;} //holds track of which overlay it is so that it can be referenced/checked bidirectionally [default 0]
  */
  this.type = 0;
  this.rendered = 0;
  this.index = 0;

  //These are not to be confused with the global colors that effect background
  //These will only effect that particular overlay.
  this.colorOne = "rgb(255, 0, 0)";
  this.colorTwo = "rgb(0, 255, 0)";
  this.colorThree = "rgb(0, 0, 255)";
  this.colorOneH = rgb2hex(colorOne); //hex version
  this.colorTwoH = rgb2hex(colorTwo); //hex version
  this.colorThreeH = rgb2hex(colorThree); //hex version
};

//where the list of objects will be held
//will hold 10 empty objects once initObjects() is run
var overlayArray = [];

//These are the objects themselves (empty until initObjects is run)
var overlayOne;
var overlayTwo;
var overlayThree;
var overlayFour;
var overlayFive;
var overlaySix;
var overlaySeven;
var overlayEight;
var overlayNine;
var overlayTen;




//******************************BACKGROUND**************************************

//===============================CHECKER========================================
//for checkered background
//number of columns
var numCol = 4; //initialized to 4
//number of rows
var numRow = 4; //initialized to 4


//==============================TRICOLOR========================================
//for horizontal triColor
//carries the heights of each of the bars.
var bandOneH = 1;
var bandTwoH = 1;
var bandThreeH = 1;

//Using the heights of all three components, the (S)hare version calculates the
//percentage of each individual out of the three
//I mean at this point I could obviously just make each worth 1/3 but here I set
//the precedent for how the (S)hare is calculated
var bandOneHS = (bandOneH/ (bandOneH + bandTwoH + bandThreeH));
var bandTwoHS = (bandTwoH/ (bandOneH + bandTwoH + bandThreeH));
var bandThreeHS = (bandThreeH/ (bandOneH + bandTwoH + bandThreeH));

//for vertical triColor
//carries the widths of each of the bars
var bandOneW = 1;
var bandTwoW = 1;
var bandThreeW = 1;

//Using the heights of all three components, the (S)hare version calculates the
//percentage of each individual out of the three
var bandOneWS = (bandOneW/ (bandOneW + bandTwoW + bandThreeW));
var bandTwoWS = (bandTwoW/ (bandOneW + bandTwoW + bandThreeW));
var bandThreeWS = (bandThreeW/ (bandOneW + bandTwoW + bandThreeW));



/*CURRENTLY DECIDING IF THIS SHOULD BE USED SINCE TRICOLOR MAKES THIS REDUNDANT
//================================BIBAR=========================================

//for horizontal BiBar
//carries the ratio between the two bars
var barOneH = 1/2;
var barTwoH = 1/2;

//for vertical BiBar
//carries the ratio between the two bars
var barOneW = 1/2;
var barTwoW = 1/2;
*/


//================================OVERLAYS======================================

//border object
function border(){
  this.index = 0;
  this.borderWidth = 80;
  this.render = function(){
    ctx.beginPath();
    ctx.lineWidth= this.borderWidth;
    ctx.strokeStyle = overlayArray[this.index].colorOneH;
    ctx.rect(0,0,canvas.width,canvas.height);
    ctx.stroke();
  };
}

//cross object
function cross(){
  this.index = 0;
  this.crossWidth = 40; //the thickness of the cross
  this.crossVerOff = 0; //the offset of the across line
  this.crossHorOff = 0; //the offset of the up-down line
  this.render = function(){
    ctx.strokeStyle = overlayArray[this.index].colorOneH; //change to object color
    ctx.beginPath();
    ctx.lineWidth = this.crossWidth;
    ctx.moveTo(0,(canvas.height/2)+this.crossVerOff);
    ctx.lineTo(canvas.width, (canvas.height/2)+this.crossVerOff);
    ctx.moveTo((canvas.width/2)+this.crossHorOff, 0);
    ctx.lineTo((canvas.width/2)+this.crossHorOff, canvas.height);
    ctx.stroke();
  }
}


//canton object
function canton(){
  this.index = 0;
  this.cantonXScale = 10; //the scale of the width
  this.cantonYScale = 10; //the scale of the height
  this.render = function(){
    ctx.fillStyle = overlayArray[this.index].colorOneH;
    ctx.fillRect(0, 0, (canvas.width/2) * (this.cantonXScale/10), (canvas.height/2) * (this.cantonYScale/10));
  }
}



//+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=
//===============================FUNCTIONS======================================
//+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=+=---=


//==================================MAIN========================================
// Here is where the initial set up for canvas is done. On loading of html and
// js files, this function is immediately run (called in body of html)

function main(){
  console.log("Main Loaded");
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = canvasW;
  canvas.height = canvasH;
  console.log(canvas.height);
  console.log(canvas.width);
  initOverlays();
  render();
}

//========================INITIALIZE OVERLAY OBJECTS============================
// When called, it initializes 10 overlay objects and places them in order in
// the overlayArray
// Should only be called once in the main function.

function initOverlays(){
  overlayOne = new overlay();
  overlayTwo = new overlay();
  overlayThree = new overlay();
  overlayFour = new overlay();
  overlayFive = new overlay();
  overlaySix = new overlay();
  overlaySeven = new overlay();
  overlayEight = new overlay();
  overlayNine = new overlay();
  overlayTen = new overlay();
  overlayOne.index = 0;
  overlayTwo.index = 1;
  overlayThree.index = 2;
  overlayFour.index = 3;
  overlayFive.index = 4;
  overlaySix.index = 5;
  overlaySeven.index = 6;
  overlayEight.index = 7;
  overlayNine.index = 8;
  overlayTen.index = 9;
  overlayOne.rendered = 1;

  overlayArray = [overlayOne, overlayTwo, overlayThree, overlayFour,
                  overlayFive, overlaySix, overlaySeven, overlayEight,
                  overlayNine];

  //Debugging
  console.log("testing initOverlays");
  /*console.log(overlayOne);
  console.log(overlayTwo);
  console.log(overlayThree);
  console.log(overlayFour);
  console.log(overlayFive);
  console.log(overlaySix);
  console.log(overlaySeven);
  console.log(overlayEight);
  console.log(overlayNine);
  console.log(overlayTen);*/
  console.log(overlayArray);
  console.log(overlayArray[3].index); //debug
}



//==================================RENDER======================================
//This is where the bulk of the rendering takes place, whether it be by calling
//funcitons from it, or explicitly drawing within it. Whenver a change is made,
//this function should be called in order to redraw the flag with the new
//parameters.

function render(){
  //redraws the background. Think of this as a pallette cleanser for the rest of
  //the drawings to build on top.
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  canvas.width = canvasW;
  canvas.height = canvasH;
  console.log(canvasW); //debug
  console.log(canvas.width); //debug
  renderBackground();
  renderOverlays();
}


//==========================RENDER BACKGROUND===================================
//Outsourcing the background rendering to a different function since I'm
//predicting it will look pretty clustered if it is all held in the Render.

function renderBackground(){
  switch(backgroundType){
    case 0:
     console.log("uniform");
     colorOneH = rgb2hex(colorOne);
     ctx.fillStyle = colorOneH;
     ctx.fillRect(0,0,canvas.width,canvas.height);
     break;
    case 1:
     console.log("checkered");
     colorOneH = rgb2hex(colorOne);
     colorTwoH = rgb2hex(colorTwo);
     ctx.fillStyle = colorOneH;
     ctx.fillRect(0,0,canvas.width,canvas.height); //draws background
     //sets second color, which will draw rects based on number of rows and
     //columns to generate the checkered effect
     ctx.fillStyle = colorTwoH;
     for(var j = 0; j<numRow; j+=2){
       //console.log("in row")
       for(var i = 0; i<numCol; i++){
         console.log(i); //debug
         ctx.fillRect(2*i*(canvas.width/numCol),(canvas.height/numRow)*j,canvas.width/numCol,canvas.height/numRow);
         ctx.fillRect((2*i*(canvas.width/numCol))+(canvas.width/numCol),(canvas.height/numRow)*(j+1),canvas.width/numCol,canvas.height/numRow);
       }
     }
     break;
    case 2:
     console.log("tricolor horizontal");
     colorOneH = rgb2hex(colorOne);
     colorTwoH = rgb2hex(colorTwo);
     colorThreeH = rgb2hex(colorThree);
     ctx.fillStyle = colorOneH;
     ctx.fillRect(0,0, canvas.width, (canvas.height * bandOneWS));
     ctx.fillStyle = colorTwoH;
     ctx.fillRect(0, (canvas.height * bandOneWS), canvas.width, (canvas.height * bandTwoWS));
     ctx.fillStyle = colorThreeH;
     ctx.fillRect(0, (canvas.height * bandOneWS) + (canvas.height * bandTwoWS), canvas.width, (canvas.height * bandThreeWS));
     break;
    case 3:
     console.log("tricolor vertical");
     colorOneH = rgb2hex(colorOne);
     colorTwoH = rgb2hex(colorTwo);
     colorThreeH = rgb2hex(colorThree);
     ctx.fillStyle = colorOneH;
     ctx.fillRect(0,0, (canvas.width  * bandOneHS), canvas.height);
     ctx.fillStyle = colorTwoH;
     ctx.fillRect((canvas.width * bandOneHS), 0, (canvas.width * bandTwoHS), canvas.height);
     ctx.fillStyle = colorThreeH;
     ctx.fillRect((canvas.width * bandOneHS) + (canvas.width * bandTwoHS), 0, (canvas.width * bandThreeHS), canvas.height);
     break;
    case 4:
     console.log("bibar horizontal");
     break;
    case 5:
     console.log("bibar vertical");
     break;
    case 6:
     console.log("test");
     colorOneH = rgb2hex(colorOne);
     colorTwoH = rgb2hex(colorTwo);
     colorThreeH = rgb2hex(colorThree);
//===================================CROSS======================================
     //var crossWidth = 40; //here would be user input
     //var crossHorOff = 0; //here would be user input
     //var crossVerOff = 0; //here would be user input
     /*ctx.strokeStyle = colorOneH; //change to object color
     ctx.beginPath();
     ctx.lineWidth = crossWidth;
     ctx.moveTo(0,(canvas.height/2)+crossVerOff);
     ctx.lineTo(canvas.width, (canvas.height/2)+crossVerOff);
     ctx.moveTo((canvas.width/2)+crossHorOff, 0);
     ctx.lineTo((canvas.width/2)+crossHorOff, canvas.height);
     ctx.stroke();*/
//===================================CANTON=====================================
     /*ctx.fillStyle = colorOneH; //change to object color
     ctx.fillRect = (0, 0, (canvas.width/2) * (cantonXScale/10), (canvas.height/2) * (cantonYScale/10));*/
     break;
  }
}


//============================RENDER OVERLAYS===================================
// Runs through all of the overlays and renders their associated type. Checks
// if it should be rendered before hand. Should be called in render() so that
// each time it is working off clean slate (straight onto background)

function renderOverlays(){
  for(var i = 0; i<10; i++){
    if(overlayArray[i].rendered==1){
      switch(overlayArray[i].type){
        case 0:
          console.log("border");
          var bord = new border(); //gotta name it something different cuz fuck javascript
          bord.index = i;
          bord.render();
          //Going to be handled withing object border() instead
          /*ctx.beginPath();
          ctx.lineWidth= borderWidth;
          ctx.strokeStyle = overlayArray[i].colorOneH;
          ctx.rect(0,0,canvas.width,canvas.height);
          ctx.stroke();*/
          break;
        case 1:
          console.log("cross");
          var crss = new cross();
          crss.index = i;
          crss.render();
          //Going to be handled withing object cross() instead
          /*ctx.strokeStyle = overlayArray[i].colorOneH; //change to object color
          ctx.beginPath();
          ctx.lineWidth = crossWidth;
          ctx.moveTo(0,(canvas.height/2)+crossVerOff);
          ctx.lineTo(canvas.width, (canvas.height/2)+crossVerOff);
          ctx.moveTo((canvas.width/2)+crossHorOff, 0);
          ctx.lineTo((canvas.width/2)+crossHorOff, canvas.height);
          ctx.stroke();*/
          break;
        case 2:
          console.log("canton");
          var cant = new canton();
          cant.index = i;
          cant.render();
          //Going to be handled withing object canton() instead
          /*ctx.fillStyle = overlayArray[i].colorOneH;
          ctx.fillRect = (0, 0, (canvas.width/2) * (cantonXScale/10), (canvas.height/2) * (cantonYScale/10));*/
          break;
      }
    }
  }
}


//============================SET BACKGROUND====================================
// Here is the handling for the background input. It takes in the background
// type and feeds it into the backgroundType variable. Notice that the actual
// rendering of the background is done in renderBackground() which is called
// indirectly at the end of this function with the render() call. This means
// that none of the actual explicit rendering occurs here.

function setBackground(backgroundValue){
  backgroundType = +backgroundValue.value;
  //console.log(backgroundValue); //debugging
  //this switch doesn't actually modify anything, it's just for debugging
  switch(backgroundType){
    case 0:
     console.log("uniform");
     break;
    case 1:
     console.log("checkered");
     break;
    case 2:
     console.log("tricolor horizontal");
     break;
    case 3:
     console.log("tricolor vertical");
     break;
    case 4:
     console.log("bibar horizontal");
     break;
    case 5:
     console.log("bibar vertical");
     break;
    case 6:
     console.log("");
     break;
  }
  render();
}


//===============================SET RATIO======================================
// Here is where the handling of the ratio input is done. It will basically take
// in the value from the dropdown for ratio and then it changes the canvas ratio
// accordingly

function setRatio(ratioValue){
  //console.log("setRatio") //debug
  var ratioType = +ratioValue.value;
  console.log(ratioType); //debug
  //depending on the selected ratio of flag, the canvas height and width will be
  //altered so that they fit these proportions while staying relatively close in
  //size to one another
  switch (ratioType) {
     case 0:
      console.log("1:1");
      canvasW = 400;
      break;
     case 1:
      console.log("13:15");
      canvasW = 462;
      break;
     case 2:
      console.log("4:5");
      canvasW = 500;
      break;
     case 3:
      console.log("28:37");
      canvasW = 529;
      break;
     case 4:
      console.log("3:4");
      canvasW = 533;
      break;
     case 5:
      console.log("8:11");
      canvasW = 550;
      break;
     case 6:
      console.log("18:25");
      canvasW = 556;
      break;
     case 7:
      console.log("2:3");
      canvasW = 600;
      break;
     case 8:
      console.log("5:8");
      canvasW = 640;
      break;
     case 9:
      console.log("3:5");
      canvasW = 667;
      break;
     case 10:
      console.log("10:19");
      canvasW = 760;
      break;
     case 11:
      console.log("1:2");
      canvasW = 800;
      break;
     case 12:
      console.log("11:28");
      canvasW = 1018;
      break;
  }
  canvas.width = canvasW;
  render();
}

//==========================SET OVERLAY TYPE====================================
//Sets the type of the specified overlay. To be called by the onchange of the
//overlay type input field so that it re renders with the new type

function setOverlayType(typeValue, index){
  var i = index;
  overlayArray[i].type = +typeValue.value;
  console.log(overlayArray[i].type); //debug
  switch (overlayArray[i].type) {
     case 0:
      console.log("border");
      //overlayArray[i].type = 0;
      break;
     case 1:
      console.log("cross");
      //overlayArray[i].type = 1;
      break;
     case 2:
      console.log("canton");
      //overlayArray[i].type = 2;
      break;
  }
  render();
}


//==============================SET COLUMN======================================
//handles the input of number of columns, restriction of range happen on the
//html side. Remember this is for the checkered background.

function setColumn(columnValue){
  numCol = +columnValue.value;
  console.log(numCol);
  render();
}

//================================SET ROW=======================================
//handles the input of number of rows, restriction of range happen on the html
//side. Remember this is for the checkered background.

function setRow(rowValue){
  numRow = +rowValue.value;
  console.log(numRow);
  render();
}

//================================SET BARS======================================
//here is where the event handling for each of the bar percenteges occurs. The
//input goes into the amount for ratio of the heights and widths, which leads
//into the amounts for the shares. These percentages are then used for
//calculating the pixel widths and heights based on canvas width and height


//Horizontal

function setBarOneH(barValue){
  bandOneH = +barValue.value;
  console.log(bandOneH);
  //Since all Shares are influenced by one another, they must be recalculated
  //each time one is set
  bandOneHS = (bandOneH/ (bandOneH + bandTwoH + bandThreeH));
  bandTwoHS = (bandTwoH/ (bandOneH + bandTwoH + bandThreeH));
  bandThreeHS = (bandThreeH/ (bandOneH + bandTwoH + bandThreeH));
  //debugging
  console.log(bandOneHS);
  console.log(bandTwoHS);
  console.log(bandThreeHS);
  render();
}

function setBarTwoH(barValue){
  bandTwoH = +barValue.value;
  console.log(bandTwoH);
  bandOneHS = (bandOneH/ (bandOneH + bandTwoH + bandThreeH));
  bandTwoHS = (bandTwoH/ (bandOneH + bandTwoH + bandThreeH));
  bandThreeHS = (bandThreeH/ (bandOneH + bandTwoH + bandThreeH));
  console.log(bandOneHS);
  console.log(bandTwoHS);
  console.log(bandThreeHS);
  render();
}

function setBarThreeH(barValue){
  bandThreeH = +barValue.value;
  console.log(bandThreeH);
  bandOneHS = (bandOneH/ (bandOneH + bandTwoH + bandThreeH));
  bandTwoHS = (bandTwoH/ (bandOneH + bandTwoH + bandThreeH));
  bandThreeHS = (bandThreeH/ (bandOneH + bandTwoH + bandThreeH));
  console.log(bandOneHS);
  console.log(bandTwoHS);
  console.log(bandThreeHS);
  render();
}

//Vertical

function setBarOneW(barValue){
  bandOneW = +barValue.value;
  console.log(bandOneW);
  bandOneWS = (bandOneW/ (bandOneW + bandTwoW + bandThreeW));
  bandTwoWS = (bandTwoW/ (bandOneW + bandTwoW + bandThreeW));
  bandThreeWS = (bandThreeW/ (bandOneW + bandTwoW + bandThreeW));
  console.log(bandOneWS);
  console.log(bandTwoWS);
  console.log(bandThreeWS);
  render();
}

function setBarTwoW(barValue){
  bandTwoW = +barValue.value;
  console.log(bandTwoW);
  bandOneWS = (bandOneW/ (bandOneW + bandTwoW + bandThreeW));
  bandTwoWS = (bandTwoW/ (bandOneW + bandTwoW + bandThreeW));
  bandThreeWS = (bandThreeW/ (bandOneW + bandTwoW + bandThreeW));
  console.log(bandOneWS);
  console.log(bandTwoWS);
  console.log(bandThreeWS);
  render();
}

function setBarThreeW(barValue){
  bandThreeW = +barValue.value;
  console.log(bandThreeW);
  bandOneWS = (bandOneW/ (bandOneW + bandTwoW + bandThreeW));
  bandTwoWS = (bandTwoW/ (bandOneW + bandTwoW + bandThreeW));
  bandThreeWS = (bandThreeW/ (bandOneW + bandTwoW + bandThreeW));
  console.log(bandOneWS);
  console.log(bandTwoWS);
  console.log(bandThreeWS);
  render();
}


/*MUST BE CHANGED TO WORK WITH CROSS AS OBJECT FOR EACH OVERLAY
//===============================SET CROSS======================================
//handling for the cross: vertical and horizontal offset, and line width.


//Horizontal Offset

function setCrossHorOff(offValue){
  crossHorOff = +offValue.value;
  crossHorOff = crossHorOff * 20;
  console.log(crossHorOff);
  render();
}

//Horizontal Offset

function setCrossVerOff(offValue){
  crossVerOff = +offValue.value;
  crossVerOff = crossVerOff * 20;
  console.log(crossVerOff);
  render();
}

function setCrossWidth(crossWidthValue){
  crossWidth = +crossWidthValue.value;
  crossWidth = crossWidth * 2;
  console.log(crossWidth);
  render();
}
*/


//=========================RGB to HEX CONVERTER=================================
//taken from stackOverflow
//in: ""(r, g, b)rgb"  out: ""#rrggbb"
//converts (r, g, b)rgb value into hex format #xxxxxx to be used for drawing.

function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}


//********************************jQuery****************************************


$(document).ready(function(){
 //If JS is enabled add a class so we can hide the form ASAP (and only for JS enabled browsers)
document.documentElement.className = 'js';
//add the jQuery click/show/hide behaviours:

     $(".reply").click(function(){
         if($("#dropDown1").is(":visible")){
           $("#dropDown1").hide();
        } else {
           $("#dropDown1").show();
        }
        //don't follow the link (optional, seen as the link is just an anchor)
        return false;
     });

document.documentElement.className = 'js';
//add the jQuery click/show/hide behaviours:

     $(".reply").click(function(){
         if($("#dropDown2").is(":visible")){
           $("#dropDown2").hide();
        } else {
           $("#dropDown2").show();
        }
        //don't follow the link (optional, seen as the link is just an anchor)
        return false;
     });

document.documentElement.className = 'js';
//add the jQuery click/show/hide behaviours:

     $(".reply").click(function(){
         if($("#dropDown3").is(":visible")){
           $("#dropDown3").hide();
        } else {
           $("#dropDown3").show();
        }
        //don't follow the link (optional, seen as the link is just an anchor)
        return false;
     })

document.documentElement.className = 'js';
//add the jQuery click/show/hide behaviours:

     $(".reply").click(function(){
         if($("#dropDown4").is(":visible")){
           $("#dropDown4").hide();
        } else {
           $("#dropDown4").show();
        }
        //don't follow the link (optional, seen as the link is just an anchor)
        return false;
     });


document.documentElement.className = 'js';
//add the jQuery click/show/hide behaviours:

     $(".reply").click(function(){
         if($("#dropDown5").is(":visible")){
           $("#dropDown5").hide();
        } else {
           $("#dropDown5").show();
        }
        //don't follow the link (optional, seen as the link is just an anchor)
        return false;
     });

});
