import { _decorator, Component, Node, Vec3, screen, find, UITransform, log, director, view } from 'cc';

import { Game } from './Game';
import { Bird } from './Bird';

const { ccclass, property } = _decorator;

//make a random number generator for the gap
const random = (min, max) =>
{
    return Math.random() * (max - min) + min
}

@ccclass('Pipes')
export class Pipes extends Component
{
    @property({ type: Node, tooltip: 'Top Pipe' })
    public topPipe: Node;

    @property({ type: Node, tooltip: 'Bottom Pipe' })
    public bottomPipe: Node;

    //temporary Locations
    public tempStartLocationUp: Vec3 = new Vec3(0, 0, 0);  //Temporary location of the up pipe
    public tempStartLocationDown: Vec3 = new Vec3(0, 0, 0); //Temporary location of the bottom pipe
    public scene = screen.windowSize; //get the size of the screen in case we decide to change the content size

    //get the pipe speeds
    public game: Game; //get the pipe speed from GameCtrl
    public bird: Bird;
    public pipeSpeed: number; //use as a final speed number
    public tempSpeed: number; //use as the moving pipe speed

    //scoring mechanism
    isPass: boolean; //Did the pipe pass the bird?

    protected onLoad (): void
    {

        //first search the gamec control
        let gameControl = find("GameCtrl");
        if (gameControl == null)
        {
            log("GameCtrl not found");
            return;
        }
        else
        {
            this.game = gameControl.getComponent(Game);
            this.bird = this.game.bird;
        }
        

        //add pipespeed to temporary method
        this.pipeSpeed = this.game.Scroll.speed;

        //set the original position
        this.initPos();

        //set the scoring mechanism to stop activating
        this.isPass = false;
    }

    //initial positions of the grounds
    initPos ()
    {   
        const visibleSize = view.getVisibleSize();

        let width = visibleSize.width;

        //start with the initial position of x for both pipes
        this.tempStartLocationUp.x = (this.topPipe.getComponent(UITransform).width + width);
        this.tempStartLocationDown.x = (this.bottomPipe.getComponent(UITransform).width + width);

        //random variables for the gaps
        // let gap = random(50, 50);  //passable area randomized. 
        let gap = 50;  //passable area.
        let topHeight = random(-30, 150);   //The height of the top pipe

        this.tempStartLocationUp.y = gap;
        this.tempStartLocationDown.y = -gap;

        //set temp locations to real ones
        this.topPipe.setPosition(this.tempStartLocationUp.x, this.tempStartLocationUp.y);
        this.bottomPipe.setPosition(this.tempStartLocationDown.x, this.tempStartLocationDown.y);

        let tempPos = this.node.getPosition();
        tempPos.y = topHeight;
        this.node.setPosition(tempPos);
    }

    //move the pipes as we update the game
    //this just moves a pair of pipes top and down
    protected update (deltaTime: number): void
    {
        // if(this.game.isOver==false) return;
        if(this.bird==null)
        {
            log("bird is null");
            return;
        }
        if (this.bird.state == 0 || this.bird.state==2) return;
        //get the pipe speed
        this.tempSpeed = Math.abs(this.pipeSpeed * deltaTime);

        //make temporary pipe locations
        this.tempStartLocationDown = this.bottomPipe.position;
        this.tempStartLocationUp = this.topPipe.position;

        //move temporary pipe locations
        this.tempStartLocationDown.x -= this.tempSpeed;
        this.tempStartLocationUp.x -= this.tempSpeed;

        //place new positions of the pipes from temporary pipe locations
        this.bottomPipe.setPosition(this.tempStartLocationDown);
        this.topPipe.setPosition(this.tempStartLocationUp);

        // //find out if bird past a pipe, add to the score
        // if (this.isPass == false && this.topPipe.position.x <= 0)
        // {

        //     //make sure it is only counted once
        //     this.isPass = true;

        //     //add a point to the score
        //     // this.game.passPipe();

        // };

        //if passed the screen, reset pipes to new location
        if (this.topPipe.getWorldPosition().x < (0 - this.scene.width))
        {
            //create a new pipe
            // this.game.createPipe();

            //delete this node for memory saving
            this.destroy();
        };

    }
}


