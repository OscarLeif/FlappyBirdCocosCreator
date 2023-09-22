import { _decorator, Component, lerp, Node, Vec3 } from 'cc';
import { UISelectable } from './UISelectable';
const { ccclass, property } = _decorator;

@ccclass('UIIndicator')
export class UIIndicator extends Component 
{
    private NodeTr: Node = null;

    public lerpSpeed: number = 0.1;
    public timer: number = 0.0;
    public lerpDuration: number = 1.0;    
    public ScaleUp: boolean = false;

    private scaleVec3: Vec3 = new Vec3(1, 1, 1);

    start ()
    {
        this.NodeTr = this.node;
        this.ScaleUp = true;
    }

    update (deltaTime: number) 
    {
        this.timer += deltaTime;

        //scaleto 1.1
        if (this.timer < this.lerpDuration)
        {
            let target = this.ScaleUp ? 1.1 : 1.0;
            this.timer += deltaTime;

            this.scaleVec3.x = lerp(this.scaleVec3.x, target, this.lerpSpeed / this.lerpDuration);
            this.scaleVec3.y = lerp(this.scaleVec3.y, target, this.lerpSpeed / this.lerpDuration);
            this.scaleVec3.z = lerp(this.scaleVec3.z, target, this.lerpSpeed / this.lerpDuration);

            this.NodeTr.setScale(this.scaleVec3);
            return;
        }
        this.timer=0;
        this.ScaleUp = !this.ScaleUp;
    }

    public ChangeParent(newParent : UISelectable): void
    {
        this.node.setParent(newParent.node);
        this.node.setPosition(new Vec3(0, 0, 0));
    }
}


