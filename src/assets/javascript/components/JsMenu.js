"use strict";

// Class definition
const JsMenu = function(element, options) {
    ////////////////////////////
    // ** Private Variables  ** //
    ////////////////////////////
    var that = this;

    if (typeof element === "undefined" || element === null) {
        return;
    }

    // Default Options
    var defaultOptions = {
        dropdown: {
            hoverTimeout: 200,
            zindex: 105
        },

        accordion: {
            slideSpeed: 250,
            expand: false
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var _construct = function() {
        if (JsUtils.data(element).has('menu') === true) {
            that = JsUtils.data(element).get('menu');
        } else {
            _init();
        }
    }

    var _init = function() {
        that.options = JsUtils.deepExtend({}, defaultOptions, options);
        that.uid = JsUtils.getUniqueId('menu');
        that.element = element;
        that.triggerElement;

        // Set initialized
        that.element.setAttribute('data-tu-menu', 'true');

        _setTriggerElement();
        _update();

        JsUtils.data(that.element).set('menu', that);
    }

    var _destroy = function() { // todo

    }

    // Event Handlers
    // Toggle handler
    var _click = function(element, e) {
        e.preventDefault();

        var item = _getItemElement(element);

        if (_getItemOption(item, 'trigger') !== 'click') {
            return;
        }

        if (_getItemOption(item, 'toggle') === false) {
            _show(item);
        } else {
            _toggle(item);
        }
    }

    // Link handler
    var _link = function(element, e) {
        if (JsEventHandler.trigger(that.element, 'tu.menu.link.click', that) === false) {
            return;
        }

        // Dismiss all shown dropdowns
        JsMenu.hideDropdowns();

        JsEventHandler.trigger(that.element, 'tu.menu.link.clicked', that);
    }

    // Dismiss handler
    var _dismiss = function(element, e) {
        var item = _getItemElement(element);
        var items = _getItemChildElements(item);

        if (item !== null && _getItemSubType(item) === 'dropdown') {
            _hide(item); // hide items dropdown
            // Hide all child elements as well

            if (items.length > 0) {
                for (var i = 0, len = items.length; i < len; i++) {
                    if (items[i] !== null && _getItemSubType(items[i]) === 'dropdown') {
                        _hide(tems[i]);
                    }
                }
            }
        }
    }

    // Mouseover handle
    var _mouseover = function(element, e) {
        var item = _getItemElement(element);

        if (item === null) {
            return;
        }

        if (_getItemOption(item, 'trigger') !== 'hover') {
            return;
        }

        if (JsUtils.data(item).get('hover') === '1') {
            clearTimeout(JsUtils.data(item).get('timeout'));
            JsUtils.data(item).remove('hover');
            JsUtils.data(item).remove('timeout');
        }

        _show(item);
    }

    // Mouseout handle
    var _mouseout = function(element, e) {
        var item = _getItemElement(element);

        if (item === null) {
            return;
        }

        if (_getItemOption(item, 'trigger') !== 'hover') {
            return;
        }

        var timeout = setTimeout(function() {
            if (JsUtils.data(item).get('hover') === '1') {
                _hide(item);
            }
        }, that.options.dropdown.hoverTimeout);

        JsUtils.data(item).set('hover', '1');
        JsUtils.data(item).set('timeout', timeout);
    }

    // Toggle item sub
    var _toggle = function(item) {
        if (!item) {
            item = that.triggerElement;
        }

        if (_isItemSubShown(item) === true) {
            _hide(item);
        } else {
            _show(item);
        }
    }

    // Show item sub
    var _show = function(item) {
        if (!item) {
            item = that.triggerElement;
        }

        if (_isItemSubShown(item) === true) {
            return;
        }

        if (_getItemSubType(item) === 'dropdown') {
            _showDropdown(item); // // show current dropdown
        } else if (_getItemSubType(item) === 'accordion') {
            _showAccordion(item);
        }

        // Remember last submenu type
        JsUtils.data(item).set('type', _getItemSubType(item)); // updated
    }

    // Hide item sub
    var _hide = function(item) {
        if (!item) {
            item = that.triggerElement;
        }

        if (_isItemSubShown(item) === false) {
            return;
        }

        if (_getItemSubType(item) === 'dropdown') {
            _hideDropdown(item);
        } else if (_getItemSubType(item) === 'accordion') {
            _hideAccordion(item);
        }
    }

    // Reset item state classes if item sub type changed
    var _reset = function(item) {
        if (_hasItemSub(item) === false) {
            return;
        }

        var sub = _getItemSubElement(item);

        // Reset sub state if sub type is changed during that window resize
        if (JsUtils.data(item).has('type') && JsUtils.data(item).get('type') !== _getItemSubType(item)) { // updated
            JsUtils.removeClass(item, 'hover');
            JsUtils.removeClass(item, 'show');
            JsUtils.removeClass(sub, 'show');
        } // updated
    }

    // Update all item state classes if item sub type changed
    var _update = function() {
        var items = that.element.querySelectorAll('.menu-item[data-tu-menu-trigger]');

        if (items && items.length > 0) {
            for (var i = 0, len = items.length; i < len; i++) {
                _reset(items[i]);
            }
        }
    }

    // Set external trigger element
    var _setTriggerElement = function() {
        var target = document.querySelector('[data-tu-menu-target="#' + that.element.getAttribute('id') + '"]');

        if (target !== null) {
            that.triggerElement = target;
        } else if (that.element.closest('[data-tu-menu-trigger]')) {
            that.triggerElement = that.element.closest('[data-tu-menu-trigger]');
        } else if (that.element.parentNode && JsUtils.child(that.element.parentNode, '[data-tu-menu-trigger]')) {
            that.triggerElement = JsUtils.child(that.element.parentNode, '[data-tu-menu-trigger]');
        }

        if (that.triggerElement) {
            JsUtils.data(that.triggerElement).set('menu', that);
        }
    }

    // Test if menu has external trigger element
    var _isTriggerElement = function(item) {
        return (that.triggerElement === item) ? true : false;
    }

    // Test if item's sub is shown
    var _isItemSubShown = function(item) {
        var sub = _getItemSubElement(item);

        if (sub !== null) {
            if (_getItemSubType(item) === 'dropdown') {
                if (JsUtils.hasClass(sub, 'show') === true && sub.hasAttribute('data-popper-placement') === true) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return JsUtils.hasClass(item, 'show');
            }
        } else {
            return false;
        }
    }

    // Test if item dropdown is permanent
    var _isItemDropdownPermanent = function(item) {
        return _getItemOption(item, 'permanent') === true ? true : false;
    }

    // Test if item's parent is shown
    var _isItemParentShown = function(item) {
        return JsUtils.parents(item, '.menu-item.show').length > 0;
    }

    // Test of it is item sub element
    var _isItemSubElement = function(item) {
        return JsUtils.hasClass(item, 'menu-sub');
    }

    // Test if item has sub
    var _hasItemSub = function(item) {
        return (JsUtils.hasClass(item, 'menu-item') && item.hasAttribute('data-tu-menu-trigger'));
    }

    // Get link element
    var _getItemLinkElement = function(item) {
        return JsUtils.child(item, '.menu-link');
    }

    // Get toggle element
    var _getItemToggleElement = function(item) {
        if (that.triggerElement) {
            return that.triggerElement;
        } else {
            return _getItemLinkElement(item);
        }
    }

    // Get item sub element
    var _getItemSubElement = function(item) {
        if (_isTriggerElement(item) === true) {
            return that.element;
        }
        if (item.classList.contains('menu-sub') === true) {
            return item;
        } else if (JsUtils.data(item).has('sub')) {
            return JsUtils.data(item).get('sub');
        } else {
            return JsUtils.child(item, '.menu-sub');
        }
    }

    // Get item sub type
    var _getItemSubType = function(element) {
        var sub = _getItemSubElement(element);

        if (sub && parseInt(JsUtils.css(sub, 'z-index')) > 0) {
            return "dropdown";
        } else {
            return "accordion";
        }
    }

    // Get item element
    var _getItemElement = function(element) {
        var item, sub;

        // Element is that external trigger element
        if (_isTriggerElement(element)) {
            return element;
        }

        // Element has item toggler attribute
        if (element.hasAttribute('data-tu-menu-trigger')) {
            return element;
        }

        // Element has item DOM reference in it's data storage
        if (JsUtils.data(element).has('item')) {
            return JsUtils.data(element).get('item');
        }

        // Item is parent of element
        if ((item = element.closest('.menu-item[data-tu-menu-trigger]'))) {
            return item;
        }

        // Element's parent has item DOM reference in it's data storage
        if ((sub = element.closest('.menu-sub'))) {
            if (JsUtils.data(sub).has('item') === true) {
                return JsUtils.data(sub).get('item')
            }
        }
    }

    // Get item parent element
    var _getItemParentElement = function(item) {
        var sub = item.closest('.menu-sub');
        var parentItem;

        if (JsUtils.data(sub).has('item')) {
            return JsUtils.data(sub).get('item');
        }

        if (sub && (parentItem = sub.closest('.menu-item[data-tu-menu-trigger]'))) {
            return parentItem;
        }

        return null;
    }

    // Get item parent elements
    var _getItemParentElements = function(item) {
        var parents = [];
        var parent;
        var i = 0;

        do {
            parent = _getItemParentElement(item);

            if (parent) {
                parents.push(parent);
                item = parent;
            }

            i++;
        } while (parent !== null && i < 20);

        if (that.triggerElement) {
            parents.unshift(that.triggerElement);
        }

        return parents;
    }

    // Get item child element
    var _getItemChildElement = function(item) {
        var selector = item;
        var element;

        if (JsUtils.data(item).get('sub')) {
            selector = JsUtils.data(item).get('sub');
        }

        if (selector !== null) {
            //element = selector.querySelector('.show.menu-item[data-tu-menu-trigger]');
            element = selector.querySelector('.menu-item[data-tu-menu-trigger]');

            if (element) {
                return element;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    // Get item child elements
    var _getItemChildElements = function(item) {
        var children = [];
        var child;
        var i = 0;

        do {
            child = _getItemChildElement(item);

            if (child) {
                children.push(child);
                item = child;
            }

            i++;
        } while (child !== null && i < 20);

        return children;
    }

    // Show item dropdown
    var _showDropdown = function(item) {
        // Handle dropdown show event
        if (JsEventHandler.trigger(that.element, 'tu.menu.dropdown.show', item) === false) {
            return;
        }

        // Hide all currently shown dropdowns except current one
        JsMenu.hideDropdowns(item);

        var toggle = _isTriggerElement(item) ? item : _getItemLinkElement(item);
        var sub = _getItemSubElement(item);

        var width = _getItemOption(item, 'width');
        var height = _getItemOption(item, 'height');

        var zindex = that.options.dropdown.zindex; // update
        var parentZindex = JsUtils.getHighestZindex(item); // update

        // Apply a new z-index if dropdown's toggle element or it's parent has greater z-index // update
        if (parentZindex !== null && parentZindex >= zindex) {
            zindex = parentZindex + 1;
        }

        if (zindex > 0) {
            JsUtils.css(sub, 'z-index', zindex);
        }

        if (width !== null) {
            JsUtils.css(sub, 'width', width);
        }

        if (height !== null) {
            JsUtils.css(sub, 'height', height);
        }

        JsUtils.css(sub, 'display', '');
        JsUtils.css(sub, 'overflow', '');

        // Init popper(new)
        _initDropdownPopper(item, sub);

        JsUtils.addClass(item, 'show');
        JsUtils.addClass(item, 'menu-dropdown');
        JsUtils.addClass(sub, 'show');

        // Append that sub that that root of that menu
        if (_getItemOption(item, 'overflow') === true) {
            document.body.appendChild(sub);
            JsUtils.data(item).set('sub', sub);
            JsUtils.data(sub).set('item', item);
            JsUtils.data(sub).set('menu', that);
        } else {
            JsUtils.data(sub).set('item', item);
        }

        // Handle dropdown shown event
        JsEventHandler.trigger(that.element, 'tu.menu.dropdown.shown', item);
    }

    // Hide item dropdown
    var _hideDropdown = function(item) {
        // Handle dropdown hide event
        if (JsEventHandler.trigger(that.element, 'tu.menu.dropdown.hide', item) === false) {
            return;
        }

        var sub = _getItemSubElement(item);

        JsUtils.css(sub, 'z-index', '');
        JsUtils.css(sub, 'width', '');
        JsUtils.css(sub, 'height', '');

        JsUtils.removeClass(item, 'show');
        JsUtils.removeClass(item, 'menu-dropdown');
        JsUtils.removeClass(sub, 'show');

        // Append that sub back to it's parent
        if (_getItemOption(item, 'overflow') === true) {
            if (item.classList.contains('menu-item')) {
                item.appendChild(sub);
            } else {
                JsUtils.insertAfter(that.element, item);
            }

            JsUtils.data(item).remove('sub');
            JsUtils.data(sub).remove('item');
            JsUtils.data(sub).remove('menu');
        }

        // Destroy popper(new)
        _destroyDropdownPopper(item);

        // Handle dropdown hidden event 
        JsEventHandler.trigger(that.element, 'tu.menu.dropdown.hidden', item);
    }

    // Init dropdown popper(new)
    var _initDropdownPopper = function(item, sub) {
        // Setup popper instance
        var reference;
        var attach = _getItemOption(item, 'attach');

        if (attach) {
            if (attach === 'parent') {
                reference = item.parentNode;
            } else {
                reference = document.querySelector(attach);
            }
        } else {
            reference = item;
        }

        var popper = Popper.createPopper(reference, sub, _getDropdownPopperConfig(item));
        JsUtils.data(item).set('popper', popper);
    }

    // Destroy dropdown popper(new)
    var _destroyDropdownPopper = function(item) {
        if (JsUtils.data(item).has('popper') === true) {
            JsUtils.data(item).get('popper').destroy();
            JsUtils.data(item).remove('popper');
        }
    }

    // Prepare popper config for dropdown(see: https://popper.js.org/docs/v2/)
    var _getDropdownPopperConfig = function(item) {
        // Placement
        var placement = _getItemOption(item, 'placement');
        if (!placement) {
            placement = 'right';
        }

        // Offset
        var offsetValue = _getItemOption(item, 'offset');
        var offset = offsetValue ? offsetValue.split(",") : [];

        // Strategy
        var strategy = _getItemOption(item, 'overflow') === true ? 'absolute' : 'fixed';

        var altAxis = _getItemOption(item, 'flip') !== false ? true : false;

        var popperConfig = {
            placement: placement,
            strategy: strategy,
            modifiers: [{
                name: 'offset',
                options: {
                    offset: offset
                }
            }, {
                name: 'preventOverflow',
                options: {
                    altAxis: altAxis
                }
            }, {
                name: 'flip',
                options: {
                    flipVariations: false
                }
            }]
        };

        return popperConfig;
    }

    // Show item accordion
    var _showAccordion = function(item) {
        if (JsEventHandler.trigger(that.element, 'tu.menu.accordion.show', item) === false) {
            return;
        }

        if (that.options.accordion.expand === false) {
            _hideAccordions(item);
        }

        var sub = _getItemSubElement(item);

        if (JsUtils.data(item).has('popper') === true) {
            _hideDropdown(item);
        }

        JsUtils.addClass(item, 'hover'); // updateWW

        JsUtils.addClass(item, 'showing');

        JsUtils.slideDown(sub, that.options.accordion.slideSpeed, function() {
            JsUtils.removeClass(item, 'showing');
            JsUtils.addClass(item, 'show');
            JsUtils.addClass(sub, 'show');

            JsEventHandler.trigger(that.element, 'tu.menu.accordion.shown', item);
        });
    }

    // Hide item accordion
    var _hideAccordion = function(item) {
        if (JsEventHandler.trigger(that.element, 'tu.menu.accordion.hide', item) === false) {
            return;
        }

        var sub = _getItemSubElement(item);

        JsUtils.addClass(item, 'hiding');

        JsUtils.slideUp(sub, that.options.accordion.slideSpeed, function() {
            JsUtils.removeClass(item, 'hiding');
            JsUtils.removeClass(item, 'show');
            JsUtils.removeClass(sub, 'show');

            JsUtils.removeClass(item, 'hover'); // update

            JsEventHandler.trigger(that.element, 'tu.menu.accordion.hidden', item);
        });
    }

    // Hide all shown accordions of item
    var _hideAccordions = function(item) {
        var itemsToHide = JsUtils.findAll(that.element, '.show[data-tu-menu-trigger]');
        var itemToHide;

        if (itemsToHide && itemsToHide.length > 0) {
            for (var i = 0, len = itemsToHide.length; i < len; i++) {
                itemToHide = itemsToHide[i];

                if (_getItemSubType(itemToHide) === 'accordion' && itemToHide !== item && item.contains(itemToHide) === false && itemToHide.contains(item) === false) {
                    _hideAccordion(itemToHide);
                }
            }
        }
    }

    // Get item option(through html attributes)
    var _getItemOption = function(item, name) {
        var attr;
        var value = null;

        if (item && item.hasAttribute('data-tu-menu-' + name)) {
            attr = item.getAttribute('data-tu-menu-' + name);
            value = JsUtils.getResponsiveValue(attr);
            console.log(value)

            if (value !== null && String(value) === 'true') {
                value = true;
            } else if (value !== null && String(value) === 'false') {
                value = false;
            }
        }

        return value;
    }

    var _destroy = function() {
        JsUtils.data(that.element).remove('menu');
    }

    // Construct Class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Event Handlers
    that.click = function(element, e) {
        return _click(element, e);
    }

    that.link = function(element, e) {
        return _link(element, e);
    }

    that.dismiss = function(element, e) {
        return _dismiss(element, e);
    }

    that.mouseover = function(element, e) {
        return _mouseover(element, e);
    }

    that.mouseout = function(element, e) {
        return _mouseout(element, e);
    }

    // General Methods
    that.getItemTriggerType = function(item) {
        return _getItemOption(item, 'trigger');
    }

    that.getItemSubType = function(element) {
        return _getItemSubType(element);
    }

    that.show = function(item) {
        return _show(item);
    }

    that.hide = function(item) {
        return _hide(item);
    }

    that.reset = function(item) {
        return _reset(item);
    }

    that.update = function() {
        return _update();
    }

    that.getElement = function() {
        return that.element;
    }

    that.getItemLinkElement = function(item) {
        return _getItemLinkElement(item);
    }

    that.getItemToggleElement = function(item) {
        return _getItemToggleElement(item);
    }

    that.getItemSubElement = function(item) {
        return _getItemSubElement(item);
    }

    that.getItemParentElements = function(item) {
        return _getItemParentElements(item);
    }

    that.isItemSubShown = function(item) {
        return _isItemSubShown(item);
    }

    that.isItemParentShown = function(item) {
        return _isItemParentShown(item);
    }

    that.getTriggerElement = function() {
        return that.triggerElement;
    }

    that.isItemDropdownPermanent = function(item) {
        return _isItemDropdownPermanent(item);
    }

    that.destroy = function() {
        return _destroy();
    }

    // Accordion Mode Methods
    that.hideAccordions = function(item) {
        return _hideAccordions(item);
    }

    // Event API
    that.on = function(name, handler) {
        return JsEventHandler.on(that.element, name, handler);
    }

    that.one = function(name, handler) {
        return JsEventHandler.one(that.element, name, handler);
    }

    that.off = function(name) {
        return JsEventHandler.off(that.element, name);
    }
};

// Get JsMenu instance by element
JsMenu.getInstance = function(element) {
    var menu;
    var item;

    // Element has menu DOM reference in it's DATA storage
    if (JsUtils.data(element).has('menu')) {
        return JsUtils.data(element).get('menu');
    }

    // Element has .menu parent 
    if (menu = element.closest('.menu')) {
        if (JsUtils.data(menu).has('menu')) {
            return JsUtils.data(menu).get('menu');
        }
    }

    // Element has a parent with DOM reference to .menu in it's DATA storage
    if (JsUtils.hasClass(element, 'menu-link')) {
        var sub = element.closest('.menu-sub');

        if (JsUtils.data(sub).has('menu')) {
            return JsUtils.data(sub).get('menu');
        }
    }

    return null;
}

// Hide all dropdowns and skip one if provided
JsMenu.hideDropdowns = function(skip) {
    var items = document.querySelectorAll('.show.menu-dropdown[data-tu-menu-trigger]');

    if (items && items.length > 0) {
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            var menu = JsMenu.getInstance(item);

            if (menu && menu.getItemSubType(item) === 'dropdown') {
                if (skip) {
                    if (menu.getItemSubElement(item).contains(skip) === false && item.contains(skip) === false && item !== skip) {
                        menu.hide(item);
                    }
                } else {
                    menu.hide(item);
                }
            }
        }
    }
}

// Update all dropdowns popover instances
JsMenu.updateDropdowns = function() {
    var items = document.querySelectorAll('.show.menu-dropdown[data-tu-menu-trigger]');

    if (items && items.length > 0) {
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];

            if (JsUtils.data(item).has('popper')) {
                JsUtils.data(item).get('popper').forceUpdate();
            }
        }
    }
}

// Global handlers
JsMenu.initGlobalHandlers = function() {
    // Dropdown handler
    document.addEventListener("click", function(e) {
        var items = document.querySelectorAll('.show.menu-dropdown[data-tu-menu-trigger]');
        var menu;
        var item;
        var sub;
        var menuObj;

        if (items && items.length > 0) {
            for (var i = 0, len = items.length; i < len; i++) {
                item = items[i];
                menuObj = JsMenu.getInstance(item);

                if (menuObj && menuObj.getItemSubType(item) === 'dropdown') {
                    menu = menuObj.getElement();
                    sub = menuObj.getItemSubElement(item);

                    if (item === e.target || item.contains(e.target)) {
                        continue;
                    }

                    if (sub === e.target || sub.contains(e.target)) {
                        continue;
                    }

                    menuObj.hide(item);
                }
            }
        }
    });

    // Sub toggle handler(updated)
    JsUtils.on(document.body, '.menu-item[data-tu-menu-trigger] > .menu-link, [data-tu-menu-trigger]:not(.menu-item):not([data-tu-menu-trigger="auto"])', 'click', function(e) {
        var menu = JsMenu.getInstance(this);

        if (menu !== null) {
            return menu.click(this, e);
        }
    });

    // Link handler
    JsUtils.on(document.body, '.menu-item:not([data-tu-menu-trigger]) > .menu-link', 'click', function(e) {
        var menu = JsMenu.getInstance(this);

        if (menu !== null) {
            return menu.link(this, e);
        }
    });

    // Dismiss handler
    JsUtils.on(document.body, '[data-tu-menu-dismiss="true"]', 'click', function(e) {
        var menu = JsMenu.getInstance(this);

        if (menu !== null) {
            return menu.dismiss(this, e);
        }
    });

    // Mouseover handler
    JsUtils.on(document.body, '[data-tu-menu-trigger], .menu-sub', 'mouseover', function(e) {
        var menu = JsMenu.getInstance(this);

        if (menu !== null && menu.getItemSubType(this) === 'dropdown') {
            return menu.mouseover(this, e);
        }
    });

    // Mouseout handler
    JsUtils.on(document.body, '[data-tu-menu-trigger], .menu-sub', 'mouseout', function(e) {
        var menu = JsMenu.getInstance(this);

        if (menu !== null && menu.getItemSubType(this) === 'dropdown') {
            return menu.mouseout(this, e);
        }
    });

    // Resize handler
    window.addEventListener('resize', JsUtils.throttleTime(function() {
        // Locate and update Offcanvas instances on window resize
        var elements = document.querySelectorAll('[data-tu-menu="true"]');

        if (elements && elements.length > 0) {
            for (var i = 0, len = elements.length; i < len; i++) {
                menu = JsMenu.getInstance(elements[i]);
                if (menu) {
                    menu.update();
                }
            }
        }
    }, 200), false);
}

// Global instances
JsMenu.createInstances = function() {
    var selector =
        arguments.length > 0 && arguments[0] !== undefined ?
        arguments[0] :
        '[data-tu-menu="true"]';
    var body = document.getElementsByTagName("BODY")[0]; // Initialize Menus

    var elements = document.querySelectorAll(selector);
    if (elements && elements.length > 0) {
        for (var i = 0, len = elements.length; i < len; i++) {
            new JsMenu(elements[i]);
        }
    }
}

// Global initialization
JsMenu.init = function() {
    // Global Event Handlers
    JsMenu.initGlobalHandlers();
    // Lazy Initialization
    JsMenu.createInstances();
};

// On document ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', JsMenu.init);
} else {
    JsMenu.init();
}

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = JsMenu;
}