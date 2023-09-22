import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpriteAnimator')
export class SpriteAnimator extends Component 
{

    @property({type: [Sprite]})
    public Sprite: Sprite;

    @property({type: [SpriteFrame]})
    public sprites: SpriteFrame[] = [];

    @property
    public framesPerSecond: number = 10;

    @property
    public paused: boolean = false;

    private _currentFrame: number = 0;
    private _timeSinceLastFrame: number = 0;

    protected onLoad (): void
    {
        this.Sprite = this.node.getComponent(Sprite);
    }

    public update(deltaTime: number)
    {

        if(this.paused)return;

        this._timeSinceLastFrame += deltaTime;
        if (this._timeSinceLastFrame >= 1 / this.framesPerSecond)
        {
            this._currentFrame = (this._currentFrame + 1) % this.sprites.length;
            this._timeSinceLastFrame = 0;
        }

        for (let i = 0; i < this.sprites.length; ++i)
        {
            // this.sprites[i].active = i == this._currentFrame;
            this.Sprite.spriteFrame = this.sprites[this._currentFrame];
        }
    }
}


