const dotenv = require('dotenv');
dotenv.config();

const { Client, Events, GatewayIntentBits, Partials, RequestManager, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, AudioPlayer } = require('@discordjs/voice');
const { join } = require('node:path');
const { loreMaster } = require('./lore');
const { dataHoarder } = require('./dataHoarder.js')
const { DMCommand, setLoreMaster } = require('./dmcommands.js');
const axios = require('axios')
const Jimp = require('jimp');
const GIFWrap = require('gifwrap')

const menacesId = '977651767376486460'
const menacesVcID = '977651767825297548'
const guild = null;

const client = new Client({
    partials: [
        Partials.Message,
        Partials.Channel
    ],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessageTyping
    ]
})


// TODO: HOMERUN


const formatDate = (i) => (i > 9) ? i : `0${i}`;
function log(msg) {
    let date = new Date();
    let s = formatDate(date.getSeconds());
    let m = formatDate(date.getMinutes());
    let h = formatDate(date.getHours());
    console.log(`${h}:${m}:${s} > ${msg}`);
}

var winMessageCounts = [];
winMessageCounts["Menace"] = 4;
winMessageCounts["Loopion"] = 4;
winMessageCounts["Strikeout"] = 2;

var killMessageCounts = [];

var sdMessageCounts = [];
sdMessageCounts["Clairvoyant"] = 7;
sdMessageCounts["Strikeout"] = 2;

var player = createAudioPlayer();
var fxplayer = createAudioPlayer();

let connection = null;

const __sounddir = 'C:\\Users\\23lee\\Desktop\\DESKTOP\\_Code\\js\\menace\\sounds';
log(__sounddir);

var queue = [];
var playingSound = false;

var soundCount = 0

loreMaster.load();
dataHoarder.load();



const commands = [
    {
        name: 'connect',
        description: 'Connect to your voice channel',
        callback: async (client, interaction /*Interaction<CacheType>*/) => {
            log(connection)
            if (connection != null) return;

            const channel = interaction.member.voice.channel;
            if (channel) {
                player = createAudioPlayer();
                fxplayer = createAudioPlayer();
                const resource = createAudioResource('https://cdn.discordapp.com/attachments/997608478300438599/1099057449186639972/b.mp3');

                await ConnectToVoice();

                player.play(resource);
                connection.subscribe(player);
                connection.subscribe(fxplayer);

                reply(interaction, "Connected to voice channel")
            } else {
                reply(interaction, "You're not in a voice channel")
            }
            
            return true;
        }
    },
    {
        name: 'disconnect',
        description: 'Disconnect from voice channel',
        callback: (client, interaction) => {
            log(interaction);
            if (interaction.member.user.id != '192324567090462720') return;
            
            if (connection != null) {
                DisconnectFromVoice();
            }
            reply(interaction, "Disconnected")
        }
    },
    {
        name: 'startloopion',
        description: 'Loopion',
        callback: (client, interaction) => {
            loopionL = true;
            reply(interaction, "LOOPION :3")
        }
    },
    {
        name: '8ball',
        description: 'Oooooo... what is it ?? yes?? no??? hmmm???? who knowsssss',
        argument: 'question',
        callback: (client, interaction) => {
            console.log(interaction);
            const e = (a) => reply(interaction, `${interaction.member.nickname} asked: **${interaction.options._hoistedOptions[0].value}**?\n > \`${a}\``, true);
            console.log(interaction.options._hoistedOptions[0].value);
            if (Math.random() < 0.9) {
                e("kill yourself");
                return;
            }
            const responseOptions = [
                "kill yourself",
                "menace approves",
                "fray sweeps",
                "excelsus cries",
                "clairvoyant crest was thinking about pause time again",
                "womp womp",
                "nuh uh",
                "youre the beast",
                "woah.",
                "you should kill yourself now",
                "bonk"
            ]
            e(responseOptions[Math.floor(Math.random() * responseOptions.length)]);
            
        }
    },
    {
        name: 'stoploopion',
        description: 'Loopion',
        callback: (client, interaction) => {
            loopionL = false;
            reply(interaction, "LOOPION 3:")
        }
    }
]

var loopionL = false;

log(commands)

async function reply(victim, msg, keep = false) {
    if (keep) {
        victim.reply(msg);
        return;
    }
    victim.reply(msg)
        .then(msg => {
            setTimeout(() => msg.delete(), 3000)
        })
}

function clearQueue() {
    queue = [];
}
function addToQueue(sound) {
    queue[queue.length] = sound;
    
    if (!playingSound) {
        playNextInQueue();
    }
}
function playNextInQueue() {
    if (loopionL) {
        const sounds = ["ahoy!", "sd/Loopion", "win/Loopion_1", "win/Loopion_2", "win/Loopion_3", "win/Loopion_4", "kill/Loopion"]
        const c = sounds[Math.floor(Math.random() * sounds.length)];
        queue.push(join(__sounddir, c+".mp3"));
    }
    if (queue.length > 0) {
        playSound(null, queue[0])
        queue.shift();
    }
}

function playSound(msg, sound, fx = false) {
    if (!connection) return;
    soundCount ++;
    log("Playing Sound "+soundCount +": " + sound)

    const resource = createAudioResource(sound);

    if (fx) {
        fxplayer = createAudioPlayer();
        connection.subscribe(fxplayer);

        fxplayer.play(resource);
        return;
    }
    player = createAudioPlayer();

    connection.subscribe(player);
    player.play(resource);

    playingSound = true;

    player.on(AudioPlayerStatus.Idle, () => {
        playingSound = false;
        playNextInQueue();
    })
}
function getWinner(str) {
    var index = str.indexOf(' ');
    if (index === -1) {
        return '';
    }
    str = str.substr(index + 1);

    index = str.indexOf(" >");
    if (index > 0) {
        return str.substr(0, index)
    }

    index = str.indexOf(" (");
    if (index === -1) {
        return str;
    }
    return str.substr(0, index);
}
function getLoser(str) {
    var index = str.indexOf(" > ");
    if (index === -1) {
        return null;
    }
    return str.substr(index + 3);
}

function playCharacterSound(path, character, refList) {
    var c = character;
    if (c in refList) {
        c = c + "_" + (Math.floor(Math.random()*(refList[c]))+1)
    }
    addToQueue(join(__sounddir, path, c+".mp3"));
}

function playCharacterIntro(p1, p2) {
    addToQueue(join(__sounddir, "vs", p1, p2+".mp3"))
}

function playVersusIntro(msg) {
    // msg: 'versus: Excelsus vs Cogwyn (Synsao vs xXBastianXx2)'
    const [user1, user2] = /(?<=\()[^)]+(?=\))/.exec(msg)[0].split(' vs ');
    const [player1, player2 = player1] = msg
        .substring(msg.indexOf(':') + 2, msg.indexOf('(') - 1)
        .split(' vs ');

    log(`Game Start: ${player1} vs ${player2}`)
    log(` ~ ${user1} vs ${user2}`)

    if (player1 == player2) {
        playCharacterIntro(player1, player2);
    } else {
        playCharacterIntro(player1, player2);
        playCharacterIntro(player2, player1);
    }
}

client.on('ready', async () => {
    log("Loading Commands")
    
    commands.forEach(cmd => {
        log("Loading " + cmd.name)
        const command = new SlashCommandBuilder()
            .setName(cmd.name)
            .setDescription(cmd.description)
        if ("argument" in cmd) {
            console.log(cmd.argument)
            command.addStringOption(option => option.setName(cmd.argument).setDescription("...").setRequired(true));
        }
        client.application.commands.create(command)
    })


    log(`Logged in as ${client.user.tag}!`)

    
})

async function ConnectToVoice() {
    const g = await client.guilds.fetch(menacesId)
    
    connection = joinVoiceChannel({
        channelId: menacesVcID+"",
        guildId: menacesId+"",
        adapterCreator: g.voiceAdapterCreator
    });

    connection.on('stateChange', (oldState, newState) => {
        const oldNetworking = Reflect.get(oldState, 'networking');
        const newNetworking = Reflect.get(newState, 'networking');
        const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
                const newUdp = Reflect.get(newNetworkState, 'udp');
                clearInterval(newUdp?.keepAliveInterval);
        }
        oldNetworking?.off('stateChange', networkStateChangeHandler);
        newNetworking?.on('stateChange', networkStateChangeHandler);
    });
}
function DisconnectFromVoice() {
    connection.destroy();
    connection = null;
}

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.member) return;
    commands.find(i => i.name === interaction.commandName).callback(client, interaction);
})

client.on("messageCreate", async (msg) => {
    //console.log(msg)

    const isMillo = msg.author.id == '192324567090462720';
    const isDylan = msg.author.id == '193745543795703808';

    if (isMillo) {
        if (msg.content.startsWith("WITH THIS TREASURE, I SUMMON")) {
            msg.channel.send("I have been summoned...");
        }
    }

    if (msg.channel.type == 1) {
        if (msg.author.bot) return;

        // Obtain menace guild
        const g = await client.guilds.fetch(menacesId)

        // Check permission
        var hasPerms = false;
        await g.members.fetch(msg.author.id).then(v => {
            hasPerms = v._roles.includes('1118258163863535667');
        })
        if (!hasPerms) {
            log(`Unauthored DM Attempt: {${msg.author.username}} ${msg.content}`)
            msg.author.send("No permission :3")
            return;
        }
        if (msg.author.id == '192324567090462720') {
            if (msg.content == 'force-quit') {
                client.destroy();
                return;
            }
        }
        
        log(`DM Handle: {${msg.author.username}} ${msg.content}`)

        let out;
        try {
            out = DMCommand(msg.content);
        } catch (e) {
            out = {response: {type: 'respond', message: `${e}`}}
        }
        if (!out.success) msg.author.send("Command not found. Type `help` for help.")
        else {
            const r = out.response;

            switch (r.type) {
                case "respond":
                    r.msg = r.msg.substring(0, 1900)
                    msg.author.send(r.msg);
                    break;
                case "embed":
                    msg.channel.send({embeds: [r.embed]})
                    break;
            }
        }
        return;
    }
    
    if (msg.channelId == '1100472825883664404') {
        var mainChar = getWinner(msg.content);
        var secondChar = getLoser(msg.content)
        if (msg.content.includes("..")) return;

        if (msg.content.startsWith("winner: ")) {
            clearQueue();
            log(` ~ Winner: ${mainChar}`)
            playCharacterSound('win', mainChar, winMessageCounts);
        }
        if (msg.content.startsWith("kill: ")) {
            playCharacterSound('kill', mainChar, killMessageCounts);
            if (Math.random() < 0.3) {
                if (secondChar != null) {
                    playCharacterSound('sd', secondChar, sdMessageCounts);
                }
            }
        }
        if (msg.content.startsWith("sd: ")) {
            playCharacterSound('sd', mainChar, sdMessageCounts);
        }
        if (msg.content.startsWith("sound: ")) {
            addToQueue(join(__sounddir, mainChar));
        }
        if (msg.content.startsWith("versus: ")) {
            playVersusIntro(msg.content)
        }
        if (msg.content.startsWith("clear")) {
            clearQueue();
        }

        if (msg.content.startsWith("data")) {
            const datas = msg.content.split(";");

            if (datas[1] == "playing") {
                // data;playing;name1|kit1,name2|kit2
                const players = datas[2].split(',');
                players.forEach(player => {
                    const name = player.split("|")[0];
                    const kit = player.split("|")[1];
                    
                    dataHoarder.addPlayerInfo(name, "games_played", 1);
                    dataHoarder.addPlayerInfo(name, `games_played_as_${kit}`, 1);
                    dataHoarder.setPlayerInfo(name, `last_played`, 1);
                });
                dataHoarder.save();
            } else if (datas[1] == "won") {
                // data;won;name1,name2
                players = datas[2].split(',');
                players.forEach(player => dataHoarder.addPlayerInfo(player, "wins", 1));
            }


        }

        if (msg.content.startsWith("startgame")) {
            playSound(msg, join(__sounddir, 'countdown.mp3'));
            if (Math.random() < 0.1) {
                playSound(msg, join(__sounddir, 'countdown_rare.mp3'));
            }
        }
        if (msg.content.startsWith("MENACE BUSTER")) {
            playSound(msg, join(__sounddir, 'menace_buster.mp3'), true);
            if (Math.random() < 0.01) {
                playSound(msg, join(__sounddir, 'im_cuming.mp3'), true);
            }
        }
        if (msg.content.startsWith("HOMERUN")) {
            playSound(msg, join(__sounddir, 'homerun.mp3'), true);
        }
        if (msg.content.startsWith("AHOY")) {
            playSound(msg, join(__sounddir, 'ahoy!.mp3'), true);
        }
        if (msg.content.toLowerCase().startsWith("kys")) {
            clearQueue();
            loopionL = false;
            playSound(msg, join(__sounddir, 'kys.mp3'));
        }
    }
    
    // last resort, the menace.
    if (msg.content == "MEN") {
        //sendRandomGif({content: "Menace, find a gif of boys kissing, add the bottom caption \"hop on menaces\" and post it."});
    }

});

client.on("voiceStateUpdate", async (ctx) => {
    const v = await ctx.guild.channels.fetch(menacesVcID)
    const userCount = v.members.filter((v,k) => !v.user.bot).size;
    if (userCount == 0) {
        if (connection) DisconnectFromVoice();
    }
    if (userCount > 0) {
        if (!connection) ConnectToVoice();
    }
})


client.login(process.env.DISCORD_TOKEN);


