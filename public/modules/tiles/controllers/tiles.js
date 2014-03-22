'use strict';

angular.module('mean.tiles').controller('TilesCtrl', ['$scope', '$http',
  function($scope, $http) {

    $scope.loadTiles = function() {
      $scope.nav_open = false;
      $http.get('/tiles/categories', null)
        .success(function(response) {

          $scope.allTiles = response;
          $scope.currentCategory = Math.floor(Math.random() * 9);
          $scope.hPosition = 9;
          console.log(response);

          $scope.tileLeft = $scope.allTiles[$scope.currentCategory][$scope.hPosition - 1];
          $scope.tileMain = $scope.allTiles[$scope.currentCategory][$scope.hPosition];
          $scope.tileRight = $scope.allTiles[$scope.currentCategory][$scope.hPosition + 1];

          $scope.tileUp = $scope.allTiles[categoryRotator($scope.currentCategory, "up")][$scope.hPosition];
          $scope.tileDown = $scope.allTiles[categoryRotator($scope.currentCategory, "down")][$scope.hPosition];
        });
    }

    var resetTiles = function() {
      $scope.$apply(function() {
        $scope.tileUp = $scope.allTiles[categoryRotator($scope.currentCategory, "up")][$scope.hPosition];
        $scope.tileDown = $scope.allTiles[categoryRotator($scope.currentCategory, "down")][$scope.hPosition];
        $scope.tileLeft = $scope.allTiles[$scope.currentCategory][$scope.hPosition - 1]
        $scope.tileRight = $scope.allTiles[$scope.currentCategory][$scope.hPosition + 1]
      });
    }

    $scope.moveUp = function() {
      $scope.tileMain = $scope.tileUp;
      $scope.currentCategory = categoryRotator($scope.currentCategory, "up");
      resetTiles();
    }

    $scope.moveDown = function() {
      $scope.tileMain = $scope.tileDown;
      $scope.currentCategory = categoryRotator($scope.currentCategory, "down");
      resetTiles();
    }

    $scope.moveLeft = function() {
      $scope.hPosition -= 1;
      $scope.tileMain = $scope.allTiles[$scope.currentCategory][$scope.hPosition];

      if ($scope.hPosition < 1) {
        $http.get('/tiles/categories', null)
          .success(function(response) {
            console.log($scope.allTiles);
            for (var i = 0; i < response.length; i++) {
              for (var j = (response[i].length - 1); j >= 0; j--) {
                $scope.allTiles[i].unshift(response[i][j]);
              };
            };
            console.log($scope.allTiles);

            $scope.hPosition += 18;
            $scope.tileUp = $scope.allTiles[categoryRotator($scope.currentCategory, "up")][$scope.hPosition];
            $scope.tileDown = $scope.allTiles[categoryRotator($scope.currentCategory, "down")][$scope.hPosition];
            $scope.tileLeft = $scope.allTiles[$scope.currentCategory][$scope.hPosition - 1]
            $scope.tileRight = $scope.allTiles[$scope.currentCategory][$scope.hPosition + 1]
          });        

      } else {
        resetTiles();
      };
    };

    $scope.moveRight = function() {
      $scope.hPosition += 1;
      $scope.tileMain = $scope.allTiles[$scope.currentCategory][$scope.hPosition];

      if (($scope.allTiles[$scope.currentCategory].length - 1) - $scope.hPosition < 1) {
        $http.get('/tiles/categories', null)
          .success(function(response) {
            console.log($scope.allTiles);
            for (var i = 0; i < response.length; i++) {
              for (var j = 0; j <= (response[i].length - 1); j++) {
                $scope.allTiles[i].push(response[i][j]);
              };
            };
            console.log($scope.allTiles);

            $scope.tileUp = $scope.allTiles[categoryRotator($scope.currentCategory, "up")][$scope.hPosition];
            $scope.tileDown = $scope.allTiles[categoryRotator($scope.currentCategory, "down")][$scope.hPosition];
            $scope.tileLeft = $scope.allTiles[$scope.currentCategory][$scope.hPosition - 1]
            $scope.tileRight = $scope.allTiles[$scope.currentCategory][$scope.hPosition + 1]
          });

      } else {
        resetTiles();
      };
    }

    var categoryRotator = function(categoryNum, direction) {
      if (direction == "up") {
        if (categoryNum == 0) {
          return 8;
        } else {
          return (categoryNum - 1);
        };
      } else if (direction == "down") {
        if (categoryNum == 8) {
          return 0;
        } else {
          return (categoryNum + 1);
        };
      };
    };

    $scope.closeNav = function() {

      $("#tileMain").removeClass("nav-open");
      $("#tileMain").addClass("nav-close");
      $("#navigation-instructions").css("transition","1s");
      $("#navigation-instructions").css("opacity", "0");
      setTimeout(function(){
        $("#navigation-instructions").css("display", "none");
        $("#tileMain").removeClass("nav-close");
      },500);
      $scope.nav_open = false;
    
    };


    $(function() {  
      //Main SWIPE FUNCTION
      $("#tileMain").swipe( {swipeStatus: swipe2,
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount) {
          
          var colorMain = $("#tileMain").css("background-color");
          var colorOffset = $("#tileLeft").css("background-color");
          console.log(colorMain);
          console.log(colorOffset);

          if(direction=="right" && distance > (document.documentElement.clientWidth)*0.45){
            animateAndMove("Left", $scope.tileLeft, colorMain, colorOffset);
          }
          else if(direction=="left" && distance > (document.documentElement.clientWidth)*0.45){
            animateAndMove("Right", $scope.tileRight, colorMain, colorOffset);    
          }
          else if(direction=="up" && distance > (document.documentElement.clientHeight)*0.45){
            animateAndMove("Down", $scope.tileUp, colorMain, colorOffset);
          }
          else if(direction=="down" && distance > (document.documentElement.clientHeight)*0.45){
            animateAndMove("Up", $scope.tileDown, colorMain, colorOffset);
          }
          else if(distance == 0 && direction == null){

            if($scope.nav_open == false){
              $("#tileMain").addClass("nav-open");
              $("#tileMain").removeClass("nav-close");
              $("#navigation-instructions").css("transition","1s");
              $("#navigation-instructions").css("display", "block");
              $("#navigation-instructions").css("opacity", "1");
              $scope.nav_open = true;
            }

          }
        },
        //Default is 75px, set to 0 for demo so any distance triggers swipe
         threshold:0
      });

      function switchColors(colorMain, colorOffset){
        $("#tileMain").css("background-color", colorOffset);
        $("#tileLeft").css("background-color", colorMain);
        $("#tileRight").css("background-color", colorMain);
        $("#tileUp").css("background-color", colorMain);
        $("#tileDown").css("background-color", colorMain);
        $("#tileMain").css("color", colorMain);
        $("#tileLeft").css("color", colorOffset);
        $("#tileRight").css("color", colorOffset);
        $("#tileUp").css("color", colorOffset);
        $("#tileDown").css("color", colorOffset);
      };

      function animateAndMove(direction, tile, colorMain, colorOffset){
        $("#tile" + direction).addClass("center-tile");
        $("#tile" + direction).addClass("show");
        $("#tileMain").addClass("hide");

        // Added this to match bg color to new tile, but needs some work with the animation
        // $("#showTile").css("background-color", colorMain);

        $("#tileMain").css("background-color", colorOffset);
        $("#tileMain").css("color", colorMain);
        $scope.$apply(function(){$scope.tileMain = tile;});

        setTimeout(function(){
          move(direction);
          $("#tile" + direction).removeClass("center-tile");
          $("#tileMain").removeClass("hide");
          $("#tile" + direction).removeClass("show");
          switchColors(colorMain,colorOffset);
        },100);

      };

      function move(direction){
        if(direction == "Left"){
          $scope.moveLeft();
        }
        else if(direction == "Right"){
          $scope.moveRight();
        }
        else if(direction == "Up"){
          $scope.moveUp();
        }
        else if(direction == "Down"){
          $scope.moveDown();
        }

      }

      function pinchMe(event, phase, direction, distance , duration , fingerCount, pinchZoom){
          $("#tileMain").css("opacity",pinchZoom);
      };

      //SWIPE 2 FUNCTION FOR ANIMATION
      function swipe2(event, phase, direction, distance) {
          // console.log( phase +" you have swiped " + distance + "px in direction:" + direction );
          $(".tile").removeClass("slow");
          $("#tileMain").addClass("fader");
          if(phase == "move"){
            if(direction == 'right'){
              $(".tile").css("margin-left", distance);
              $("#tileLeft").css("opacity", (1.5*distance)/document.documentElement.clientWidth);
              $("#tileMain.fader").css("opacity", 1-((1.5*distance)/document.documentElement.clientWidth));

            }
            else if (direction == 'left'){
              $(".tile").css("margin-left", -distance);
              $("#tileRight").css("opacity", (1.5*distance)/document.documentElement.clientWidth);
              $("#tileMain.fader").css("opacity", 1-((1.5*distance)/document.documentElement.clientWidth));
            }
            else if (direction == 'down'){
              $("#tileMain").css("bottom", -distance);
              $("#tileUp").css("bottom", 100-((distance/document.documentElement.clientHeight)*100)+"%");
              $("#tileDown").css("bottom", -100-((distance/document.documentElement.clientHeight)*100)+"%");
              $("#tileLeft").css("bottom", -distance);
              $("#tileRight").css("bottom", -distance);
              $("#tileUp").css("opacity", (1.5*distance)/document.documentElement.clientHeight);
              $("#tileMain.fader").css("opacity", 1-((1.5*distance)/document.documentElement.clientWidth));
            }
            
            else if (direction == 'up'){
              $("#tileMain").css("bottom", distance);
              $("#tileUp").css("bottom", 100+((distance/document.documentElement.clientHeight)*100)+"%");
              $("#tileDown").css("bottom", -100+((distance/document.documentElement.clientHeight)*100)+"%");
              $("#tileLeft").css("bottom", distance);
              $("#tileRight").css("bottom", distance);
              $("#tileDown").css("opacity", (1.5*distance)/document.documentElement.clientHeight);
              $("#tileMain.fader").css("opacity", 1-((1.5*distance)/document.documentElement.clientWidth));
            }
             
          }
          else if (phase == "end"){
            //console.log(distance);
            if(distance>(document.documentElement.clientHeight)*0.45){
             $(".tile").css("margin", "0px");
             $("#tileDown").css("bottom","-100%");
             $("#tileUp").css("bottom","100%");
             $("#tileMain").css("bottom", 0);
             $("#tileLeft").css("bottom", 0);
             $("#tileRight").css("bottom", 0);
             $("#tileMain.fader").css("opacity", 1);
            }
            else{
              $(".tile").addClass("slow");
              $(".tile").css("margin", "0px");
              $("#tileDown").css("bottom","-100%");
              $("#tileUp").css("bottom","100%");
              $("#tileMain").css("bottom", 0);
              $("#tileLeft").css("bottom", 0);
              $("#tileRight").css("bottom", 0);
              $("#tileMain.fader").css("opacity", 1);

              setTimeout(function(){
                $(".tile").removeClass("slow");
              },100);
            }
          }
        };
    });


    // Create a random tile and save to database
    // Leave this alone!!!!!!!!!!!!!

    // CANT TOUCH THISSSSSS, HAI *fsssttt*

    $scope.createTile = function() {
      $http.post('/tiles', null)
        .success(function(response) {

          // Assigns created tile object to $scope.tile
          $scope.tile = response;
        })
    }

    // SPRITZ test
    $scope.spritzNow = function(content) {
      var contentArr = content.split(/\W/).filter(function(n) { return n != "" });
      var counter = 0;

      var startSpritz = setInterval(function() {
        if (counter >= contentArr.length - 1)
          window.clearInterval(startSpritz);

        var avgNumber = Math.round(contentArr[counter].length * 0.29);
        var wordArr = contentArr[counter].split('');
        wordArr.splice(avgNumber, 1, "<span class='red'>" + contentArr[counter][avgNumber] + "</span>")
        wordArr = wordArr.join('');

        $('#spritz').html(wordArr);
        counter++;
      }, 250);
    };
    // END
  }
]);
