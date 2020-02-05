import { Component, ElementRef, ViewChild, OnInit, OnDestroy, HostListener, Renderer2 } from '@angular/core';
import { GameComponent } from './models/game-component/game-component';
import { ObstacleComponent } from './models/obstacle-component/obstacle-component';
import { TextComponent } from './models/text-component/text-component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {

  private interval;
  private frameNo = 0;
  private context;
  private myObstacles = [];
  private key: number | boolean;
  private player: GameComponent;
  private playerScore: TextComponent;

  public score = 0;
  public title = 'dodge';

  @ViewChild('canvasContainer', { static: true }) private canvas: ElementRef;
  @ViewChild('modal', { static: true }) private modal: ElementRef;

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event) {
    this.key = event.keyCode;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event) {
    this.key = false;
  }

  /**
   * To be implemented for mobile and touch devices
   */
  // @HostListener('window:mousedown', ['$event'])
  // onMousedown(e) {
  // }

  // @HostListener('window:mouseup', ['$event'])
  // onMouseUp(e) {
  // }

  // @HostListener('window:touchstart', ['$event'])
  // onTouchStart(e) {
  // }

  // @HostListener('window:touchend', ['$event'])
  // onTouchEnd(e) {
  // }


  constructor(private renderer: Renderer2) {  }

  ngOnInit() {
    this.generateCanvas();
  }

  generateCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.nativeElement.getBoundingClientRect(); // Get the size of the canvas in CSS pixels.
    this.canvas.nativeElement.width = rect.width * dpr; // Give the canvas pixel dimensions of their CSS size * the device pixel ratio.
    this.canvas.nativeElement.height = rect.height * dpr;
    this.context = this.canvas.nativeElement.getContext('2d');
    this.context.scale(dpr, dpr); // Scale all drawing operations by the dpr, so you don't have to worry about the difference.
    this.startGame();
  }

  startGame() {
    this.frameNo = 0;
    this.score = 0;
    this.myObstacles = [];
    this.player = new GameComponent(30, 30, 'red', 225, 225, 'player');
    this.playerScore = new TextComponent('60px', 'consolas', 'white', this.canvas.nativeElement.width * 0.75, 60);
    this.interval = setInterval(() => {
      this.updateGameArea();
    }, 20);
  }

  gameOver() {
    clearInterval(this.interval);
    this.renderer.addClass(this.modal.nativeElement, 'show-modal');
  }

  restartGame() {
    this.renderer.removeClass(this.modal.nativeElement, 'show-modal');
    this.clearCanvas();
    this.startGame();
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  updateGameArea() {
    let y, width, gap, minWidth, maxWidth, minGap, maxGap;
    for (let i = 0; i < this.myObstacles.length; i += 1) {
      if (this.player.checkCrash(this.myObstacles[i])) {
          this.gameOver();
          return;
      } else {
        this.score += 1;
      }
    }
    this.clearCanvas();
    this.frameNo += 1;
    if (this.frameNo === 1 || this.everyInterval(100)) {
      y = this.canvas.nativeElement.width;
      minWidth = this.canvas.nativeElement.width / 4;
      maxWidth = (this.canvas.nativeElement.width) * 0.75;
      width = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
      minGap = this.canvas.nativeElement.width * 0.2;
      maxGap = (this.canvas.nativeElement.width) * 0.3;
      gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      this.myObstacles.push(new ObstacleComponent(width, 40, 0, 0, 'leftObstacle'));
      this.myObstacles.push(new ObstacleComponent(y - width - gap, 40, width + gap, 0, 'rightObstacle'));
    }
    for (let i = 0; i < this.myObstacles.length; i += 1) {
      this.myObstacles[i].y_coordinate += 1.5;
      this.myObstacles[i].updateComponent(this.context);
    }

    this.playerScore.updateScore(this.context, 'SCORE: ' + this.score);
    this.updatePlayerPosition();
  }

  // updatePlayerPosition() {
  //   this.player.speedX = 0;
  //   this.player.speedY = 0;
  //   if (this.key && this.key === 37) {this.player.speedX = -10; }
  //   if (this.key && this.key === 39) {this.player.speedX = 10; }
  //   if (this.key && this.key === 40) {this.player.speedY = -10; }
  //   if (this.key && this.key === 38) {this.player.speedY = 10; }
  //   this.player.updatePosition(this.context, this.player.speedX, this.player.speedY);
  // }

  updatePlayerPosition() {
    this.player.speed = 0;
    this.player.moveAngle = 0;
    if (this.key && this.key === 37) {this.player.moveAngle = -10; }
    if (this.key && this.key === 39) {this.player.moveAngle = 10; }
    if (this.key && this.key === 40) {this.player.speed = -10; }
    if (this.key && this.key === 38) {this.player.speed = 10; }
    this.player.updatePosition(this.context, this.player.speed, this.player.moveAngle);
  }

  everyInterval(n) {
    if ((this.frameNo / n) % 1 === 0) { return true; }
    return false;
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}
