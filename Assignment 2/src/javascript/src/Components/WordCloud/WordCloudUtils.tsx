import {WordCount} from "./WordCloud";

export function scaleWords(words: WordCount[], minRange: number, maxRange: number) {

    const x: any[] = [];

    for (let i = 0; i < words.length; i++) {
        x.push(words[i].value);
    }

    const maxValue = (Math.max(...x));
    const minValue = (Math.min(...x));

    function convertRange(value: number, r1: any, r2: any) {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    }

    for (let i = 0; i < words.length; i++) {
        words[i].value = convertRange(words[i].value, [minValue, maxValue], [minRange, maxRange]);
    }
    return words;
}
