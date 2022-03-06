/* 

Examples:

первого декабря 2001 -> 01/12/2001
второго декабря 2001 -> 01/12/2001
1 декабря 2001 -> 01/12/2001
1-го декабря 2002 -> 01/12/2002
11.12.2002 -> 11/12/2002
11/12/2002 -> 11/12/2002
сегодня -> 22/02/2022
вчера -> 21/02/2022

*/

interface ITextMonth {
    month: number;
    text: string;
    maxLength: number;
}

interface ITextToMonthResult {
    month: number;
    target: string;
}

type TextToMonthType = ITextToMonthResult | undefined;

const textMonths: ITextMonth[] = [
    {
        month: 0,
        text: 'январ',
        maxLength: 6,
    },
    {
        month: 1,
        text: 'феврал',
        maxLength: 7,
    },
    {
        month: 2,
        text: 'март',
        maxLength: 5,
    },
    {
        month: 3,
        text: 'апрел',
        maxLength: 6,
    },
    {
        month: 4,
        text: 'ма',
        maxLength: 3,
    },
    {
        month: 5,
        text: 'июн',
        maxLength: 4,
    },
    {
        month: 6,
        text: 'июл',
        maxLength: 4,
    },
    {
        month: 7,
        text: 'август',
        maxLength: 7,
    },
    {
        month: 8,
        text: 'сентябр',
        maxLength: 8,
    },
    {
        month: 9,
        text: 'октябр',
        maxLength: 7,
    },
    {
        month: 10,
        text: 'ноябр',
        maxLength: 6,
    },
    {
        month: 11,
        text: 'декабр',
        maxLength: 7,
    },
]

const textToMonth = (texts: string[]): TextToMonthType => {
    for(const text of texts){
        const find = textMonths.find((item) => text.indexOf(item.text) > -1 && text.length <= item.maxLength);
        if(find !== undefined){
            return {
                target: text,
                month: find.month,
            }
        }
    }
    return undefined;
}

export const DateRecognizer = (dateString: string): Date | false => {
    const date = new Date();

    const matchMonth = dateString.match(/(январ|феврал|март|апрел|ма|июн|июл|август|сентябр|октябр|ноябр|декабр)\S*/gmi);
    if(matchMonth !== null){
        const monthFromText = textToMonth(matchMonth);
        if(monthFromText !== undefined){
            console.log(monthFromText);
            dateString = dateString.replace(monthFromText.target, (monthFromText.month + 1).toString());
        }
    }

    dateString = dateString.replace(/\-[а-я]{1,2}/gis, '');

    const matchDMY = dateString.match(/\d{1,2}(\.|\/|\s)\d{1,2}(\.|\/|\s)\d{4}/gmi);
    if(matchDMY !== null){
        const DMY = matchDMY[0].split(/\.|\/|\s/gmi);
        if(DMY.length === 3){
            date.setDate(parseInt(DMY[0]));
            date.setMonth(parseInt(DMY[1]) - 1);
            date.setFullYear(parseInt(DMY[2]));
        }
    }else{
        return false;
    }
    
    date.setHours(0,0,0,0);

    return date;
}