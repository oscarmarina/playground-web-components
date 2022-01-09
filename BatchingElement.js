/* https://open-wc.org/blog/lit-element-deepdive-in-batching-updates */

export class BatchingElement extends HTMLElement {
  #renderRequest = false;
  #res = () => {};
  #uuid = '';

  constructor() {
    super();
    this.#uuid = Math.random().toString(36).substring(2, 10);
    this.updateComplete = this.#resolver();
  }

  get uuid() {
    return this.#uuid;
  }

  render() {}

  async requestUpdate() {
    if (!this.#renderRequest) {
      this.#renderRequest = true;
      this.#renderRequest = await false;

      this.render();
      this.#res();

      this.updateComplete = this.#resolver();
    }
  }

  #resolver() {
    return new Promise((res) => {
      this.#res = () => res;
    });
  }
}
