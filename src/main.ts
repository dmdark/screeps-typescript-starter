import * as Config from "./config/config";
import CreepManager from "./components/creeps/creepManager";
import SourceManager from "./components/creeps/sourceManager";
import SpawnManager from "./components/creeps/spawnManager";
import UpgradeManager from "./components/creeps/upgradeManager";

// Any code written outside the `loop()` method is executed only when the
// Screeps system reloads your script.
// Use this bootstrap wisely. You can cache some of your stuff to save CPU.
// You should extend prototypes before the game loop executes here.

// This is an example for using a config variable from `config.ts`.
if (Config.USE_PATHFINDER) {
  PathFinder.use(true);
}


/**
 * Screeps system expects this "loop" method in main.js to run the
 * application. If we have this line, we can be sure that the globals are
 * bootstrapped properly and the game loop is executed.
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 *
 * @export
 */
export function loop() {
  // Check memory for null or out of bounds custom objects
  if (!Memory.uuid || Memory.uuid > 100) {
    Memory.uuid = 0;
  }

  SpawnManager.getInstance().init();
  const room: Room = Game.rooms["sim"];

  const sourceManager = new SourceManager(room);
  sourceManager.run();

  const creepManager = new CreepManager(room);
  creepManager.run();

  const upgradeManager = new UpgradeManager(room);
  upgradeManager.run();

  SpawnManager.getInstance().execute();

  clearMemory(room.name);
}

function clearMemory(roomName: string) {
  // Clears any non-existing creep memory.
  for (let name in Memory.creeps) {
    let creep: any = Memory.creeps[name];

    if (creep.room === roomName) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
  }
}