export class Rating extends BatchingElement {
    static get observedAttributes(): string[];
    tplContainer: Element;
    slotNodeTpl: Element;
    set ratingName(arg: string);
    get ratingName(): string;
    set maxRating(arg: number);
    get maxRating(): number;
    set rating(arg: number);
    get rating(): number;
    connectedCallback(): void;
    attributeChangedCallback(name: any, oldVal: any, newVal: any): void;
    clearRatingElements(): void;
    createRatingStar(selected: any, idx: any): void;
    changeRating(idx: any): void;
}
import { BatchingElement } from './BatchingElement.js';
