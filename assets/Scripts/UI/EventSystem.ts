import { _decorator, Component, EventGamepad, EventKeyboard, Input, input, KeyCode, log, Node } from 'cc';
import { UISelectable } from './UISelectable';
import { UIIndicator } from './UIIndicator';
import { AndroidNative } from '../Android/AndroidNative';
const { ccclass, property } = _decorator;

@ccclass('EventSystem')
export class EventSystem extends Component
{

    public static instance: EventSystem = null;

    @property({ type: UISelectable })
    public FirstSelected: UISelectable = null;

    @property({ type: UISelectable })
    public CurrentSelected: UISelectable = null;

    @property({ type: UIIndicator })
    public Indicator: UIIndicator = null;

    public RecoverFocus: boolean = true;

    onLoad () 
    {
        if (EventSystem.instance == null)
        {
            EventSystem.instance = this;
        }
        input.on(Input.EventType.KEY_DOWN, this.KeyboardOnKeyDown, this);
        input.on(Input.EventType.GAMEPAD_INPUT, this.GamePadOnKeyDown, this);
    }

    protected start (): void 
    {
    }
    private submitAction: boolean = false;

    private GamePadOnKeyDown (event: EventGamepad): void
    {
        if (this.CurrentSelected == null)
        {
            return;
        }

        let leftAction = event.gamepad.dpad.left.getValue() == 1;
        let rightAction = event.gamepad.dpad.right.getValue() == 1;
        let upAction = event.gamepad.dpad.up.getValue() == 1;
        let downAction = event.gamepad.dpad.down.getValue() == 1;
        

        if (event.gamepad.buttonSouth.getValue() == 1 && !this.submitAction)
        {
            this.CurrentSelected.OnSubmit();
        }
        else if(event.gamepad.buttonSouth.getValue() == 0 && this.submitAction)
        {
            log("Not Submit");
            this.submitAction = false;
        }

        if (leftAction && this.CurrentSelected.SelectOnLeft != null)
        {
            this.ChangeCurrentSelected(this.CurrentSelected.selectLeft);
        }
        else if (rightAction && this.CurrentSelected.SelectOnRight != null)
        {
            this.ChangeCurrentSelected(this.CurrentSelected.selectRight);
        }

        if (upAction && this.CurrentSelected.SelectOnUp != null)
        {
            this.ChangeCurrentSelected(this.CurrentSelected.selectUp);
        }
        else if (downAction && this.CurrentSelected.SelectOnDown != null)
        {
            this.ChangeCurrentSelected(this.CurrentSelected.selectDown);
        }
    }

    //Handle Keyboard Input
    private KeyboardOnKeyDown (event: EventKeyboard): void
    {
        if (this.CurrentSelected == null)
        {
            log("No Current Selected");
            return;
        }

        let leftAction = false;
        if (event.keyCode == (KeyCode.ARROW_LEFT) || event.keyCode == (KeyCode.KEY_A)) 
        {
            leftAction = true;
        }

        let rightAction = false;
        if (event.keyCode == (KeyCode.ARROW_RIGHT) || event.keyCode == (KeyCode.KEY_D))
        {
            rightAction = true;
        }

        let upAction = false;
        if (event.keyCode == (KeyCode.ARROW_UP) || event.keyCode == (KeyCode.KEY_W))
        {
            upAction = true;
        }

        let downAction = false;
        if (event.keyCode == (KeyCode.ARROW_DOWN) || event.keyCode == (KeyCode.KEY_S))
        {
            downAction = true;
        }

        let submitAction = false;
        if (event.keyCode == (KeyCode.ENTER) || event.keyCode == (KeyCode.SPACE))
        {
            submitAction = true;
        }

        if (submitAction)
        {
            this.CurrentSelected.OnSubmit();
        }

        if (leftAction)
        {
            if (this.CurrentSelected.SelectOnLeft != null)
            {
                this.ChangeCurrentSelected(this.CurrentSelected.selectLeft);
            }
        }
        else if (rightAction)
        {
            if (this.CurrentSelected.SelectOnRight != null)
            {
                this.ChangeCurrentSelected(this.CurrentSelected.selectRight);
            }
        }
        else if (upAction)
        {
            if (this.CurrentSelected.SelectOnUp != null)
            {
                this.ChangeCurrentSelected(this.CurrentSelected.selectUp);
            }
        }
        else if (downAction)
        {
            if (this.CurrentSelected.SelectOnDown != null)
            {
                this.ChangeCurrentSelected(this.CurrentSelected.selectDown);
            }
        }
    }

    public ChangeCurrentSelected (newSelected: UISelectable): void
    {
        this.CurrentSelected = newSelected;
        this.CurrentSelected.OnSelect();
        this.Indicator.ChangeParent(this.CurrentSelected);
    }


    protected onDisable (): void 
    {
        if (EventSystem.instance == this)
        {
            EventSystem.instance = null;
        }
    }

    protected update (dt: number): void 
    {
        if (this.RecoverFocus)
        {
            if (this.CurrentSelected == null)
            {

            }
        }
    }
}


