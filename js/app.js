var life = 3;
var score = 0;
var level = 30;

// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    this.x = x; // location X
    this.y = y; // location Y
    this.speed = speed; // Speed of ennemy
    this.sprite = 'images/enemy-bug.png'; // The image/sprite for our enemies
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt; // Ensure the game run at same speed for all computers.
    if (this.x > 450){ // remove ennemies once they reach the end
        this.x = -101;
        allEnemies.splice(allEnemies.indexOf(this), 1);
    }
    this.collisionCheck();

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

//used https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
Enemy.prototype.collisionCheck = function(){
    var playerZone = { x: player.x, y: player.y, width: 50, height: 40 }
    var enemyZone = { x: this.x, y: this.y, width: 50, height: 30 }
    if (playerZone.x < enemyZone.x + enemyZone.width &&
        playerZone.x + playerZone.width > enemyZone.x &&
        playerZone.y < enemyZone.y + enemyZone.height &&
        playerZone.y + playerZone.height > enemyZone.y){
        this.collided();
    }
};

Enemy.prototype.collided = function(){
    life -=1;
    if (life === 0){ //Game over alert
        alert("Game over!");
        location.reload(); // reload game
    }else {
        alert(`You got HIT! life remaining = ${life}`); // alert remaining lives
    }
    player = new Player(200,400,5);
    
};

var Player = function(x,y,speed) {
    this.x = x; // location X
    this.y = y; // location Y
    this.speed = speed; // Speed of player
    this.sprite = 'images/char-boy.png'; //player image
};


Player.prototype.update = function(){
    if (life < 1 ){
        allEnemies = []; // clear ennemies if no life left
    }else {
        this.generateEnemy(); // if more than 1 life, generate ennemies
    }
    

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.generateEnemy = function(){
    ennemies = 3;
    if (level > 50){ // increase ennemies according to difficulty level
        ennemies = 4;
    }else if (level > 80){
        ennemies = 5;
    }
    if (allEnemies.length <1){  //generate ennemies if none
        for (i=0; i<ennemies; i++){
            this.difficutly(level);
        }
    }
};

//Canvas move side way by 101 and up/down by 83 according to render() in engine.js
Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            if (this.x >50){
                this.x -= 101;
        }
            break;
        case 'right':
            if (this.x <400){
                this.x += 101;
            }
            break;
        case 'up':
            if (this.y === 68){
                this.winner(); // Score!
            }else if (this.y > 68) {
                this.y -= 83;
            }
            break;
        case 'down':
            if (this.y < 400){
                this.y += 83;
            }
            break;
        default:
            break;
    }

};

Player.prototype.winner = function(){
    // winner function
    this.y -= 83; // make the last move.
    score +=100;
    document.querySelector('.score').textContent=score; // display score
    if (level <=100){
        level +=10;
    }
    this.difficutly(level);
    setTimeout(function(){ player = new Player(200,400,5); }, 500); // wait on respawning.
    
};

//difficutly level ennemy generator
Player.prototype.difficutly = function(s){
    if (allEnemies.length <= 2){ //find a way to limit ennemy at once and respwan after
        var Speed = s * Math.floor(Math.random() * 10 + 2);
    }else if (allEnemies.length <=4) {
        var Speed = s * Math.floor(Math.random() * 10 + 5);
    }else if (allEnemies.length <=6) {
        var Speed = s * Math.floor(Math.random() * 10 + 8);
    }
    //safe zone at the bottom, ennemy start at 300.
    allEnemies.push(new Enemy(-101, 60 + (Math.floor(Math.random() * 300) + 1 ), Speed));
}

var allEnemies = [];
var player = new Player(200,400,5);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

