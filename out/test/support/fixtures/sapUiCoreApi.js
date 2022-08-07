"use strict";
module.exports = {
    "$schema-ref": "http://schemas.sap.com/sapui5/designtime/api.json/1.0",
    "version": "1.54.6",
    "library": "sap.ui.core",
    "symbols": [{
            "kind": "class",
            "name": "sap.m.Tree",
            "basename": "Tree",
            "resource": "sap/m/Tree.js",
            "module": "sap/m/Tree",
            "export": "",
            "static": true,
            "visibility": "public",
            "since": "1.42",
            "extends": "sap.m.ListBase",
            "description": "The <code>Tree</code> control provides a tree structure for displaying data in a hierarchy. <b>Note:</b> Growing feature is not supported by <code>Tree</code>.",
            "ui5-metamodel": true,
            "ui5-metadata": {
                "stereotype": "control",
                "events": [{
                        "name": "toggleOpenState",
                        "visibility": "public",
                        "since": "1.50",
                        "description": "Fired when an item has been expanded or collapsed by user interaction.",
                        "parameters": { "itemIndex": { "name": "itemIndex", "type": "int", "description": "Index of the expanded/collapsed item" }, "itemContext": { "name": "itemContext", "type": "object", "description": "Binding context of the item" }, "expanded": { "name": "expanded", "type": "boolean", "description": "Flag that indicates whether the item has been expanded or collapsed" } },
                        "methods": ["attachToggleOpenState", "detachToggleOpenState", "fireToggleOpenState"]
                    }]
            },
            "constructor": {
                "visibility": "public",
                "parameters": [{
                        "name": "sId",
                        "type": "string",
                        "optional": true,
                        "description": "ID for the new control, generated automatically if no id is given"
                    }, {
                        "name": "mSettings",
                        "type": "object",
                        "optional": true,
                        "description": "Initial settings for the new control"
                    }],
                "description": "Constructor for a new Tree.\n\nAccepts an object literal <code>mSettings</code> that defines initial property values, aggregated and associated objects as well as event handlers. See {@link sap.ui.base.ManagedObject#constructor} for a general description of the syntax of the settings object.",
                "references": ["{@link fiori:/tree/ Tree}"]
            },
            "events": [{
                    "name": "toggleOpenState",
                    "visibility": "public",
                    "since": "1.50",
                    "parameters": [{
                            "name": "oControlEvent",
                            "type": "sap.ui.base.Event",
                            "parameterProperties": { "getSource": { "name": "getSource", "type": "sap.ui.base.EventProvider", "optional": false }, "getParameters": { "name": "getParameters", "type": "object", "optional": false, "parameterProperties": { "itemIndex": { "name": "itemIndex", "type": "int", "optional": false, "description": "Index of the expanded/collapsed item" }, "itemContext": { "name": "itemContext", "type": "object", "optional": false, "description": "Binding context of the item" }, "expanded": { "name": "expanded", "type": "boolean", "optional": false, "description": "Flag that indicates whether the item has been expanded or collapsed" } } } }
                        }],
                    "description": "Fired when an item has been expanded or collapsed by user interaction."
                }],
            "methods": [{
                    "name": "attachToggleOpenState",
                    "visibility": "public",
                    "since": "1.50",
                    "returnValue": {
                        "type": "sap.m.Tree",
                        "description": "Reference to <code>this</code> in order to allow method chaining"
                    },
                    "parameters": [{
                            "name": "oData",
                            "type": "object",
                            "optional": true,
                            "description": "An application-specific payload object that will be passed to the event handler along with the event object when firing the event"
                        }, {
                            "name": "fnFunction",
                            "type": "function",
                            "optional": false,
                            "description": "The function to be called when the event occurs"
                        }, {
                            "name": "oListener",
                            "type": "object",
                            "optional": true,
                            "description": "Context object to call the event handler with. Defaults to this <code>sap.m.Tree</code> itself"
                        }],
                    "description": "Attaches event handler <code>fnFunction</code> to the {@link #event:toggleOpenState toggleOpenState} event of this <code>sap.m.Tree</code>.\n\nWhen called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener</code> if specified, otherwise it will be bound to this <code>sap.m.Tree</code> itself.\n\nFired when an item has been expanded or collapsed by user interaction."
                }, {
                    "name": "collapse",
                    "visibility": "public",
                    "since": "1.56.0",
                    "returnValue": {
                        "type": "sap.m.Tree",
                        "description": "A reference to the Tree control"
                    },
                    "parameters": [{
                            "name": "vParam",
                            "type": "int|int[]",
                            "optional": false,
                            "description": "The index or indices of the tree items to be collapsed"
                        }],
                    "description": "Collapses one or multiple items."
                }, {
                    "name": "collapseAll",
                    "visibility": "public",
                    "since": "1.48.0",
                    "returnValue": {
                        "type": "sap.m.Tree",
                        "description": "A reference to the Tree control"
                    },
                    "description": "Collapses all nodes."
                }, {
                    "name": "detachToggleOpenState",
                    "visibility": "public",
                    "since": "1.50",
                    "returnValue": {
                        "type": "sap.m.Tree",
                        "description": "Reference to <code>this</code> in order to allow method chaining"
                    },
                    "parameters": [{
                            "name": "fnFunction",
                            "type": "function",
                            "optional": false,
                            "description": "The function to be called, when the event occurs"
                        }, {
                            "name": "oListener",
                            "type": "object",
                            "optional": true,
                            "description": "Context object on which the given function had to be called"
                        }],
                    "description": "Detaches event handler <code>fnFunction</code> from the {@link #event:toggleOpenState toggleOpenState} event of this <code>sap.m.Tree</code>.\n\nThe passed function and listener object must match the ones used for event registration."
                }, {
                    "name": "expand",
                    "visibility": "public",
                    "since": "1.56.0",
                    "returnValue": {
                        "type": "sap.m.Tree",
                        "description": "A reference to the Tree control"
                    },
                    "parameters": [{
                            "name": "vParam",
                            "type": "int|int[]",
                            "optional": false,
                            "description": "The index or indices of the item to be expanded"
                        }],
                    "description": "Expands one or multiple items. Note that items that are hidden at the time of calling this API can't be expanded."
                }, {
                    "name": "expandToLevel",
                    "visibility": "public",
                    "since": "1.48.0",
                    "returnValue": {
                        "type": "sap.m.Tree",
                        "description": "Returns <code>this</code> to allow method chaining"
                    },
                    "parameters": [{
                            "name": "iLevel",
                            "type": "int",
                            "optional": false,
                            "description": "The level to which the data is expanded"
                        }],
                    "description": "Defines the level to which the tree is expanded. The function can be used to define the initial expanding state. An alternative way to define the initial expanding state is to set the parameter <code>numberOfExpandedLevels</code> of the binding.\n\nExample: <pre>\n  oTree.bindItems({\n     path: \"...\",\n     parameters: {\n        numberOfExpandedLevels: 1\n     }\n  });\n</pre>"
                }, {
                    "name": "extend",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "function",
                        "description": "Created class / constructor function"
                    },
                    "parameters": [{
                            "name": "sClassName",
                            "type": "string",
                            "optional": false,
                            "description": "Name of the class being created"
                        }, {
                            "name": "oClassInfo",
                            "type": "object",
                            "optional": true,
                            "description": "Object literal with information about the class"
                        }, {
                            "name": "FNMetaImpl",
                            "type": "function",
                            "optional": true,
                            "description": "Constructor function for the metadata object; if not given, it defaults to the metadata implementation used by this class"
                        }],
                    "description": "Creates a new subclass of class sap.m.Tree with name <code>sClassName</code> and enriches it with the information contained in <code>oClassInfo</code>.\n\n<code>oClassInfo</code> might contain the same kind of information as described in {@link sap.m.ListBase.extend}."
                }, {
                    "name": "fireToggleOpenState",
                    "visibility": "protected",
                    "since": "1.50",
                    "returnValue": {
                        "type": "sap.m.Tree",
                        "description": "Reference to <code>this</code> in order to allow method chaining"
                    },
                    "parameters": [{
                            "name": "mParameters",
                            "type": "object",
                            "optional": true,
                            "parameterProperties": {
                                "itemIndex": {
                                    "name": "itemIndex",
                                    "type": "int",
                                    "optional": true,
                                    "description": "Index of the expanded/collapsed item"
                                },
                                "itemContext": {
                                    "name": "itemContext",
                                    "type": "object",
                                    "optional": true,
                                    "description": "Binding context of the item"
                                },
                                "expanded": {
                                    "name": "expanded",
                                    "type": "boolean",
                                    "optional": true,
                                    "description": "Flag that indicates whether the item has been expanded or collapsed"
                                }
                            },
                            "description": "Parameters to pass along with the event"
                        }],
                    "description": "Fires event {@link #event:toggleOpenState toggleOpenState} to attached listeners."
                }, {
                    "name": "getMetadata",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.core.ElementMetadata",
                        "description": "Metadata object describing this class"
                    },
                    "description": "Returns a metadata object for class sap.m.Tree."
                }, {
                    "name": "setGrowing",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.m.Tree",
                        "description": "Returns <code>this</code> to allow method chaining"
                    },
                    "parameters": [{
                            "name": "bValue",
                            "type": "boolean",
                            "optional": false,
                            "description": "New value for the <code>growing</code> property, ignored."
                        }],
                    "description": "The <code>growing</code> property is not supported for control <code>Tree</code>.",
                    "deprecated": {
                        "since": "1.46"
                    }
                }, {
                    "name": "setGrowingDirection",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.m.Tree",
                        "description": "Returns <code>this</code> to allow method chaining"
                    },
                    "parameters": [{
                            "name": "sValue",
                            "type": "sap.m.ListGrowingDirection",
                            "optional": false,
                            "description": "New value for the <code>growingDirection</code> property, ignored."
                        }],
                    "description": "The <code>growingDirection</code> property is not supported for control <code>Tree</code>.",
                    "deprecated": {
                        "since": "1.46"
                    }
                }, {
                    "name": "setGrowingScrollToLoad",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.m.Tree",
                        "description": "Returns <code>this</code> to allow method chaining"
                    },
                    "parameters": [{
                            "name": "bValue",
                            "type": "int",
                            "optional": false,
                            "description": "New value for the <code>growingScrollToLoad</code> property, ignored."
                        }],
                    "description": "The <code>growingScrollToLoad</code> property is not supported for control <code>Tree</code>.",
                    "deprecated": {
                        "since": "1.46"
                    }
                }, {
                    "name": "setGrowingThreshold",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.m.Tree",
                        "description": "Returns <code>this</code> to allow method chaining"
                    },
                    "parameters": [{
                            "name": "iValue",
                            "type": "int",
                            "optional": false,
                            "description": "New value for the <code>growingThreshold</code> property, ignored."
                        }],
                    "description": "The <code>growingThreshold</code> property is not supported for control <code>Tree</code>.",
                    "deprecated": {
                        "since": "1.46"
                    }
                }, {
                    "name": "setGrowingTriggerText",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.m.Tree",
                        "description": "Returns <code>this</code> to allow method chaining"
                    },
                    "parameters": [{
                            "name": "sValue",
                            "type": "string",
                            "optional": false,
                            "description": "New value for the <code>growingTriggerText</code> property, ignored."
                        }],
                    "description": "The <code>growingTriggerText</code> property is not supported for control <code>Tree</code>.",
                    "deprecated": {
                        "since": "1.46"
                    }
                }],
            "originalName": "sap.m.Tree",
            "apiDocUrl": "https://openui5.hana.ondemand.com/1.84.0/#/api/sap.m.Tree"
        }, {
            "kind": "class",
            "name": "sap.ui.base.EventProvider",
            "basename": "EventProvider",
            "resource": "sap/ui/base/EventProvider.js",
            "module": "sap/ui/base/EventProvider",
            "export": "",
            "abstract": true,
            "static": true,
            "visibility": "public",
            "extends": "sap.ui.base.Object",
            "description": "Provides eventing capabilities for objects like attaching or detaching event handlers for events which are notified when events are fired.",
            "ui5-metadata": {
                "stereotype": "object"
            },
            "constructor": {
                "visibility": "public",
                "description": "Creates an instance of EventProvider."
            },
            "methods": [{
                    "name": "attachEvent",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.ui.base.EventProvider",
                        "description": "Returns <code>this</code> to allow method chaining"
                    },
                    "parameters": [{
                            "name": "sEventId",
                            "type": "string",
                            "optional": false,
                            "description": "The identifier of the event to listen for"
                        }, {
                            "name": "oData",
                            "type": "object",
                            "optional": true,
                            "description": "An object that will be passed to the handler along with the event object when the event is fired"
                        }, {
                            "name": "fnFunction",
                            "type": "function",
                            "optional": false,
                            "description": "The handler function to call when the event occurs. This function will be called in the context of the <code>oListener</code> instance (if present) or on the event provider instance. The event object ({@link sap.ui.base.Event}) is provided as first argument of the handler. Handlers must not change the content of the event. The second argument is the specified <code>oData</code> instance (if present)."
                        }, {
                            "name": "oListener",
                            "type": "object",
                            "optional": true,
                            "description": "The object that wants to be notified when the event occurs (<code>this</code> context within the handler function). If it is not specified, the handler function is called in the context of the event provider."
                        }],
                    "description": "Attaches an event handler to the event with the given identifier."
                }, {
                    "name": "attachEventOnce",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.ui.base.EventProvider",
                        "description": "Returns <code>this</code> to allow method chaining"
                    },
                    "parameters": [{
                            "name": "sEventId",
                            "type": "string",
                            "optional": false,
                            "description": "The identifier of the event to listen for"
                        }, {
                            "name": "oData",
                            "type": "object",
                            "optional": true,
                            "description": "An object that will be passed to the handler along with the event object when the event is fired"
                        }, {
                            "name": "fnFunction",
                            "type": "function",
                            "optional": false,
                            "description": "The handler function to call when the event occurs. This function will be called in the context of the <code>oListener</code> instance (if present) or on the event provider instance. The event object ({@link sap.ui.base.Event}) is provided as first argument of the handler. Handlers must not change the content of the event. The second argument is the specified <code>oData</code> instance (if present)."
                        }, {
                            "name": "oListener",
                            "type": "object",
                            "optional": true,
                            "description": "The object that wants to be notified when the event occurs (<code>this</code> context within the handler function). If it is not specified, the handler function is called in the context of the event provider."
                        }],
                    "description": "Attaches an event handler, called one time only, to the event with the given identifier.\n\nWhen the event occurs, the handler function is called and the handler registration is automatically removed afterwards."
                }, {
                    "name": "destroy",
                    "visibility": "public",
                    "description": "Cleans up the internal structures and removes all event handlers.\n\nThe object must not be used anymore after destroy was called.",
                    "references": ["sap.ui.base.Object#destroy"]
                }, {
                    "name": "detachEvent",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.ui.base.EventProvider",
                        "description": "Returns <code>this</code> to allow method chaining"
                    },
                    "parameters": [{
                            "name": "sEventId",
                            "type": "string",
                            "optional": false,
                            "description": "The identifier of the event to detach from"
                        }, {
                            "name": "fnFunction",
                            "type": "function",
                            "optional": false,
                            "description": "The handler function to detach from the event"
                        }, {
                            "name": "oListener",
                            "type": "object",
                            "optional": true,
                            "description": "The object that wanted to be notified when the event occurred"
                        }],
                    "description": "Removes a previously attached event handler from the event with the given identifier.\n\nThe passed parameters must match those used for registration with {@link #attachEvent} beforehand."
                }, {
                    "name": "extend",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "function",
                        "description": "Created class / constructor function"
                    },
                    "parameters": [{
                            "name": "sClassName",
                            "type": "string",
                            "optional": false,
                            "description": "Name of the class being created"
                        }, {
                            "name": "oClassInfo",
                            "type": "object",
                            "optional": true,
                            "description": "Object literal with information about the class"
                        }, {
                            "name": "FNMetaImpl",
                            "type": "function",
                            "optional": true,
                            "description": "Constructor function for the metadata object; if not given, it defaults to <code>sap.ui.core.ElementMetadata</code>"
                        }],
                    "description": "Creates a new subclass of class sap.ui.base.EventProvider with name <code>sClassName</code> and enriches it with the information contained in <code>oClassInfo</code>.\n\n<code>oClassInfo</code> might contain the same kind of information as described in {@link sap.ui.base.Object.extend}."
                }, {
                    "name": "fireEvent",
                    "visibility": "protected",
                    "returnValue": {
                        "type": "sap.ui.base.EventProvider|boolean",
                        "description": "Returns <code>this</code> to allow method chaining. When <code>preventDefault</code> is supported on the fired event the function returns <code>true</code> if the default action should be executed, <code>false</code> otherwise."
                    },
                    "parameters": [{
                            "name": "sEventId",
                            "type": "string",
                            "optional": false,
                            "description": "The identifier of the event to fire"
                        }, {
                            "name": "mParameters",
                            "type": "object",
                            "optional": true,
                            "description": "The parameters which should be carried by the event"
                        }, {
                            "name": "bAllowPreventDefault",
                            "type": "boolean",
                            "optional": true,
                            "description": "Defines whether function <code>preventDefault</code> is supported on the fired event"
                        }, {
                            "name": "bEnableEventBubbling",
                            "type": "boolean",
                            "optional": true,
                            "description": "Defines whether event bubbling is enabled on the fired event. Set to <code>true</code> the event is also forwarded to the parent(s) of the event provider ({@link #getEventingParent}) until the bubbling of the event is stopped or no parent is available anymore."
                        }],
                    "description": "Fires an {@link sap.ui.base.Event event} with the given settings and notifies all attached event handlers."
                }, {
                    "name": "getEventingParent",
                    "visibility": "protected",
                    "returnValue": {
                        "type": "sap.ui.base.EventProvider",
                        "description": "The parent event provider"
                    },
                    "description": "Returns the parent in the eventing hierarchy of this object.\n\nPer default this returns null, but if eventing is used in objects, which are hierarchically structured, this can be overwritten to make the object hierarchy visible to the eventing and enables the use of event bubbling within this object hierarchy."
                }, {
                    "name": "getMetadata",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.base.Metadata",
                        "description": "Metadata object describing this class"
                    },
                    "description": "Returns a metadata object for class sap.ui.base.EventProvider."
                }, {
                    "name": "hasListener",
                    "visibility": "restricted",
                    "static": true,
                    "returnValue": {
                        "type": "boolean",
                        "description": "Returns whether a listener with the same parameters exists"
                    },
                    "parameters": [{
                            "name": "oEventProvider",
                            "type": "sap.ui.base.EventProvider",
                            "optional": false,
                            "description": "The event provider to get the registered events for"
                        }, {
                            "name": "sEventId",
                            "type": "string",
                            "optional": false,
                            "description": "The identifier of the event to check listeners for"
                        }, {
                            "name": "fnFunction",
                            "type": "function",
                            "optional": false,
                            "description": "The handler function to check for"
                        }, {
                            "name": "oListener",
                            "type": "object",
                            "optional": true,
                            "description": "The listener object to check for"
                        }],
                    "description": "Checks whether the given event provider has the given listener registered for the given event.\n\nReturns true if function and listener object both match the corresponding parameters of at least one listener registered for the named event."
                }, {
                    "name": "hasListeners",
                    "visibility": "protected",
                    "returnValue": {
                        "type": "boolean",
                        "description": "Whether there are any registered event handlers"
                    },
                    "parameters": [{
                            "name": "sEventId",
                            "type": "string",
                            "optional": false,
                            "description": "The identifier of the event"
                        }],
                    "description": "Returns whether there are any registered event handlers for the event with the given identifier."
                }, {
                    "name": "toString",
                    "visibility": "public",
                    "returnValue": {
                        "type": "string",
                        "description": "A string description of this event provider"
                    },
                    "description": "Returns a string representation of this object.\n\nIn case there is no class or id information, a simple static string is returned. Subclasses should override this method."
                }]
        },
        {
            "kind": "class",
            "name": "sap.ui.base.Object",
            "basename": "Object",
            "resource": "sap/ui/base/Object.js",
            "module": "sap/ui/base/Object",
            "export": "",
            "abstract": true,
            "static": true,
            "visibility": "public",
            "description": "Base class for all SAPUI5 Objects",
            "ui5-metadata": {
                "stereotype": "object"
            },
            "constructor": {
                "visibility": "public",
                "description": "Constructor for an sap.ui.base.Object."
            },
            "methods": [{
                    "name": "defineClass",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.base.Metadata",
                        "description": "the created metadata object"
                    },
                    "parameters": [{
                            "name": "sClassName",
                            "type": "string",
                            "optional": false,
                            "description": "name of an (already declared) constructor function"
                        }, {
                            "name": "oStaticInfo",
                            "type": "object",
                            "optional": false,
                            "parameterProperties": {
                                "baseType": {
                                    "name": "baseType",
                                    "type": "string",
                                    "optional": false,
                                    "description": "qualified name of a base class"
                                },
                                "publicMethods": {
                                    "name": "publicMethods",
                                    "type": "string[]",
                                    "optional": false,
                                    "description": "array of names of public methods"
                                }
                            },
                            "description": "static info used to create the metadata object"
                        }, {
                            "name": "FNMetaImpl",
                            "type": "function",
                            "optional": true,
                            "description": "constructor function for the metadata object. If not given, it defaults to sap.ui.base.Metadata."
                        }],
                    "description": "Creates metadata for a given class and attaches it to the constructor and prototype of that class.\n\nAfter creation, metadata can be retrieved with getMetadata().\n\nThe static info can at least contain the following entries: <ul> <li>baseType: {string} fully qualified name of a base class or empty</li> <li>publicMethods: {string} an array of method names that will be visible in the interface proxy returned by {@link #getInterface}</li> </ul>",
                    "deprecated": {
                        "since": "1.3.1",
                        "text": "Use the static <code>extend</code> method of the desired base class (e.g. {@link sap.ui.base.Object.extend})"
                    }
                }, {
                    "name": "destroy",
                    "visibility": "public",
                    "description": "Destructor method for objects"
                }, {
                    "name": "extend",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "function",
                        "description": "the created class / constructor function"
                    },
                    "since": "1.3.1",
                    "parameters": [{
                            "name": "sClassName",
                            "type": "string",
                            "optional": false,
                            "description": "name of the class to be created"
                        }, {
                            "name": "oClassInfo",
                            "type": "object",
                            "optional": true,
                            "description": "structured object with informations about the class"
                        }, {
                            "name": "FNMetaImpl",
                            "type": "function",
                            "optional": true,
                            "description": "constructor function for the metadata object. If not given, it defaults to sap.ui.base.Metadata."
                        }],
                    "description": "Creates a subclass of class sap.ui.base.Object with name <code>sClassName</code> and enriches it with the information contained in <code>oClassInfo</code>.\n\n<code>oClassInfo</code> might contain three kinds of informations: <ul> <li><code>metadata:</code> an (optional) object literal with metadata about the class. The information in the object literal will be wrapped by an instance of {@link sap.ui.base.Metadata Metadata} and might contain the following information <ul> <li><code>interfaces:</code> {string[]} (optional) set of names of implemented interfaces (defaults to no interfaces)</li> <li><code>publicMethods:</code> {string[]} (optional) list of methods that should be part of the public facade of the class</li> <li><code>abstract:</code> {boolean} (optional) flag that marks the class as abstract (purely informational, defaults to false)</li> <li><code>final:</code> {boolean} (optional) flag that marks the class as final (defaults to false)</li> </ul> Subclasses of sap.ui.base.Object can enrich the set of supported metadata (e.g. see {@link sap.ui.core.Element.extend}). </li>\n\n<li><code>constructor:</code> a function that serves as a constructor function for the new class. If no constructor function is given, the framework creates a default implementation that delegates all its arguments to the constructor function of the base class. </li>\n\n<li><i>any-other-name:</i> any other property in the <code>oClassInfo</code> is copied into the prototype object of the newly created class. Callers can thereby add methods or properties to all instances of the class. But be aware that the given values are shared between all instances of the class. Usually, it doesn't make sense to use primitive values here other than to declare public constants. </li>\n\n</ul>\n\nThe prototype object of the newly created class uses the same prototype as instances of the base class (prototype chaining).\n\nA metadata object is always created, even if there is no <code>metadata</code> entry in the <code>oClassInfo</code> object. A getter for the metadata is always attached to the prototype and to the class (constructor function) itself.\n\nLast but not least, with the third argument <code>FNMetaImpl</code> the constructor of a metadata class can be specified. Instances of that class will be used to represent metadata for the newly created class and for any subclass created from it. Typically, only frameworks will use this parameter to enrich the metadata for a new class hierarchy they introduce (e.g. {@link sap.ui.core.Element.extend Element})."
                }, {
                    "name": "getInterface",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.ui.base.Interface",
                        "description": "the public interface of the object"
                    },
                    "description": "Returns the public interface of the object."
                }, {
                    "name": "getMetadata",
                    "visibility": "public",
                    "returnValue": {
                        "description": "{sap.ui.base.Metadata] metadata for the class of the object"
                    },
                    "description": "Returns the metadata for the class that this object belongs to.\n\nThis method is only defined when metadata has been declared by using {@link sap.ui.base.Object.defineClass} or {@link sap.ui.base.Object.extend}."
                }]
        }
    ]
};
//# sourceMappingURL=sapUiCoreApi.js.map