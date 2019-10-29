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
     * PB_MsgType enum.
     * @exports PB_MsgType
     * @enum {string}
     * @property {number} UNDEFINED=0 UNDEFINED value
     * @property {number} CMD=1 CMD value
     * @property {number} RESPONSE=2 RESPONSE value
     * @property {number} RESPONSE_GET_TEMP_PROFILE=3 RESPONSE_GET_TEMP_PROFILE value
     * @property {number} TEMP_MEASURE=4 TEMP_MEASURE value
     * @property {number} RESPONSE_TEMP_MEASURE=5 RESPONSE_TEMP_MEASURE value
     * @property {number} FINISH_PROGRAM=6 FINISH_PROGRAM value
     * @property {number} PLAIN_TEXT=7 PLAIN_TEXT value
     * @property {number} SWITCH_OVEN_STATE=8 SWITCH_OVEN_STATE value
     */
    $root.PB_MsgType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNDEFINED"] = 0;
        values[valuesById[1] = "CMD"] = 1;
        values[valuesById[2] = "RESPONSE"] = 2;
        values[valuesById[3] = "RESPONSE_GET_TEMP_PROFILE"] = 3;
        values[valuesById[4] = "TEMP_MEASURE"] = 4;
        values[valuesById[5] = "RESPONSE_TEMP_MEASURE"] = 5;
        values[valuesById[6] = "FINISH_PROGRAM"] = 6;
        values[valuesById[7] = "PLAIN_TEXT"] = 7;
        values[valuesById[8] = "SWITCH_OVEN_STATE"] = 8;
        return values;
    })();
    
    /**
     * PB_CmdType enum.
     * @exports PB_CmdType
     * @enum {string}
     * @property {number} GET_TEMP_PROFILE=0 GET_TEMP_PROFILE value
     * @property {number} GET_STATE=1 GET_STATE value
     * @property {number} START=2 START value
     * @property {number} STOP=3 STOP value
     * @property {number} HARD_RESET=4 HARD_RESET value
     * @property {number} CLIENT_REQUIRES_RESET=5 CLIENT_REQUIRES_RESET value
     * @property {number} MANUAL_ON=6 MANUAL_ON value
     * @property {number} MANUAL_OFF=7 MANUAL_OFF value
     */
    $root.PB_CmdType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "GET_TEMP_PROFILE"] = 0;
        values[valuesById[1] = "GET_STATE"] = 1;
        values[valuesById[2] = "START"] = 2;
        values[valuesById[3] = "STOP"] = 3;
        values[valuesById[4] = "HARD_RESET"] = 4;
        values[valuesById[5] = "CLIENT_REQUIRES_RESET"] = 5;
        values[valuesById[6] = "MANUAL_ON"] = 6;
        values[valuesById[7] = "MANUAL_OFF"] = 7;
        return values;
    })();
    
    $root.PB_Command = (function() {
    
        /**
         * Properties of a PB_Command.
         * @exports IPB_Command
         * @interface IPB_Command
         * @property {PB_CmdType|null} [cmdType] PB_Command cmdType
         * @property {number|null} [id] PB_Command id
         * @property {number|null} [priority] PB_Command priority
         */
    
        /**
         * Constructs a new PB_Command.
         * @exports PB_Command
         * @classdesc Represents a PB_Command.
         * @implements IPB_Command
         * @constructor
         * @param {IPB_Command=} [properties] Properties to set
         */
        function PB_Command(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * PB_Command cmdType.
         * @member {PB_CmdType} cmdType
         * @memberof PB_Command
         * @instance
         */
        PB_Command.prototype.cmdType = 0;
    
        /**
         * PB_Command id.
         * @member {number} id
         * @memberof PB_Command
         * @instance
         */
        PB_Command.prototype.id = 0;
    
        /**
         * PB_Command priority.
         * @member {number} priority
         * @memberof PB_Command
         * @instance
         */
        PB_Command.prototype.priority = 0;
    
        /**
         * Creates a new PB_Command instance using the specified properties.
         * @function create
         * @memberof PB_Command
         * @static
         * @param {IPB_Command=} [properties] Properties to set
         * @returns {PB_Command} PB_Command instance
         */
        PB_Command.create = function create(properties) {
            return new PB_Command(properties);
        };
    
        /**
         * Encodes the specified PB_Command message. Does not implicitly {@link PB_Command.verify|verify} messages.
         * @function encode
         * @memberof PB_Command
         * @static
         * @param {IPB_Command} message PB_Command message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PB_Command.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cmdType != null && message.hasOwnProperty("cmdType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cmdType);
            if (message.id != null && message.hasOwnProperty("id"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.id);
            if (message.priority != null && message.hasOwnProperty("priority"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.priority);
            return writer;
        };
    
        /**
         * Encodes the specified PB_Command message, length delimited. Does not implicitly {@link PB_Command.verify|verify} messages.
         * @function encodeDelimited
         * @memberof PB_Command
         * @static
         * @param {IPB_Command} message PB_Command message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PB_Command.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a PB_Command message from the specified reader or buffer.
         * @function decode
         * @memberof PB_Command
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {PB_Command} PB_Command
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PB_Command.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Command();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cmdType = reader.int32();
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
         * Decodes a PB_Command message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof PB_Command
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {PB_Command} PB_Command
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PB_Command.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a PB_Command message.
         * @function verify
         * @memberof PB_Command
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PB_Command.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cmdType != null && message.hasOwnProperty("cmdType"))
                switch (message.cmdType) {
                default:
                    return "cmdType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
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
         * Creates a PB_Command message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof PB_Command
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {PB_Command} PB_Command
         */
        PB_Command.fromObject = function fromObject(object) {
            if (object instanceof $root.PB_Command)
                return object;
            var message = new $root.PB_Command();
            switch (object.cmdType) {
            case "GET_TEMP_PROFILE":
            case 0:
                message.cmdType = 0;
                break;
            case "GET_STATE":
            case 1:
                message.cmdType = 1;
                break;
            case "START":
            case 2:
                message.cmdType = 2;
                break;
            case "STOP":
            case 3:
                message.cmdType = 3;
                break;
            case "HARD_RESET":
            case 4:
                message.cmdType = 4;
                break;
            case "CLIENT_REQUIRES_RESET":
            case 5:
                message.cmdType = 5;
                break;
            case "MANUAL_ON":
            case 6:
                message.cmdType = 6;
                break;
            case "MANUAL_OFF":
            case 7:
                message.cmdType = 7;
                break;
            }
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.priority != null)
                message.priority = object.priority >>> 0;
            return message;
        };
    
        /**
         * Creates a plain object from a PB_Command message. Also converts values to other types if specified.
         * @function toObject
         * @memberof PB_Command
         * @static
         * @param {PB_Command} message PB_Command
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PB_Command.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cmdType = options.enums === String ? "GET_TEMP_PROFILE" : 0;
                object.id = 0;
                object.priority = 0;
            }
            if (message.cmdType != null && message.hasOwnProperty("cmdType"))
                object.cmdType = options.enums === String ? $root.PB_CmdType[message.cmdType] : message.cmdType;
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.priority != null && message.hasOwnProperty("priority"))
                object.priority = message.priority;
            return object;
        };
    
        /**
         * Converts this PB_Command to JSON.
         * @function toJSON
         * @memberof PB_Command
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PB_Command.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return PB_Command;
    })();
    
    $root.PB_TempMeasure = (function() {
    
        /**
         * Properties of a PB_TempMeasure.
         * @exports IPB_TempMeasure
         * @interface IPB_TempMeasure
         * @property {number|null} [time] PB_TempMeasure time
         * @property {number|null} [mills] PB_TempMeasure mills
         * @property {number|null} [temp] PB_TempMeasure temp
         */
    
        /**
         * Constructs a new PB_TempMeasure.
         * @exports PB_TempMeasure
         * @classdesc Represents a PB_TempMeasure.
         * @implements IPB_TempMeasure
         * @constructor
         * @param {IPB_TempMeasure=} [properties] Properties to set
         */
        function PB_TempMeasure(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * PB_TempMeasure time.
         * @member {number} time
         * @memberof PB_TempMeasure
         * @instance
         */
        PB_TempMeasure.prototype.time = 0;
    
        /**
         * PB_TempMeasure mills.
         * @member {number} mills
         * @memberof PB_TempMeasure
         * @instance
         */
        PB_TempMeasure.prototype.mills = 0;
    
        /**
         * PB_TempMeasure temp.
         * @member {number} temp
         * @memberof PB_TempMeasure
         * @instance
         */
        PB_TempMeasure.prototype.temp = 0;
    
        /**
         * Creates a new PB_TempMeasure instance using the specified properties.
         * @function create
         * @memberof PB_TempMeasure
         * @static
         * @param {IPB_TempMeasure=} [properties] Properties to set
         * @returns {PB_TempMeasure} PB_TempMeasure instance
         */
        PB_TempMeasure.create = function create(properties) {
            return new PB_TempMeasure(properties);
        };
    
        /**
         * Encodes the specified PB_TempMeasure message. Does not implicitly {@link PB_TempMeasure.verify|verify} messages.
         * @function encode
         * @memberof PB_TempMeasure
         * @static
         * @param {IPB_TempMeasure} message PB_TempMeasure message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PB_TempMeasure.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.time != null && message.hasOwnProperty("time"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.time);
            if (message.mills != null && message.hasOwnProperty("mills"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.mills);
            if (message.temp != null && message.hasOwnProperty("temp"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.temp);
            return writer;
        };
    
        /**
         * Encodes the specified PB_TempMeasure message, length delimited. Does not implicitly {@link PB_TempMeasure.verify|verify} messages.
         * @function encodeDelimited
         * @memberof PB_TempMeasure
         * @static
         * @param {IPB_TempMeasure} message PB_TempMeasure message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PB_TempMeasure.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a PB_TempMeasure message from the specified reader or buffer.
         * @function decode
         * @memberof PB_TempMeasure
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {PB_TempMeasure} PB_TempMeasure
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PB_TempMeasure.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_TempMeasure();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.time = reader.uint32();
                    break;
                case 2:
                    message.mills = reader.float();
                    break;
                case 3:
                    message.temp = reader.float();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a PB_TempMeasure message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof PB_TempMeasure
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {PB_TempMeasure} PB_TempMeasure
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PB_TempMeasure.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a PB_TempMeasure message.
         * @function verify
         * @memberof PB_TempMeasure
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PB_TempMeasure.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.time != null && message.hasOwnProperty("time"))
                if (!$util.isInteger(message.time))
                    return "time: integer expected";
            if (message.mills != null && message.hasOwnProperty("mills"))
                if (typeof message.mills !== "number")
                    return "mills: number expected";
            if (message.temp != null && message.hasOwnProperty("temp"))
                if (typeof message.temp !== "number")
                    return "temp: number expected";
            return null;
        };
    
        /**
         * Creates a PB_TempMeasure message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof PB_TempMeasure
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {PB_TempMeasure} PB_TempMeasure
         */
        PB_TempMeasure.fromObject = function fromObject(object) {
            if (object instanceof $root.PB_TempMeasure)
                return object;
            var message = new $root.PB_TempMeasure();
            if (object.time != null)
                message.time = object.time >>> 0;
            if (object.mills != null)
                message.mills = Number(object.mills);
            if (object.temp != null)
                message.temp = Number(object.temp);
            return message;
        };
    
        /**
         * Creates a plain object from a PB_TempMeasure message. Also converts values to other types if specified.
         * @function toObject
         * @memberof PB_TempMeasure
         * @static
         * @param {PB_TempMeasure} message PB_TempMeasure
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PB_TempMeasure.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.time = 0;
                object.mills = 0;
                object.temp = 0;
            }
            if (message.time != null && message.hasOwnProperty("time"))
                object.time = message.time;
            if (message.mills != null && message.hasOwnProperty("mills"))
                object.mills = options.json && !isFinite(message.mills) ? String(message.mills) : message.mills;
            if (message.temp != null && message.hasOwnProperty("temp"))
                object.temp = options.json && !isFinite(message.temp) ? String(message.temp) : message.temp;
            return object;
        };
    
        /**
         * Converts this PB_TempMeasure to JSON.
         * @function toJSON
         * @memberof PB_TempMeasure
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PB_TempMeasure.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return PB_TempMeasure;
    })();
    
    $root.PB_TempProfile = (function() {
    
        /**
         * Properties of a PB_TempProfile.
         * @exports IPB_TempProfile
         * @interface IPB_TempProfile
         * @property {number|null} [countPoints] PB_TempProfile countPoints
         * @property {Array.<IPB_TempMeasure>|null} [data] PB_TempProfile data
         */
    
        /**
         * Constructs a new PB_TempProfile.
         * @exports PB_TempProfile
         * @classdesc Represents a PB_TempProfile.
         * @implements IPB_TempProfile
         * @constructor
         * @param {IPB_TempProfile=} [properties] Properties to set
         */
        function PB_TempProfile(properties) {
            this.data = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * PB_TempProfile countPoints.
         * @member {number} countPoints
         * @memberof PB_TempProfile
         * @instance
         */
        PB_TempProfile.prototype.countPoints = 0;
    
        /**
         * PB_TempProfile data.
         * @member {Array.<IPB_TempMeasure>} data
         * @memberof PB_TempProfile
         * @instance
         */
        PB_TempProfile.prototype.data = $util.emptyArray;
    
        /**
         * Creates a new PB_TempProfile instance using the specified properties.
         * @function create
         * @memberof PB_TempProfile
         * @static
         * @param {IPB_TempProfile=} [properties] Properties to set
         * @returns {PB_TempProfile} PB_TempProfile instance
         */
        PB_TempProfile.create = function create(properties) {
            return new PB_TempProfile(properties);
        };
    
        /**
         * Encodes the specified PB_TempProfile message. Does not implicitly {@link PB_TempProfile.verify|verify} messages.
         * @function encode
         * @memberof PB_TempProfile
         * @static
         * @param {IPB_TempProfile} message PB_TempProfile message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PB_TempProfile.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.countPoints != null && message.hasOwnProperty("countPoints"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.countPoints);
            if (message.data != null && message.data.length)
                for (var i = 0; i < message.data.length; ++i)
                    $root.PB_TempMeasure.encode(message.data[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified PB_TempProfile message, length delimited. Does not implicitly {@link PB_TempProfile.verify|verify} messages.
         * @function encodeDelimited
         * @memberof PB_TempProfile
         * @static
         * @param {IPB_TempProfile} message PB_TempProfile message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PB_TempProfile.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a PB_TempProfile message from the specified reader or buffer.
         * @function decode
         * @memberof PB_TempProfile
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {PB_TempProfile} PB_TempProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PB_TempProfile.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_TempProfile();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.countPoints = reader.uint32();
                    break;
                case 2:
                    if (!(message.data && message.data.length))
                        message.data = [];
                    message.data.push($root.PB_TempMeasure.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a PB_TempProfile message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof PB_TempProfile
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {PB_TempProfile} PB_TempProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PB_TempProfile.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a PB_TempProfile message.
         * @function verify
         * @memberof PB_TempProfile
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PB_TempProfile.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.countPoints != null && message.hasOwnProperty("countPoints"))
                if (!$util.isInteger(message.countPoints))
                    return "countPoints: integer expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                if (!Array.isArray(message.data))
                    return "data: array expected";
                for (var i = 0; i < message.data.length; ++i) {
                    var error = $root.PB_TempMeasure.verify(message.data[i]);
                    if (error)
                        return "data." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a PB_TempProfile message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof PB_TempProfile
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {PB_TempProfile} PB_TempProfile
         */
        PB_TempProfile.fromObject = function fromObject(object) {
            if (object instanceof $root.PB_TempProfile)
                return object;
            var message = new $root.PB_TempProfile();
            if (object.countPoints != null)
                message.countPoints = object.countPoints >>> 0;
            if (object.data) {
                if (!Array.isArray(object.data))
                    throw TypeError(".PB_TempProfile.data: array expected");
                message.data = [];
                for (var i = 0; i < object.data.length; ++i) {
                    if (typeof object.data[i] !== "object")
                        throw TypeError(".PB_TempProfile.data: object expected");
                    message.data[i] = $root.PB_TempMeasure.fromObject(object.data[i]);
                }
            }
            return message;
        };
    
        /**
         * Creates a plain object from a PB_TempProfile message. Also converts values to other types if specified.
         * @function toObject
         * @memberof PB_TempProfile
         * @static
         * @param {PB_TempProfile} message PB_TempProfile
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PB_TempProfile.toObject = function toObject(message, options) {
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
                    object.data[j] = $root.PB_TempMeasure.toObject(message.data[j], options);
            }
            return object;
        };
    
        /**
         * Converts this PB_TempProfile to JSON.
         * @function toJSON
         * @memberof PB_TempProfile
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PB_TempProfile.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return PB_TempProfile;
    })();
    
    $root.PB_ResponseGetTempProfile = (function() {
    
        /**
         * Properties of a PB_ResponseGetTempProfile.
         * @exports IPB_ResponseGetTempProfile
         * @interface IPB_ResponseGetTempProfile
         * @property {boolean|null} [success] PB_ResponseGetTempProfile success
         * @property {IPB_TempProfile|null} [profile] PB_ResponseGetTempProfile profile
         */
    
        /**
         * Constructs a new PB_ResponseGetTempProfile.
         * @exports PB_ResponseGetTempProfile
         * @classdesc Represents a PB_ResponseGetTempProfile.
         * @implements IPB_ResponseGetTempProfile
         * @constructor
         * @param {IPB_ResponseGetTempProfile=} [properties] Properties to set
         */
        function PB_ResponseGetTempProfile(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * PB_ResponseGetTempProfile success.
         * @member {boolean} success
         * @memberof PB_ResponseGetTempProfile
         * @instance
         */
        PB_ResponseGetTempProfile.prototype.success = false;
    
        /**
         * PB_ResponseGetTempProfile profile.
         * @member {IPB_TempProfile|null|undefined} profile
         * @memberof PB_ResponseGetTempProfile
         * @instance
         */
        PB_ResponseGetTempProfile.prototype.profile = null;
    
        /**
         * Creates a new PB_ResponseGetTempProfile instance using the specified properties.
         * @function create
         * @memberof PB_ResponseGetTempProfile
         * @static
         * @param {IPB_ResponseGetTempProfile=} [properties] Properties to set
         * @returns {PB_ResponseGetTempProfile} PB_ResponseGetTempProfile instance
         */
        PB_ResponseGetTempProfile.create = function create(properties) {
            return new PB_ResponseGetTempProfile(properties);
        };
    
        /**
         * Encodes the specified PB_ResponseGetTempProfile message. Does not implicitly {@link PB_ResponseGetTempProfile.verify|verify} messages.
         * @function encode
         * @memberof PB_ResponseGetTempProfile
         * @static
         * @param {IPB_ResponseGetTempProfile} message PB_ResponseGetTempProfile message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PB_ResponseGetTempProfile.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.profile != null && message.hasOwnProperty("profile"))
                $root.PB_TempProfile.encode(message.profile, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified PB_ResponseGetTempProfile message, length delimited. Does not implicitly {@link PB_ResponseGetTempProfile.verify|verify} messages.
         * @function encodeDelimited
         * @memberof PB_ResponseGetTempProfile
         * @static
         * @param {IPB_ResponseGetTempProfile} message PB_ResponseGetTempProfile message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PB_ResponseGetTempProfile.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a PB_ResponseGetTempProfile message from the specified reader or buffer.
         * @function decode
         * @memberof PB_ResponseGetTempProfile
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {PB_ResponseGetTempProfile} PB_ResponseGetTempProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PB_ResponseGetTempProfile.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_ResponseGetTempProfile();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.success = reader.bool();
                    break;
                case 2:
                    message.profile = $root.PB_TempProfile.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a PB_ResponseGetTempProfile message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof PB_ResponseGetTempProfile
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {PB_ResponseGetTempProfile} PB_ResponseGetTempProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PB_ResponseGetTempProfile.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a PB_ResponseGetTempProfile message.
         * @function verify
         * @memberof PB_ResponseGetTempProfile
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PB_ResponseGetTempProfile.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.profile != null && message.hasOwnProperty("profile")) {
                var error = $root.PB_TempProfile.verify(message.profile);
                if (error)
                    return "profile." + error;
            }
            return null;
        };
    
        /**
         * Creates a PB_ResponseGetTempProfile message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof PB_ResponseGetTempProfile
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {PB_ResponseGetTempProfile} PB_ResponseGetTempProfile
         */
        PB_ResponseGetTempProfile.fromObject = function fromObject(object) {
            if (object instanceof $root.PB_ResponseGetTempProfile)
                return object;
            var message = new $root.PB_ResponseGetTempProfile();
            if (object.success != null)
                message.success = Boolean(object.success);
            if (object.profile != null) {
                if (typeof object.profile !== "object")
                    throw TypeError(".PB_ResponseGetTempProfile.profile: object expected");
                message.profile = $root.PB_TempProfile.fromObject(object.profile);
            }
            return message;
        };
    
        /**
         * Creates a plain object from a PB_ResponseGetTempProfile message. Also converts values to other types if specified.
         * @function toObject
         * @memberof PB_ResponseGetTempProfile
         * @static
         * @param {PB_ResponseGetTempProfile} message PB_ResponseGetTempProfile
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PB_ResponseGetTempProfile.toObject = function toObject(message, options) {
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
                object.profile = $root.PB_TempProfile.toObject(message.profile, options);
            return object;
        };
    
        /**
         * Converts this PB_ResponseGetTempProfile to JSON.
         * @function toJSON
         * @memberof PB_ResponseGetTempProfile
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PB_ResponseGetTempProfile.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return PB_ResponseGetTempProfile;
    })();
    
    /**
     * PB_ProgramState enum.
     * @exports PB_ProgramState
     * @enum {string}
     * @property {number} STOPPED=0 STOPPED value
     * @property {number} LAUNCHED=1 LAUNCHED value
     */
    $root.PB_ProgramState = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "STOPPED"] = 0;
        values[valuesById[1] = "LAUNCHED"] = 1;
        return values;
    })();
    
    /**
     * PB_OvenState enum.
     * @exports PB_OvenState
     * @enum {string}
     * @property {number} OFF=0 OFF value
     * @property {number} ON=1 ON value
     */
    $root.PB_OvenState = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "OFF"] = 0;
        values[valuesById[1] = "ON"] = 1;
        return values;
    })();
    
    /**
     * PB_ControlMode enum.
     * @exports PB_ControlMode
     * @enum {string}
     * @property {number} DEFAULT_OFF=0 DEFAULT_OFF value
     * @property {number} TEMP_PROFILE=1 TEMP_PROFILE value
     * @property {number} HOLD_CONST_TEMP=2 HOLD_CONST_TEMP value
     * @property {number} MANUAL=3 MANUAL value
     */
    $root.PB_ControlMode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "DEFAULT_OFF"] = 0;
        values[valuesById[1] = "TEMP_PROFILE"] = 1;
        values[valuesById[2] = "HOLD_CONST_TEMP"] = 2;
        values[valuesById[3] = "MANUAL"] = 3;
        return values;
    })();
    
    /**
     * PB_ControlState enum.
     * @exports PB_ControlState
     * @enum {string}
     * @property {number} DISABLED=0 DISABLED value
     * @property {number} BACKGROUND=1 BACKGROUND value
     * @property {number} ENABLED=2 ENABLED value
     */
    $root.PB_ControlState = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "DISABLED"] = 0;
        values[valuesById[1] = "BACKGROUND"] = 1;
        values[valuesById[2] = "ENABLED"] = 2;
        return values;
    })();
    
    /**
     * PB_ErrorType enum.
     * @exports PB_ErrorType
     * @enum {string}
     * @property {number} NONE=0 NONE value
     * @property {number} FAULTY_TEMPERATURE_SENSOR=1 FAULTY_TEMPERATURE_SENSOR value
     * @property {number} FAULTY_RELAY=2 FAULTY_RELAY value
     * @property {number} UNKNOWN_COMMAND=3 UNKNOWN_COMMAND value
     * @property {number} UNKNOWN_ERROR=4 UNKNOWN_ERROR value
     */
    $root.PB_ErrorType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NONE"] = 0;
        values[valuesById[1] = "FAULTY_TEMPERATURE_SENSOR"] = 1;
        values[valuesById[2] = "FAULTY_RELAY"] = 2;
        values[valuesById[3] = "UNKNOWN_COMMAND"] = 3;
        values[valuesById[4] = "UNKNOWN_ERROR"] = 4;
        return values;
    })();
    
    $root.PB_Response = (function() {
    
        /**
         * Properties of a PB_Response.
         * @exports IPB_Response
         * @interface IPB_Response
         * @property {PB_CmdType|null} [cmdType] PB_Response cmdType
         * @property {number|null} [cmdId] PB_Response cmdId
         * @property {boolean|null} [success] PB_Response success
         * @property {PB_ControlMode|null} [controlMode] PB_Response controlMode
         * @property {PB_ProgramState|null} [programState] PB_Response programState
         * @property {PB_OvenState|null} [ovenState] PB_Response ovenState
         * @property {PB_ErrorType|null} [error] PB_Response error
         * @property {number|null} [time] PB_Response time
         * @property {number|null} [mills] PB_Response mills
         */
    
        /**
         * Constructs a new PB_Response.
         * @exports PB_Response
         * @classdesc Represents a PB_Response.
         * @implements IPB_Response
         * @constructor
         * @param {IPB_Response=} [properties] Properties to set
         */
        function PB_Response(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * PB_Response cmdType.
         * @member {PB_CmdType} cmdType
         * @memberof PB_Response
         * @instance
         */
        PB_Response.prototype.cmdType = 0;
    
        /**
         * PB_Response cmdId.
         * @member {number} cmdId
         * @memberof PB_Response
         * @instance
         */
        PB_Response.prototype.cmdId = 0;
    
        /**
         * PB_Response success.
         * @member {boolean} success
         * @memberof PB_Response
         * @instance
         */
        PB_Response.prototype.success = false;
    
        /**
         * PB_Response controlMode.
         * @member {PB_ControlMode} controlMode
         * @memberof PB_Response
         * @instance
         */
        PB_Response.prototype.controlMode = 0;
    
        /**
         * PB_Response programState.
         * @member {PB_ProgramState} programState
         * @memberof PB_Response
         * @instance
         */
        PB_Response.prototype.programState = 0;
    
        /**
         * PB_Response ovenState.
         * @member {PB_OvenState} ovenState
         * @memberof PB_Response
         * @instance
         */
        PB_Response.prototype.ovenState = 0;
    
        /**
         * PB_Response error.
         * @member {PB_ErrorType} error
         * @memberof PB_Response
         * @instance
         */
        PB_Response.prototype.error = 0;
    
        /**
         * PB_Response time.
         * @member {number} time
         * @memberof PB_Response
         * @instance
         */
        PB_Response.prototype.time = 0;
    
        /**
         * PB_Response mills.
         * @member {number} mills
         * @memberof PB_Response
         * @instance
         */
        PB_Response.prototype.mills = 0;
    
        /**
         * Creates a new PB_Response instance using the specified properties.
         * @function create
         * @memberof PB_Response
         * @static
         * @param {IPB_Response=} [properties] Properties to set
         * @returns {PB_Response} PB_Response instance
         */
        PB_Response.create = function create(properties) {
            return new PB_Response(properties);
        };
    
        /**
         * Encodes the specified PB_Response message. Does not implicitly {@link PB_Response.verify|verify} messages.
         * @function encode
         * @memberof PB_Response
         * @static
         * @param {IPB_Response} message PB_Response message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PB_Response.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cmdType != null && message.hasOwnProperty("cmdType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cmdType);
            if (message.cmdId != null && message.hasOwnProperty("cmdId"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.cmdId);
            if (message.success != null && message.hasOwnProperty("success"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.success);
            if (message.controlMode != null && message.hasOwnProperty("controlMode"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.controlMode);
            if (message.programState != null && message.hasOwnProperty("programState"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.programState);
            if (message.ovenState != null && message.hasOwnProperty("ovenState"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.ovenState);
            if (message.error != null && message.hasOwnProperty("error"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.error);
            if (message.time != null && message.hasOwnProperty("time"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.time);
            if (message.mills != null && message.hasOwnProperty("mills"))
                writer.uint32(/* id 9, wireType 5 =*/77).float(message.mills);
            return writer;
        };
    
        /**
         * Encodes the specified PB_Response message, length delimited. Does not implicitly {@link PB_Response.verify|verify} messages.
         * @function encodeDelimited
         * @memberof PB_Response
         * @static
         * @param {IPB_Response} message PB_Response message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PB_Response.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a PB_Response message from the specified reader or buffer.
         * @function decode
         * @memberof PB_Response
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {PB_Response} PB_Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PB_Response.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Response();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cmdType = reader.int32();
                    break;
                case 2:
                    message.cmdId = reader.uint32();
                    break;
                case 3:
                    message.success = reader.bool();
                    break;
                case 4:
                    message.controlMode = reader.int32();
                    break;
                case 5:
                    message.programState = reader.int32();
                    break;
                case 6:
                    message.ovenState = reader.int32();
                    break;
                case 7:
                    message.error = reader.int32();
                    break;
                case 8:
                    message.time = reader.uint32();
                    break;
                case 9:
                    message.mills = reader.float();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a PB_Response message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof PB_Response
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {PB_Response} PB_Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PB_Response.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a PB_Response message.
         * @function verify
         * @memberof PB_Response
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PB_Response.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cmdType != null && message.hasOwnProperty("cmdType"))
                switch (message.cmdType) {
                default:
                    return "cmdType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    break;
                }
            if (message.cmdId != null && message.hasOwnProperty("cmdId"))
                if (!$util.isInteger(message.cmdId))
                    return "cmdId: integer expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.controlMode != null && message.hasOwnProperty("controlMode"))
                switch (message.controlMode) {
                default:
                    return "controlMode: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.programState != null && message.hasOwnProperty("programState"))
                switch (message.programState) {
                default:
                    return "programState: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.ovenState != null && message.hasOwnProperty("ovenState"))
                switch (message.ovenState) {
                default:
                    return "ovenState: enum value expected";
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
                case 4:
                    break;
                }
            if (message.time != null && message.hasOwnProperty("time"))
                if (!$util.isInteger(message.time))
                    return "time: integer expected";
            if (message.mills != null && message.hasOwnProperty("mills"))
                if (typeof message.mills !== "number")
                    return "mills: number expected";
            return null;
        };
    
        /**
         * Creates a PB_Response message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof PB_Response
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {PB_Response} PB_Response
         */
        PB_Response.fromObject = function fromObject(object) {
            if (object instanceof $root.PB_Response)
                return object;
            var message = new $root.PB_Response();
            switch (object.cmdType) {
            case "GET_TEMP_PROFILE":
            case 0:
                message.cmdType = 0;
                break;
            case "GET_STATE":
            case 1:
                message.cmdType = 1;
                break;
            case "START":
            case 2:
                message.cmdType = 2;
                break;
            case "STOP":
            case 3:
                message.cmdType = 3;
                break;
            case "HARD_RESET":
            case 4:
                message.cmdType = 4;
                break;
            case "CLIENT_REQUIRES_RESET":
            case 5:
                message.cmdType = 5;
                break;
            case "MANUAL_ON":
            case 6:
                message.cmdType = 6;
                break;
            case "MANUAL_OFF":
            case 7:
                message.cmdType = 7;
                break;
            }
            if (object.cmdId != null)
                message.cmdId = object.cmdId >>> 0;
            if (object.success != null)
                message.success = Boolean(object.success);
            switch (object.controlMode) {
            case "DEFAULT_OFF":
            case 0:
                message.controlMode = 0;
                break;
            case "TEMP_PROFILE":
            case 1:
                message.controlMode = 1;
                break;
            case "HOLD_CONST_TEMP":
            case 2:
                message.controlMode = 2;
                break;
            case "MANUAL":
            case 3:
                message.controlMode = 3;
                break;
            }
            switch (object.programState) {
            case "STOPPED":
            case 0:
                message.programState = 0;
                break;
            case "LAUNCHED":
            case 1:
                message.programState = 1;
                break;
            }
            switch (object.ovenState) {
            case "OFF":
            case 0:
                message.ovenState = 0;
                break;
            case "ON":
            case 1:
                message.ovenState = 1;
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
            case "UNKNOWN_COMMAND":
            case 3:
                message.error = 3;
                break;
            case "UNKNOWN_ERROR":
            case 4:
                message.error = 4;
                break;
            }
            if (object.time != null)
                message.time = object.time >>> 0;
            if (object.mills != null)
                message.mills = Number(object.mills);
            return message;
        };
    
        /**
         * Creates a plain object from a PB_Response message. Also converts values to other types if specified.
         * @function toObject
         * @memberof PB_Response
         * @static
         * @param {PB_Response} message PB_Response
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PB_Response.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cmdType = options.enums === String ? "GET_TEMP_PROFILE" : 0;
                object.cmdId = 0;
                object.success = false;
                object.controlMode = options.enums === String ? "DEFAULT_OFF" : 0;
                object.programState = options.enums === String ? "STOPPED" : 0;
                object.ovenState = options.enums === String ? "OFF" : 0;
                object.error = options.enums === String ? "NONE" : 0;
                object.time = 0;
                object.mills = 0;
            }
            if (message.cmdType != null && message.hasOwnProperty("cmdType"))
                object.cmdType = options.enums === String ? $root.PB_CmdType[message.cmdType] : message.cmdType;
            if (message.cmdId != null && message.hasOwnProperty("cmdId"))
                object.cmdId = message.cmdId;
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            if (message.controlMode != null && message.hasOwnProperty("controlMode"))
                object.controlMode = options.enums === String ? $root.PB_ControlMode[message.controlMode] : message.controlMode;
            if (message.programState != null && message.hasOwnProperty("programState"))
                object.programState = options.enums === String ? $root.PB_ProgramState[message.programState] : message.programState;
            if (message.ovenState != null && message.hasOwnProperty("ovenState"))
                object.ovenState = options.enums === String ? $root.PB_OvenState[message.ovenState] : message.ovenState;
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = options.enums === String ? $root.PB_ErrorType[message.error] : message.error;
            if (message.time != null && message.hasOwnProperty("time"))
                object.time = message.time;
            if (message.mills != null && message.hasOwnProperty("mills"))
                object.mills = options.json && !isFinite(message.mills) ? String(message.mills) : message.mills;
            return object;
        };
    
        /**
         * Converts this PB_Response to JSON.
         * @function toJSON
         * @memberof PB_Response
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PB_Response.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return PB_Response;
    })();
    
    $root.PB_SwitchOvenState = (function() {
    
        /**
         * Properties of a PB_SwitchOvenState.
         * @exports IPB_SwitchOvenState
         * @interface IPB_SwitchOvenState
         * @property {number|null} [time] PB_SwitchOvenState time
         * @property {number|null} [mills] PB_SwitchOvenState mills
         * @property {PB_OvenState|null} [ovenState] PB_SwitchOvenState ovenState
         */
    
        /**
         * Constructs a new PB_SwitchOvenState.
         * @exports PB_SwitchOvenState
         * @classdesc Represents a PB_SwitchOvenState.
         * @implements IPB_SwitchOvenState
         * @constructor
         * @param {IPB_SwitchOvenState=} [properties] Properties to set
         */
        function PB_SwitchOvenState(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * PB_SwitchOvenState time.
         * @member {number} time
         * @memberof PB_SwitchOvenState
         * @instance
         */
        PB_SwitchOvenState.prototype.time = 0;
    
        /**
         * PB_SwitchOvenState mills.
         * @member {number} mills
         * @memberof PB_SwitchOvenState
         * @instance
         */
        PB_SwitchOvenState.prototype.mills = 0;
    
        /**
         * PB_SwitchOvenState ovenState.
         * @member {PB_OvenState} ovenState
         * @memberof PB_SwitchOvenState
         * @instance
         */
        PB_SwitchOvenState.prototype.ovenState = 0;
    
        /**
         * Creates a new PB_SwitchOvenState instance using the specified properties.
         * @function create
         * @memberof PB_SwitchOvenState
         * @static
         * @param {IPB_SwitchOvenState=} [properties] Properties to set
         * @returns {PB_SwitchOvenState} PB_SwitchOvenState instance
         */
        PB_SwitchOvenState.create = function create(properties) {
            return new PB_SwitchOvenState(properties);
        };
    
        /**
         * Encodes the specified PB_SwitchOvenState message. Does not implicitly {@link PB_SwitchOvenState.verify|verify} messages.
         * @function encode
         * @memberof PB_SwitchOvenState
         * @static
         * @param {IPB_SwitchOvenState} message PB_SwitchOvenState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PB_SwitchOvenState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.time != null && message.hasOwnProperty("time"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.time);
            if (message.mills != null && message.hasOwnProperty("mills"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.mills);
            if (message.ovenState != null && message.hasOwnProperty("ovenState"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.ovenState);
            return writer;
        };
    
        /**
         * Encodes the specified PB_SwitchOvenState message, length delimited. Does not implicitly {@link PB_SwitchOvenState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof PB_SwitchOvenState
         * @static
         * @param {IPB_SwitchOvenState} message PB_SwitchOvenState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PB_SwitchOvenState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a PB_SwitchOvenState message from the specified reader or buffer.
         * @function decode
         * @memberof PB_SwitchOvenState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {PB_SwitchOvenState} PB_SwitchOvenState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PB_SwitchOvenState.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_SwitchOvenState();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.time = reader.uint32();
                    break;
                case 2:
                    message.mills = reader.float();
                    break;
                case 3:
                    message.ovenState = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a PB_SwitchOvenState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof PB_SwitchOvenState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {PB_SwitchOvenState} PB_SwitchOvenState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PB_SwitchOvenState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a PB_SwitchOvenState message.
         * @function verify
         * @memberof PB_SwitchOvenState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PB_SwitchOvenState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.time != null && message.hasOwnProperty("time"))
                if (!$util.isInteger(message.time))
                    return "time: integer expected";
            if (message.mills != null && message.hasOwnProperty("mills"))
                if (typeof message.mills !== "number")
                    return "mills: number expected";
            if (message.ovenState != null && message.hasOwnProperty("ovenState"))
                switch (message.ovenState) {
                default:
                    return "ovenState: enum value expected";
                case 0:
                case 1:
                    break;
                }
            return null;
        };
    
        /**
         * Creates a PB_SwitchOvenState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof PB_SwitchOvenState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {PB_SwitchOvenState} PB_SwitchOvenState
         */
        PB_SwitchOvenState.fromObject = function fromObject(object) {
            if (object instanceof $root.PB_SwitchOvenState)
                return object;
            var message = new $root.PB_SwitchOvenState();
            if (object.time != null)
                message.time = object.time >>> 0;
            if (object.mills != null)
                message.mills = Number(object.mills);
            switch (object.ovenState) {
            case "OFF":
            case 0:
                message.ovenState = 0;
                break;
            case "ON":
            case 1:
                message.ovenState = 1;
                break;
            }
            return message;
        };
    
        /**
         * Creates a plain object from a PB_SwitchOvenState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof PB_SwitchOvenState
         * @static
         * @param {PB_SwitchOvenState} message PB_SwitchOvenState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PB_SwitchOvenState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.time = 0;
                object.mills = 0;
                object.ovenState = options.enums === String ? "OFF" : 0;
            }
            if (message.time != null && message.hasOwnProperty("time"))
                object.time = message.time;
            if (message.mills != null && message.hasOwnProperty("mills"))
                object.mills = options.json && !isFinite(message.mills) ? String(message.mills) : message.mills;
            if (message.ovenState != null && message.hasOwnProperty("ovenState"))
                object.ovenState = options.enums === String ? $root.PB_OvenState[message.ovenState] : message.ovenState;
            return object;
        };
    
        /**
         * Converts this PB_SwitchOvenState to JSON.
         * @function toJSON
         * @memberof PB_SwitchOvenState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PB_SwitchOvenState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return PB_SwitchOvenState;
    })();
    
    $root.PB_ControlData = (function() {
    
        /**
         * Properties of a PB_ControlData.
         * @exports IPB_ControlData
         * @interface IPB_ControlData
         * @property {PB_ControlMode|null} [mode] PB_ControlData mode
         * @property {PB_ControlState|null} [state] PB_ControlData state
         * @property {number|null} [elapsedTime] PB_ControlData elapsedTime
         * @property {number|null} [finishTime] PB_ControlData finishTime
         * @property {number|null} [constTempValue] PB_ControlData constTempValue
         */
    
        /**
         * Constructs a new PB_ControlData.
         * @exports PB_ControlData
         * @classdesc Represents a PB_ControlData.
         * @implements IPB_ControlData
         * @constructor
         * @param {IPB_ControlData=} [properties] Properties to set
         */
        function PB_ControlData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * PB_ControlData mode.
         * @member {PB_ControlMode} mode
         * @memberof PB_ControlData
         * @instance
         */
        PB_ControlData.prototype.mode = 0;
    
        /**
         * PB_ControlData state.
         * @member {PB_ControlState} state
         * @memberof PB_ControlData
         * @instance
         */
        PB_ControlData.prototype.state = 0;
    
        /**
         * PB_ControlData elapsedTime.
         * @member {number} elapsedTime
         * @memberof PB_ControlData
         * @instance
         */
        PB_ControlData.prototype.elapsedTime = 0;
    
        /**
         * PB_ControlData finishTime.
         * @member {number} finishTime
         * @memberof PB_ControlData
         * @instance
         */
        PB_ControlData.prototype.finishTime = 0;
    
        /**
         * PB_ControlData constTempValue.
         * @member {number} constTempValue
         * @memberof PB_ControlData
         * @instance
         */
        PB_ControlData.prototype.constTempValue = 0;
    
        /**
         * Creates a new PB_ControlData instance using the specified properties.
         * @function create
         * @memberof PB_ControlData
         * @static
         * @param {IPB_ControlData=} [properties] Properties to set
         * @returns {PB_ControlData} PB_ControlData instance
         */
        PB_ControlData.create = function create(properties) {
            return new PB_ControlData(properties);
        };
    
        /**
         * Encodes the specified PB_ControlData message. Does not implicitly {@link PB_ControlData.verify|verify} messages.
         * @function encode
         * @memberof PB_ControlData
         * @static
         * @param {IPB_ControlData} message PB_ControlData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PB_ControlData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.mode != null && message.hasOwnProperty("mode"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.mode);
            if (message.state != null && message.hasOwnProperty("state"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.state);
            if (message.elapsedTime != null && message.hasOwnProperty("elapsedTime"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.elapsedTime);
            if (message.finishTime != null && message.hasOwnProperty("finishTime"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.finishTime);
            if (message.constTempValue != null && message.hasOwnProperty("constTempValue"))
                writer.uint32(/* id 5, wireType 5 =*/45).float(message.constTempValue);
            return writer;
        };
    
        /**
         * Encodes the specified PB_ControlData message, length delimited. Does not implicitly {@link PB_ControlData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof PB_ControlData
         * @static
         * @param {IPB_ControlData} message PB_ControlData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PB_ControlData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a PB_ControlData message from the specified reader or buffer.
         * @function decode
         * @memberof PB_ControlData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {PB_ControlData} PB_ControlData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PB_ControlData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_ControlData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.mode = reader.int32();
                    break;
                case 2:
                    message.state = reader.int32();
                    break;
                case 3:
                    message.elapsedTime = reader.uint32();
                    break;
                case 4:
                    message.finishTime = reader.uint32();
                    break;
                case 5:
                    message.constTempValue = reader.float();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a PB_ControlData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof PB_ControlData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {PB_ControlData} PB_ControlData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PB_ControlData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a PB_ControlData message.
         * @function verify
         * @memberof PB_ControlData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PB_ControlData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.mode != null && message.hasOwnProperty("mode"))
                switch (message.mode) {
                default:
                    return "mode: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.state != null && message.hasOwnProperty("state"))
                switch (message.state) {
                default:
                    return "state: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.elapsedTime != null && message.hasOwnProperty("elapsedTime"))
                if (!$util.isInteger(message.elapsedTime))
                    return "elapsedTime: integer expected";
            if (message.finishTime != null && message.hasOwnProperty("finishTime"))
                if (!$util.isInteger(message.finishTime))
                    return "finishTime: integer expected";
            if (message.constTempValue != null && message.hasOwnProperty("constTempValue"))
                if (typeof message.constTempValue !== "number")
                    return "constTempValue: number expected";
            return null;
        };
    
        /**
         * Creates a PB_ControlData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof PB_ControlData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {PB_ControlData} PB_ControlData
         */
        PB_ControlData.fromObject = function fromObject(object) {
            if (object instanceof $root.PB_ControlData)
                return object;
            var message = new $root.PB_ControlData();
            switch (object.mode) {
            case "DEFAULT_OFF":
            case 0:
                message.mode = 0;
                break;
            case "TEMP_PROFILE":
            case 1:
                message.mode = 1;
                break;
            case "HOLD_CONST_TEMP":
            case 2:
                message.mode = 2;
                break;
            case "MANUAL":
            case 3:
                message.mode = 3;
                break;
            }
            switch (object.state) {
            case "DISABLED":
            case 0:
                message.state = 0;
                break;
            case "BACKGROUND":
            case 1:
                message.state = 1;
                break;
            case "ENABLED":
            case 2:
                message.state = 2;
                break;
            }
            if (object.elapsedTime != null)
                message.elapsedTime = object.elapsedTime >>> 0;
            if (object.finishTime != null)
                message.finishTime = object.finishTime >>> 0;
            if (object.constTempValue != null)
                message.constTempValue = Number(object.constTempValue);
            return message;
        };
    
        /**
         * Creates a plain object from a PB_ControlData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof PB_ControlData
         * @static
         * @param {PB_ControlData} message PB_ControlData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PB_ControlData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.mode = options.enums === String ? "DEFAULT_OFF" : 0;
                object.state = options.enums === String ? "DISABLED" : 0;
                object.elapsedTime = 0;
                object.finishTime = 0;
                object.constTempValue = 0;
            }
            if (message.mode != null && message.hasOwnProperty("mode"))
                object.mode = options.enums === String ? $root.PB_ControlMode[message.mode] : message.mode;
            if (message.state != null && message.hasOwnProperty("state"))
                object.state = options.enums === String ? $root.PB_ControlState[message.state] : message.state;
            if (message.elapsedTime != null && message.hasOwnProperty("elapsedTime"))
                object.elapsedTime = message.elapsedTime;
            if (message.finishTime != null && message.hasOwnProperty("finishTime"))
                object.finishTime = message.finishTime;
            if (message.constTempValue != null && message.hasOwnProperty("constTempValue"))
                object.constTempValue = options.json && !isFinite(message.constTempValue) ? String(message.constTempValue) : message.constTempValue;
            return object;
        };
    
        /**
         * Converts this PB_ControlData to JSON.
         * @function toJSON
         * @memberof PB_ControlData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PB_ControlData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return PB_ControlData;
    })();

    return $root;
});
