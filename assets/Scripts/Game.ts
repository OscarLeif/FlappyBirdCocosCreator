import { _decorator, AudioClip, AudioPCMDataView, AudioSource, Collider2D, Component, Contact2DType, director, EventGamepad, EventKeyboard, EventMouse, Input, input, KeyCode, log, Node, NodeEventType, RichText, Scene, sys, tween, UIOpacity, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { Bird } from './Bird';
import { Scroll } from './Scroll';
import { PipePool } from './PipePool';
import { AndroidNative } from './Android/AndroidNative';
import { FlashUI } from './UI/FlashUI';

@ccclass('Game')
export class Game extends Component
{

    @property({ type: Bird, tooltip: "Add Bird node", })
    public bird: Bird;

    @property({ type: Scroll, tooltip: "Add Scroll node", })
    public Scroll: Scroll;

    @property({ type: UIOpacity, tooltip: "Add UIOpacity node", })
    public SpriteFade: UIOpacity;

    @property({ type: Node, tooltip: "Add GameOver node", })
    public GameOverNode: Node;

    @property({ type: PipePool, tooltip: "Add PipePool node", })
    public pipeQueue: PipePool;

    //needed to tell the game it's over
    public isOver: boolean;

    @property({ type: AudioSource, tooltip: "Add AudioSource node", })
    public AudioSource: AudioSource;

    @property({ type: AudioClip, tooltip: "Add hitSound node", })
    public hitSound: AudioClip;

    @property({ type: AudioClip, tooltip: "Add hitSound node", })
    public scoreSound: AudioClip;

    public score: number = 0;

    @property({ type: RichText, tooltip: "Add ScoreLabel node", })
    public ScoreLabel: RichText = null;

    @property({ type: Vec3, tooltip: "Add GameOverStartPos node", })
    public gameOverStartPos: Vec3;

    @property({ type: Vec3, tooltip: "Add GameOverStartPos node", })
    public gameOverHidePos: Vec3;

    @property({ type: RichText, tooltip: "Add labelScore node", })
    public labelScore: RichText = null;

    @property({ type: RichText, tooltip: "Add labelBestScore node", })
    public labelBestScore: RichText = null;

    @property({type: FlashUI, tooltip: "The Flash Screen" })
    public FlashUI: FlashUI;    

    protected onLoad (): void
    {
        this.score = 0;
        this.isOver = true;
        this.SpriteFade.opacity = 255;
        this.initListener();

        //disable game over node
        this.GameOverNode.active = false;

        log("Game Over Pos " + this.GameOverNode.position.toString());
        log("Game Over World Pos " + this.GameOverNode.getWorldPosition());

        this.gameOverStartPos = this.GameOverNode.getWorldPosition();
        this.gameOverHidePos = new Vec3(this.gameOverStartPos.x, this.gameOverStartPos.y - 1000, this.gameOverStartPos.z);
        this.GameOverNode.setPosition(new Vec3(0, -1000));

        tween().
            target(this.SpriteFade)
            .to(0.5, { opacity: 0 })
            .start();
    }

    initListener (): void
    {
        
        input.on(Input.EventType.KEY_DOWN, this.OnKeyDown, this);
        // input.on(Input.EventType.MOUSE_DOWN, this.OnClick, this)
        input.on(Input.EventType.TOUCH_START, this.touchStart, this);       
        input.on(Input.EventType.GAMEPAD_INPUT, this.GamePadOnKeyDown, this);     
    }

    private GamePadOnKeyDown (event: EventGamepad): void
    {
        if (event.gamepad.buttonSouth.getValue() == 1)
        {
            this.FlapBird();
        }
    }


    private OnClick (event: EventMouse): void
    {
        log("Mouse Click");
        this.FlapBird();
    }

    private touchStart (): void
    {
        log("Click and Touch");
        this.FlapBird();
    }

    OnKeyDown (event: EventKeyboard)
    {
        switch (event.keyCode)
        {
            case KeyCode.KEY_A:
                log("You Press the A Key");
                break;
            case KeyCode.SPACE:
                {
                    this.FlapBird();
                }
                break;
        }
    }

    public FlapBird (): void
    {
        log("Flap Bird");
        if (this.isOver) 
        {
            this.resetGame();
            // this.bird.resetBird();
            this.startGame();

        }

        if (this.isOver == false)
        {
            if (this.bird == null)
            {
                // node is null
                log("The Bird is Null asign on the editor");
            }
            this.bird.play();
        }
    }

    startGame () :void
    {
        this.isOver = false;
        // this.Scroll.StartScroll();
        //this.pipeQueue.addPool();
    }

    resetGame ():void
    {
        this.isOver = false;
        // this.pipeQueue.reset();//We should just pause the pipe queue
        // this.bird.resetBird();
        // this.Scroll.reset();
    }

    AddPoint ():void
    {
        this.score++;
        this.ScoreLabel.string = this.score.toString();
        this.AudioSource.playOneShot(this.scoreSound, 1);
    }

    Dead (): void
    {
        if (this.isOver == false)
        {
            this.FlashUI.Flash();
            
            this.isOver = true;
            this.Scroll.StopScroll();
            this.AudioSource.playOneShot(this.hitSound, 1);
            this.GameOverNode.active = true;

            this.labelScore.string = this.score.toString();

            //get the saved score, data is only saved as string.
            let recoverScore = localStorage.getItem("bestScore");
            if (recoverScore == null)
            {
                localStorage.setItem("bestScore", "0");
            }
            let bestScore = parseInt(localStorage.getItem("bestScore"));

            if (this.score > bestScore)
            {
                bestScore = this.score;
                localStorage.setItem("bestScore", bestScore.toString());
            }

            this.labelBestScore.string = bestScore.toString();

            tween(this.GameOverNode)
                .to(1, { position: new Vec3(0, 0) })
                .start();
        }
    }

    // The function that will be called when the button is clicked
    public onClickRestartGame (event, customData)
    {
        tween().
            target(this.SpriteFade)
            .to(0.5, { opacity: 255 })
            .call(this.RestartGame)
            .start();
    }

    private RestartGame (): void
    {
        //count gameplay
        let countGamePlay = localStorage.getItem("countGamePlay");
        if (countGamePlay == null)
        {
            localStorage.setItem("countGamePlay", "0");
        }
        let count = parseInt(localStorage.getItem("countGamePlay"));
        count++;
        
        if(count>3)
        {
            count = 0;
        }        
        localStorage.setItem("countGamePlay", count.toString());

        director.loadScene("game");
    }

    timerSpawnPipe: number = 0;

    protected update (dt: number): void
    {
        if (this.isOver == false)
        {
            this.timerSpawnPipe += dt;
            if (this.timerSpawnPipe > 1)
            {
                this.timerSpawnPipe = 0;
                this.pipeQueue.addPool();
            }
        }
    }

    contactGroundPipe (): void
    {
        let collider = this.bird.node.getComponent(Collider2D);
        if (collider)
        {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: any): void
    {
        this.bird.hitSomething = true;
    }
}


