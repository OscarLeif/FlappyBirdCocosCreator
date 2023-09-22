import { _decorator, CCFloat, Component, Node, tween, Tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BirdMenu')
export class BirdMenu extends Component
{
    @property({type:CCFloat})
    public actionTime: number = 1;

    @property({type:CCFloat})
    public moveUpDistance: number = 20;    

    private tweenPos: Tween<Vec3>;
    private _wPos : Vec3 = new Vec3(0,0,0);
    private startPos: Vec3;

    protected onLoad (): void
    {
        Vec3.copy(this._wPos, this.node.worldPosition);
        this.startPos = this.node.getWorldPosition();
        let moveUp = this.node.getWorldPosition();
        moveUp.y += this.moveUpDistance;

        this.tweenPos = tween(this._wPos)
            .to(this.actionTime, moveUp, { easing: 'linear' })
            .to(this.actionTime, this.startPos, { easing: 'linear' })
            .union()
            .repeat(Infinity);
    }

    protected onEnable (): void
    {
        this.tweenPos.start();
    }

    protected onDisable (): void
    {
        this.tweenPos.stop();
    }

    protected update (dt: number): void
    {
        this.node.setWorldPosition(this._wPos);
    }
}