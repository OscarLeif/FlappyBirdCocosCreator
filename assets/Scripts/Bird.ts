import
{
    _decorator,
    AudioClip,
    AudioSource,
    CCFloat,
    Collider2D,
    Component,
    Contact2DType,
    IPhysics2DContact,
    lerp,
    log,
    Node,
    RigidBody2D,
    Tween,
    tween,
    Vec2,
    Vec3,
} from 'cc';
const { ccclass, property } = _decorator;

//create a enum waiting, playing, dead
enum State
{
    WAITING = 0,
    PLAYING = 1,
    DEAD = 2,
}

import { Game } from './Game';
import { SpriteAnimator } from './SpriteAnimator';

@ccclass('Bird')
export class Bird extends Component
{
    public actionTime: number = 1;

    @property({ type: Game })
    public Game: Game;

    @property({ type: CCFloat })
    public verticalForce: number = 300;

    @property({ type: AudioSource, tooltip: "Add AudioSource node", })
    public AudioSource: AudioSource;

    @property({ type: AudioClip, tooltip: "Add FlappySound node", })
    public FlappySound: AudioClip;

    public state: State = State.WAITING;

    _wPos: Vec3 = new Vec3(0, 0, 0);

    private rb: RigidBody2D;
    private collider2D: Collider2D;
    private SpriteAnimator: SpriteAnimator;

    private tweenPos: Tween<Vec3>;

    private startPos: Vec3;

    private timerRotateUp: number = 0;
    private timeElapsedDown: number = 0;

    private rotateLerpDuration: number = 10;
    private rotateLerpDurationUp: number = 0.5;

    private tweenRotateUp: Tween<number>;

    private faceUpAngle: number = 15;

    public hitSomething: boolean = false;

    protected onLoad (): void 
    {
        this.state = State.WAITING;
        this.rb = this.node.getComponent(RigidBody2D);
        this.collider2D = this.node.getComponent(Collider2D);
        this.SpriteAnimator = this.node.getComponent(SpriteAnimator);
        this.rb.gravityScale = 0;

        Vec3.copy(this._wPos, this.node.worldPosition);
        this.startPos = this.node.getWorldPosition();
        let moveUp = this.node.getWorldPosition();
        moveUp.y += 20;

        this.tweenPos = tween(this._wPos)
            .to(this.actionTime, moveUp, { easing: 'linear' })
            .to(this.actionTime, this.startPos, { easing: 'linear' })
            .union()
            .repeat(Infinity);
        log('Load Finish');
        if (this.collider2D != null)
        {
            this.collider2D.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);            
        }
    }

    protected start (): void 
    {
        this.tweenPos.start();
    }

    protected onDisable(): void 
    {
        this.tweenPos.stop();   
    }

    public play (): void 
    {
        if (this.state == State.WAITING)
        {
            this.state = State.PLAYING;
            this.rb.gravityScale = 1;
        }
        if (this.state == State.PLAYING)
        {
            this.Flappy();
        }
    }

    public Flappy (): void
    {
        if (this.state == State.DEAD) return;

        this.rb.linearVelocity = new Vec2(0, 0);
        this.rb.applyForceToCenter(new Vec2(0, this.verticalForce), true);
        this.AudioSource.playOneShot(this.FlappySound, 1);
    }

    protected update (dt: number): void 
    {
        if (this.state == State.DEAD)
        {
            let velocity = this.rb.linearVelocity;
            this.UpdateFaceBirdAngle(velocity, dt);
            return;
        }

        if (this.state == State.WAITING)
        {
            this.node.worldPosition = this._wPos;
        }

        if (this.state == State.PLAYING)
        {
            let velocity = this.rb.linearVelocity;
            this.UpdateFaceBirdAngle(velocity, dt);
        }
    }

    private UpdateFaceBirdAngle (velocity: Vec2, dt: number)
    {
        if (velocity.y > 1)
        {
            this.timerRotateUp = 0;
            if (this.timeElapsedDown < this.rotateLerpDurationUp)
            {
                this.timeElapsedDown += dt;
                this.node.angle = lerp(this.node.angle, this.faceUpAngle, this.timeElapsedDown / this.rotateLerpDurationUp);
            }

            else
            {
                this.node.angle = this.faceUpAngle;
            }

        }
        else if (velocity.y < 0)
        {
            this.timeElapsedDown = 0;
            if (this.timerRotateUp < this.rotateLerpDuration)
            {
                this.timerRotateUp += dt;
                this.node.angle = lerp(this.node.angle, -90, this.timerRotateUp / this.rotateLerpDuration);
            }

            else
            {
                this.node.angle = -90;
            }

        }
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) 
    {
        if (otherCollider.tag == 1)
        {
            log("You hit a new point");
            this.Game.AddPoint();
            otherCollider.enabled = false;
        }
        else
        {
            log("You die");
            this.SpriteAnimator.paused = true;
            this.hitSomething = true;
            this.state = State.DEAD;
            this.Game.Dead();
        }
    }

    protected lerp (start: number, end: number, time: number): number
    {
        return start + time * (end - start);
    }
}
