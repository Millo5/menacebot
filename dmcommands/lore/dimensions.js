const { loreMaster, Dimension } = require('./../../lore')
const { EmbedBuilder } = require('discord.js')
const { commands, colour } = require('./../../dmcommands')

const dimCommand = {
    name: "dimension",
    alias: ["dim"],
    desc: "Dimension related commands",
    args: [
        {
            name: "list",
            desc: "List every dimension",
            trigger: (args, semantics) => {
                var out = {type: "embed"}
                out.embed = new EmbedBuilder()
                        .setColor(colour.dimension)
                        .setAuthor({ name: "Dimension" })
                        .setTitle("List of Dimensions")

                loreMaster.dimensions.forEach(dim => out.embed.addFields({ name: `${dim.GetName()} [${dim.GetUUID()}]`, value: dim.GetDesc() }))
                return out;
            }
        },
        {
            name: "add",
            desc: "Add a new dimension",
            trigger: (args, semantics) => {
                var out = {type: "respond", msg: ":3"}

                var name = args[1];
                loreMaster.AddDimension(new Dimension(name))
                loreMaster.save();
                console.log(args);

                return out;
            }
        },
        {
            name: "edit",
            desc: "Edit an existing dimension's info",
            args: [
                {
                    semantic: "targetDim",
                    trigger: (args, semantics) => {
                        console.log(args)
                        console.log(semantics)

                        let dim = loreMaster.GetDimensionByUuid(semantics.targetDim * 1)
                        if (dim == undefined) {
                            dim = loreMaster.GetDimensionByName(semantics.targetDim)
                            if (dim == undefined) {
                                return {type: "respond", msg: `Dimension '${semantics.targetDim}' not found`}
                            }
                        }

                        console.log(dim)
                        console.log(dim.desc);
                        
                        const _embed = new EmbedBuilder()
                                .setColor(colour.dimension)
                                .setAuthor({ name: "Dimension" })
                                .setTitle(dim.name)
                                .setDescription(dim.desc)
                                .setTimestamp(dim.date)
                                .setFooter({text: `UUID: ${dim.uuid} | Created at `})
                                .addFields(
                                    {name: '\u200B', value: '\u200B'},
                                    {name: 'Last Modified', value: `<t:${dim.GetLastUpdate()}:R>`}
                                )

                        //loreMaster.save();
                        return {type: "embed", embed: _embed};
                    }
                }
            ],
            trigger: (a, s) => {
                return {type: "respond", msg: "Usage: `dim edit <NAME | ID>"}
            }
        }
    ]
}

commands.push(dimCommand)
