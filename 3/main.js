class SimpleColorPicker {
    constructor(spectrumElement, colorDisplayElement, spectrumSlider) {
        this.spectrumElement = spectrumElement;
        this.spectrumDragger = spectrumElement.querySelector('.spectrumDragger');
        this.colorDisplayElement = colorDisplayElement;
        this.spectrumSlider = spectrumSlider;
        this.currentHue = 0;

        // Bind methods and store the references
        this.onMouseMoveBound = this.onMouseMove.bind(this);
        this.onMouseUpBound = this.onMouseUp.bind(this);

        this.spectrumElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    }

    onMouseDown(event) {
        event.preventDefault();
        this.moveDragger(event);
        document.addEventListener('mousemove', this.onMouseMoveBound);
        document.addEventListener('mouseup', this.onMouseUpBound);
    }

    onMouseMove(event) {
        this.moveDragger(event);
    }

    onMouseUp() {
        // Remove the event listeners when the mouse is released
        document.removeEventListener('mousemove', this.onMouseMoveBound);
        document.removeEventListener('mouseup', this.onMouseUpBound);
    }

    moveDragger(event) {
        const rect = this.spectrumElement.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));

        this.spectrumDragger.style.left = `${x - this.spectrumDragger.clientWidth / 2}px`;
        this.spectrumDragger.style.top = `${y - this.spectrumDragger.clientHeight / 2}px`;

        this.updateColor(x, y, rect.width, rect.height);
    }

    updateColor(x, y, width, height) {
        const saturation = x / width;
        const value = 1 - y / height;
        const color = this.hsvToHex(this.currentHue, saturation, value);
        this.colorDisplayElement.style.backgroundColor = color;
    }

    hsvToHex(h, s, v) {
        let r, g, b;
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: (r = v), (g = t), (b = p); break;
            case 1: (r = q), (g = v), (b = p); break;
            case 2: (r = p), (g = v), (b = t); break;
            case 3: (r = p), (g = q), (b = v); break;
            case 4: (r = t), (g = p), (b = v); break;
            case 5: (r = v), (g = p), (b = q); break;
        }

        return `#${((1 << 24) + (Math.round(r * 255) << 16) + (Math.round(g * 255) << 8) + Math.round(b * 255))
            .toString(16)
            .slice(1)}`;
    }

    setHue(hue) {
        this.currentHue = hue;
        const flatColor = this.hsvToHex(hue, 1, 1);
        this.spectrumElement.querySelector('.brightSpectrum').style.background = `linear-gradient(to right, #fff, ${flatColor})`;
    }
}

// Initialize the color picker
document.addEventListener('DOMContentLoaded', () => {
    const spectrumElement = document.querySelector('.spectrum');
    const colorDisplayElement = document.getElementById('selectedColor');
    const spectrumSlider = document.getElementById('spectrum-colour-slider');
    const colorPicker = new SimpleColorPicker(spectrumElement, colorDisplayElement, spectrumSlider);

    // Optionally set a different hue
    colorPicker.setHue(0); // Red hue as an example
});
