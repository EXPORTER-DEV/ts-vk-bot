import axios from "axios";
const qs = require('qs');

export class CurrenctyAPI {
    static async usdToRub(usd: number): Promise<number | false> {
        const response = await axios({
            url: 'https://open.er-api.com/v6/latest/RUB',
        }).then((res) => res.data).catch((e) => false);
        if(response && response.result === "success"){
            if(response.rates['USD'] === undefined){
                return false;
            }
            return usd / response.rates['USD'];
        }
        return false;
    }
    static async rubToUsd(rub: number): Promise<number | false> {
        const response = await axios({
            url: 'https://open.er-api.com/v6/latest/RUB',
        }).then((res) => res.data).catch((e) => false);
        if(response && response.result === "success"){
            if(response.rates['USD'] === undefined){
                return false;
            }
            return rub * response.rates['USD'];
        }
        return false;
    }
}