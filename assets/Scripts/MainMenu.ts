import { _decorator, Component, Node, Director, director, Canvas, UIOpacity, tween, Sprite, Color } from 'cc';
import { AndroidNative } from './Android/AndroidNative';
const { ccclass, property } = _decorator;


@ccclass('MainMenu')
export class MainMenu extends Component 
{   
    @property({type: Canvas})
    public canvas: Canvas = null;

    @property({type: UIOpacity})
    public SpriteFade: UIOpacity = null;

    protected onLoad (): void
    {
        this.canvas = this.node.getComponent(Canvas);
        this.SpriteFade.opacity = 0;
    }

    // The function that will be called when the button is clicked
    public onClickStart(event, customData) 
    {        
        tween().
        target(this.SpriteFade)
        .to(0.5, { opacity:255 })
        .call(this.LoadSceneGame)
        .start();
    }

    public onClickLeaderboards():void
    {
        AndroidNative.showAlert("Leaderboards");
    }
    
    private  LoadSceneGame():void
    {
        director.loadScene("game");
    }
}