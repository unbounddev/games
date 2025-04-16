import { Application, Assets, Container, Graphics, GraphicsContext, Sprite, testImageFormat, Text, TextStyleOptions, Texture } from "pixi.js";
import { Client, getStateCallbacks, Room } from "colyseus.js";
import type { QuixxState, Player } from "../server/src/rooms/schema/QuixxState";
 
const client = new Client("http://localhost:2567");

const DICE_PATH = "/assets/dice/dieWhite_border";
const BLUE = 0x1c9fd7;
const GREEN = 0x16bb77;
const RED = 0xee2747;
const YELLOW = 0xffcc00;
const BACKGROUND = 0x1099bb;
const CONFIG = {
  WIDTH: 1920,
  HEIGHT: 1080
};

(async () => {
  
  // Create a new application
  const app = new Application();
  // Initialize the application
  await app.init({ 
    background: BACKGROUND, 
    resizeTo: window,
    autoDensity: true
  });
  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);
  document.documentElement.requestFullscreen()
  const redSquareTexture = await Assets.load("/assets/ui/red_square.png");
  const yellowSquareTexture = await Assets.load("/assets/ui/yellow_square.png");
  const greenSquareTexture = await Assets.load("/assets/ui/green_square.png");
  const blueSquareTexture = await Assets.load("/assets/ui/blue_square.png");
  const buttonTexture = await Assets.load("/assets/ui/button.png");
  const game = new Container();
  game.width = CONFIG.WIDTH;
  game.height = CONFIG.HEIGHT;
  game.scale.x = actualWidth() / CONFIG.WIDTH;
  game.scale.y = actualHeight() / CONFIG.HEIGHT;
  game.x = app.screen.width / 2 - actualWidth() / 2;
  game.y = app.screen.height / 2 - actualHeight() / 2;
  // const bg = new Sprite(Texture.WHITE);
  // bg.width = CONFIG.WIDTH;
  // bg.height = CONFIG.HEIGHT;
  // bg.tint = BACKGROUND;
  // Add the game to the stage
  app.stage.addChild(game);
  // game.addChild(bg);
  const room: Room<QuixxState> = await client.joinOrCreate("quixx");
  // const players = [];
  const $ = getStateCallbacks(room);

  const text = [new Text(), new Text(), new Text(), new Text()];
  const text_loc = [
    { x: () => CONFIG.WIDTH * 0.5, y: CONFIG.HEIGHT - 50 },
    { x: (text: Text) => text.width / 2 + 30 , y: CONFIG.HEIGHT / 2 },
    { x: () => CONFIG.WIDTH * 0.5, y: 50 },
    { x: (text: Text) => CONFIG.WIDTH - text.width / 2 - 30, y: CONFIG.HEIGHT * 0.5 },
  ];

  for (let i = 0; i < text.length; i++){
    text[i].anchor.set(0.5);
    text[i].position.set(text_loc[i].x(text[i]), text_loc[i].y);
    game.addChild(text[i]);
  }

  const button = new Sprite(buttonTexture);
  button.position.set(CONFIG.WIDTH * 0.9, CONFIG.HEIGHT * 0.9);
  button.scale.set(1.5);
  button.anchor.set(0.5);
  game.addChild(button);
  button.on('pointerdown', (event) => { alert('Roll!'); });
  button.eventMode = 'static';

  const rollText = new Text({ text: 'Roll', style: { fontWeight: 'bold', fontSize: 48, fill: GREEN }});
  rollText.position.set(CONFIG.WIDTH * 0.9, CONFIG.HEIGHT * 0.9);
  rollText.anchor.set(0.5);
  game.addChild(rollText);

  room.onStateChange((state) => {
    console.log(state)
  })

  function displayPlayers(){
    // get player names
    let playerNames = room.state.players.values();
    playerNames = Array.from(playerNames);
    playerNames = playerNames.map(p => p.name);
    // clear current text
    text.forEach(t => t.text = "");
    // display players
    if(playerNames.length == 1){
      text[0].text = playerNames[0];
    } else if (playerNames.length > 1){
      const currPlayerIndex = playerNames.indexOf(room.state.players.get(room.sessionId).name);
      const displayOrder = [...playerNames.slice(currPlayerIndex), ...playerNames.slice(0, currPlayerIndex)];
      displayOrder.forEach((player, index) => {
        text[index].text = player;
        text[index].position.set(text_loc[index].x(text[index]), text_loc[index].y)
      })
    }
  }

  class Card {
    container: Container = new Container();
    redSquares: Container[] = [];
    yellowSquares: Container[] = [];
    greenSquares: Container[] = [];
    blueSquares: Container[] = [];
  
    constructor(startX: number, startY: number){
      const squareSize = 64;
      const squareGap = squareSize + 10;
      const fontStyle: Partial<TextStyleOptions> = {
        fontWeight: "bold", 
        fontSize: 36
      };

      for (let i = 0; i < 12; i++){
        const redContainer = new Container();
        const redSquare = new Sprite(redSquareTexture);
        const redNumberText = new Text({ text: `${i+1}`, style: fontStyle });
        redContainer.position.set(startX + ((i-6)*squareGap) + (redSquare.width/2+5), startY);
        redNumberText.anchor.set(0.5);
        redSquare.anchor.set(0.5);
        redContainer.addChild(redSquare, redNumberText);
        const yellowContainer = new Container();
        const yellowSquare = new Sprite(yellowSquareTexture);
        const yellowNumberText = new Text({ text: `${i+1}`, style: fontStyle });
        yellowContainer.position.set(startX + ((i-6)*squareGap) + (yellowSquare.width/2+5), startY+squareGap);
        yellowNumberText.anchor.set(0.5);
        yellowSquare.anchor.set(0.5);
        yellowContainer.addChild(yellowSquare, yellowNumberText);
        const greenContainer = new Container();
        const greenSquare = new Sprite(greenSquareTexture);
        const greenNumberText = new Text({ text: `${i+1}`, style: fontStyle });
        greenContainer.position.set(startX + ((i-6)*squareGap) + (greenSquare.width/2+5), startY+squareGap*2);
        greenNumberText.anchor.set(0.5);
        greenSquare.anchor.set(0.5);
        greenContainer.addChild(greenSquare, greenNumberText);
        const blueContainer = new Container();
        const blueSquare = new Sprite(blueSquareTexture);
        const blueNumberText = new Text({ text: `${i+1}`, style: fontStyle });
        blueContainer.position.set(startX + ((i-6)*squareGap) + (blueSquare.width/2+5), startY+squareGap*3);
        blueNumberText.anchor.set(0.5);
        blueSquare.anchor.set(0.5);
        blueContainer.addChild(blueSquare, blueNumberText);
        this.redSquares.push(redContainer);
        this.yellowSquares.push(yellowContainer);
        this.greenSquares.push(greenContainer);
        this.blueSquares.push(blueContainer);
      }
      this.container.addChild(...this.redSquares, ...this.yellowSquares, ...this.greenSquares, ...this.blueSquares);
    }
  }

  function actualWidth() {
    const { width, height } = app.screen;
    const isWidthConstrained = width < height * 16 / 9;
    return isWidthConstrained ? width : height * 16 / 9;
  }

  function actualHeight() {
    const { width, height } = app.screen;
    const isHeightConstrained = height < width * 9 / 16;
    return isHeightConstrained ? height : width * 9 / 16;
  }

  $(room.state).players.onAdd((player, index) => {
    console.log(room.state.players);
    displayPlayers();
  })

  $(room.state).players.onRemove((player) => {
    displayPlayers();
  })

  // Load the dice textures
  const DICE_TEXTURES = [
    await Assets.load(`${DICE_PATH}1.png`),
    await Assets.load(`${DICE_PATH}2.png`),
    await Assets.load(`${DICE_PATH}3.png`),
    await Assets.load(`${DICE_PATH}4.png`),
    await Assets.load(`${DICE_PATH}5.png`),
    await Assets.load(`${DICE_PATH}6.png`),
  ]
  
  // Create a dice Sprites
  const dice = [
    new Sprite(DICE_TEXTURES[0]),
    new Sprite(DICE_TEXTURES[1]),
    new Sprite(DICE_TEXTURES[2]),
    new Sprite(DICE_TEXTURES[3]),
    new Sprite(DICE_TEXTURES[4]),
    new Sprite(DICE_TEXTURES[5]),
  ];

  const die_width = dice[0].width;
  const die_gap = die_width*0.5+5;
  const dice_pos = [
    { x: CONFIG.WIDTH * 0.5 - die_width - 10, y: CONFIG.HEIGHT / 2 - die_gap },
    { x: CONFIG.WIDTH * 0.5, y: CONFIG.HEIGHT / 2 - die_gap },
    { x: CONFIG.WIDTH * 0.5 + die_width + 10, y: CONFIG.HEIGHT / 2 - die_gap },
    { x: CONFIG.WIDTH * 0.5 - die_width - 10, y: CONFIG.HEIGHT / 2 + die_gap },
    { x: CONFIG.WIDTH * 0.5, y: CONFIG.HEIGHT / 2 + die_gap },
    { x: CONFIG.WIDTH * 0.5 + die_width + 10, y: CONFIG.HEIGHT / 2 + die_gap },
  ]

  // position dice and add them to game
  dice.forEach((die, i) => {
    die.anchor.set(0.5);
    die.position.set(dice_pos[i].x, dice_pos[i].y);
    game.addChild(die);
  })

  // set dice color
  dice[2].tint = RED;
  dice[3].tint = GREEN;
  dice[4].tint = BLUE;
  dice[5].tint = YELLOW;
  
  // draw players card
  const playerCard = new Card(CONFIG.WIDTH*0.5, CONFIG.HEIGHT*0.5+die_width+10+64);
  game.addChild(playerCard.container);

  // draw opponent card
  const opponentCard = new Card(CONFIG.WIDTH*0.5, CONFIG.HEIGHT*0.5-256-die_width-48);
  game.addChild(opponentCard.container);


  

  // Listen for animate update
  // app.ticker.add((time) => {
  //   // Just for fun, let's rotate mr rabbit a little.
  //   // * Delta is 1 if running at 100% performance *
  //   // * Creates frame-independent transformation *
  // });
})();
