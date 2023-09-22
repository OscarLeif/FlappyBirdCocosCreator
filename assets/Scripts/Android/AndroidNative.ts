import { _decorator, Component, native, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AndroidNative')
export class AndroidNative 
{
    public static showAlert (message: string): void
    {
        if (sys.os === sys.OS.ANDROID)
        {
            let className = "com/cocos/game/AppActivity";
            let methodName = "showAlertDialog";
            let methodSignature = "(Ljava/lang/String;Ljava/lang/String;)V";
            native.reflection.callStaticMethod(className, methodName, methodSignature, "Title", "Native Call Test is OK");
        }
    }

    public static showToast (message: string, length: number): void
    {
        if (sys.os === sys.OS.ANDROID)
        {
            let className = "com/cocos/game/AppActivity";
            let methodName = "showToast";
            let methodSignature = "(Ljava/lang/String;I)V";
            native.reflection.callStaticMethod(className, methodName, methodSignature, message, length);
        }
    }
}


