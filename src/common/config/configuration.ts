import { TimeUnits } from "../utils/TimeUnits";
import { validation } from "./validation";

export default () => {
    validation(process.env);
    return {
        isProduction: process.env.NODE_ENV === 'production',
        apiToken: process.env.API_TOKEN,
        caching: {
            MIDDLEWARE_CONNECT_USER: parseInt(process.env.CACHING_CONNECT_USER) || TimeUnits.fromDaysToMS(1),
            DEFAULT: TimeUnits.fromHoursToMS(1),
        },
    }
}