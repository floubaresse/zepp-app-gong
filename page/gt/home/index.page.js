import * as hmUI from "@zos/ui";
import { log as Logger } from "@zos/utils";
import { TEXT_STYLE } from "zosLoader:./index.page.[pf].layout.js";
import { create, id} from "@zos/media"
import { Vibrator, VIBRATOR_SCENE_SHORT_LIGHT } from "@zos/sensor";
import { setPageBrightTime } from '@zos/display'
import { pauseDropWristScreenOff } from '@zos/display'

const player = create(id.PLAYER);


function initBong() {


  player.addEventListener(player.event.PREPARE, function (result) {
    if (result) {
      console.log('=== prepare succeed ===')
      player.start()
    } else {
      console.log('=== prepare fail ===')
      player.release()
    }
  })
  
  player.addEventListener(player.event.COMPLETE, function (result) {
    console.log('=== play end ===')
    player.stop()
    //player.release()
  })

  console.log("setting source...")
  player.setSource(player.source.FILE, { file: 'bong.mp3' })

}


function bong () {

  console.log(player.getStatus())
  console.log("preparing...")

  player.prepare()
  console.log(player.getStatus())

  const vibrator = new Vibrator();
  vibrator.setMode(VIBRATOR_SCENE_SHORT_LIGHT);
  
  vibrator.stop()
  vibrator.start()
}


const logger = Logger.getLogger("bong");
Page({
  onInit() {
    logger.debug("page onInit invoked");
  },
  build() {
    logger.debug("page build invoked");
    hmUI.createWidget(hmUI.widget.TEXT, TEXT_STYLE);

    this.startBong();

  },
  onDestroy() {
    logger.debug("page onDestroy invoked");
  },

  startBong () {
    // don't turn off the screen for 600 seconds
    const result = setPageBrightTime({
      brightTime: 6000 * 1000,
    })

    // don't turn off the screen on wrist down for 600 seconds
    pauseDropWristScreenOff({
      duration: 6000 * 1000,
    })

    initBong();
    bong();

    setInterval(function() {
      bong();
    }, 30 * 1000);

    
    
  },
});