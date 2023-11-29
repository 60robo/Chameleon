import { exit } from "process";
import { ServerWebSocket } from "bun";

import { getRoles, loadLocations, getRandomChoice, shuffleArray, generateID } from './tools';

function refreshConsole() {
  console.clear();
  console.log('listening on ' + server.hostname + ":" + server.port);
  console.log("status: " + data.status);
  console.log("connections: " + connections);
  console.log("players: " + playerCount);
  
  for (let name of data.players){
    console.log("\t" + name);
  }
}

const locations: string[] = loadLocations()
var location: string;
var roles: string[];

var currentSpy = "";
var currentSpyIndex = -1;

var connections = 0;
var playerCount = 0;

var data = {
  type: "data",
  status: "",
  players: [] as string [],
};

type websocketData = {
  isPlayer: boolean;
  name: string;
};

const server = Bun.serve<websocketData>({
      port:6969,
      fetch(request, {}){
        server.upgrade(request, {
          
          data: {
            name: "Spectator",
            isPlayer: false
          }
      });
        return new Response("Server Running!");
      },
      websocket:{
        open(ws) {
          connections++;
          refreshConsole();
          ws.subscribe("game");

          server.publish("game", JSON.stringify(data));
        },

        close(ws, code, reason) {
          connections--;
          if(ws.data.isPlayer){
            playerCount--;
            ws.unsubscribe(ws.data.name);
          }
          data.players.splice(data.players.indexOf(ws.data.name), 1);

          refreshConsole();
        },

        message(ws, message) {
          const splitMessage = message.toString().split(' ');

          if (splitMessage[0] == "join"){
            var name = splitMessage.slice(1).join(" ");

            if (ws.data.name == "Spectator"){
              playerCount++;
              ws.data.isPlayer = true;
              if (playerCount < 3){
                data.status = "Waiting for more Players " + "(" + playerCount + "/3)"
              } else {
                data.status = "Game starting soon";
              }

            } else {
              ws.unsubscribe(ws.data.name);
              data.players.splice(data.players.indexOf(ws.data.name), 1);

            }

            ws.data.name = name;
            ws.subscribe(name);
            data.players.push(name);
            refreshConsole();
            server.publish("game", JSON.stringify(data));
          }

          if (splitMessage[0] == "start" && playerCount >= 3){
            data.status = "starting game...";
            refreshConsole()

            currentSpy = getRandomChoice(data.players);
            currentSpyIndex = data.players.indexOf(currentSpy);

            location = getRandomChoice(locations);
            roles = getRoles(location);

            var rolesNeededCount = playerCount - 1;

            while (roles.length < rolesNeededCount){
              roles = roles.concat(roles);
            }

            roles = shuffleArray(roles);
            roles.splice(currentSpyIndex, 0, "spy");
          
          for (let i = 0; i < data.players.length; i++) {
            if(roles[i] == "spy") {
              server.publish(data.players[i], JSON.stringify({type: "location", Location: "?", Role: "Spy"}));
            } else {
              server.publish(data.players[i], JSON.stringify({Location: location, Role: roles[i]}));
            }
          }

          data.status = "Game Running";
          refreshConsole();
        }
        },
      }
})


console.log('listening on ' + server.hostname + ":" + server.port);