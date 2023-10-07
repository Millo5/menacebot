"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loreMaster = exports.Character = exports.Dimension = void 0;
var EmbedBuilder = require('discord.js').EmbedBuilder;
var fs = require('fs');
var colour = {
    character: 0x0099FF,
    dimension: 0xFFD03B
};
// Update the version to prevent characters from breaking with updates :3
var VERSION = 1;
var uuids = 0;
var LoreMaster = /** @class */ (function () {
    function LoreMaster() {
        this.characters = [];
        this.dimensions = [];
    }
    LoreMaster.prototype.AddDimension = function (dim) { this.dimensions.push(dim); };
    ;
    LoreMaster.prototype.AddCharacter = function (char) { this.characters.push(char); };
    ;
    LoreMaster.prototype.a = function () {
        this.dimensions.push(new Dimension("Prime"));
        this.characters.push(new Character("Menace"));
    };
    LoreMaster.prototype.GetDimensionByName = function (name) {
        return this.dimensions.find(function (i) { return i.GetName().toLowerCase() == name.toLowerCase(); });
    };
    LoreMaster.prototype.GetDimensionByUuid = function (uuid) {
        return this.dimensions.find(function (i) { return i.GetUUID() == uuid; });
    };
    LoreMaster.prototype.GetDimension = function (identifier) {
        var dim = exports.loreMaster.GetDimensionByUuid(identifier * 1);
        if (dim == undefined) {
            dim = exports.loreMaster.GetDimensionByName(identifier);
            if (dim == undefined)
                return null;
        }
        return dim;
    };
    LoreMaster.prototype.RemoveDimension = function (dim) {
        var index = this.dimensions.indexOf(dim);
        if (index !== -1) {
            this.dimensions.splice(index, 1);
        }
    };
    LoreMaster.prototype.GetCharacterByName = function (name) {
        return this.characters.find(function (i) { return i.GetName().toLowerCase() == name.toLowerCase(); });
    };
    LoreMaster.prototype.GetCharacterByUuid = function (uuid) {
        return this.characters.find(function (i) { return i.GetUUID() == uuid; });
    };
    LoreMaster.prototype.GetCharacter = function (identifier) {
        var char = exports.loreMaster.GetCharacterByUuid(identifier * 1);
        if (char == undefined) {
            char = exports.loreMaster.GetCharacterByName(identifier);
            if (char == undefined)
                return null;
        }
        return char;
    };
    LoreMaster.prototype.RemoveCharacter = function (char) {
        var index = this.characters.indexOf(char);
        if (index !== -1) {
            this.characters.splice(index, 1);
        }
    };
    LoreMaster.prototype.save = function () {
        var jsonString = JSON.stringify(this);
        fs.writeFileSync('lore.json', jsonString);
    };
    LoreMaster.prototype.load = function () {
        var _this = this;
        if (!fs.existsSync('lore.json'))
            return;
        try {
            var jsonString = fs.readFileSync('lore.json').toString();
            var loadedLore = JSON.parse(jsonString, function (key, value) {
                if (key === '')
                    return value;
                return value;
            });
            this.characters = [];
            this.dimensions = [];
            loadedLore.characters.forEach(function (i) { return _this.characters.push(Character.from(i)); });
            loadedLore.dimensions.forEach(function (i) { return _this.dimensions.push(Dimension.from(i)); });
            uuids = Math.max.apply(Math, __spreadArray(__spreadArray([], this.characters.map(function (i) { return i.GetUUID(); }), false), this.dimensions.map(function (i) { return i.GetUUID(); }), false)) + 1;
        }
        catch (_a) {
            return;
        }
    };
    return LoreMaster;
}());
var Entity = /** @class */ (function () {
    function Entity(name) {
        this.version = VERSION;
        this.uuid = uuids++;
        this.date = Date.now();
        this.lastUpdate = Date.now();
        this.name = name;
        this.desc = 'No description set';
        this.lore = 'No Lore';
    }
    Entity.prototype.Update = function () {
        this.lastUpdate = Date.now();
    };
    Entity.prototype.GetUUID = function () { return this.uuid; };
    Entity.prototype.GetName = function () { return this.name; };
    Entity.prototype.SetName = function (_) { this.name = _.trim(); this.Update(); };
    Entity.prototype.GetDesc = function () { return this.desc; };
    Entity.prototype.SetDesc = function (_) { this.desc = _.trim(); this.Update(); };
    Entity.prototype.GetLore = function () { return this.lore; };
    Entity.prototype.SetLore = function (_) { this.lore = _.trim(); this.Update(); };
    Entity.prototype.GetDate = function () { return this.date; };
    Entity.prototype.GetLastUpdate = function () { return Math.round(this.lastUpdate / 1000); };
    return Entity;
}());
var Dimension = /** @class */ (function (_super) {
    __extends(Dimension, _super);
    function Dimension(name) {
        return _super.call(this, name) || this;
    }
    Dimension.from = function (_) {
        var instance = new Dimension('');
        Object.entries(_).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            instance[key] = value;
        });
        return instance;
    };
    Dimension.prototype.GetEmbed = function () {
        return new EmbedBuilder()
            .setColor(colour.dimension)
            .setAuthor({ name: "Dimension" })
            .setTitle(this.name)
            .setDescription(this.desc)
            .setTimestamp(this.date)
            .setFooter({ text: "UUID: ".concat(this.uuid, " | Created at ") })
            .addFields({ name: 'Lore', value: this.lore }, { name: '\u200B', value: '\u200B' }, { name: 'Last Modified', value: "<t:".concat(this.GetLastUpdate(), ":R>") });
    };
    return Dimension;
}(Entity));
exports.Dimension = Dimension;
var Character = /** @class */ (function (_super) {
    __extends(Character, _super);
    function Character(name, dimension) {
        if (dimension === void 0) { dimension = 0; }
        var _this = _super.call(this, name) || this;
        _this.dimension = dimension;
        _this.perception = "No perception";
        return _this;
    }
    Character.from = function (_) {
        var instance = new Character('');
        Object.entries(_).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            instance[key] = value;
        });
        return instance;
    };
    Character.prototype.GetPerception = function () { return this.perception; };
    Character.prototype.SetPerception = function (_) { this.perception = _.trim(); this.Update(); };
    Character.prototype.GetEmbed = function () {
        return new EmbedBuilder()
            .setColor(colour.character)
            .setAuthor({ name: "Character" })
            .setTitle(this.name)
            .setDescription(this.desc)
            .setTimestamp(this.date)
            .setFooter({ text: "UUID: ".concat(this.uuid, " | Created at ") })
            .addFields({ name: 'Lore', value: this.lore }, { name: 'Perception', value: this.perception }, { name: 'Dimension', value: exports.loreMaster.GetDimensionByUuid(this.dimension).GetName() }, { name: '\u200B', value: '\u200B' }, { name: 'Last Modified', value: "<t:".concat(this.GetLastUpdate(), ":R>") });
    };
    return Character;
}(Entity));
exports.Character = Character;
exports.loreMaster = new LoreMaster();
