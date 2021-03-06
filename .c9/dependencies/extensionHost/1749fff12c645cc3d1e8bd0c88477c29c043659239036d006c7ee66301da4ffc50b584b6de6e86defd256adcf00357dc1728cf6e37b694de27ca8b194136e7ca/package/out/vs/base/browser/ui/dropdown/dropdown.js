/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/browser/touch", "vs/base/common/actions", "vs/base/browser/ui/actionbar/actionbar", "vs/base/browser/dom", "vs/base/browser/keyboardEvent", "vs/css!./dropdown"], function (require, exports, touch_1, actions_1, actionbar_1, dom_1, keyboardEvent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BaseDropdown extends actions_1.ActionRunner {
        constructor(container, options) {
            super();
            this._element = dom_1.append(container, dom_1.$('.monaco-dropdown'));
            this._label = dom_1.append(this._element, dom_1.$('.dropdown-label'));
            let labelRenderer = options.labelRenderer;
            if (!labelRenderer) {
                labelRenderer = (container) => {
                    container.textContent = options.label || '';
                    return null;
                };
            }
            for (const event of [dom_1.EventType.CLICK, dom_1.EventType.MOUSE_DOWN, touch_1.EventType.Tap]) {
                this._register(dom_1.addDisposableListener(this._label, event, e => dom_1.EventHelper.stop(e, true))); // prevent default click behaviour to trigger
            }
            for (const event of [dom_1.EventType.MOUSE_DOWN, touch_1.EventType.Tap]) {
                this._register(dom_1.addDisposableListener(this._label, event, e => {
                    if (e instanceof MouseEvent && e.detail > 1) {
                        return; // prevent multiple clicks to open multiple context menus (https://github.com/Microsoft/vscode/issues/41363)
                    }
                    if (this.visible) {
                        this.hide();
                    }
                    else {
                        this.show();
                    }
                }));
            }
            this._register(dom_1.addDisposableListener(this._label, dom_1.EventType.KEY_UP, e => {
                const event = new keyboardEvent_1.StandardKeyboardEvent(e);
                if (event.equals(3 /* Enter */) || event.equals(10 /* Space */)) {
                    dom_1.EventHelper.stop(e, true); // https://github.com/Microsoft/vscode/issues/57997
                    if (this.visible) {
                        this.hide();
                    }
                    else {
                        this.show();
                    }
                }
            }));
            const cleanupFn = labelRenderer(this._label);
            if (cleanupFn) {
                this._register(cleanupFn);
            }
            touch_1.Gesture.addTarget(this._label);
        }
        get element() {
            return this._element;
        }
        get label() {
            return this._label;
        }
        set tooltip(tooltip) {
            if (this._label) {
                this._label.title = tooltip;
            }
        }
        show() {
            this.visible = true;
        }
        hide() {
            this.visible = false;
        }
        isVisible() {
            return !!this.visible;
        }
        onEvent(e, activeElement) {
            this.hide();
        }
        dispose() {
            super.dispose();
            this.hide();
            if (this.boxContainer) {
                this.boxContainer.remove();
                this.boxContainer = undefined;
            }
            if (this.contents) {
                this.contents.remove();
                this.contents = undefined;
            }
            if (this._label) {
                this._label.remove();
                this._label = undefined;
            }
        }
    }
    exports.BaseDropdown = BaseDropdown;
    class Dropdown extends BaseDropdown {
        constructor(container, options) {
            super(container, options);
            this.contextViewProvider = options.contextViewProvider;
        }
        show() {
            super.show();
            dom_1.addClass(this.element, 'active');
            this.contextViewProvider.showContextView({
                getAnchor: () => this.getAnchor(),
                render: (container) => {
                    return this.renderContents(container);
                },
                onDOMEvent: (e, activeElement) => {
                    this.onEvent(e, activeElement);
                },
                onHide: () => this.onHide()
            });
        }
        getAnchor() {
            return this.element;
        }
        onHide() {
            dom_1.removeClass(this.element, 'active');
        }
        hide() {
            super.hide();
            if (this.contextViewProvider) {
                this.contextViewProvider.hideContextView();
            }
        }
        renderContents(container) {
            return null;
        }
    }
    exports.Dropdown = Dropdown;
    class DropdownMenu extends BaseDropdown {
        constructor(container, options) {
            super(container, options);
            this._contextMenuProvider = options.contextMenuProvider;
            this.actions = options.actions || [];
            this.actionProvider = options.actionProvider;
            this.menuClassName = options.menuClassName || '';
        }
        set menuOptions(options) {
            this._menuOptions = options;
        }
        get menuOptions() {
            return this._menuOptions;
        }
        get actions() {
            if (this.actionProvider) {
                return this.actionProvider.getActions();
            }
            return this._actions;
        }
        set actions(actions) {
            this._actions = actions;
        }
        show() {
            super.show();
            dom_1.addClass(this.element, 'active');
            this._contextMenuProvider.showContextMenu({
                getAnchor: () => this.element,
                getActions: () => this.actions,
                getActionsContext: () => this.menuOptions ? this.menuOptions.context : null,
                getActionViewItem: action => this.menuOptions && this.menuOptions.actionViewItemProvider ? this.menuOptions.actionViewItemProvider(action) : undefined,
                getKeyBinding: action => this.menuOptions && this.menuOptions.getKeyBinding ? this.menuOptions.getKeyBinding(action) : undefined,
                getMenuClassName: () => this.menuClassName,
                onHide: () => this.onHide(),
                actionRunner: this.menuOptions ? this.menuOptions.actionRunner : undefined,
                anchorAlignment: this.menuOptions.anchorAlignment
            });
        }
        hide() {
            super.hide();
        }
        onHide() {
            this.hide();
            dom_1.removeClass(this.element, 'active');
        }
    }
    exports.DropdownMenu = DropdownMenu;
    class DropdownMenuActionViewItem extends actionbar_1.BaseActionViewItem {
        constructor(action, menuActionsOrProvider, contextMenuProvider, actionViewItemProvider, actionRunner, keybindings, clazz, anchorAlignmentProvider) {
            super(null, action);
            this.menuActionsOrProvider = menuActionsOrProvider;
            this.contextMenuProvider = contextMenuProvider;
            this.actionViewItemProvider = actionViewItemProvider;
            this.actionRunner = actionRunner;
            this.keybindings = keybindings;
            this.clazz = clazz;
            this.anchorAlignmentProvider = anchorAlignmentProvider;
        }
        render(container) {
            const labelRenderer = (el) => {
                this.element = dom_1.append(el, dom_1.$('a.action-label.icon'));
                if (this.clazz) {
                    dom_1.addClasses(this.element, this.clazz);
                }
                this.element.tabIndex = 0;
                this.element.setAttribute('role', 'button');
                this.element.setAttribute('aria-haspopup', 'true');
                this.element.title = this._action.label || '';
                return null;
            };
            const options = {
                contextMenuProvider: this.contextMenuProvider,
                labelRenderer: labelRenderer
            };
            // Render the DropdownMenu around a simple action to toggle it
            if (Array.isArray(this.menuActionsOrProvider)) {
                options.actions = this.menuActionsOrProvider;
            }
            else {
                options.actionProvider = this.menuActionsOrProvider;
            }
            this.dropdownMenu = this._register(new DropdownMenu(container, options));
            this.dropdownMenu.menuOptions = {
                actionViewItemProvider: this.actionViewItemProvider,
                actionRunner: this.actionRunner,
                getKeyBinding: this.keybindings,
                context: this._context
            };
            if (this.anchorAlignmentProvider) {
                const that = this;
                this.dropdownMenu.menuOptions = Object.assign({}, this.dropdownMenu.menuOptions, { get anchorAlignment() {
                        return that.anchorAlignmentProvider();
                    } });
            }
        }
        setActionContext(newContext) {
            super.setActionContext(newContext);
            if (this.dropdownMenu) {
                this.dropdownMenu.menuOptions.context = newContext;
            }
        }
        show() {
            if (this.dropdownMenu) {
                this.dropdownMenu.show();
            }
        }
    }
    exports.DropdownMenuActionViewItem = DropdownMenuActionViewItem;
});
//# sourceMappingURL=dropdown.js.map