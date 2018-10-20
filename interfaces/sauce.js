module.exports = (TOOLS, MODULES, CONSTANTS) => {
    const Sagiri = MODULES.SAGIRI
    const { Utils } = TOOLS.FUNCTIONS
    const { RichEmbed } = MODULES.DISCORDJS
    const sauceToken = process.env.SAUCENAO_TOKEN

    const sauceInterface = {
        index: async (message, args) => {
            try {
                const link = args[0]

                if (!link) return message.channel.send('Insert a link, pls')
                const sagiri = new Sagiri(sauceToken)
                const searchLink = 'http://saucenao.com/search.php?db=999&url=' + link

                const waitMessage = await Utils.sendWaitMessage(message, 'search', 'Looking for sauce...')
                const search = await sagiri.getSauce(link)
                waitMessage.delete()

                let list = []
                search.forEach((result, index) => {
                    list.push({
                        name: `${index + 1}. Similarity: ${result.similarity.toFixed(1)}%`,
                        value: `[${result.site}](${result.url})`,
                        inline: true
                    })
                })

                const embed = new RichEmbed({
                    author: {
                        icon_url: 'https://www.google.com/s2/favicons?domain=https://saucenao.com/',
                        name: 'SauceNAO Image Crawler',
                        url: 'https://saucenao.com/'
                    },
                    description: `**Hey, ${message.author}**!\nHere are some results that may be relevant to the image.\nIn case of error or the results aren't really matching your image, visit [this link](${searchLink}) and try to search again.`,
                    thumbnail: {
                        url: link
                    },
                    color: 15554891,
                    fields: list
                })
                
                return message.channel.send({ embed }).catch(err => {
                    if (err.code === 50013) return message.channel.send(`You lack the **Embed Links** permission!`)
                    return Utils.sendErrorMessage(message, err)
                })
            } catch (error) {
                return Utils.sendErrorMessage(message, error)
            }
        }
    }

    return sauceInterface
}

module.exports.config = {
    aliases: {
        command: ['sc', 'saucenao'],
        methods: {}
    }
}