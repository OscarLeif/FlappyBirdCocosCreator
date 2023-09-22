import { _decorator, Button, EventGamepad, log } from 'cc';
import { Component, EventHandler as ComponentEventHandler } from 'cc';
import { AndroidNative } from '../Android/AndroidNative';
const { ccclass, property } = _decorator;

@ccclass('UISelectable')
export class UISelectable extends Component 
{

    //For now lets just use a Explicit Navigation   
    @property({ type: Button, tooltip: "Navigation Up", })
    public SelectOnUp: Button = null;

    @property({ type: Button, tooltip: "Navigation Down", })
    public SelectOnDown: Button = null;

    @property({ type: Button, tooltip: "Navigation Left", })
    public SelectOnLeft: Button = null;

    @property({ type: Button, tooltip: "Navigation Right", })
    public SelectOnRight: Button = null;

    private Button: Button = null;

    public selectRight: UISelectable;
    public selectLeft: UISelectable;
    public selectUp: UISelectable;
    public selectDown: UISelectable;


    protected onLoad (): void
    {
        this.Button = this.getComponent(Button);
        if (this.SelectOnUp != null)     
        {
            this.selectUp = this.SelectOnUp.getComponent(UISelectable);
        }
        if (this.SelectOnDown != null)     
        {
            this.selectDown = this.SelectOnDown.getComponent(UISelectable);
        }
        if (this.SelectOnLeft != null)     
        {
            this.selectLeft = this.SelectOnLeft.getComponent(UISelectable);
        }
        if (this.SelectOnRight != null)     
        {
            this.selectRight = this.SelectOnRight.getComponent(UISelectable);
        }
    }

    public OnSubmit (): void
    {
        if (this.Button != null && this.Button.clickEvents != null)
        {
            let count = this.Button.clickEvents.length
            AndroidNative.showToast("Tryin to emit event " + count + " " + this.node.name, 0);
            ComponentEventHandler.emitEvents(this.Button.clickEvents);
            log("OnSubmit " + this.node.name);
        }
    }

    OnSelect () 
    {
        log("OnSelect " + this.node.name);
    }
}
