module.exports = (TOOLS, MODULES, CONSTANTS) => {
    const logger = TOOLS.LOGGER
    const moment = MODULES.MOMENT
    const prefix = CONSTANTS.PREFIX
    const kitsuUrl = CONSTANTS.URL.KITSU
    const { RichEmbed } = MODULES.DISCORDJS
    const { Utils, Anime } = TOOLS.FUNCTIONS

    const animeInterface = {

        /**
         * Shows help about the command
         * 
         * @param {object} message DiscordJS Message Object
         * @returns {object} Sent Message Object
         */
        index: (message) => {
            const embed = new RichEmbed({
                title: `All about \`${prefix}anime\` commands`,
                description: 'You can browse popular animes, search for titles, get details from a specific anime... The list still goes on!',
                color: 15554891,
                footer: {
                    icon_url: "https://i.imgur.com/qi7zUuc.jpg",
                    text: "Mori Summer Project"
                },
                thumbnail: {
                    url: "https://i.imgur.com/qi7zUuc.jpg"
                },
                fields: [
                    {
                        name: 'Get the Hottest Anime Titles :fire:',
                        value: `${prefix}anime popular`
                    },
                    {
                        name: 'More Awesome Commands Coming Soon! :mag:',
                        value: `${prefix}anime ...`
                    }
                ]
            }).setTimestamp()
            
            return message.channel.send({ embed }).catch(err => {
                logger.error(err)
                message.channel.send("You lack the **Embed Links** permission!")
            })
        },

        /**
         * Gets popular anime titles from Kitsu.io
         * 
         * @param {object} message DiscordJS Message Object
         * @param {object} args Message Arguments
         * @returns {object} Sent Message Object
         */
        popular: async (message, args) => {
            try {
                const limit = args[1] || 10

                const waitMessage = await Utils.sendWaitMessage(message, 'get', 'Getting the hottest anime titles...')
                let { data: { data: popularAnimeData } } = await Anime.getPopular(limit)
                waitMessage.delete()

                popularAnimeData = popularAnimeData.map((anime, index) => {
                    const link = kitsuUrl + '/anime/' + anime.attributes.slug
                    return {
                        name: `${index + 1}. ${anime.attributes.canonicalTitle}`,
                        value: `ID: ${anime.id}\nLink: [${link}](${link})`
                    }
                })

                const embed = new RichEmbed({
                    title: 'Anime Ranks Based on Popularity',
                    description: `**Got it, ${message.author}!**\nHere's the current list of the top ${limit} most popular anime titles 🔥`,
                    url: kitsuUrl + '/explore/anime/most-popular',
                    color: 16610652,
                    footer: {
                        icon_url: message.author.displayAvatarURL,
                        text: 'Mori Summer Project'
                    },
                    thumbnail: {
                        url: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/v1483996064/bry24vyez4pkm83sojkl.png'
                    },
                    fields: popularAnimeData
                }).setTimestamp()

                return message.channel.send({ embed })
            } catch (err) {
                return Utils.sendErrorMessage(message, err)
            }
        },

        /**
         * Search anime by title on Kitsu.io
         * 
         * @param {object} message DiscordJS Message Object
         * @param {object} args Message Arguments
         * @param {number} page Pagination Page
         * @returns {object} Sent Message Object
         */
        search: async (message, args, page) => {
            try {
                const [, ...searchQuery] = args
                page = page || 1

                const waitMessage = await Utils.sendWaitMessage(message, 'search')
                let { data: searchResultsData } = await Anime.search(searchQuery, page)
                waitMessage.delete()

                let indexNumbers = []
                let searchResults = searchResultsData.data.map((anime, index) => {
                    const entryNumber = (page * 10) - 10 + index + 1
                    indexNumbers.push(entryNumber.toString())
                    return `[${entryNumber}] ${anime.attributes.canonicalTitle}\n`
                })

                if(searchResultsData.links.prev) searchResults.push('[-] Prev Page\n')
                if(searchResultsData.links.next) searchResults.push('[+] Next Page')

                const embed = new RichEmbed({
                    title: 'Anime Search',
                    description: `Yo, here's the search result! 👌\nType an index number from below to see the details about that specific anime.\`\`\`\n${searchResults.join('')}\`\`\``,
                    url: kitsuUrl + '/anime?text=' + encodeURIComponent(searchQuery),
                    color: 16610652,
                    footer: {
                        icon_url: message.author.displayAvatarURL,
                        text: "Mori Summer Project"
                    }
                }).setTimestamp()
                await message.channel.send({ embed })

                let isValidResponse = response => Utils.isNumber(response) || response == '-' || response == '+'
                let response = await message.channel.awaitMessages(response => isValidResponse(response), { max: 1, time: 10000, errors: [] })
                response = response.first().content

                if (Utils.isNumber(response) && indexNumbers.includes(response)) {
                    let selectedIndex = parseInt(response) - 1 - (page * 10) + 10
                    return animeInterface.info(message, [undefined, searchResultsData.data[selectedIndex].id])
                } else if(response == '-') {
                    return animeInterface.search(message, args, page - 1)
                } else if(response == '+') {
                    return animeInterface.search(message, args, page + 1)
                }
            } catch (err) {
                return Utils.sendErrorMessage(message, err)
            }
        },

        /**
         * Gets details about an anime by its ID
         * 
         * @param {object} message DiscordJS Message Object
         * @param {object} args Message Arguments
         * @returns {object} Sent Message Object
         */
        info: async (message, args) => {
            try {
                const [, id] = args

                const waitMessage = await Utils.sendWaitMessage(message, 'get', 'Getting your anime info...')
                let { data: animeData } = await Anime.getInfo(id)
                let { data: [animeInfo] } = animeData
                waitMessage.delete()
                
                const getCompanyIds = (haystack, role) => haystack
                    .filter(included => included.attributes.role === role)
                    .map(included => included.relationships.company.data.id)

                const mediaProductions = animeData.included.filter(included => included.type === 'mediaProductions')
                const studioIds = getCompanyIds(mediaProductions, 'studio')
                const producerIds = getCompanyIds(mediaProductions, 'producer')
                const genres = animeData.included.filter(included => included.type === 'genres').map(genre => genre.attributes.name)

                let producers = []
                let studios = []

                producerIds.forEach(id => producers.push(animeData.included.find(data => data.id === id && data.type === 'producers').attributes.name))
                studioIds.forEach(id => studios.push(animeData.included.find(data => data.id === id && data.type === 'producers').attributes.name))

                const airedFrom = moment(animeInfo.attributes.startDate, 'YYYY-MM-DD').format('MMM D, YYYY')
                const airedUntil = animeInfo.attributes.endDate === null ? '' : ' to ' + moment(animeInfo.attributes.endDate, 'YYYY-MM-DD').format('MMM D, YYYY')

                const embed = new RichEmbed({
                    title: "Anime Details Based on ID",
                    description: `**Hey, ${message.author}!**\nHere's the info on the anime you just requested 💯`,
                    url: kitsuUrl + '/anime/' + animeInfo.attributes.slug,
                    color: 16610652,
                    footer: {
                        icon_url: message.author.displayAvatarURL,
                        text: 'Mori Summer Project'
                    },
                    thumbnail: {
                        url: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/v1483996064/bry24vyez4pkm83sojkl.png'
                    },
                    image: {
                        url: animeInfo.attributes.posterImage.small
                    },
                    fields: [
                        {
                            name: animeInfo.attributes.canonicalTitle,
                            value: Utils.truncateString(`
                                **ID**: ${animeInfo.id}
                                **Title:** ${animeInfo.attributes.canonicalTitle}
                                **Type:** ${Utils.capitalizeFirstLetter(animeInfo.type)} (${animeInfo.attributes.episodeCount} Episodes)
                                **Status:** ${animeInfo.attributes.status === 'finished' ? 'Finished' : 'Currently Airing'}
                                **Aired:** ${airedFrom + airedUntil}
                                **Producers:** ${producers.join(', ')}
                                **Studios:** ${studios.join(', ')}
                                **Genres:** ${genres.join(', ')}
                                **Rating:** ${animeInfo.attributes.averageRating} (${Object.values(animeInfo.attributes.ratingFrequencies).reduce((acc, current) => parseInt(acc) + parseInt(current))} users)
                                **Age Rating:** ${animeInfo.attributes.ageRating}
                                **Link:** ${kitsuUrl + '/anime/' + animeInfo.attributes.slug}
                            `, 1021)
                        }
                    ]
                }).setTimestamp()

                return message.channel.send({ embed })
            } catch (err) {
                return Utils.sendErrorMessage(message, err)
            }
        }

    }

    return animeInterface
}

module.exports.config = {
    aliases: {
        command: ['a'],
        methods: {}
    }
}