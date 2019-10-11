/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    /**
     * MsgType enum.
     * @exports MsgType
     * @enum {string}
     * @property {number} UNDEFINED=0 UNDEFINED value
     * @property {number} CMD=1 CMD value
     * @property {number} ANS_CMD_GET_TEMP_PROFILE=2 ANS_CMD_GET_TEMP_PROFILE value
     * @property {number} ANS_CMD_GET_STATE=3 ANS_CMD_GET_STATE value
     * @property {number} ANS_CMD_START=4 ANS_CMD_START value
     * @property {number} ANS_CMD_STOP=5 ANS_CMD_STOP value
     * @property {number} TEMP_MEASURE=6 TEMP_MEASURE value
     * @property {number} ANS_TEMP_MEASURE=7 ANS_TEMP_MEASURE value
     * @property {number} FINISH_PROGRAM=8 FINISH_PROGRAM value
     * @property {number} PLAIN_TEXT=9 PLAIN_TEXT value
     */
    $root.MsgType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNDEFINED"] = 0;
        values[valuesById[1] = "CMD"] = 1;
        values[valuesById[2] = "ANS_CMD_GET_TEMP_PROFILE"] = 2;
        values[valuesById[3] = "ANS_CMD_GET_STATE"] = 3;
        values[valuesById[4] = "ANS_CMD_START"] = 4;
        values[valuesById[5] = "ANS_CMD_STOP"] = 5;
        values[valuesById[6] = "TEMP_MEASURE"] = 6;
        values[valuesById[7] = "ANS_TEMP_MEASURE"] = 7;
        values[valuesById[8] = "FINISH_PROGRAM"] = 8;
        values[valuesById[9] = "PLAIN_TEXT"] = 9;
        return values;
    })();
    
    $root.OvenCommand = (function() {
    
        /**
         * Properties of an OvenCommand.
         * @exports IOvenCommand
         * @interface IOvenCommand
         * @property {OvenCommand.Type|null} [type] OvenCommand type
         * @property {number|null} [id] OvenCommand id
         * @property {number|null} [priority] OvenCommand priority
         */
    
        /**
         * Constructs a new OvenCommand.
         * @exports OvenCommand
         * @classdesc Represents an OvenCommand.
         * @implements IOvenCommand
         * @constructor
         * @param {IOvenCommand=} [properties] Properties to set
         */
        function OvenCommand(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * OvenCommand type.
         * @member {OvenCommand.Type} type
         * @memberof OvenCommand
         * @instance
         */
        OvenCommand.prototype.type = 0;
    
        /**
         * OvenCommand id.
         * @member {number} id
         * @memberof OvenCommand
         * @instance
         */
        OvenCommand.prototype.id = 0;
    
        /**
         * OvenCommand priority.
         * @member {number} priority
         * @memberof OvenCommand
         * @instance
         */
        OvenCommand.prototype.priority = 0;
    
        /**
         * Creates a new OvenCommand instance using the specified properties.
         * @function create
         * @memberof OvenCommand
         * @static
         * @param {IOvenCommand=} [properties] Properties to set
         * @returns {OvenCommand} OvenCommand instance
         */
        OvenCommand.create = function create(properties) {
            return new OvenCommand(properties);
        };
    
        /**
         * Encodes the specified OvenCommand message. Does not implicitly {@link OvenCommand.verify|verify} messages.
         * @function encode
         * @memberof OvenCommand
         * @static
         * @param {IOvenCommand} message OvenCommand message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OvenCommand.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.id != null && message.hasOwnProperty("id"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.id);
            if (message.priority != null && message.hasOwnProperty("priority"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.priority);
            return writer;
        };
    
        /**
         * Encodes the specified OvenCommand message, length delimited. Does not implicitly {@link OvenCommand.verify|verify} messages.
         * @function encodeDelimited
         * @memberof OvenCommand
         * @static
         * @param {IOvenCommand} message OvenCommand message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OvenCommand.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an OvenCommand message from the specified reader or buffer.
         * @function decode
         * @memberof OvenCommand
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {OvenCommand} OvenCommand
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OvenCommand.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OvenCommand();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.type = reader.int32();
                    break;
                case 2:
                    message.id = reader.uint32();
                    break;
                case 3:
                    message.priority = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an OvenCommand message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof OvenCommand
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {OvenCommand} OvenCommand
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OvenCommand.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an OvenCommand message.
         * @function verify
         * @memberof OvenCommand
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OvenCommand.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.priority != null && message.hasOwnProperty("priority"))
                if (!$util.isInteger(message.priority))
                    return "priority: integer expected";
            return null;
        };
    
        /**
         * Creates an OvenCommand message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof OvenCommand
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {OvenCommand} OvenCommand
         */
        OvenCommand.fromObject = function fromObject(object) {
            if (object instanceof $root.OvenCommand)
                return object;
            var message = new $root.OvenCommand();
            switch (object.type) {
            case "GET_TEMP_PROFILE":
            case 0:
                message.type = 0;
                break;
            case "GET_STATE":
            case 1:
                message.type = 1;
                break;
            case "START":
            case 2:
                message.type = 2;
                break;
            case "STOP":
            case 3:
                message.type = 3;
                break;
            }
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.priority != null)
                message.priority = object.priority >>> 0;
            return message;
        };
    
        /**
         * Creates a plain object from an OvenCommand message. Also converts values to other types if specified.
         * @function toObject
         * @memberof OvenCommand
         * @static
         * @param {OvenCommand} message OvenCommand
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OvenCommand.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.type = options.enums === String ? "GET_TEMP_PROFILE" : 0;
                object.id = 0;
                object.priority = 0;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.OvenCommand.Type[message.type] : message.type;
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.priority != null && message.hasOwnProperty("priority"))
                object.priority = message.priority;
            return object;
        };
    
        /**
         * Converts this OvenCommand to JSON.
         * @function toJSON
         * @memberof OvenCommand
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OvenCommand.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Type enum.
         * @name OvenCommand.Type
         * @enum {string}
         * @property {number} GET_TEMP_PROFILE=0 GET_TEMP_PROFILE value
         * @property {number} GET_STATE=1 GET_STATE value
         * @property {number} START=2 START value
         * @property {number} STOP=3 STOP value
         */
        OvenCommand.Type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "GET_TEMP_PROFILE"] = 0;
            values[valuesById[1] = "GET_STATE"] = 1;
            values[valuesById[2] = "START"] = 2;
            values[valuesById[3] = "STOP"] = 3;
            return values;
        })();
    
        return OvenCommand;
    })();
    
    $root.TempMeasure = (function() {
    
        /**
         * Properties of a TempMeasure.
         * @exports ITempMeasure
         * @interface ITempMeasure
         * @property {number|null} [time] TempMeasure time
         * @property {number|null} [temp] TempMeasure temp
         */
    
        /**
         * Constructs a new TempMeasure.
         * @exports TempMeasure
         * @classdesc Represents a TempMeasure.
         * @implements ITempMeasure
         * @constructor
         * @param {ITempMeasure=} [properties] Properties to set
         */
        function TempMeasure(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * TempMeasure time.
         * @member {number} time
         * @memberof TempMeasure
         * @instance
         */
        TempMeasure.prototype.time = 0;
    
        /**
         * TempMeasure temp.
         * @member {number} temp
         * @memberof TempMeasure
         * @instance
         */
        TempMeasure.prototype.temp = 0;
    
        /**
         * Creates a new TempMeasure instance using the specified properties.
         * @function create
         * @memberof TempMeasure
         * @static
         * @param {ITempMeasure=} [properties] Properties to set
         * @returns {TempMeasure} TempMeasure instance
         */
        TempMeasure.create = function create(properties) {
            return new TempMeasure(properties);
        };
    
        /**
         * Encodes the specified TempMeasure message. Does not implicitly {@link TempMeasure.verify|verify} messages.
         * @function encode
         * @memberof TempMeasure
         * @static
         * @param {ITempMeasure} message TempMeasure message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TempMeasure.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.time != null && message.hasOwnProperty("time"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.time);
            if (message.temp != null && message.hasOwnProperty("temp"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.temp);
            return writer;
        };
    
        /**
         * Encodes the specified TempMeasure message, length delimited. Does not implicitly {@link TempMeasure.verify|verify} messages.
         * @function encodeDelimited
         * @memberof TempMeasure
         * @static
         * @param {ITempMeasure} message TempMeasure message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TempMeasure.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a TempMeasure message from the specified reader or buffer.
         * @function decode
         * @memberof TempMeasure
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {TempMeasure} TempMeasure
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TempMeasure.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TempMeasure();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.time = reader.uint32();
                    break;
                case 2:
                    message.temp = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a TempMeasure message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof TempMeasure
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {TempMeasure} TempMeasure
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TempMeasure.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a TempMeasure message.
         * @function verify
         * @memberof TempMeasure
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TempMeasure.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.time != null && message.hasOwnProperty("time"))
                if (!$util.isInteger(message.time))
                    return "time: integer expected";
            if (message.temp != null && message.hasOwnProperty("temp"))
                if (!$util.isInteger(message.temp))
                    return "temp: integer expected";
            return null;
        };
    
        /**
         * Creates a TempMeasure message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof TempMeasure
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {TempMeasure} TempMeasure
         */
        TempMeasure.fromObject = function fromObject(object) {
            if (object instanceof $root.TempMeasure)
                return object;
            var message = new $root.TempMeasure();
            if (object.time != null)
                message.time = object.time >>> 0;
            if (object.temp != null)
                message.temp = object.temp >>> 0;
            return message;
        };
    
        /**
         * Creates a plain object from a TempMeasure message. Also converts values to other types if specified.
         * @function toObject
         * @memberof TempMeasure
         * @static
         * @param {TempMeasure} message TempMeasure
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TempMeasure.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.time = 0;
                object.temp = 0;
            }
            if (message.time != null && message.hasOwnProperty("time"))
                object.time = message.time;
            if (message.temp != null && message.hasOwnProperty("temp"))
                object.temp = message.temp;
            return object;
        };
    
        /**
         * Converts this TempMeasure to JSON.
         * @function toJSON
         * @memberof TempMeasure
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TempMeasure.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return TempMeasure;
    })();
    
    $root.TempProfile = (function() {
    
        /**
         * Properties of a TempProfile.
         * @exports ITempProfile
         * @interface ITempProfile
         * @property {number|null} [countPoints] TempProfile countPoints
         * @property {Array.<ITempMeasure>|null} [data] TempProfile data
         */
    
        /**
         * Constructs a new TempProfile.
         * @exports TempProfile
         * @classdesc Represents a TempProfile.
         * @implements ITempProfile
         * @constructor
         * @param {ITempProfile=} [properties] Properties to set
         */
        function TempProfile(properties) {
            this.data = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * TempProfile countPoints.
         * @member {number} countPoints
         * @memberof TempProfile
         * @instance
         */
        TempProfile.prototype.countPoints = 0;
    
        /**
         * TempProfile data.
         * @member {Array.<ITempMeasure>} data
         * @memberof TempProfile
         * @instance
         */
        TempProfile.prototype.data = $util.emptyArray;
    
        /**
         * Creates a new TempProfile instance using the specified properties.
         * @function create
         * @memberof TempProfile
         * @static
         * @param {ITempProfile=} [properties] Properties to set
         * @returns {TempProfile} TempProfile instance
         */
        TempProfile.create = function create(properties) {
            return new TempProfile(properties);
        };
    
        /**
         * Encodes the specified TempProfile message. Does not implicitly {@link TempProfile.verify|verify} messages.
         * @function encode
         * @memberof TempProfile
         * @static
         * @param {ITempProfile} message TempProfile message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TempProfile.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.countPoints != null && message.hasOwnProperty("countPoints"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.countPoints);
            if (message.data != null && message.data.length)
                for (var i = 0; i < message.data.length; ++i)
                    $root.TempMeasure.encode(message.data[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified TempProfile message, length delimited. Does not implicitly {@link TempProfile.verify|verify} messages.
         * @function encodeDelimited
         * @memberof TempProfile
         * @static
         * @param {ITempProfile} message TempProfile message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TempProfile.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a TempProfile message from the specified reader or buffer.
         * @function decode
         * @memberof TempProfile
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {TempProfile} TempProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TempProfile.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TempProfile();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.countPoints = reader.uint32();
                    break;
                case 2:
                    if (!(message.data && message.data.length))
                        message.data = [];
                    message.data.push($root.TempMeasure.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a TempProfile message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof TempProfile
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {TempProfile} TempProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TempProfile.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a TempProfile message.
         * @function verify
         * @memberof TempProfile
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TempProfile.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.countPoints != null && message.hasOwnProperty("countPoints"))
                if (!$util.isInteger(message.countPoints))
                    return "countPoints: integer expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                if (!Array.isArray(message.data))
                    return "data: array expected";
                for (var i = 0; i < message.data.length; ++i) {
                    var error = $root.TempMeasure.verify(message.data[i]);
                    if (error)
                        return "data." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a TempProfile message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof TempProfile
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {TempProfile} TempProfile
         */
        TempProfile.fromObject = function fromObject(object) {
            if (object instanceof $root.TempProfile)
                return object;
            var message = new $root.TempProfile();
            if (object.countPoints != null)
                message.countPoints = object.countPoints >>> 0;
            if (object.data) {
                if (!Array.isArray(object.data))
                    throw TypeError(".TempProfile.data: array expected");
                message.data = [];
                for (var i = 0; i < object.data.length; ++i) {
                    if (typeof object.data[i] !== "object")
                        throw TypeError(".TempProfile.data: object expected");
                    message.data[i] = $root.TempMeasure.fromObject(object.data[i]);
                }
            }
            return message;
        };
    
        /**
         * Creates a plain object from a TempProfile message. Also converts values to other types if specified.
         * @function toObject
         * @memberof TempProfile
         * @static
         * @param {TempProfile} message TempProfile
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TempProfile.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.data = [];
            if (options.defaults)
                object.countPoints = 0;
            if (message.countPoints != null && message.hasOwnProperty("countPoints"))
                object.countPoints = message.countPoints;
            if (message.data && message.data.length) {
                object.data = [];
                for (var j = 0; j < message.data.length; ++j)
                    object.data[j] = $root.TempMeasure.toObject(message.data[j], options);
            }
            return object;
        };
    
        /**
         * Converts this TempProfile to JSON.
         * @function toJSON
         * @memberof TempProfile
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TempProfile.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return TempProfile;
    })();
    
    $root.AnsCmdGetTempProfile = (function() {
    
        /**
         * Properties of an AnsCmdGetTempProfile.
         * @exports IAnsCmdGetTempProfile
         * @interface IAnsCmdGetTempProfile
         * @property {boolean|null} [success] AnsCmdGetTempProfile success
         * @property {ITempProfile|null} [profile] AnsCmdGetTempProfile profile
         */
    
        /**
         * Constructs a new AnsCmdGetTempProfile.
         * @exports AnsCmdGetTempProfile
         * @classdesc Represents an AnsCmdGetTempProfile.
         * @implements IAnsCmdGetTempProfile
         * @constructor
         * @param {IAnsCmdGetTempProfile=} [properties] Properties to set
         */
        function AnsCmdGetTempProfile(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * AnsCmdGetTempProfile success.
         * @member {boolean} success
         * @memberof AnsCmdGetTempProfile
         * @instance
         */
        AnsCmdGetTempProfile.prototype.success = false;
    
        /**
         * AnsCmdGetTempProfile profile.
         * @member {ITempProfile|null|undefined} profile
         * @memberof AnsCmdGetTempProfile
         * @instance
         */
        AnsCmdGetTempProfile.prototype.profile = null;
    
        /**
         * Creates a new AnsCmdGetTempProfile instance using the specified properties.
         * @function create
         * @memberof AnsCmdGetTempProfile
         * @static
         * @param {IAnsCmdGetTempProfile=} [properties] Properties to set
         * @returns {AnsCmdGetTempProfile} AnsCmdGetTempProfile instance
         */
        AnsCmdGetTempProfile.create = function create(properties) {
            return new AnsCmdGetTempProfile(properties);
        };
    
        /**
         * Encodes the specified AnsCmdGetTempProfile message. Does not implicitly {@link AnsCmdGetTempProfile.verify|verify} messages.
         * @function encode
         * @memberof AnsCmdGetTempProfile
         * @static
         * @param {IAnsCmdGetTempProfile} message AnsCmdGetTempProfile message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AnsCmdGetTempProfile.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.profile != null && message.hasOwnProperty("profile"))
                $root.TempProfile.encode(message.profile, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified AnsCmdGetTempProfile message, length delimited. Does not implicitly {@link AnsCmdGetTempProfile.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AnsCmdGetTempProfile
         * @static
         * @param {IAnsCmdGetTempProfile} message AnsCmdGetTempProfile message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AnsCmdGetTempProfile.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an AnsCmdGetTempProfile message from the specified reader or buffer.
         * @function decode
         * @memberof AnsCmdGetTempProfile
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AnsCmdGetTempProfile} AnsCmdGetTempProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AnsCmdGetTempProfile.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AnsCmdGetTempProfile();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.success = reader.bool();
                    break;
                case 2:
                    message.profile = $root.TempProfile.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an AnsCmdGetTempProfile message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AnsCmdGetTempProfile
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AnsCmdGetTempProfile} AnsCmdGetTempProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AnsCmdGetTempProfile.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an AnsCmdGetTempProfile message.
         * @function verify
         * @memberof AnsCmdGetTempProfile
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AnsCmdGetTempProfile.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.profile != null && message.hasOwnProperty("profile")) {
                var error = $root.TempProfile.verify(message.profile);
                if (error)
                    return "profile." + error;
            }
            return null;
        };
    
        /**
         * Creates an AnsCmdGetTempProfile message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AnsCmdGetTempProfile
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AnsCmdGetTempProfile} AnsCmdGetTempProfile
         */
        AnsCmdGetTempProfile.fromObject = function fromObject(object) {
            if (object instanceof $root.AnsCmdGetTempProfile)
                return object;
            var message = new $root.AnsCmdGetTempProfile();
            if (object.success != null)
                message.success = Boolean(object.success);
            if (object.profile != null) {
                if (typeof object.profile !== "object")
                    throw TypeError(".AnsCmdGetTempProfile.profile: object expected");
                message.profile = $root.TempProfile.fromObject(object.profile);
            }
            return message;
        };
    
        /**
         * Creates a plain object from an AnsCmdGetTempProfile message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AnsCmdGetTempProfile
         * @static
         * @param {AnsCmdGetTempProfile} message AnsCmdGetTempProfile
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AnsCmdGetTempProfile.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.success = false;
                object.profile = null;
            }
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            if (message.profile != null && message.hasOwnProperty("profile"))
                object.profile = $root.TempProfile.toObject(message.profile, options);
            return object;
        };
    
        /**
         * Converts this AnsCmdGetTempProfile to JSON.
         * @function toJSON
         * @memberof AnsCmdGetTempProfile
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AnsCmdGetTempProfile.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return AnsCmdGetTempProfile;
    })();
    
    /**
     * OvenState enum.
     * @exports OvenState
     * @enum {string}
     * @property {number} STOPPED=0 STOPPED value
     * @property {number} LAUNCHED=1 LAUNCHED value
     */
    $root.OvenState = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "STOPPED"] = 0;
        values[valuesById[1] = "LAUNCHED"] = 1;
        return values;
    })();
    
    /**
     * OvenErrorType enum.
     * @exports OvenErrorType
     * @enum {string}
     * @property {number} NONE=0 NONE value
     * @property {number} FAULTY_TEMPERATURE_SENSOR=1 FAULTY_TEMPERATURE_SENSOR value
     * @property {number} FAULTY_RELAY=2 FAULTY_RELAY value
     * @property {number} UNKNOWN_ERROR=3 UNKNOWN_ERROR value
     */
    $root.OvenErrorType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NONE"] = 0;
        values[valuesById[1] = "FAULTY_TEMPERATURE_SENSOR"] = 1;
        values[valuesById[2] = "FAULTY_RELAY"] = 2;
        values[valuesById[3] = "UNKNOWN_ERROR"] = 3;
        return values;
    })();
    
    $root.AnsCmdGetState = (function() {
    
        /**
         * Properties of an AnsCmdGetState.
         * @exports IAnsCmdGetState
         * @interface IAnsCmdGetState
         * @property {OvenState|null} [state] AnsCmdGetState state
         * @property {OvenErrorType|null} [error] AnsCmdGetState error
         */
    
        /**
         * Constructs a new AnsCmdGetState.
         * @exports AnsCmdGetState
         * @classdesc Represents an AnsCmdGetState.
         * @implements IAnsCmdGetState
         * @constructor
         * @param {IAnsCmdGetState=} [properties] Properties to set
         */
        function AnsCmdGetState(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * AnsCmdGetState state.
         * @member {OvenState} state
         * @memberof AnsCmdGetState
         * @instance
         */
        AnsCmdGetState.prototype.state = 0;
    
        /**
         * AnsCmdGetState error.
         * @member {OvenErrorType} error
         * @memberof AnsCmdGetState
         * @instance
         */
        AnsCmdGetState.prototype.error = 0;
    
        /**
         * Creates a new AnsCmdGetState instance using the specified properties.
         * @function create
         * @memberof AnsCmdGetState
         * @static
         * @param {IAnsCmdGetState=} [properties] Properties to set
         * @returns {AnsCmdGetState} AnsCmdGetState instance
         */
        AnsCmdGetState.create = function create(properties) {
            return new AnsCmdGetState(properties);
        };
    
        /**
         * Encodes the specified AnsCmdGetState message. Does not implicitly {@link AnsCmdGetState.verify|verify} messages.
         * @function encode
         * @memberof AnsCmdGetState
         * @static
         * @param {IAnsCmdGetState} message AnsCmdGetState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AnsCmdGetState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.state != null && message.hasOwnProperty("state"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.state);
            if (message.error != null && message.hasOwnProperty("error"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.error);
            return writer;
        };
    
        /**
         * Encodes the specified AnsCmdGetState message, length delimited. Does not implicitly {@link AnsCmdGetState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AnsCmdGetState
         * @static
         * @param {IAnsCmdGetState} message AnsCmdGetState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AnsCmdGetState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an AnsCmdGetState message from the specified reader or buffer.
         * @function decode
         * @memberof AnsCmdGetState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AnsCmdGetState} AnsCmdGetState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AnsCmdGetState.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AnsCmdGetState();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.state = reader.int32();
                    break;
                case 2:
                    message.error = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an AnsCmdGetState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AnsCmdGetState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AnsCmdGetState} AnsCmdGetState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AnsCmdGetState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an AnsCmdGetState message.
         * @function verify
         * @memberof AnsCmdGetState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AnsCmdGetState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.state != null && message.hasOwnProperty("state"))
                switch (message.state) {
                default:
                    return "state: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.error != null && message.hasOwnProperty("error"))
                switch (message.error) {
                default:
                    return "error: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            return null;
        };
    
        /**
         * Creates an AnsCmdGetState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AnsCmdGetState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AnsCmdGetState} AnsCmdGetState
         */
        AnsCmdGetState.fromObject = function fromObject(object) {
            if (object instanceof $root.AnsCmdGetState)
                return object;
            var message = new $root.AnsCmdGetState();
            switch (object.state) {
            case "STOPPED":
            case 0:
                message.state = 0;
                break;
            case "LAUNCHED":
            case 1:
                message.state = 1;
                break;
            }
            switch (object.error) {
            case "NONE":
            case 0:
                message.error = 0;
                break;
            case "FAULTY_TEMPERATURE_SENSOR":
            case 1:
                message.error = 1;
                break;
            case "FAULTY_RELAY":
            case 2:
                message.error = 2;
                break;
            case "UNKNOWN_ERROR":
            case 3:
                message.error = 3;
                break;
            }
            return message;
        };
    
        /**
         * Creates a plain object from an AnsCmdGetState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AnsCmdGetState
         * @static
         * @param {AnsCmdGetState} message AnsCmdGetState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AnsCmdGetState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.state = options.enums === String ? "STOPPED" : 0;
                object.error = options.enums === String ? "NONE" : 0;
            }
            if (message.state != null && message.hasOwnProperty("state"))
                object.state = options.enums === String ? $root.OvenState[message.state] : message.state;
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = options.enums === String ? $root.OvenErrorType[message.error] : message.error;
            return object;
        };
    
        /**
         * Converts this AnsCmdGetState to JSON.
         * @function toJSON
         * @memberof AnsCmdGetState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AnsCmdGetState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return AnsCmdGetState;
    })();
    
    $root.AnsCmdStart = (function() {
    
        /**
         * Properties of an AnsCmdStart.
         * @exports IAnsCmdStart
         * @interface IAnsCmdStart
         * @property {boolean|null} [success] AnsCmdStart success
         * @property {number|null} [startTime] AnsCmdStart startTime
         */
    
        /**
         * Constructs a new AnsCmdStart.
         * @exports AnsCmdStart
         * @classdesc Represents an AnsCmdStart.
         * @implements IAnsCmdStart
         * @constructor
         * @param {IAnsCmdStart=} [properties] Properties to set
         */
        function AnsCmdStart(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * AnsCmdStart success.
         * @member {boolean} success
         * @memberof AnsCmdStart
         * @instance
         */
        AnsCmdStart.prototype.success = false;
    
        /**
         * AnsCmdStart startTime.
         * @member {number} startTime
         * @memberof AnsCmdStart
         * @instance
         */
        AnsCmdStart.prototype.startTime = 0;
    
        /**
         * Creates a new AnsCmdStart instance using the specified properties.
         * @function create
         * @memberof AnsCmdStart
         * @static
         * @param {IAnsCmdStart=} [properties] Properties to set
         * @returns {AnsCmdStart} AnsCmdStart instance
         */
        AnsCmdStart.create = function create(properties) {
            return new AnsCmdStart(properties);
        };
    
        /**
         * Encodes the specified AnsCmdStart message. Does not implicitly {@link AnsCmdStart.verify|verify} messages.
         * @function encode
         * @memberof AnsCmdStart
         * @static
         * @param {IAnsCmdStart} message AnsCmdStart message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AnsCmdStart.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.startTime);
            return writer;
        };
    
        /**
         * Encodes the specified AnsCmdStart message, length delimited. Does not implicitly {@link AnsCmdStart.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AnsCmdStart
         * @static
         * @param {IAnsCmdStart} message AnsCmdStart message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AnsCmdStart.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an AnsCmdStart message from the specified reader or buffer.
         * @function decode
         * @memberof AnsCmdStart
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AnsCmdStart} AnsCmdStart
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AnsCmdStart.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AnsCmdStart();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.success = reader.bool();
                    break;
                case 2:
                    message.startTime = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an AnsCmdStart message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AnsCmdStart
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AnsCmdStart} AnsCmdStart
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AnsCmdStart.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an AnsCmdStart message.
         * @function verify
         * @memberof AnsCmdStart
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AnsCmdStart.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                if (!$util.isInteger(message.startTime))
                    return "startTime: integer expected";
            return null;
        };
    
        /**
         * Creates an AnsCmdStart message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AnsCmdStart
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AnsCmdStart} AnsCmdStart
         */
        AnsCmdStart.fromObject = function fromObject(object) {
            if (object instanceof $root.AnsCmdStart)
                return object;
            var message = new $root.AnsCmdStart();
            if (object.success != null)
                message.success = Boolean(object.success);
            if (object.startTime != null)
                message.startTime = object.startTime >>> 0;
            return message;
        };
    
        /**
         * Creates a plain object from an AnsCmdStart message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AnsCmdStart
         * @static
         * @param {AnsCmdStart} message AnsCmdStart
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AnsCmdStart.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.success = false;
                object.startTime = 0;
            }
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                object.startTime = message.startTime;
            return object;
        };
    
        /**
         * Converts this AnsCmdStart to JSON.
         * @function toJSON
         * @memberof AnsCmdStart
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AnsCmdStart.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return AnsCmdStart;
    })();
    
    $root.AnsCmdStop = (function() {
    
        /**
         * Properties of an AnsCmdStop.
         * @exports IAnsCmdStop
         * @interface IAnsCmdStop
         * @property {boolean|null} [success] AnsCmdStop success
         * @property {number|null} [stopTime] AnsCmdStop stopTime
         */
    
        /**
         * Constructs a new AnsCmdStop.
         * @exports AnsCmdStop
         * @classdesc Represents an AnsCmdStop.
         * @implements IAnsCmdStop
         * @constructor
         * @param {IAnsCmdStop=} [properties] Properties to set
         */
        function AnsCmdStop(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * AnsCmdStop success.
         * @member {boolean} success
         * @memberof AnsCmdStop
         * @instance
         */
        AnsCmdStop.prototype.success = false;
    
        /**
         * AnsCmdStop stopTime.
         * @member {number} stopTime
         * @memberof AnsCmdStop
         * @instance
         */
        AnsCmdStop.prototype.stopTime = 0;
    
        /**
         * Creates a new AnsCmdStop instance using the specified properties.
         * @function create
         * @memberof AnsCmdStop
         * @static
         * @param {IAnsCmdStop=} [properties] Properties to set
         * @returns {AnsCmdStop} AnsCmdStop instance
         */
        AnsCmdStop.create = function create(properties) {
            return new AnsCmdStop(properties);
        };
    
        /**
         * Encodes the specified AnsCmdStop message. Does not implicitly {@link AnsCmdStop.verify|verify} messages.
         * @function encode
         * @memberof AnsCmdStop
         * @static
         * @param {IAnsCmdStop} message AnsCmdStop message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AnsCmdStop.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.stopTime != null && message.hasOwnProperty("stopTime"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.stopTime);
            return writer;
        };
    
        /**
         * Encodes the specified AnsCmdStop message, length delimited. Does not implicitly {@link AnsCmdStop.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AnsCmdStop
         * @static
         * @param {IAnsCmdStop} message AnsCmdStop message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AnsCmdStop.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an AnsCmdStop message from the specified reader or buffer.
         * @function decode
         * @memberof AnsCmdStop
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AnsCmdStop} AnsCmdStop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AnsCmdStop.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AnsCmdStop();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.success = reader.bool();
                    break;
                case 2:
                    message.stopTime = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an AnsCmdStop message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AnsCmdStop
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AnsCmdStop} AnsCmdStop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AnsCmdStop.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an AnsCmdStop message.
         * @function verify
         * @memberof AnsCmdStop
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AnsCmdStop.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.stopTime != null && message.hasOwnProperty("stopTime"))
                if (!$util.isInteger(message.stopTime))
                    return "stopTime: integer expected";
            return null;
        };
    
        /**
         * Creates an AnsCmdStop message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AnsCmdStop
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AnsCmdStop} AnsCmdStop
         */
        AnsCmdStop.fromObject = function fromObject(object) {
            if (object instanceof $root.AnsCmdStop)
                return object;
            var message = new $root.AnsCmdStop();
            if (object.success != null)
                message.success = Boolean(object.success);
            if (object.stopTime != null)
                message.stopTime = object.stopTime >>> 0;
            return message;
        };
    
        /**
         * Creates a plain object from an AnsCmdStop message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AnsCmdStop
         * @static
         * @param {AnsCmdStop} message AnsCmdStop
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AnsCmdStop.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.success = false;
                object.stopTime = 0;
            }
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            if (message.stopTime != null && message.hasOwnProperty("stopTime"))
                object.stopTime = message.stopTime;
            return object;
        };
    
        /**
         * Converts this AnsCmdStop to JSON.
         * @function toJSON
         * @memberof AnsCmdStop
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AnsCmdStop.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return AnsCmdStop;
    })();
    
    $root.AnsTempMeasure = (function() {
    
        /**
         * Properties of an AnsTempMeasure.
         * @exports IAnsTempMeasure
         * @interface IAnsTempMeasure
         * @property {boolean|null} [success] AnsTempMeasure success
         */
    
        /**
         * Constructs a new AnsTempMeasure.
         * @exports AnsTempMeasure
         * @classdesc Represents an AnsTempMeasure.
         * @implements IAnsTempMeasure
         * @constructor
         * @param {IAnsTempMeasure=} [properties] Properties to set
         */
        function AnsTempMeasure(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * AnsTempMeasure success.
         * @member {boolean} success
         * @memberof AnsTempMeasure
         * @instance
         */
        AnsTempMeasure.prototype.success = false;
    
        /**
         * Creates a new AnsTempMeasure instance using the specified properties.
         * @function create
         * @memberof AnsTempMeasure
         * @static
         * @param {IAnsTempMeasure=} [properties] Properties to set
         * @returns {AnsTempMeasure} AnsTempMeasure instance
         */
        AnsTempMeasure.create = function create(properties) {
            return new AnsTempMeasure(properties);
        };
    
        /**
         * Encodes the specified AnsTempMeasure message. Does not implicitly {@link AnsTempMeasure.verify|verify} messages.
         * @function encode
         * @memberof AnsTempMeasure
         * @static
         * @param {IAnsTempMeasure} message AnsTempMeasure message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AnsTempMeasure.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            return writer;
        };
    
        /**
         * Encodes the specified AnsTempMeasure message, length delimited. Does not implicitly {@link AnsTempMeasure.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AnsTempMeasure
         * @static
         * @param {IAnsTempMeasure} message AnsTempMeasure message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AnsTempMeasure.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an AnsTempMeasure message from the specified reader or buffer.
         * @function decode
         * @memberof AnsTempMeasure
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AnsTempMeasure} AnsTempMeasure
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AnsTempMeasure.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AnsTempMeasure();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.success = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an AnsTempMeasure message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AnsTempMeasure
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AnsTempMeasure} AnsTempMeasure
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AnsTempMeasure.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an AnsTempMeasure message.
         * @function verify
         * @memberof AnsTempMeasure
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AnsTempMeasure.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            return null;
        };
    
        /**
         * Creates an AnsTempMeasure message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AnsTempMeasure
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AnsTempMeasure} AnsTempMeasure
         */
        AnsTempMeasure.fromObject = function fromObject(object) {
            if (object instanceof $root.AnsTempMeasure)
                return object;
            var message = new $root.AnsTempMeasure();
            if (object.success != null)
                message.success = Boolean(object.success);
            return message;
        };
    
        /**
         * Creates a plain object from an AnsTempMeasure message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AnsTempMeasure
         * @static
         * @param {AnsTempMeasure} message AnsTempMeasure
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AnsTempMeasure.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.success = false;
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            return object;
        };
    
        /**
         * Converts this AnsTempMeasure to JSON.
         * @function toJSON
         * @memberof AnsTempMeasure
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AnsTempMeasure.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return AnsTempMeasure;
    })();
    
    $root.FinishProgram = (function() {
    
        /**
         * Properties of a FinishProgram.
         * @exports IFinishProgram
         * @interface IFinishProgram
         * @property {boolean|null} [success] FinishProgram success
         */
    
        /**
         * Constructs a new FinishProgram.
         * @exports FinishProgram
         * @classdesc Represents a FinishProgram.
         * @implements IFinishProgram
         * @constructor
         * @param {IFinishProgram=} [properties] Properties to set
         */
        function FinishProgram(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * FinishProgram success.
         * @member {boolean} success
         * @memberof FinishProgram
         * @instance
         */
        FinishProgram.prototype.success = false;
    
        /**
         * Creates a new FinishProgram instance using the specified properties.
         * @function create
         * @memberof FinishProgram
         * @static
         * @param {IFinishProgram=} [properties] Properties to set
         * @returns {FinishProgram} FinishProgram instance
         */
        FinishProgram.create = function create(properties) {
            return new FinishProgram(properties);
        };
    
        /**
         * Encodes the specified FinishProgram message. Does not implicitly {@link FinishProgram.verify|verify} messages.
         * @function encode
         * @memberof FinishProgram
         * @static
         * @param {IFinishProgram} message FinishProgram message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FinishProgram.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            return writer;
        };
    
        /**
         * Encodes the specified FinishProgram message, length delimited. Does not implicitly {@link FinishProgram.verify|verify} messages.
         * @function encodeDelimited
         * @memberof FinishProgram
         * @static
         * @param {IFinishProgram} message FinishProgram message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FinishProgram.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a FinishProgram message from the specified reader or buffer.
         * @function decode
         * @memberof FinishProgram
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {FinishProgram} FinishProgram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FinishProgram.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.FinishProgram();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.success = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a FinishProgram message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof FinishProgram
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {FinishProgram} FinishProgram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FinishProgram.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a FinishProgram message.
         * @function verify
         * @memberof FinishProgram
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FinishProgram.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            return null;
        };
    
        /**
         * Creates a FinishProgram message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof FinishProgram
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {FinishProgram} FinishProgram
         */
        FinishProgram.fromObject = function fromObject(object) {
            if (object instanceof $root.FinishProgram)
                return object;
            var message = new $root.FinishProgram();
            if (object.success != null)
                message.success = Boolean(object.success);
            return message;
        };
    
        /**
         * Creates a plain object from a FinishProgram message. Also converts values to other types if specified.
         * @function toObject
         * @memberof FinishProgram
         * @static
         * @param {FinishProgram} message FinishProgram
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FinishProgram.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.success = false;
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            return object;
        };
    
        /**
         * Converts this FinishProgram to JSON.
         * @function toJSON
         * @memberof FinishProgram
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FinishProgram.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return FinishProgram;
    })();

    return $root;
});
