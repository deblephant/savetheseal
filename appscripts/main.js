
require(
   // Use this library to "fix" some annoying things about Raphel paper and graphical elements:
    //     a) paper.put(relement) - to put an Element created by paper back on a paper after it has been removed
    //     b) call element.addEventListener(...) instead of element.node.addEventListner(...)
    ["../jslibs/raphael.lonce"],  // include a custom-built library

    function () {

        console.log("Yo, I am alive!");


        var paper = new Raphael(document.getElementById("SVGcanvas"));
        var scoreBoard = document.getElementById("scoreboard")

        // put the width and heigth of the canvas into variables for our own convenience
        var pWidth = paper.canvas.offsetWidth;
        var pHeight = paper.canvas.offsetHeight;
        //---------------------------------------------------------------------

        // Create a nice background of a circus setting
        var bgRect = paper.rect(0,0,pWidth, pHeight);
        bgRect.attr({"fill": "url(http://vignette3.wikia.nocookie.net/disney/images/b/bb/Circus_(Art).png/revision/latest?cb=20130602152329)"});

        //Created a translucent cover for the backround at the starting menu
        var startRect = paper.rect(0,0,pWidth, pHeight).attr({
            'fill':'white',
            'opacity':'0.6'
        }); 
        
        // Generate random integer
        var randInt = function (lim){
            return Math.floor(lim*Math.random());
        };

        //Code that draws a path in the shape of a star (retrieved from http://jsfiddle.net/raphaeljs/qS6Ua/)
        Raphael.fn.star= function(x, y, r) {
            // start at the top point
            var path = "M" + x + "," + (y - r);
            
            // let's draw this the way we might by hand, by connecting each point the one two-fifths of the way around the clock
            for (var c = 0; c < 6; c += 1) {
                var angle = 270 + c * 144,
                    rx = x + r * Math.cos(angle * Math.PI / 180),
                    ry = y + r * Math.sin(angle * Math.PI / 180);

                path += "L" + rx + "," + ry;
            }    
           
            return paper.path(path);
        };

        //Styled the start button to be star-shaped and filled it with color
        var startButton = paper.star(2*pWidth/3,pHeight/2,75).attr({'fill':'gold', 'stroke-width':0});
        //Created a text for the startbutton
        var startText = paper.text(2*pWidth/3, pHeight/2-7, 'START');

        //Styled the text of the startButton
        startText.attr({
            stroke: "black",
            "font-family": "zebrawood std",
            "font-size": 23,
            "stroke-width": 1
        });

        //Created and style a instruction button for players to click when they want to read how to play the game
        var instructButton = paper.star(pWidth/3,pHeight/2,75).attr({'fill':'#FF3333', 'stroke-width':0});
        var instructText = paper.text(pWidth/3,pHeight/2, 'How to\nplay').attr({
            stroke: "black", 
            "font-family": "zebrawood std",
            "font-size":23,
            "stroke-width": 0.8
        });

        //Instructions for the game
        var instructions = paper.text(270,190, "Drag Sally around\nin order to\navoid the balls.").attr({
            "font-family":"Museo Sans Condensed",
            "font-size":17
        });

        //OK button to return to main menu after reading instructions
        var okButton = paper.rect(249,235,30,25).attr({'fill':'url(http://www.emctiles.co.uk/images/product_image/EMC01479.jpg)'})
        var okText = paper.text(265,245, "Ok!").attr({"font-family":'Museo Sans Condensed', "font-size":15})

        //Instructions and OK button are hidden orginally
        instructions.hide();
        okText.hide();
        okButton.hide();

        //Function to show instructions and OK button when the instructButton is clicked
        function instruct(ev){
            instructButton.animate({transform: "s2.0"},100,"linear"); //Added animation to make the start become bigger to show instructions
            instructText.hide();
            instructions.show();
            okButton.show();
            okText.show();
        };

        //Function to close the instructions when OK button is clicked
        function close(ev){
            instructButton.animate({transform: "s1.0"},100,"linear"); //Added animation to make the star return to orginal size
            instructText.show();
            instructions.hide();
            okButton.hide();
            okText.hide();
        };

        //Created a continue button similar to the startButton
        var tryButton = paper.star(pWidth/2,pHeight/2,75).attr({'fill':'#FF9900', 'stroke-width':0});
        //Added text to the contButton
        var tryText = paper.text(pWidth/2, pHeight/2-12, 'Try Again?');

        //Styled the 'Try Again?' text
        tryText.attr({
            stroke: "black",
            "font-family": "zebrawood std",
            "font-size": 21
        });

        //Prevents the text from getting highlighted when it is clicked
        tryText.attr("class","donthighlight");
        
        //Added background music for the game & audio when player loses
        var sound = new Audio('music.wav');
        var lose = new Audio('lose.wav');
        var startSong = new Audio('startsong.wav');

        //Starting track plays and loops 
        startSong.play();
        startSong.loop=true;

        // Unhides the start button
        var ready = function(){
            startButton.show();
            startText.show();
            tryButton.hide();
            tryText.hide();
        };

        //Unhides the continue button
        var tryAgain = function(){
            tryButton.show();
            tryText.show();
        };        

        //Called when the start button is clicked to hide the startButton and begin the game
        var start = function(){

            //Created a prompt with the game instructions and for users to select their difficulty level from 1-3
            var difficulty = prompt("Please select your difficulty level from 1-3 (1-Easy, 2-Medium, 3-Hard)");
            
            //In the situation that player leaves difficulty blank or clicks 'cancel'
            var difficulty = difficulty || "1";
            
            //Music for game starts playing when game starts and loops. The music at the beginning stops.
            sound.play();
            sound.loop=true;
            startSong.pause();

            //All buttons and other elements are hidden during the game 
            startButton.hide();
            startText.hide();
            instructButton.hide();
            instructText.hide();
            tryButton.hide();
            tryText.hide();
            startRect.hide();
            seal99.hide();

            //Created the sally the seal character
            //Created a circle for easy reference for mouse events
            var seal = paper.circle(pWidth/2,pHeight/2,50).attr({
                'fill': 'url(http://www.heathersanimations.com/animals/seal96.gif)',
                'stroke': 'none'
            });

            //Create array of dots
            var dotArray = [];//Initialize array
            //Variable that represents the values of the dots in dotArray
            var i = 0;  //initialize i to 0 
            var numDots = 30;

            // Loop that creates 100 dots (Basketballs to avoid) 
            while (i < numDots){

                dotArray[i] = paper.circle(randInt(pWidth), 0, 15);
                dotArray[i].attr({
                    "fill": 'url(http://www.gifs.net/Animation11/Sports/Basketball/Ball_spins.gif)',//Styled it to become spinning basketballs
                    "stroke": 'none'
                });

                //Initialize position of dots
                dotArray[i].xpos = randInt(pWidth);
                dotArray[i].ypos = 0;

                //QInitialized the rate of the dots using the map function
                dotArray[i].xrate = -5+10*Math.random();
                dotArray[i].yrate = -7+14*Math.random();
                i++;    //Increment of i at end of loop.               
            }; 

        var count = 0; //Count starts at 0

        var gravity; //So that the basketballs will fall
        
        //Created different diffculty levels for the game
        if (difficulty==='1'){ //Basketballs drop the slowest
            gravity=.1;
            setInterval(nextEmit, 300)
        };

        if (difficulty==='2'){
            gravity=.4;
            setInterval(nextEmit,90)
        };

        if (difficulty==='3'){ //Basketballs drop the fastest
            gravity=.7;
            setInterval(nextEmit,75)
        };
        
        //Draw function that makes the dots move
        var draw = function(){

                //Count and keep track of the number of times this function is called
                count++;

                i=0;
                while(i<numDots){

                    dotArray[i].yrate += gravity;

                    dotArray[i].xpos += dotArray[i].xrate;
                    dotArray[i].ypos += dotArray[i].yrate;

                    //Move the dot using our 'state' variables
                    dotArray[i].attr({'cx': dotArray[i].xpos, 'cy': dotArray[i].ypos});


                    i++; //Increment i

                };
        };
            
            // Calls draw function
            setInterval(draw, 30); 

            var nextToEmit=0; //Set nextToEmit to 0
            //Function to emit balls continually
            function nextEmit(){
                dotArray[nextToEmit].xpos=randInt(pWidth);
                dotArray[nextToEmit].ypos=0;
                //Add properties to keep track of the rate the dot is moving
                //MAPPING of ranges
                dotArray[nextToEmit].xrate= 3*Math.random();
                dotArray[nextToEmit].yrate= 13*Math.random();

                nextToEmit=(nextToEmit+1) % numDots;

            };
            
 
            
            //Distance function that takes 4 variables and returns the distance between two points
            var distance = function(x1,y1,x2,y2){         
                var xd = x2-x1;
                var xs = xd*xd;
                var yd = y2-y1;
                var ys = yd*yd;        
                // Math object for computation of the distance
                return  Math.sqrt(xs+ys);
            };

            //Movement of character
            //Added event listener to move the character
            var mousedown=false;
            //Variable that keeps track of the score
            var score = 0;
            //var scoreboard = document.getElementById('scoreboard');
            var upScore=true

            //Function for updating score
            function updateScore(){
            if (! upScore) {
                    return }
              
                //Score increases the longer the time the mouse is moved
                score++;
                //Updates score on the scoreboard & displays the difficulty level. Also styled the font on the scoreboard
                scoreBoard.innerHTML = 'DIFFICULTY: '+ difficulty + '      SCORE: ' + score;
                
            }; 
            
            //Calles updateScore every 100ms to update score
            setInterval(updateScore, 100)
            
            //Events only occur when the mouse is clicked
            seal.addEventListener('mousedown', function(ev){
                mousedown=true;
                console.log('got a click');

            });

            //Function for the game to restart
                        var reset = function(){
                            //tryAgain button appears on screen
                            tryAgain();
                                        
                            //Seal goes off screen
                            seal.attr({
                                'cx':-100,
                                'cy':-100
                            });

                            //score restarts
                            upScore=false;
                        };

            //Function for mousemove event. Detects the collision of the balls and the seal.
            function sealMove(ev){
                if (! mousedown) {
                    return }

                //Seal takes position of the mouse. Player can drag the seal.
                seal.attr({'cx': ev.offsetX, 'cy': ev.offsetY});

                //Score increases the longer the time the mouse is moved
                score++;
                //Updates score on the scoreboard & styled the font on the scoreboard
                //scoreboard.innerHTML ='SCORE:' + '\n' + score;
                                

                //Detects collision of the seal and the balls which will determine when the game is over
                for (i=1; i<30; i++){
                    if(distance(dotArray[i].xpos,dotArray[i].ypos, ev.offsetX, ev.offsetY)<45){ // Distance function that returns the distance between the seal and the balls
                        console.log('collision!');
                         //Music stops when game is over & plays 'lose' audio
                        sound.pause();
                        lose.play();

                        //Does not track mouse movement
                        mousedown=false;

                        //Alert to inform the player that he lost and what his score is
                        alert('Oh no! Sally dropped her ball. Your score is ' + score);

                        
                        
                        //Calls the reset function
                        reset();

                    }; 
                };     
                
            };

            //Added event listener for mousemoves on the bgRect and the seal to allow smoother movement of the seal
            bgRect.addEventListener('mousemove', function(ev){
                sealMove(ev);       
            });

            seal.addEventListener('mousemove', function(ev){
                sealMove(ev);                
            });           
            
            //Movement of seal only occurs when mouse is dragged
            bgRect.addEventListener('mouseup', function(ev){
                mousedown=false;
            });
        
        };

        //Created event listeners to both the startButton and startText so that the game will load when any part of the buttons are clicked
        startButton.click(function(ev){
            start();   
        });
        startText.addEventListener('click', start);

        //When the tryAgain button is clicked, the page will refresh to start a new game (retrieved from http://stackoverflow.com/questions/2405117/difference-between-window-location-href-window-location-href-and-window-location)
        tryButton.click(function(ev){window.location.reload()});
        tryText.addEventListener('click', function(ev){window.location.reload()});

        //Instruct functions is called when the instructButton is clicked
        instructButton.addEventListener('click', instruct);
        instructText.addEventListener('click', instruct);

        //Close function is called when okButton is clicked
        okButton.addEventListener('click', close);
        okText.addEventListener('click', close);


        //Starting page buttons appear once page is loaded
        ready();

        

        

});



                 

    

