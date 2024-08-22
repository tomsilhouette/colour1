class SimpleColourPicker {
  constructor(
    spectrumElement,
    colourDisplayElement,
    spectrumSlider,
    colourInputElement
  ) {
    this.spectrumElement = spectrumElement;
    this.spectrumDragger = spectrumElement.querySelector('.spectrumDragger');
    this.colourDisplayElement = colourDisplayElement;
    this.spectrumSlider = spectrumSlider;
    this.colourInputElement = colourInputElement;
    this.currentHue = 0;

    // Bind methods and store the references
    this.onMouseMoveBound = this.onMouseMove.bind(this);
    this.onMouseUpBound = this.onMouseUp.bind(this);
    this.onSliderChangeBound = this.onSliderChange.bind(this);

    this.spectrumElement.addEventListener(
      'mousedown',
      this.onMouseDown.bind(this)
    );
    this.spectrumSlider.addEventListener('input', this.onSliderChangeBound);
  }

  // Listen for mouse on canvas
  onMouseDown(event) {
    event.preventDefault();
    this.moveCanvasIndicator(event);

    document.addEventListener('mousemove', this.onMouseMoveBound);
    document.addEventListener('mouseup', this.onMouseUpBound);
  }

  // Listen for mouse move on canvas
  onMouseMove(event) {
    this.moveCanvasIndicator(event);
  }

  // Listen for mouse up on canvas
  onMouseUp() {
    document.removeEventListener('mousemove', this.onMouseMoveBound);
    document.removeEventListener('mouseup', this.onMouseUpBound);
  }

  moveCanvasIndicator(event) {
    const rect = this.spectrumElement.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    this.spectrumDragger.style.left = `${
      x - this.spectrumDragger.clientWidth / 2
    }px`;
    this.spectrumDragger.style.top = `${
      y - this.spectrumDragger.clientHeight / 2
    }px`;

    this.updateColour(x, y, rect.width, rect.height);
  }

  updateColour(x, y, width, height) {
    const saturation = x / width;
    const value = 1 - y / height;
    const colour = this.hsvToHex(this.currentHue, saturation, value);
    console.log('colour', colour);
    this.colourDisplayElement.style.backgroundColor = colour;
    this.colourInputElement.value = colour;
  }

  hsvToHex(h, s, v) {
    let r, g, b;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }

    return `#${(
      (1 << 24) +
      (Math.round(r * 255) << 16) +
      (Math.round(g * 255) << 8) +
      Math.round(b * 255)
    )
      .toString(16)
      .slice(1)}`;
  }

  setHue(hue) {
    this.currentHue = hue;
    const flatColour = this.hsvToHex(hue, 1, 1);

    this.colourInputElement.value = flatColour;

    this.spectrumElement.querySelector(
      '.brightSpectrum'
    ).style.background = `linear-gradient(to right, #fff, ${flatColour})`;
    console.log('flatcolour', flatColour);
    this.colourDisplayElement.style.backgroundColor = flatColour;
  }

  onSliderChange(event) {
    const hueValue = event.target.value / 100; // Convert to range [0, 1]
    this.setHue(hueValue);
  }
}

// Initialize the color picker
document.addEventListener('DOMContentLoaded', () => {
  const spectrumElement = document.querySelector('.spectrum');
  const colourDisplayElement = document.getElementById(
    'selected-colour-display'
  );
  const spectrumSlider = document.getElementById('spectrum-colour-slider');
  const colourInputElement = document.getElementById('hex-code');

  const colourPicker = new SimpleColourPicker(
    spectrumElement,
    colourDisplayElement,
    spectrumSlider,
    colourInputElement
  );

  // Optionally set a different hue
  colourPicker.setHue(0); // Red hue as an example
});
