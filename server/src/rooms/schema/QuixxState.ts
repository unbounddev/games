import { Schema, ArraySchema, type, MapSchema } from "@colyseus/schema";

export class Card extends Schema {
  @type([ "boolean" ]) red = new ArraySchema<boolean>(false, false, false, false, false, false, false, false, false, false, false, false);
  @type([ "boolean" ]) yellow = new ArraySchema<boolean>(false, false, false, false, false, false, false, false, false, false, false, false);
  @type([ "boolean" ]) green = new ArraySchema<boolean>(false, false, false, false, false, false, false, false, false, false, false, false);
  @type([ "boolean" ]) blue = new ArraySchema<boolean>(false, false, false, false, false, false, false, false, false, false, false, false);
}

export class Player extends Schema {
  @type("string") name: string = "";
  @type(Card) card: Card = new Card();

  constructor(name: string){
    super();
    this.name = name;
  }
}

export class QuixxState extends Schema {
  @type("string") currPlayer: string = "";
  @type("number") white1: number = 1;
  @type("number") white2: number = 2;
  @type("number") red: number = 3;
  @type("number") yellow: number = 4;
  @type("number") green: number = 5;
  @type("number") blue: number = 6;
  @type({ map: Player }) players = new MapSchema<Player>();
}
