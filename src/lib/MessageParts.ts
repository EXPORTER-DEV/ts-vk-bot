const maximumMessageLength = 4096;
interface IMessageParts {
    words: string[];
    length: number;
}
export const MessageParts = (message: string, separator: string = ' ', splitter: RegExp = RegExp('\\s', 'gi')): string[] => {
    let messageParts: IMessageParts[] = [];
    if(message.length > maximumMessageLength){
        messageParts = message.split(splitter).reduce((carry, word, index, target) => {
            const currentIndex = carry.length - 1;
            // If carry is empty:
            if(currentIndex === -1){
                carry.push({
                    words: [word],
                    length: word.length,
                });
            }else{
                const current = carry[currentIndex];
                // Check if current message part length will be under maximumMessageLength:
                if(currentIndex === target.length - 1 || current.length + separator.length + word.length > maximumMessageLength){
                    // If message part length will be higher than maximumMessageLength, create new message part:
                    carry.push({
                        words: [word],
                        length: word.length,
                    });
                }else{
                    // If everything is ok, just add words and update length value:
                    carry[currentIndex].words.push(word);
                    carry[currentIndex].length = carry[currentIndex].words.join(separator).length;
                }
            }
            return carry;
        }, [] as IMessageParts[]);
    }else{
        return [message];
    }
    return messageParts.map((item) => item.words.join(separator));
}