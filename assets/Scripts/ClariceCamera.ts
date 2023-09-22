import { _decorator, Component, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

/// <summary>
/// This is a Camera Script to follow the player.
/// Must be attached to the Camera Node.
/// </summary>
@ccclass('ClariceCamera')
export class ClariceCamera extends Component
{
    @property({type:Node, tooltip:"The target to follow", displayOrder:1})
     public target: Node;

     @property({type:Vec2, tooltip:"The offset to follow", displayOrder:2})
    public offset:Vec2 = new Vec2(0,0);

    start ()
    {

    }

    update (deltaTime: number)
    {
        if(this.target == null)return;

        let targetPos = this.target.getWorldPosition();
        let CameraPos = this.node.getWorldPosition();

        CameraPos.x = targetPos.x + this.offset.x;
        // CameraPos.y = targetPos.y + this.offset.y;//Not requiered for this game.

        this.node.setWorldPosition(CameraPos);
    }
}