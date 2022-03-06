import { CurrenctyAPI } from "../lib/CurrencyAPI";
import { ToCaseCount } from "../lib/ToCaseCount";

const Handlebars = require("handlebars");
const { Ner } = require('@nlpjs/ner');

export interface IChatNLPResult {
    entities: {
        start: number;
        end: number;
        len: number;
        accuracy: number;
        sourceText: string;
        uttranceText: string;
        entity: string;
        resolution: Record<string, any>[]
    }[];
    answer: string | undefined;
    utterance: string;
    optionalUtterance: string;
    [key: string]: any;
}

export interface IChatNLPData {
    [intent: string]: {
        processing: string[],
        answers: string[],
        handler?: (result?: IChatNLPResult, nerManager?: Record<string, any>) => Promise<string>,
    }
}

export interface IChatNLPEntity {
    name: string;
    type: 'regex' | 'text' | 'trim';
    value?: string | RegExp;
    forms?: string[];
    //
    between?: [string, string][];
    after?: string[];
    afterFirst?: string[];
    afterLast?: string[]
    before?: string[];
    beforeFirst?: string[];
    beforeLast?: string[];
}

export const ChatNLPIntents = {
    CURRENCY_USD_RUB: 'currency.usd.rub',
    CURRENCY_RUB_USD: 'currency.rub.usd',
    NUMBERS_SUM: 'numbers.sum',
    NUMBERS_MULTIPLE: 'number.multiple',
    WHATSAP: 'whatsap',
    WHATSAP_OK: 'whatasp_ok',
    WHATSAP_BAD: 'whatsap_bad',
    WHATSAP_DOING: 'whatsap_doing',
    BYE: 'bye',
}

export const ChatNLPData: IChatNLPData = {
    [ChatNLPIntents.CURRENCY_USD_RUB]: {
        processing: [
            '{{number}} долларов в рубли',
            '{{number}} рублей в доллары',
            '{{number}} $ в ₽',
        ],
        answers: [
            '{{number}} {{currencyFromName}} в переводе на {{currencyTo}} будет {{amount}} {{currencyToName}}',
        ],
        handler: async (result: IChatNLPResult) => {
            if(result.entities.length > 0){
                const manager = new Ner({ threshold: 0.8 });
                manager.addBetweenCondition('ru', 'currency_from', result.entities[0].sourceText, 'в');
                manager.addAfterCondition('ru', 'currency_to', 'в');
                const currencies = await manager.process({
                    locale: 'ru',
                    utterance: result.utterance
                });
                const currencyFromSearch = currencies.entities.find((item) => item.entity === 'currency_from')?.sourceText.toLowerCase() ?? false;
                const currencyToSearch = currencies.entities.find((item) => item.entity === 'currency_to')?.sourceText.toLowerCase() ?? false;

                const currencyFrom = currencyFromSearch !== false 
                    && (currencyFromSearch.indexOf('доллар') > -1 
                        || currencyFromSearch.indexOf('$') > -1) 
                    ? 'usd' : currencyFromSearch !== false 
                    && (currencyFromSearch.indexOf('руб') > -1 
                        || currencyFromSearch.indexOf('₽') > -1) ? 'rub' : false;
                
                const currencyTo = currencyToSearch !== false 
                    && (currencyToSearch.indexOf('доллар') > -1 
                        || currencyToSearch.indexOf('$') > -1) 
                    ? 'usd' : currencyToSearch !== false 
                    && (currencyToSearch.indexOf('руб') > -1 
                        || currencyToSearch.indexOf('₽') > -1) ? 'rub' : false;

                const currencyFromValue = parseFloat(result.entities[0].sourceText);
                let amount: number | string = 0;
                if(currencyTo !== currencyFrom && currencyTo !== false && currencyFrom !== false && currencyFromValue > 0){
                    let loadCurrency: number | false = false;
                    if(currencyFrom === 'usd'){
                        loadCurrency = await CurrenctyAPI.usdToRub(currencyFromValue);
                    }else if(currencyFrom === 'rub'){
                        loadCurrency = await CurrenctyAPI.rubToUsd(currencyFromValue);
                    }
                    if(loadCurrency !== false){
                        amount = loadCurrency.toFixed(3);
                        return Handlebars.compile(result.answer)({
                            amount,
                            currencyFromName: currencyFrom === 'usd' ?  ToCaseCount(currencyFromValue, ['доллар', 'доллары', 'долларов']) : ToCaseCount(parseInt(currencyFromValue.toString()), ['рубль', 'рубли', 'рублей']),
                            currencyTo: currencyTo === 'usd' ? 'доллары' : 'рубли',
                            currencyToName: currencyTo === 'usd' ? ToCaseCount(parseInt(amount.toString()), ['доллар', 'доллары', 'долларов']) : ToCaseCount(parseInt(amount.toString()), ['рубль', 'рубли', 'рублей']),
                        });
                    }
                }
            }
            return 'Не удалось загрузить курс валюты, попробуй позже.';
        },
    },
    [ChatNLPIntents.NUMBERS_SUM]: {
        processing: [
            '{{number}} + {{number}}',
            '{{number}} плюс {{number}}',
        ],
        answers: [
            '{{number_0}} + {{number_1}} = {{sum}}'
        ],
        handler: async (result: IChatNLPResult) => {
            if(result.entities.length >= 2){
                const number_1 = parseFloat(result.entities[0].sourceText) ?? 0;
                const number_2 = parseFloat(result.entities[1].sourceText) ?? 0;
                return Handlebars.compile(result.answer)({
                    sum: number_1 + number_2,
                });
            }else{
                return 'Я не совсем тебя понял, попробуй написать по-другому.';
            }
        },
    },
    [ChatNLPIntents.NUMBERS_MULTIPLE]: {
        processing: [
            '{{number}} * {{number}}',
            '{{number}} умножить на {{number}}',
        ],
        answers: [
            '{{number_0}} * {{number_1}} = {{multiple}}'
        ],
        handler: async (result: IChatNLPResult) => {
            if(result.entities.length >= 2){
                const number_1 = parseFloat(result.entities[0].sourceText) ?? 0;
                const number_2 = parseFloat(result.entities[1].sourceText) ?? 0;
                let multiple: number | string = number_1 * number_2;
                if(parseInt(multiple.toString()) !== multiple){
                    multiple = multiple.toFixed(3);
                }
                return Handlebars.compile(result.answer)({
                    multiple: multiple,
                });
            }else{
                return 'Я не совсем тебя понял, попробуй написать по-другому.';
            }
        },
    },
    [ChatNLPIntents.WHATSAP]: {
        processing: [
            'привет как дела',
        ],
        answers: [
            'У меня нормально, а у тебя как?',
            'Хорошо, а как твои дела?',
        ],
        handler: async (result: IChatNLPResult) => {
            return result.answer;
        },
    },
    [ChatNLPIntents.WHATSAP_OK]: {
        processing: [
            'нормально у меня дела',
            'хорошо',
            'нормально',
            'отлично',
            'пойдёт'
        ],
        answers: [
            'Рад за тебя!',
            'Замечательно!'
        ],
        handler: async (result: IChatNLPResult) => {
            return result.answer;
        },
    },
    [ChatNLPIntents.WHATSAP_BAD]: {
        processing: [
            'плохо у меня дела',
            'плохо',
            'ужасно',
        ],
        answers: [
            'Точно будет лучше!',
            'Не грусти',
        ],
        handler: async (result: IChatNLPResult) => {
            return result.answer;
        },
    },
    [ChatNLPIntents.WHATSAP_DOING]: {
        processing: [
            'что делаешь',
            'чем занимаешься',
        ],
        answers: [
            'Пытаюсь сделать мир лучше!',
            'Не думал, что кого-то интересует моя деятельность. Занимаюсь саморазвитием - улучшением нейронной сети :)'
        ],
        handler: async (result: IChatNLPResult) => {
            return result.answer;
        },
    },
    [ChatNLPIntents.BYE]: {
        processing: [
            'пока',
            'досвидания',
            'до встречи',
            'увидимся позже',
            'мне нужно идти'
        ],
        answers: [
            'Рад был пообщаться!',
            'Пока',
        ],
        handler: async (result: IChatNLPResult) => {
            return result.answer;
        },
    },
}