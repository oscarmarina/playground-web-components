/* https://open-wc.org/blog/lit-element-deepdive-in-batching-updates */

export class BatchingElement extends HTMLElement {
  constructor() {
    super();
    this.updateComplete = this.__resolver();
    this.__uuid = BatchingElement.uuid++; // eslint-disable-line
  }

  render() {}

  async requestUpdate(dispatchEvent) {
    if (!this.__renderRequest) {
      this.__renderRequest = true;
      await 0;
      this.render();
      if (dispatchEvent) {
        if (this.constructor.config.disabled && this.hasAttribute('disabled')) {
          /** noop */
        } else {
          this.__dispatch();
        }
      }

      this.__res();
      this.updateComplete = this.__resolver();
      this.__renderRequest = false;
    }
  }

  __dispatch() {} // eslint-disable-line

  __resolver() {
    return new Promise((res) => {
      this.__res = res;
    });
  }
}

BatchingElement.uuid = 0;
