import { BatchingElement } from './BatchingElement.js';
const template = document.createElement('template');
template.innerHTML = `
<style>
:host {
  display:block;
  overflow: scroll;
}

:host(:focus-visible) button:focus {
  outline:10px solid peru;
}

:host(.blue) {
  border: 3px solid #3d6fb4;
}

div {
  display: flex;
  justify-content: center;
  flex-direction: row-reverse;
}

img {
  width: 60px;
  height: 60px;
  margin: 10px;
}

p, ::slotted(p) {
  text-align: center;
  font-size: 32px;
  margin: 0;
  padding: 0;
}

/* This slot will be disabled because it's only used as a template for the rating stars and have no functionality */
slot[name="rating-star"] {
  display: none;
}

.rating-item {
  filter: grayscale(100%);
  cursor: pointer;
}

.rating-item.selected {
  filter: none;
}

.rating-item:hover, .rating-item:hover ~ .rating-item {
  filter: none;
}

.rating-star {
  display: block;
  -webkit-mask-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 166 166"><polygon fill="rgb(165,255,214)" points="83 26.8 65.7 61.8 27.1 67.4 55 94.7 48.5 133.2 83 115 117.5 133.2 111 94.7 138.9 67.4 100.3 61.8 83 26.8 83 26.8"/></svg>');
  background-color: #3d6fb4;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center center;
  width: 80px;
  height: 80px;
}

/*
https://browserstrangeness.bitbucket.io/css_hacks.html#safari
*/
@media not all and (min-resolution:.001dpcm) {
  @supports (-webkit-appearance:none) {
    :host([focus-visible]) button:focus {
      opacity: 0.5;
      color: blue;
    }
  }
}

button:focus-visible {
  opacity: 0.5;
  color: lime
}

</style>

<slot>
  <p part="title">Rating Web Component</p>
</slot>
<div>
<button>eooo</button>
  <slot name="rating-star">
    <div part="icon" class="rating-star"></div>
  </slot>
</div>
`;

export class Rating extends BatchingElement {
  static get observedAttributes() {
    return ['rating', 'max-rating'];
  }

  constructor() {
    super();
    // attach to the Shadow DOM
    const root = this.attachShadow({ mode: 'closed' });
    root.appendChild(template.content.cloneNode(true));
    this.element = root.querySelector('div');
    const slot = this.element.querySelector('slot');
    this.slotNode = slot.querySelector('div');
    slot.addEventListener('slotchange', (event) => {
      // Take first element of the slot and assign it as new rating star template
      const node = slot.assignedNodes()[0];
      if (node) {
        this.slotNode = node;
        this.requestUpdate();
      }
    });
  }

  get ratingName() {
    return this.getAttribute('rating-name');
  }

  set ratingName(value) {
    this.setAttribute('rating-name', value);
  }

  get maxRating() {
    return Number(this.getAttribute('max-rating'));
  }

  set maxRating(value) {
    this.setAttribute('max-rating', value);
  }

  get rating() {
    return Number(this.getAttribute('rating'));
  }

  set rating(value) {
    if (Number(value) < 0 || Number(value) > this.maxRating) {
      value = 0;
    }
    this.setAttribute('rating', value);
  }

  connectedCallback() {
    // set default value for maximal rating value
    if (!this.maxRating || this.maxRating < 0) {
      this.maxRating = 5;
    }
    // set default value for rating
    if (!this.rating || this.rating < 0 || this.rating > this.maxRating) {
      this.rating = 0;
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) {
      return;
    }

    switch (name) {
      case 'max-rating':
        this.maxRating = newVal;
        break;
      case 'rating':
        this.rating = newVal;
        this.dispatchEvent(new CustomEvent('ratingchanged', { detail: this.rating }));
        break;
    }
    this.requestUpdate();
  }

  render() {
    this.clearRatingElements();
    for (let i = this.maxRating; i > 0; i--) {
      i = parseInt(i);
      const selected = this.rating ? this.rating >= i : false;
      this.createRatingStar(selected, i);
    }
  }

  clearRatingElements() {
    const nodes = this.element.getElementsByClassName('rating-item');
    if (nodes) {
      while (nodes.length > 0) {
        nodes[0].parentNode.removeChild(nodes[0]);
      }
    }
  }

  createRatingStar(selected, itemId) {
    const ratingTemplate = document.createElement('div');
    ratingTemplate.setAttribute(
      'class',
      selected ? `rating-item item-${itemId} selected` : `rating-item item-${itemId}`
    );
    ratingTemplate.appendChild(this.slotNode.cloneNode(true));
    ratingTemplate.addEventListener('click', () => {
      this.changeRating(itemId);
    });
    this.element.appendChild(ratingTemplate);
  }

  changeRating(event) {
    this.rating = event;
  }
}

window.customElements.define('my-rating', Rating);
