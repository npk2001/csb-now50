function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

class Bear {
  constructor() {
    this.dBear = 100;
    this.htmlElement = document.getElementById("bear");
    this.id = this.htmlElement.id;
    this.x = this.htmlElement.offsetLeft;
    this.y = this.htmlElement.offsetTop;
  }

  move(xDir, yDir) {
    this.fitBounds(); //we add this instruction to keep bear within board
    this.x += this.dBear * xDir;
    this.y += this.dBear * yDir;
    this.display();
  }

  display() {
    this.htmlElement.style.left = this.x + "px";
    this.htmlElement.style.top = this.y + "px";
    this.htmlElement.style.display = "absolute";
  }

  fitBounds() {
    let parent = this.htmlElement.parentElement;
    let iw = this.htmlElement.offsetWidth;
    let ih = this.htmlElement.offsetHeight;
    // let l = parent.offsetLeft;
    // let t = parent.offsetTop;
    let w = parent.offsetWidth;
    let h = parent.offsetHeight;
    if (this.x < 0) this.x = 0;
    if (this.x > w - iw) this.x = w - iw;
    if (this.y < 0) this.y = 0;
    if (this.y > h - ih) this.y = h - ih;
  }

  setSpeed() {
    this.dBear = parseInt(document.getElementById("dBear").value, 10);
  }

  // Handle keyboad events
  // to move the bear
  moveBear(e) {
    //codes of the four keys
    const KEYUP = 38;
    const KEYDOWN = 40;
    const KEYLEFT = 37;
    const KEYRIGHT = 39;

    if (e.keyCode === KEYRIGHT) {
      this.move(1, 0);
    } // right key

    if (e.keyCode === KEYLEFT) {
      this.move(-1, 0);
    } // left key

    if (e.keyCode === KEYUP) {
      this.move(0, -1);
    } // up key

    if (e.keyCode === KEYDOWN) {
      this.move(0, 1);
    } // down key
  }

  reset() {
    this.dBear = 100;
    this.x = 0;
    this.y = 0;
  }
}

class Bee {
  constructor(beeNumber) {
    //the HTML element corresponding to the IMG of the bee
    this.htmlElement = this.createBeeImg(beeNumber);
    //iits HTML ID
    this.id = this.htmlElement.id;
    //the left position (x)
    this.x = this.htmlElement.offsetLeft;
    //the top position (y)
    this.y = this.htmlElement.offsetTop;
  }

  move(dx, dy) {
    //move the bees by dx, dy
    this.x += dx;
    this.y += dy;
    this.display();
  }

  display() {
    //adjust position of bee and display it
    this.fitBounds(); //add this to adjust to bounds
    this.htmlElement.style.left = this.x + "px";
    this.htmlElement.style.top = this.y + "px";
    this.htmlElement.style.display = "block";
  }

  fitBounds() {
    //check and make sure the bees stays in the board space
    let parent = this.htmlElement.parentElement;
    let iw = this.htmlElement.offsetWidth;
    let ih = this.htmlElement.offsetHeight;
    // let l = parent.offsetLeft;
    // let t = parent.offsetTop;
    let w = parent.offsetWidth;
    let h = parent.offsetHeight;
    if (this.x < 0) this.x = 0;
    if (this.x > w - iw) this.x = w - iw;
    if (this.y < 0) this.y = 0;
    if (this.y > h - ih) this.y = h - ih;
  }

  createBeeImg(wNum) {
    //get dimension and position of board div
    let boardDiv = document.getElementById("board");
    let boardDivW = boardDiv.offsetWidth;
    let boardDivH = boardDiv.offsetHeight;
    let boardDivX = boardDiv.offsetLeft;
    let boardDivY = boardDiv.offsetTop;
    //create the IMG element
    let img = document.createElement("img");
    img.setAttribute("src", "images/bee.gif");
    img.setAttribute("width", "100");
    img.setAttribute("alt", "A bee!");
    img.setAttribute("id", "bee" + wNum);
    img.setAttribute("class", "bee"); //set class of html tag img
    //add the IMG element to the DOM as a child of the board div
    img.style.position = "absolute";
    boardDiv.appendChild(img);
    //set initial position
    let x = getRandomInt(boardDivW);
    let y = getRandomInt(boardDivH);
    img.style.left = boardDivX + x + "px";
    img.style.top = y + "px";
    //return the img object
    return img;
  }
}

class Bees {
  constructor(props) {
    this.bear = props.bear;
    this.bees = [];
    this.hits = 0;
    this.period = 100;
    this.updateTimer = null;

    this.duration = 10;
    this.lastStingTime = new Date().getTime();
  }

  makeBees() {
    //get number of bees specified by the user
    let nbBees = parseInt(document.getElementById("nbBees").value, 10);

    if (isNaN(nbBees)) {
      //check that the input field contains a valid number
      window.alert("Invalid number of bees");
      return;
    }

    //create bees
    let i = 1;
    while (i <= nbBees) {
      var num = i;
      var bee = new Bee(num); //create object and its IMG element
      bee.display(); //display the bee

      this.bees.push(bee); //add the bee object to the bees array
      i++;
    }
  }

  moveBees() {
    //get speed input field value
    let speed = parseInt(document.getElementById("speedBees").value, 10);
    //move each bee to a random location
    for (let i = 0; i < this.bees.length; i++) {
      let dx = getRandomInt(2 * speed) - speed;
      let dy = getRandomInt(2 * speed) - speed;

      this.bees[i].move(dx, dy);

      this.isHit(this.bees[i], this.bear);
    }
  }

  updateBees() {
    if (this.hits >= 1000) {
      window.alert("GAME OVER");

      //window.alert("GAME OVE);

      // reset the counts too!
      this.hits.reset();
      this.bear.reset();

      this.bees.forEach((bee, index) => {
        if (index) {
          bee.htmlElement.remove();
        }
      });

      return window.clearTimeout(this.updateTimer);
      //return;
    }

    // update loop for game
    //move the bees randomly
    this.moveBees();
    //update the timer for the next move
    this.updateTimer = window.setTimeout(() => this.updateBees(), this.period);
  }

  setPeriod() {
    this.period = parseInt(document.getElementById("periodTimer").value, 10);
  }

  isHit(defender, offender) {
    if (this.overlap(defender, offender)) {
      //check if the two image overlap
      this.hits += 1;
      document.getElementById("hits").innerHTML = this.hits; //display the new score
      //calculate longest duration
      let newStingTime = new Date().getTime();
      let thisDuration = newStingTime - this.lastStingTime;
      this.lastStingTime = newStingTime;
      let longestDuration = parseInt(this.duration.innerHTML, 10);
      if (longestDuration === 0) {
        longestDuration = thisDuration;
      } else {
        if (longestDuration < thisDuration) longestDuration = thisDuration;
      }
      document.getElementById("duration").innerHTML = longestDuration;
    }
  }

  overlap(element1, element2) {
    //consider the two rectangles wrapping the two elements
    //rectangle of the first element
    let left1 = element1.htmlElement.offsetLeft;
    let top1 = element1.htmlElement.offsetTop;
    let right1 =
      element1.htmlElement.offsetLeft + element1.htmlElement.offsetWidth;
    let bottom1 =
      element1.htmlElement.offsetTop + element1.htmlElement.offsetHeight;
    //rectangle of the second element
    let left2 = element2.htmlElement.offsetLeft; //e2x
    let top2 = element2.htmlElement.offsetTop; //e2y
    let right2 =
      element2.htmlElement.offsetLeft + element2.htmlElement.offsetWidth;
    let bottom2 =
      element2.htmlElement.offsetTop + element2.htmlElement.offsetHeight;
    //calculate the intersection of the two rectangles
    let x_intersect = Math.max(
      0,
      Math.min(right1, right2) - Math.max(left1, left2)
    );
    let y_intersect = Math.max(
      0,
      Math.min(bottom1, bottom2) - Math.max(top1, top2)
    );
    let intersectArea = x_intersect * y_intersect;
    //if intersection is nil no hit
    if (intersectArea === 0 || isNaN(intersectArea)) {
      return false;
    }
    return true;
  }
}

/*function isHit(defender, offender) {
if (overlap(defender, offender)) {
  //check if the two image overlap
  let score = hits.innerHTML;
  score = Number(score) + 1; //increment the score
  hits.innerHTML = score; //display the new score
  //calculate longest duration
  let newStingTime = new Date();
  let thisDuration = newStingTime - lastStingTime;
  lastStingTime = newStingTime;
  let longestDuration = Number(duration.innerHTML);
  if (longestDuration === 0) {
    longestDuration = thisDuration;
  } else {
    if (longestDuration < thisDuration) longestDuration = thisDuration;
  }
  document.getElementById("duration").innerHTML = longestDuration;
}
}

function overlap(element1, element2) {
//consider the two rectangles wrapping the two elements
//rectangle of the first element
left1 = element1.htmlElement.offsetLeft;
top1 = element1.htmlElement.offsetTop;
right1 = element1.htmlElement.offsetLeft + element1.htmlElement.offsetWidth;
bottom1 = element1.htmlElement.offsetTop + element1.htmlElement.offsetHeight;
//rectangle of the second element
left2 = element2.htmlElement.offsetLeft; //e2x
top2 = element2.htmlElement.offsetTop; //e2y
right2 = element2.htmlElement.offsetLeft + element2.htmlElement.offsetWidth;
bottom2 = element2.htmlElement.offsetTop + element2.htmlElement.offsetHeight;
//calculate the intersection of the two rectangles
x_intersect = Math.max(0, Math.min(right1, right2) - Math.max(left1, left2));
y_intersect = Math.max(0, Math.min(bottom1, bottom2) - Math.max(top1, top2));
intersectArea = x_intersect * y_intersect;
//if intersection is nil no hit
if (intersectArea == 0 || isNaN(intersectArea)) {
  return false;
}
return true;
}

/*function startGame() {
let startDiv = document.getElementById("start");
let gameCanvas = document.getElementById("canvas");
let gameOver = document.getElementById("game-over");
startDiv.style.display = "none";
gameCanvas.style.display = "block";
gameOver.style.display = "none";
start();
}

function gameOver() {
let startDiv = document.getElementById("start");
let gameCanvas = document.getElementById("canvas");
let gameOver = document.getElementById("game-over");
startDiv.style.display = "none";
gameCanvas.style.display = "none";
gameOver.style.display = "block";

dBear.reset();
bees.reset();

clearInterval(loop);
}*/

function start() {
  //create bear
  const bear = new Bear();
  //create new array for bees
  const bees = new Bees({
    bear
  });

  //create bees
  bees.makeBees();
  bees.updateBees();

  // listen to bear speed changes and update the value
  document
    .getElementById("dBear")
    .addEventListener("change", () => bear.setSpeed());

  // Add an event listener to the keypress event.
  document.addEventListener("keydown", (event) => bear.moveBear(event), false);

  document
    .getElementById("nbBees")
    .addEventListener("change", () => bees.makeBees());

  document
    .getElementById("periodTimer")
    .addEventListener("change", () => bees.setPeriod());
}

start();
