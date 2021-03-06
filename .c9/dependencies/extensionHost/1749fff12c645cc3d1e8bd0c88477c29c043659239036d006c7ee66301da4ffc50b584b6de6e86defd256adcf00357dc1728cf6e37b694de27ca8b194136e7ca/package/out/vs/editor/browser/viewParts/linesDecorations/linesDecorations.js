/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/editor/browser/viewParts/glyphMargin/glyphMargin", "vs/css!./linesDecorations"], function (require, exports, glyphMargin_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LinesDecorationsOverlay extends glyphMargin_1.DedupOverlay {
        constructor(context) {
            super();
            this._context = context;
            this._decorationsLeft = this._context.configuration.editor.layoutInfo.decorationsLeft;
            this._decorationsWidth = this._context.configuration.editor.layoutInfo.decorationsWidth;
            this._renderResult = null;
            this._context.addEventHandler(this);
        }
        dispose() {
            this._context.removeEventHandler(this);
            this._renderResult = null;
            super.dispose();
        }
        // --- begin event handlers
        onConfigurationChanged(e) {
            if (e.layoutInfo) {
                this._decorationsLeft = this._context.configuration.editor.layoutInfo.decorationsLeft;
                this._decorationsWidth = this._context.configuration.editor.layoutInfo.decorationsWidth;
            }
            return true;
        }
        onDecorationsChanged(e) {
            return true;
        }
        onFlushed(e) {
            return true;
        }
        onLinesChanged(e) {
            return true;
        }
        onLinesDeleted(e) {
            return true;
        }
        onLinesInserted(e) {
            return true;
        }
        onScrollChanged(e) {
            return e.scrollTopChanged;
        }
        onZonesChanged(e) {
            return true;
        }
        // --- end event handlers
        _getDecorations(ctx) {
            const decorations = ctx.getDecorationsInViewport();
            let r = [], rLen = 0;
            for (let i = 0, len = decorations.length; i < len; i++) {
                const d = decorations[i];
                const linesDecorationsClassName = d.options.linesDecorationsClassName;
                if (linesDecorationsClassName) {
                    r[rLen++] = new glyphMargin_1.DecorationToRender(d.range.startLineNumber, d.range.endLineNumber, linesDecorationsClassName);
                }
            }
            return r;
        }
        prepareRender(ctx) {
            const visibleStartLineNumber = ctx.visibleRange.startLineNumber;
            const visibleEndLineNumber = ctx.visibleRange.endLineNumber;
            const toRender = this._render(visibleStartLineNumber, visibleEndLineNumber, this._getDecorations(ctx));
            const left = this._decorationsLeft.toString();
            const width = this._decorationsWidth.toString();
            const common = '" style="left:' + left + 'px;width:' + width + 'px;"></div>';
            const output = [];
            for (let lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
                const lineIndex = lineNumber - visibleStartLineNumber;
                const classNames = toRender[lineIndex];
                let lineOutput = '';
                for (let i = 0, len = classNames.length; i < len; i++) {
                    lineOutput += '<div class="cldr ' + classNames[i] + common;
                }
                output[lineIndex] = lineOutput;
            }
            this._renderResult = output;
        }
        render(startLineNumber, lineNumber) {
            if (!this._renderResult) {
                return '';
            }
            return this._renderResult[lineNumber - startLineNumber];
        }
    }
    exports.LinesDecorationsOverlay = LinesDecorationsOverlay;
});
//# sourceMappingURL=linesDecorations.js.map