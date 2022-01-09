export class BatchingElement extends HTMLElement {
    updateComplete: Promise<any>;
    get uuid(): string;
    render(): void;
    requestUpdate(): Promise<void>;
    #private;
}
