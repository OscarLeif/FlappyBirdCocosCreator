import { _decorator, CCFloat, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Scroll')
export class Scroll extends Component 
{
    

    @property({type: CCFloat})
    public speed:number = -300;
    @property({type:CCFloat})
    public limit:number = -336; //width terrain
    
    public canScroll:boolean;

    start() 
    {
        this.canScroll=true;
    }

    StopScroll ()
    {
        this.canScroll=false;
    }

    update(deltaTime: number) 
    {
        if(this.canScroll==false)
        {
            return;
        }

        let pos = this.node.getPosition();
        pos.x += this.speed*deltaTime;
        
        if(pos.x <= this.limit)
        {
            pos.x += Math.abs(this.limit);
        }
        this.node.setPosition(pos);
    }
}


