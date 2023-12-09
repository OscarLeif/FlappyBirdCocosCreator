import { _decorator, Component, Node, screen, UIOpacity, UITransform, Vec2, View } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FlashUI')
export class FlashUI extends Component 
{
    @property({ type: UIOpacity, tooltip: "Add labelBestScore node", })
    public uiElement: UIOpacity;          
    
    private uiTransform: UITransform;

    private flashDuration: number = 0.2; // Duration of the flash effect in seconds
    private flashTimer: number = 0; // Timer to control the flash duration
    private isFlashing: boolean = false; // Flag to track if the flash effect is active

    protected start(): void 
    {
        this.uiTransform= this.getComponent(UITransform);
        this.uiElement.opacity = 0;
    }

    public Flash():void
    {                

        let size = screen.windowSize;
        this.uiTransform.setContentSize(size.x,size.y);

        this.isFlashing=true;
    } 

    protected update(dt: number): void 
    {
        if(this.isFlashing)
        {
            this.flashTimer += dt;

            // Calculate the opacity based on the flash timer
            const t = this.flashTimer / this.flashDuration;
            const opacity = Math.abs(Math.sin(t * Math.PI)); // Adjust the function for the desired effect

            // Set the opacity of the UI element
            this.uiElement.opacity = Math.floor(opacity * 255);

            // Check if the flash duration is complete
            if (this.flashTimer >= this.flashDuration) {
                this.isFlashing = false;
                this.flashTimer = 0;

                // Reset the UI element opacity
                this.uiElement.opacity = 0;
            }
        }
    }
}

