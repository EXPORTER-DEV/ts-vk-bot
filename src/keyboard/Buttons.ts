import { Scenes } from "../constants";
import { Button } from "../common/utils/Button";

export const Buttons = {
    HOME_BUTTON: Button(Scenes.HOME, "positive"),
    CHAT_NLP: Button(Scenes.CHAT_NLP, "primary"),
    WEBSITE_AVAILABILITY: Button(Scenes.WEBSITE_AVAILABILITY, 'positive'),
    CONFIRM_BUTTON: Button("Подтвердить", "positive", {cmd: 'confirm'}),
    CANCEL_BUTTON: Button("Отменить", "negative", {cmd: 'cancel'}),
}