var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex ,trex_running,trex_collided;
var edges, groundImage;
var invisibleGround;
var cloud;
var cloudImage;
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obsatcle6;
var score;
var cloudsGroup,obstaclesGroup;
var gameOver, gameOverImg, restart, restartImg;
var jumpSound,checkPointSound,dieSound;
function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided= loadAnimation("trex_collided.png");
  groundImage = loadImage ("ground2.png");
  cloudImage = loadImage ("cloud.png");
  obstacle1 = loadImage ("obstacle1.png");
  obstacle2 = loadImage ("obstacle2.png");
  obstacle3 = loadImage ("obstacle3.png");
  obstacle4 = loadImage ("obstacle4.png");
  obstacle5 = loadImage ("obstacle5.png");
  obstacle6 = loadImage ("obstacle6.png");
  gameOverImg = loadImage ("gameOver.png");
  restartImg = loadImage ("restart.png");
  jumpSound = loadSound ("sonidos/jump.mp3");
  checkPointSound = loadSound ("sonidos/checkpoint.mp3");
  dieSound = loadSound  ("sonidos/die.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //create a trex sprite
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  //añade la escala y la pocicion del trex
  trex.scale = 0.4;
  trex.x = 50;

  // crea el sprite el suelo
  ground = createSprite (width/2,height,width,2);
  ground.addImage (groundImage);
  ground.x = width/2;
  ground.velocityX = -4;
  gameOver = createSprite (width/2,height/2-50);
  gameOver.addImage (gameOverImg);
  restart = createSprite (width/2,height/2);
  restart.addImage (restartImg);
  restart.scale = 0.6;
  gameOver.scale = 0.7;
  //crear sprite del suelo invisible
  invisibleGround = createSprite (width/2,height-10,width,10);
  invisibleGround.visible = false;
  gameOver.visible = false;
  restart.visible = false;
  //crear grupos de obstáculos y nubes
  obstaclesGroup= new Group();
  cloudsGroup= new Group();
  

  //establecer colicionador
  trex.setCollider("circle",0,0,40);
  trex.debug=true;
  edges = createEdgeSprites();
  score = 0;
}

function draw(){
  background("green");
  //mostrar puntuación
  fill ("white");
  text("puntaje: "+score,500,50);
  
  if (gameState == PLAY){
    score = score+Math.round(getFrameRate()/60);
    if (score  > 0 && score %300 == 0){
      checkPointSound.play();
    } 
    ground.velocityX = 0;
    if (ground.x < 0) {
      ground.x = 200;
    }
    //salta cuando se presione barra espaciadora
    if (keyDown("space") && trex.y >= height-120){
      trex.velocityY = -10;
      jumpSound.play();
    }
   trex.velocityY = trex.velocityY + 0.5;
   spawnClouds();
  spawnObstacles();
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
    }
  }
  else if (gameState == END){
    ground.velocityX = 0;
    trex.velocityX= 0;
    gameOver.visible = true;
    restart.visible = true;
    //establecer tiempo de vida a los objetos de los grupos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    //cambiar animación del trex
    trex.changeAnimation("collided",trex_collided);


    //detener nubes y obstaculos
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  }
 
  
  
 

  //evita que el trex caiga
  
  trex.collide (invisibleGround);
  if(mousePressedOver(restart)){
    reset();
  }
    drawSprites();

}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score = 0;
}
function spawnClouds(){
  if(frameCount % 60 == 0){
    cloud = createSprite(width+20,height-300,40,10);
    cloud.addImage(cloudImage);
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    cloud.y = Math.round (random(10,60));
    cloud.lifetime = 300 ;

    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //aagegar nube al grupo
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles(){
  if (frameCount % 60 == 0){
    var obstacle = createSprite (600,height-95,10,40);
    obstacle.velocityX = -6;
    obstacle.lifetime = 100;
    obstacle.scale = 0.5;
    //generar obstaculos aleatorios
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;        
    }
    trex.depth = obstacle.depth +1;

    //Agregar cada obstácuo al grupo
    obstaclesGroup.add(obstacle);
  }
}