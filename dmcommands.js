
const { loreMaster, Dimension } = require('./lore')
const { EmbedBuilder } = require('discord.js')

const colour = {
    character: 0x0099FF,
    dimension: 0xFFD03B,
    util: 0xD03BFF
}

exports.colour = colour;

const commands = [
    {
        name: "help",
        desc: "List of all commands (help [command])",
        trigger: (args, semantics) => {
            var out = {type: "embed"}
            out.embed = new EmbedBuilder()
                .setColor(colour.util)
                .setAuthor({ name: "Help" })
                .setTitle(`'${args}'`)
                .setDescription(this.desc)
                .setTimestamp(this.date)
                .setFooter({text: `UUID: ${this.uuid} | Created at `})
                .addFields(
                    {name: 'Lore', value: this.lore},
                    {name: '\u200B', value: '\u200B'},
                    {name: 'Last Modified', value: `<t:${this.GetLastUpdate()}:R>`}
                );
            

            if (args.length > 1) {
                // Find command
                const cmd = commands.find(i => i.name.toLowerCase().startsWith(args[1]))
                if (cmd) {
                    // Create the response message
                    out.msg += "\nUsage of `" + cmd.name+"`:";
                    if (cmd.alias) out.msg += "\nAlias: `" + cmd.alias.join(", ")+"`";

                    out.msg += "\n"+cmd.desc+"\n";
                    
                    // Add all the arguments
                    if (cmd.args) cmd.args.forEach(i => out.msg += "\n`"+ cmd.name +" "+ i.name + "` - " + i.desc)

                } else {
                    // Command doesn't exist
                    out.msg += "\nCommand `"+args[1]+"` not found";
                }
            } else {
                // default help command
                commands.forEach(c => out.msg += "\n`" + c.name + "` - " + c.desc);
            }
            out.msg += "\n~~                                                                 ~~"
            return out;
        }
    }
]
exports.commands = commands;

require('./dmcommands/initialize')

function getTrigger(cmd, args, semantics = []) {
    var r = {trigger: cmd.trigger, semantics: semantics}
    if (args.length > 1) {
        if (cmd.args) {
            // Literal Return
            const a = cmd.args.find(i => i.name?.toLowerCase() == args[1].toLowerCase() || (i.alias && i.alias.includes(args[0].toLowerCase())))
            if (a && a.name) {
                args.shift();
                return getTrigger(a, args, r.semantics);
            }

            // Semantic Return
            const b = cmd.args.find(i => i.semantic != null);
            if (b) {
                if (args.length <= 1) {
                    return {trigger: (a, s) => { return {type: "respond", msg: `Missing semantic value \`${b.semantic}\``} }, semantics: null}
                }

                r.semantics[b.semantic] = args[1]
                args.shift();
                return getTrigger(b, args, r.semantics);
            }
        }
    }
    return r;
}


exports.DMCommand = function(input) {
    let output = {
        success: false
    }

    const args = input.split(" ");
    const origArgs = Array.from(args);

    const cmd = commands.find(cmd => (cmd.name.toLowerCase() === args[0].toLowerCase() || (cmd.alias && cmd.alias.includes(args[0].toLowerCase()))));
    if (cmd) {
        output.success = true;
        
        let trigger = getTrigger(cmd, args);
        let semantics = trigger.semantics;
        trigger = trigger.trigger;

        let cmdOut = null;
        if (trigger) {
            cmdOut = trigger(args, semantics);
        } else {
            console.log(origArgs)
            cmdOut = commands[0].trigger(["help", origArgs[0]], semantics);
        }
        output.response = cmdOut;
    }

    return output;
}