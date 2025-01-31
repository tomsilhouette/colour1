class CustomHexColorPicker {

    CUSTOM_COLOR_STORAGE_KEYNAME = 'customhexcolorcustomlist';
    DEFAULT_COLOR = '#FFFFFF';
    INPUT_COLOR_ATTRNAME = 'data-color';
    INPUT_COLOR_DATAATTRNAME = 'color';
    PRESET_COLOR_ATTRNAME = 'preset-hexcolor';
    CUSTOM_COLOR_ATTRNAME = 'custom-hexcolor';
    CUSTOM_LBL_TEXT = 'Custom colors';
    CANCEL_BTN_TEXT = 'Cancel';
    SELECT_BTN_TEXT = 'Select';

    constructor(params) {
        this.presetColorRowEle = document.createElement('div');
        this.presetColorRowEle.classList.add('presetColorRow');
        this.presetColorEle = document.createElement('div');
        this.presetColorEle.classList.add('presetColor');
        this.currentHue = 0;
        this.currentSaturation = 0;
        this.currentValue = 0;
        this.showPalette = true;
        if (params) {
            if (params.palette == false) {
                this.showPalette = false;
            }
            var defaultColor = params.defaultcolor;
            if (defaultColor) {
                defaultColor = defaultColor.trim();
                var hexColorName = this.HTML_HEXCOLOR_NAMES[params.defaultcolor];
                if (hexColorName) {
                    this.DEFAULT_COLOR = `#${hexColorName}`;
                }
            }
            var attrName = params.colorattribute;
            var dataAttrName = params.datacolorattribute;
            if (attrName) {
                this.INPUT_COLOR_ATTRNAME = attrName;
            } else if (dataAttrName) {
                this.INPUT_COLOR_DATAATTRNAME = dataAttrName;
            }
            var customLabelText = params.customlabeltext;
            if (customLabelText != undefined) {
                this.CUSTOM_LBL_TEXT = customLabelText;
            }
            var cancelBtnText = params.canceltext;
            if (cancelBtnText) {
                this.CANCEL_BTN_TEXT = cancelBtnText;
            }
            var selectBtnText = params.selecttext;
            if (selectBtnText) {
                this.SELECT_BTN_TEXT = selectBtnText;
            }
        }
        this.render();
        this.hidePicker();
        this.spectrumDraggerPosX = this.spectrumDraggerMinX;
        this.spectrumDraggerPosY = this.spectrumDraggerMinY;
        this.stripDraggerPosX = this.stripDraggerMinX;
        this.stripDraggerPosY = this.stripDraggerMinY;
    }

    render() {
        this.renderHexColorPicker();

        this.hexCpViewEle = document.querySelector('customhexcp-view:last-child');
        this.hexCpViewEle.onblur = this.hidePicker.bind(this);

        this.paletteEle = this.hexCpViewEle.querySelector('hexcp-palette');
        if (this.showPalette) {
            this.presetColorsEle = this.paletteEle.querySelector('hexcp-palette preset-colors');
            this.renderPresetColors();
        } else {
            this.paletteEle.style.display = 'none';
        }

        this.customColorBoxEle = this.hexCpViewEle.querySelector('hexcp-palette custom-colors .customColorBox');
        this.renderCustomColors();


        this.spectrumEle = this.hexCpViewEle.querySelector('hexcp-main .spectrum');
        this.spectrumWidth = this.spectrumEle.clientWidth;
        this.spectrumHeight = this.spectrumEle.clientHeight;
        this.spectrumDraggerEle = this.spectrumEle.querySelector('hexcp-main .spectrum .spectrumDragger');
        this.spectrumDraggerMinX = -this.spectrumDraggerEle.clientWidth / 2;
        this.spectrumDraggerMinY = -this.spectrumDraggerEle.clientHeight / 2;
        this.spectrumDraggerMaxX = this.spectrumWidth - this.spectrumDraggerEle.clientWidth / 2;
        this.spectrumDraggerMaxY = this.spectrumHeight - this.spectrumDraggerEle.clientHeight / 2;
        this.spectrumEle.onmousedown = this.spectrumEleMousedown.bind(this);

        this.stripEle = this.hexCpViewEle.querySelector('hexcp-main .colorStrip');
        this.stripWidth = this.stripEle.clientWidth;
        this.stripDraggerEle = this.stripEle.querySelector('hexcp-main .colorStrip .colorStripDragger');
        this.stripDraggerMinX = -this.stripDraggerEle.clientWidth / 2;
        this.stripDraggerMaxX = this.stripWidth - this.stripDraggerEle.clientWidth / 2;
        this.stripEle.onmousedown = this.stripEleMousedown.bind(this);

        this.prevColorEle = this.hexCpViewEle.querySelector('.prevColor');
        this.prevColorEle.onclick = this.prevColorSelect.bind(this);

        this.currColorEle = this.hexCpViewEle.querySelector('.currColor');
        this.hexInputEle = this.hexCpViewEle.querySelector('.hexInput');
        this.hexCodeEle = this.hexInputEle.querySelector('.hexCode');
        this.hexCodeEle.onchange = this.hexChange.bind(this);

        this.cancelSelectEle = this.hexCpViewEle.querySelector('.cancelSelect');
        this.cancelSelectEle.onclick = this.hidePicker.bind(this);

        this.selectColorEle = this.hexCpViewEle.querySelector('.selectColor');
        this.selectColorEle.onclick = this.selectColor.bind(this);
    }

    renderPresetColors() {
        var colorRowList = [];
        var colorRowEle;
        var colorEle;
        for (var i = 0; i < this.PRESET_COLOR_LIST.length; i++) {
            colorRowList = this.PRESET_COLOR_LIST[i];
            colorRowEle = this.presetColorRowEle.cloneNode();
            for (var j = 0; j < colorRowList.length; j++) {
                colorEle = this.presetColorEle.cloneNode();
                colorEle.style.background = colorRowList[j];
                colorEle.setAttribute(this.PRESET_COLOR_ATTRNAME, colorRowList[j]);
                colorEle.onclick = this.presetColorSelect.bind(this);
                colorRowEle.append(colorEle);
            }
            this.presetColorsEle.append(colorRowEle);
        }
    }

    renderCustomColors() {
        var customColorsList = JSON.parse(localStorage.getItem(this.CUSTOM_COLOR_STORAGE_KEYNAME)) || [];
        var customColorsEleList = Array.from(this.customColorBoxEle.querySelectorAll('.customColor'));
        var customColorEle;
        var customColor;
        for (var i = 0; i < customColorsList.length; i++) {
            customColorEle = customColorsEleList[i];
            customColor = customColorsList[i];
            customColorEle.style.background = customColor;
            customColorEle.setAttribute(this.CUSTOM_COLOR_ATTRNAME, customColor);
            customColorEle.classList.remove('empty');
            customColorEle.onclick = this.customColorSelect.bind(this);
        }
        this.addCustomColorEle = this.customColorBoxEle.querySelector('.addCustomColor');
        this.addCustomColorEle.onclick = this.customColorAdd.bind(this);
    }

    renderHexColorPicker() {
        let html = `<customhexcp-view tabindex="999">
                        <hexcp-palette>
                        <hexcp-main>
                            <div class="spectrum">
                                <div class="brightSpectrum">
                                    <div class="darkSpectrum">
                                        <div class="spectrumDragger"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="colorStrip">
                                <div class="colorStripDragger"></div>
                            </div>
                            <div class="hexInputRow">
                                <div class="chosenColor">
                                    <div class="prevColor"></div>
                                    <div class="currColor"></div>
                                </div>
                                <div class="hexInput">
                                    <div class="hexCodePrefix">#</div>
                                    <input type="text" class="hexCode" spellcheck="false" maxlength="6" />
                                </div>
                            </div>
                            <div class="selectColorRow">
                                <button class="selectColor">${this.SELECT_BTN_TEXT}</button>
                                <button class="cancelSelect">${this.CANCEL_BTN_TEXT}</button>
                            </div>
                        </hexcp-main>
                    </customhexcp-view>`;
        document.body.insertAdjacentHTML('beforeend', html);
    }

    presetColorSelect() {
        var presetColorEle = event.target;
        var presetColor = presetColorEle.getAttribute(this.PRESET_COLOR_ATTRNAME);
        this.setHexColor(presetColor);
        this.hexChange();
        presetColorEle.classList.add('active');
    }

    customColorAdd() {
        var customColorsList = JSON.parse(localStorage.getItem(this.CUSTOM_COLOR_STORAGE_KEYNAME)) || [];
        if (customColorsList.includes(this.currColor)) {
            this.setCurrCustomColorToFront();
            return;
        }
        var customColorEleList = this.customColorBoxEle.querySelectorAll('.customColor.empty');
        var customColorEle = customColorEleList[0/*customColorEleList.length - 1*/];
        if (customColorEle) {
            customColorEle.style.background = this.currColor;
            customColorEle.setAttribute(this.CUSTOM_COLOR_ATTRNAME, this.currColor);
            var customColorEleClone = customColorEle.cloneNode();
            customColorEleClone.classList.remove('empty');
            customColorEle.remove();
            this.customColorBoxEle.querySelector('.customColor').before(customColorEleClone);
            customColorEleClone.onclick = this.customColorSelect.bind(this);
            customColorsList.unshift(this.currColor);
            localStorage.setItem(this.CUSTOM_COLOR_STORAGE_KEYNAME, JSON.stringify(customColorsList));
        } else {
            var lastCustomColorEle = this.customColorBoxEle.lastElementChild;
            var customColorEle = lastCustomColorEle.cloneNode();
            customColorEle.style.background = this.currColor;
            customColorEle.setAttribute(this.CUSTOM_COLOR_ATTRNAME, this.currColor);
            lastCustomColorEle.remove();
            this.customColorBoxEle.firstElementChild.after(customColorEle);
            customColorEle.onclick = this.customColorSelect.bind(this);
            customColorsList.unshift(this.currColor);
            customColorsList.pop();
            localStorage.setItem(this.CUSTOM_COLOR_STORAGE_KEYNAME, JSON.stringify(customColorsList));
        }
    }

    setCurrCustomColorToFront() {
        var oldCustomColorEle = this.customColorBoxEle.querySelector(`.customColor[${this.CUSTOM_COLOR_ATTRNAME}="${this.currColor}"]`);
        var currCustomColorEle = oldCustomColorEle.cloneNode();
        this.customColorBoxEle.querySelector('.customColor').before(currCustomColorEle);
        currCustomColorEle.onclick = this.customColorSelect.bind(this);
        oldCustomColorEle.remove();
        var customColorsList = JSON.parse(localStorage.getItem(this.CUSTOM_COLOR_STORAGE_KEYNAME));
        customColorsList.splice(customColorsList.indexOf(this.currColor), 1);
        customColorsList.unshift(this.currColor);
        localStorage.setItem(this.CUSTOM_COLOR_STORAGE_KEYNAME, JSON.stringify(customColorsList));
    }

    customColorSelect() {
        var customColorEle = event.target;
        var customColor = customColorEle.getAttribute(this.CUSTOM_COLOR_ATTRNAME);
        this.setHexColor(customColor);
        this.hexChange();
        customColorEle.classList.add('active');
    }

    spectrumEleMousedown(event) {
        event.preventDefault();
        var rect = this.spectrumEle.getBoundingClientRect();
        this.spectrumDraggerPosX = event.clientX - rect.left + this.spectrumDraggerMinX;
        this.spectrumDraggerPosY = event.clientY - rect.top + this.spectrumDraggerMinY;
        this.spectrumDraggerEle.style.cssText = `left:${this.spectrumDraggerPosX}px;top:${this.spectrumDraggerPosY}px`;

        document.onmousemove = this.spectrumDraggerMousemove.bind(this);
        document.onmouseup = this.draggerMouseup.bind(this);
        this.removeActiveClass();
        this.spectrumChange();
    }

    spectrumDraggerMousemove(event) {
        event.preventDefault();
        var rect = this.spectrumEle.getBoundingClientRect();
        this.spectrumDraggerPosX = event.clientX - rect.left + this.spectrumDraggerMinX;
        this.spectrumDraggerPosY = event.clientY - rect.top + this.spectrumDraggerMinY;

        if (this.spectrumDraggerPosX < this.spectrumDraggerMinX) {
            this.spectrumDraggerPosX = this.spectrumDraggerMinX;
        } else if (this.spectrumDraggerPosX > this.spectrumDraggerMaxX) {
            this.spectrumDraggerPosX = this.spectrumDraggerMaxX;
        }
        if (this.spectrumDraggerPosY < this.spectrumDraggerMinY) {
            this.spectrumDraggerPosY = this.spectrumDraggerMinY;
        } else if (this.spectrumDraggerPosY > this.spectrumDraggerMaxY) {
            this.spectrumDraggerPosY = this.spectrumDraggerMaxY;
        }

        this.spectrumDraggerEle.style.cssText = `left:${this.spectrumDraggerPosX}px;top:${this.spectrumDraggerPosY}px`;
        this.spectrumChange();
    }

    stripEleMousedown(event) {
        event.preventDefault();
        var rect = this.stripEle.getBoundingClientRect();
        this.stripDraggerPosX = event.clientX - rect.left + this.stripDraggerMinX;
        this.stripDraggerEle.style.cssText = `left:${this.stripDraggerPosX}px;`;

        document.onmousemove = this.stripDraggerMousemove.bind(this);
        document.onmouseup = this.draggerMouseup.bind(this);
        this.removeActiveClass();
        this.stripChange();
    }

    stripDraggerMousemove(event) {
        event.preventDefault();
        var rect = this.stripEle.getBoundingClientRect();
        this.stripDraggerPosX = event.clientX - rect.left + this.stripDraggerMinX;

        if (this.stripDraggerPosX < this.stripDraggerMinX) {
            this.stripDraggerPosX = this.stripDraggerMinX;
        } else if (this.stripDraggerPosX > this.stripDraggerMaxX) {
            this.stripDraggerPosX = this.stripDraggerMaxX;
        }

        this.stripDraggerEle.style.left = this.stripDraggerPosX + "px";
        this.stripChange();
    }

    draggerMouseup() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    spectrumChange() {
        this.currentSaturation = parseFloat((this.spectrumDraggerPosX - this.spectrumDraggerMinX) / this.spectrumWidth);
        this.currentValue = parseFloat((this.spectrumHeight - (this.spectrumDraggerPosY - this.spectrumDraggerMinY)) / this.spectrumHeight);
        var hexColor = this.hsvToHex({
            h: this.currentHue,
            s: this.currentSaturation,
            v: this.currentValue
        });;
        this.setCurrColor(hexColor);
        this.setHexColor(hexColor);
    }

    stripChange() {
        this.currentHue = parseFloat((this.stripDraggerPosX - this.stripDraggerMinX) / this.stripWidth);
        var flatColor = this.hsvToHex({
            h: this.currentHue,
            s: 1,
            v: 1
        });

        this.setSpectrumColor(flatColor);
        this.spectrumChange();
    }

    hexChange(setTransition = true) {
        var hexInputColor = `#${this.hexCodeEle.value}`;
        this.hexCpViewEle.focus();
        if (!this.isHexColor(hexInputColor)) {
            this.hexInputEle.classList.add('invalid');
            this.addCustomColorEle.classList.add('disable');
            this.selectColorEle.classList.add('disable');
            return;
        } else {
            this.hexInputEle.classList.remove('invalid');
            this.addCustomColorEle.classList.remove('disable');
            this.selectColorEle.classList.remove('disable');
        }

        this.currColor = hexInputColor;
        this.setCurrColor(this.currColor);

        var hsvColor = this.hexToHsv(this.currColor);
        this.currentHue = (hsvColor.h % 360) / 360;
        this.currentSaturation = hsvColor.s;
        this.currentValue = hsvColor.v;
        var flatColor = this.hsvToHex({
            h: this.currentHue,
            s: 1,
            v: 1
        });

        this.setSpectrumColor(flatColor);
        this.spectrumDraggerPosX = this.currentSaturation * this.spectrumWidth + this.spectrumDraggerMinX;
        this.spectrumDraggerPosY = this.spectrumHeight - (this.currentValue * this.spectrumHeight) + this.spectrumDraggerMinY;
        this.spectrumDraggerEle.style.cssText = `${ setTransition ? 'transition:0.2s;' : '' }left:${this.spectrumDraggerPosX}px;top:${this.spectrumDraggerPosY}px;`;

        this.stripDraggerPosX = (this.currentHue * this.stripWidth) + this.stripDraggerMinX;
        this.stripDraggerEle.style.cssText = `${setTransition ? 'transition:0.2s;' : ''}left:${this.stripDraggerPosX}px;`;
        this.removeActiveClass();
    }

    hexToHsv(hex) {
        var rgb = this.hexToRgb(hex);
        var hsv = this.rgbToHsv.apply(this, rgb);
        return hsv;
    }

    hexToRgb(hex) {
        var hexMap = (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length / 3 + '})', 'g'));
        var rgbMap = hexMap.map(function (n) {
            return parseInt(hex.length % 2 ? n + n : n, 16);
        });
        return rgbMap;
    }

    rgbToHsv(...args) {
        var red = this.unitToRatio(args[0], 255);
        var green = this.unitToRatio(args[1], 255);
        var blue = this.unitToRatio(args[2], 255);

        var maxValue = Math.max(red, green, blue);
        var minValue = Math.min(red, green, blue);
        var hue, saturation, value = maxValue;

        var diff = maxValue - minValue;
        saturation = maxValue === 0 ? 0 : diff / maxValue;

        if (maxValue == minValue) {
            hue = 0;
        } else {
            switch (maxValue) {
                case red:
                    hue = (green - blue) / diff + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = (blue - red) / diff + 2;
                    break;
                case blue:
                    hue = (red - green) / diff + 4;
                    break;
            }
            hue /= 6;
        }

        return {
            h: (hue * 360),
            s: saturation,
            v: value
        };
    }

    unitToRatio(colorUnit, maxValue) {
        var isPercentage = typeof colorUnit === 'string' && colorUnit.indexOf('%') != -1;
        colorUnit = Math.min(maxValue, Math.max(0, parseFloat(colorUnit)));

        if (isPercentage) {
            colorUnit = parseInt(colorUnit * maxValue, 10) / 100;
        }

        if ((Math.abs(colorUnit - maxValue) < 0.000001)) {
            return 1;
        }
        return (colorUnit % maxValue) / parseFloat(maxValue);
    }

    hsvToHex(color) {
        var hsvInPercent = this.hsvToPercentage(color);
        var rgb = this.hsvPercentToRgb(hsvInPercent);
        var hexCode = this.rgbToHex(rgb);
        return `#${hexCode}`;
    }

    hsvToPercentage(color) {
        var hsvInPercentage = {};
        for (var i in color) {
            if (color.hasOwnProperty(i)) {
                hsvInPercentage[i] = this.ratioToPercentage(color[i]);
            }
        }
        return hsvInPercentage;
    };

    ratioToPercentage(ratio) {
        if (ratio <= 1) {
            ratio = `${ratio * 100}%`;
        }
        return ratio;
    }

    hsvPercentToRgb(hsvPercentObj) {
        var [hue, saturation, value] = [hsvPercentObj.h, hsvPercentObj.s, hsvPercentObj.v];

        var rgb = {
            r: 0,
            g: 0,
            b: 0
        };
        hue = this.unitToRatio(hue, 360) * 6;
        saturation = this.unitToRatio(saturation, 100);
        value = this.unitToRatio(value, 100);

        var hueInteger = Math.floor(hue);
        var hueFactorial = hue - hueInteger;
        var colorRange1 = value * (1 - saturation);
        var colorRange2 = value * (1 - hueFactorial * saturation);
        var colorRange3 = value * (1 - (1 - hueFactorial) * saturation);
        var colorRangeIndex = hueInteger % 6;
        var red = [value, colorRange2, colorRange1, colorRange1, colorRange3, value][colorRangeIndex];
        var green = [colorRange3, value, value, colorRange2, colorRange1, colorRange1][colorRangeIndex];
        var blue = [colorRange1, colorRange1, colorRange3, value, value, colorRange2][colorRangeIndex];
        rgb = {
            r: red * 255,
            g: green * 255,
            b: blue * 255
        };

        return {
            r: Math.min(255, Math.max(rgb.r, 0)),
            g: Math.min(255, Math.max(rgb.g, 0)),
            b: Math.min(255, Math.max(rgb.b, 0))
        };
    }

    rgbToHex(color) {
        var r = color.r;
        var g = color.g;
        var b = color.b;
        var hex = [
            this.prependZero(Math.round(r).toString(16)),
            this.prependZero(Math.round(g).toString(16)),
            this.prependZero(Math.round(b).toString(16))
        ];

        return hex.join('');
    }

    prependZero(colorUnit) {
        return colorUnit.length == 1 ? `0${colorUnit}` : `${colorUnit}`;
    }

    register(colorInputEle) {
        colorInputEle.onclick = this.showPicker.bind(this);
    }

    isHexColor(color) {
        return /^#([0-9A-F]{3}){1,2}$/i.test(color);
    }

    getPrevColor() {
        var prevColor = (typeof $ == 'function') ? $(this.colorInputEle).data(this.INPUT_COLOR_DATAATTRNAME) : this.colorInputEle.getAttribute(this.INPUT_COLOR_ATTRNAME).trim();
        if (this.isHexColor(prevColor)) {
            return prevColor;
        } else {
            var hexPrevColor = this.HTML_HEXCOLOR_NAMES[prevColor];
            if (hexPrevColor) {
                return `#${hexPrevColor}`;
            } else {
                return this.DEFAULT_COLOR;
            }
        }
    }

    showPicker(event) {
        var isVisible = this.hexCpViewEle.style.display === 'block';
        if (isVisible) {
            this.hidePicker();
        } else {
            this.colorInputEle = event.target;
            this.hexCpViewEle.style.visibility = 'hidden';
            this.hexCpViewEle.style.display = 'block';
            this.positionPicker();
            this.prevColor = this.getPrevColor();
            this.setPrevColor(this.prevColor);
            this.setHexColor(this.prevColor);
            this.hexChange(false);
            this.hexCpViewEle.style.visibility = 'visible';
            this.hexCpViewEle.focus();
            window.addEventListener('scroll', this.hidePicker.bind(this), true);
        }
    }

    hidePicker(event) {
        if (!event || event && event.relatedTarget !== this.hexCodeEle && event.relatedTarget !== this.selectColorEle) {
            this.hexCpViewEle.style.display = 'none';
            this.hexCpViewEle.style.visibility = 'hidden';
        }
    }

    positionPicker() {
        var pickerWidth = this.hexCpViewEle.offsetWidth;
        var pickerHeight = this.hexCpViewEle.offsetHeight;
        var rect = this.colorInputEle.getBoundingClientRect();
        var pickerLeft = rect.left - pickerWidth / 2 + rect.width / 2;
        var pickerTop = rect.top + rect.height;
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;

        if (pickerTop + pickerHeight > windowHeight) {
            pickerTop -= (pickerHeight + rect.height);
        }
        if (pickerLeft < 0) {
            pickerLeft = 0;
        } else {
            var rightOverflow = pickerLeft + pickerWidth - windowWidth;
            if (rightOverflow > 0) {
                pickerLeft -= rightOverflow;
            }
        }
        pickerTop += pageYOffset;
        pickerLeft += pageXOffset;
        this.hexCpViewEle.style.cssText = `left:${pickerLeft}px;top:${pickerTop}px;display:block;`;
    }

    setPrevColor(color) {
        this.prevColorEle.style.background = color;
    }

    setCurrColor(color) {
        this.currColorEle.style.background = color;
    }

    setSpectrumColor(color) {
        this.spectrumEle.style.background = color;
    }

    setHexColor(color) {
        this.currColor = color;
        this.hexCodeEle.value = color.replace('#', '');
    }

    prevColorSelect() {
        this.setHexColor(this.prevColor);
        this.hexChange();
    }

    removeActiveClass() {
        let activeEleList = this.hexCpViewEle.querySelectorAll('.active');
        for (var i = 0; i < activeEleList.length; i++) {
            activeEleList[i].classList.remove('active');
        }
    }

    selectColor() {
        this.colorInputEle.setAttribute(this.INPUT_COLOR_ATTRNAME, this.currColor);
        (typeof $ == 'function') && $(this.colorInputEle).data(this.INPUT_COLOR_DATAATTRNAME, this.currColor);
        this.colorInputEle.dispatchEvent(new Event('change', { "bubbles": true }));
        this.hidePicker();
    }
}

/*var customHexColorPicker = new CustomHexColorPicker({
    palette: true/false,
    defaultColor: 'red'/'#f00'/'#ff0000',
    colorattribute: 'anything',
    customlabeltext: 'anything',
    canceltext: 'anything',
    selecttext: 'anything'
});
//customHexColorPicker.register(colorInputEle);*/



