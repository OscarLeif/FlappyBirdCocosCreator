import { _decorator, Color, Component, find, Node, Sprite, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TransitionScene')
export class TransitionScene extends Component
{
    protected onLoad (): void
    {
        //Screen Should be black
        //and fade out 
        let opa = this.getComponent(UIOpacity);
        tween(opa).to(1, { opacity:255 }).start();
    }
}


