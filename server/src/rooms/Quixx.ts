import { Room, Client } from "@colyseus/core";
import { QuixxState, Player } from "./schema/QuixxState";

function generateName() {
  const adjectives = ["admiring", "adoring", "agitated", "amazing", "angry", "awesome", "blissful", "bold", "brave", "busy", "calm", "charming", "clever", "cool", "daring", "dark", "determined", "dreamy", "eager", "easy", "elegant", "epic", "exciting", "fabulous", "fast", "festive", "flamboyant", "focused", "friendly", "frosty", "funny", "gentle", "gifted", "glorious", "goofy", "graceful", "happy", "hardcore", "heuristic", "hopeful", "hungry", "infallible", "inspiring", "jolly", "jovial", "keen", "kind", "laughing", "loving", "lucid", "magical", "modest", "musing", "mysterious", "nerdy", "nice", "optimistic", "peaceful", "pedantic", "pensive", "practical", "priceless", "quirky", "romantic", "serene", "sharp", "silly", "sleepy", "stoic", "strange", "sweet", "tender", "thirsty", "trusting", "unruffled", "upbeat", "vibrant", "vigilant", "vocal", "warm", "wary", "wild", "wise", "wonderful", "xenodochial", "youthful", "zealous"];
  const nouns = ["ant", "ape", "armadillo", "bat", "bear", "bee", "beetle", "bird", "bison", "butterfly", "cat", "cheetah", "chicken", "chimpanzee", "cobra", "cod", "crab", "crane", "crocodile", "deer", "dog", "dolphin", "dove", "duck", "eagle", "eel", "elephant", "elk", "ferret", "fish", "flamingo", "fly", "fox", "frog", "gerbil", "goat", "goose", "gorilla", "hamster", "hare", "hawk", "horse", "jellyfish", "kangaroo", "koala", "ladybug", "leopard", "lion", "lizard", "lobster", "manatee", "monkey", "mosquito", "mouse", "octopus", "owl", "panda", "parrot", "pig", "pigeon", "pony", "rabbit", "rat", "rhino", "salmon", "seal", "shark", "sheep", "shrew", "skunk", "snail", "snake", "spider", "squid", "squirrel", "starfish", "stork", "swan", "tiger", "toad", "turkey", "turtle", "walrus", "whale", "wolf", "zebra"];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective}-${randomNoun}`;
}

export class Quixx extends Room<QuixxState> {
  maxClients = 5;
  state = new QuixxState();

  onCreate (options: any) {
    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin (client: Client, options: any) {
    const players = Array.from(this.state.players.values().map(currPlayer => currPlayer.name));
    console.log(this.state);
    let name;
    do {
      name = generateName();
    } while (players.includes(name));
    const player = new Player(name);
    this.state.players.set(client.sessionId, player);
    console.log(client.sessionId, `${player.name} joined!`);
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
