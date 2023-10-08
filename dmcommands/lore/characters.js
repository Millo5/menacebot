const { loreMaster, Dimension, Character } = require('../../lore')
const { EmbedBuilder } = require('discord.js')
const { commands, colour } = require('../../dmcommands')

const charCommand = {
    name: "character",
    alias: ["char"],
    desc: "Character related commands",
    args: [
        {
            name: "list",
            desc: "List every character",
            public: true,
            trigger: (args, semantics) => {
                var out = {type: "embed"}
                out.embed = new EmbedBuilder()
                    .setColor(colour.character)
                    .setAuthor({ name: "Character" })
                    .setTitle("List of Characters")
                
                const _filter = [];
                if (args.length > 1 && args[1].startsWith('"')) {
                    let i;
                    for (i = 1; i < args.length; i++) {
                        _filter.push(args[i].replace('"', '').replace('"', '').toLowerCase())
                        if (args[i].endsWith('"')) break;
                    }
                    args.splice(1, i);
                }
                

                let characterList = loreMaster.characters;
                if (_filter.length > 0) {
                    characterList = characterList.filter(i => 
                            _filter.filter(f => i.GetName().toLowerCase().includes(f) ||
                                i.GetDesc().toLowerCase().includes(f)
                            ).length > 0
                        );
                }
                
                const pageCount = Math.ceil(characterList.length/15)
                let page = 1;
                if (args.length > 1) page = args[1]*1;

                if (page < 1) page = 1;
                if (page > pageCount) page = pageCount;


                characterList.slice((page-1)*15, page*15).forEach((char,_) => out.embed.addFields(
                    { name: `${_+1}. ${char.GetName()} [${char.GetUUID()}]`, value: char.GetDesc() }
                    ))
                
                out.embed.setFooter({ text: `Page ${page}/${pageCount}`, iconURL: 'https://media.discordapp.net/attachments/500361970952830979/1119402476853002370/Screenshot_2023-06-06_230749.png' });

                return out;
            }
        },
        {
            name: "view",
            alies: ["v"],
            desc: "View an existing character's info",
            public: true,
            args: [
                {
                    semantic: "targetChar",
                    trigger: (args, semantics) => {

                        let char = loreMaster.GetCharacterByUuid(semantics.targetChar * 1)
                        if (char == undefined) {
                            char = loreMaster.GetCharacterByName(semantics.targetChar)
                            if (char == undefined) {
                                return {type: "respond", msg: `Character '${semantics.targetChar}' not found`}
                            }
                        }
                        
                        const _embed = char.GetEmbed()

                        return {type: "embed", embed: _embed};
                    }
                }
            ],
            trigger: (a, s) => {
                return {type: "respond", msg: "Usage: `char view [NAME | ID]`"}
            }
        },
        {
            name: "add",
            desc: "Add a new character",
            trigger: (args, semantics) => {
                var out = {type: "respond", msg: ":3"}

                var name = args[1];
                loreMaster.AddCharacter(new Character(name))
                loreMaster.save();
                console.log(args);

                return out;
            }
        },
        {
            name: "edit",
            desc: "Edit an existing character's info",
            args: [
                {
                    semantic: "targetChar",
                    trigger: (args, semantics) => {

                        let char = loreMaster.GetCharacterByUuid(semantics.targetChar * 1)
                        if (char == undefined) {
                            char = loreMaster.GetCharacterByName(semantics.targetChar)
                            if (char == undefined) {
                                return {type: "respond", msg: `Character '${semantics.targetChar}' not found`}
                            }
                        }
                        
                        const _embed = char.GetEmbed()

                        //loreMaster.save();
                        return {type: "embed", embed: _embed};
                    },
                    args: [
                        {
                            name: "name",
                            desc: "Set name",
                            trigger: (a, s) => {
                                const out = {type: "respond", msg: `char edit ${s.targetChar} name <Name>`}
                                if (a.length > 1) {
                                    const char = loreMaster.GetCharacter(s.targetChar);
                                    if (char == undefined) return {type: "respond", msg: `Character '${s.targetChar}' not found`}

                                    let name = Array.from(a);
                                    name.shift();

                                    out.msg = `Set \`${char.name}\`'s name to \`${name.join(" ")}\``

                                    char.SetName(name.join(" "));

                                    loreMaster.save();
                                }
                                return out;
                            }
                        },
                        {
                            name: "delete",
                            desc: "Deleted",
                            trigger: (a, s) => {
                                const char = loreMaster.GetCharacter(s.targetChar);
                                if (char == undefined) return {type: "respond", msg: `Character '${s.targetChar}' not found`}

                                loreMaster.RemoveCharacter(char);
                                loreMaster.save();
                                return {type: "respond", msg: `removed ${s.targetChar}`}
                            }
                        },
                        {
                            name: "description",
                            alias: ["desc"],
                            desc: "Set description",
                            trigger: (a, s) => {
                                const char = loreMaster.GetCharacter(s.targetChar);
                                if (char == undefined) return {type: "respond", msg: `Character '${s.targetChar}' not found`}

                                let desc = Array.from(a);
                                desc.shift();
                                char.SetDesc(desc.join(" "));
                                
                                loreMaster.save();
                                return {type: 'embed', embed: char.GetEmbed()}
                            }
                        },
                        {
                            name: "lore",
                            desc: "Set lore",
                            trigger: (a, s) => {
                                const char = loreMaster.GetCharacter(s.targetChar);
                                if (char == undefined) return {type: "respond", msg: `Character '${s.targetChar}' not found`}

                                let desc = Array.from(a);
                                desc.shift();
                                char.SetLore(desc.join(" "));
                                
                                loreMaster.save();
                                return {type: 'embed', embed: char.GetEmbed()}
                            }
                        },
                        {
                            name: "perception",
                            desc: "Set perception",
                            trigger: (a, s) => {
                                const char = loreMaster.GetCharacter(s.targetChar);
                                if (char == undefined) return {type: "respond", msg: `Character '${s.targetChar}' not found`}

                                let desc = Array.from(a);
                                desc.shift();
                                char.SetPerception(desc.join(" "));
                                
                                loreMaster.save();
                                return {type: 'embed', embed: char.GetEmbed()}
                            }
                        }
                    ]
                }
            ],
            trigger: (a, s) => {
                return {type: "respond", msg: "Usage: `char edit [NAME | ID]`"}
            }
        }
        
    ]
}

commands.push(charCommand)
