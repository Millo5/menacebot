
const fs = require('fs')

class DataHoarder {

    constructor() {
        this.global = {}
        this.player = {}
    }

    addPlayerInfo(player, key, value) {
        if (!player in this.player) this.player[player] = {}
        if (!key in this.player[player]) this.player[player][key] = 0;
        this.player[player][key] += value;
        return this.player[player][key];
    }
    setPlayerInfo(player, key, value) {
        if (!player in this.player) this.player[player] = {}
        
    }
    addGlobalInfo(key, value) {
        if (!key in this.global) this.global[key] = 0;
        this.global[key] += value;
        return this.global[key];
    }


    save() {
        const jsonString = JSON.stringify(this);
        fs.writeFileSync('data.json', jsonString);
    }

    load() {
        if (!fs.existsSync('data.json')) return;
        
        try {
            const jsonString = fs.readFileSync('data.json').toString();
            const loadedData = JSON.parse(jsonString);
            
            this.global = loadedData.global;
            this.player = loadedData.player;
        } catch {
            return;
        }
    }
}

exports.dataHoarder = new DataHoarder();