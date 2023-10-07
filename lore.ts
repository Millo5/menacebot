const { EmbedBuilder } = require('discord.js')

const fs = require('fs')

const colour = {
    character: 0x0099FF,
    dimension: 0xFFD03B
}

// Update the version to prevent characters from breaking with updates :3
const VERSION = 1 
var uuids = 0;

class LoreMaster {
    dimensions: Dimension[];
    characters: Character[];
    
    constructor() {
        this.characters = [];
        this.dimensions = [];
    }

    AddDimension(dim: Dimension) { this.dimensions.push(dim) };
    AddCharacter(char: Character) { this.characters.push(char) };

    a() {
        this.dimensions.push(new Dimension("Prime"))
        this.characters.push(new Character("Menace"))
    }

    GetDimensionByName(name) {
        return this.dimensions.find(i => i.GetName().toLowerCase() == name.toLowerCase());
    }
    GetDimensionByUuid(uuid) {
        return this.dimensions.find(i => i.GetUUID() == uuid);
    }
    GetDimension(identifier) {
        let dim = loreMaster.GetDimensionByUuid(identifier * 1)
        if (dim == undefined) {
            dim = loreMaster.GetDimensionByName(identifier)
            if (dim == undefined)
                return null
        }
        return dim;
    }
    RemoveDimension(dim) {
        const index = this.dimensions.indexOf(dim);
        if (index!== -1) {
            this.dimensions.splice(index, 1);
        }
    }

    GetCharacterByName(name) {
        return this.characters.find(i => i.GetName().toLowerCase() == name.toLowerCase());
    }
    GetCharacterByUuid(uuid) {
        return this.characters.find(i => i.GetUUID() == uuid);
    }
    GetCharacter(identifier) {
        let char = loreMaster.GetCharacterByUuid(identifier * 1)
        if (char == undefined) {
            char = loreMaster.GetCharacterByName(identifier)
            if (char == undefined)
                return null
        }
        return char;
    }
    RemoveCharacter(char) {
        const index = this.characters.indexOf(char);
        if (index!== -1) {
            this.characters.splice(index, 1);
        }
    }

    save() {
        const jsonString = JSON.stringify(this);
        fs.writeFileSync('lore.json', jsonString);
    }

    load() {
        if (!fs.existsSync('lore.json')) return;
        
        try {
            const jsonString = fs.readFileSync('lore.json').toString();
            const loadedLore: LoreMaster = JSON.parse(jsonString, (key, value) => {
                if (key === '') return value;
                return value;
            })
            
            this.characters = []
            this.dimensions = []
            loadedLore.characters.forEach(i => this.characters.push(Character.from(i)));
            loadedLore.dimensions.forEach(i => this.dimensions.push(Dimension.from(i)));

            uuids = Math.max(...this.characters.map(i => i.GetUUID()), ...this.dimensions.map(i => i.GetUUID()))+1;
        } catch {
            return;
        }
    }
}

class Entity {
    protected version: number;
    protected uuid: number;
    protected date: number;
    protected lastUpdate: number;
  
    protected name: string;
    protected desc: string;
    protected lore: string;

  
    constructor(name) {
      this.version = VERSION;
      this.uuid = uuids++;
      this.date = Date.now();
      this.lastUpdate = Date.now();
  
      this.name = name;
      this.desc = 'No description set';
      this.lore = 'No Lore';
    }

    Update() {
        this.lastUpdate = Date.now();
    }

    GetUUID() { return this.uuid }
    
    GetName() { return this.name; }
    SetName(_)  { this.name = _.trim(); this.Update(); }
    GetDesc()  { return this.desc; }
    SetDesc(_) { this.desc = _.trim(); this.Update(); }
    GetLore() { return this.lore }
    SetLore(_) { this.lore = _.trim(); this.Update(); }

    GetDate() { return this.date; }
    GetLastUpdate() { return Math.round(this.lastUpdate/1000); }
}

export class Dimension extends Entity {
    constructor(name) {
        super(name);
    }

    static from(_: object): Dimension {
        const instance = new Dimension('');
        Object.entries(_).forEach(([key, value]) => {
            instance[key] = value;
        })
        return instance;
    }
    
    GetEmbed() {
        return new EmbedBuilder()
            .setColor(colour.dimension)
            .setAuthor({ name: "Dimension" })
            .setTitle(this.name)
            .setDescription(this.desc)
            .setTimestamp(this.date)
            .setFooter({text: `UUID: ${this.uuid} | Created at `})
            .addFields(
                {name: 'Lore', value: this.lore},
                {name: '\u200B', value: '\u200B'},
                {name: 'Last Modified', value: `<t:${this.GetLastUpdate()}:R>`}
            );
    }
    
}

export class Character extends Entity {
    protected dimension: number;
    protected perception: string;
    
    constructor(name, dimension = 0) {
        super(name);
        this.dimension = dimension;
        this.perception = "No perception"
    }
    
    static from(_: object): Character {
        const instance = new Character('');
        Object.entries(_).forEach(([key, value]) => {
            instance[key] = value;
        })
        return instance;
    }
    
    GetPerception() { return this.perception }
    SetPerception(_) { this.perception = _.trim(); this.Update(); }

    GetEmbed() {
        return new EmbedBuilder()
            .setColor(colour.character)
            .setAuthor({ name: "Character" })
            .setTitle(this.name)
            .setDescription(this.desc)
            .setTimestamp(this.date)
            .setFooter({text: `UUID: ${this.uuid} | Created at `})
            .addFields(
                {name: 'Lore', value: this.lore},
                {name: 'Perception', value: this.perception},
                {name: 'Dimension', value: loreMaster.GetDimensionByUuid(this.dimension).GetName()},
                {name: '\u200B', value: '\u200B'},
                {name: 'Last Modified', value: `<t:${this.GetLastUpdate()}:R>`}
            );
    }
}

export const loreMaster: LoreMaster = new LoreMaster();

