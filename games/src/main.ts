import { Application, Assets, Container, Sprite, testImageFormat, Text } from "pixi.js";
import { Client, getStateCallbacks, Room } from "colyseus.js";
import type { QuixxState, Player } from "../server/src/rooms/schema/QuixxState";
 
const client = new Client("http://localhost:2567");

const DICE_PATH = "/assets/dice/dieWhite_border";

(async () => {
  // Create a new application
  const app = new Application();
  await app.init({ background: "#1099bb", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);
  const game = new Container();
  const room: Room<QuixxState> = await client.joinOrCreate("quixx");
  // const players = [];
  const $ = getStateCallbacks(room);

  const text = [new Text(), new Text(), new Text(), new Text()];
  const text_loc = [
    { x: app.screen.width * 0.5, y: app.screen.height * 0.9 },
    { x: app.screen.width * 0.1, y: app.screen.height * 0.5 },
    { x: app.screen.width * 0.5, y: app.screen.height * 0.1 },
    { x: app.screen.width * 0.1, y: app.screen.height * 0.5 },
  ];

  for (let i = 0; i < text.length; i++){
    text[i].anchor.set(0.5);
    text[i].position.set(text_loc[i].x, text_loc[i].y);
    game.addChild(text[i]);
  }

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
      })
    }
  }

  $(room.state).players.onAdd((player, index) => {
    console.log(room.state.players);
    displayPlayers();
  })

  $(room.state).players.onRemove((player) => {
    displayPlayers();
  })
  // Initialize the application

  // Append the application canvas to the document body

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

  const die_gap = dice[0].width*0.5+5;
  const dice_pos = [
    { x: app.screen.width * 0.5 - die_gap * 2, y: app.screen.height / 2 - die_gap },
    { x: app.screen.width * 0.5, y: app.screen.height / 2 - die_gap },
    { x: app.screen.width * 0.5 + die_gap * 2, y: app.screen.height / 2 - die_gap },
    { x: app.screen.width * 0.5 - die_gap * 2, y: app.screen.height / 2 + die_gap },
    { x: app.screen.width * 0.5, y: app.screen.height / 2 + die_gap },
    { x: app.screen.width * 0.5 + die_gap * 2, y: app.screen.height / 2 + die_gap },
  ]

  // position dice and add them to game
  dice.forEach((die, i) => {
    die.anchor.set(0.5);
    die.position.set(dice_pos[i].x, dice_pos[i].y);
    game.addChild(die);
  })

  // set dice color
  dice[2].tint = 0xff0000;
  dice[3].tint = 0x00ff00;
  dice[4].tint = 0x0000ff;
  dice[5].tint = 0xffff00;


  // Add the game to the stage
  app.stage.addChild(game);

  // Listen for animate update
  // app.ticker.add((time) => {
  //   // Just for fun, let's rotate mr rabbit a little.
  //   // * Delta is 1 if running at 100% performance *
  //   // * Creates frame-independent transformation *
  // });
})();
