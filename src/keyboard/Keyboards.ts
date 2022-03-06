import { Buttons } from "./Buttons";
import { Keyboard } from "../common/utils/Keyboard";
import { UserEntity } from "../entity/User.entity";

export const Keyboards = {
    MAIN_MENU: (user: UserEntity) => {
        const buttons = [
            Buttons.CHAT_NLP,
            Buttons.WEBSITE_AVAILABILITY,
        ];
        return Keyboard(buttons).inline();
    },
    CANCEL: Keyboard([
        Buttons.CANCEL_BUTTON,
    ]).oneTime(),
    CANCEL_CONFIRM: Keyboard([
        Buttons.CANCEL_BUTTON,
        Buttons.CONFIRM_BUTTON
    ]).oneTime(),
    HOME: Keyboard([
        Buttons.HOME_BUTTON,
    ]).inline(),
}