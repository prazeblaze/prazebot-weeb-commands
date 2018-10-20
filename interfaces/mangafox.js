module.exports = (TOOLS, MODULES, CONSTANTS) => {
    const logger = TOOLS.LOGGER
    const prefix = CONSTANTS.PREFIX
    const { RichEmbed } = MODULES.DISCORDJS
    const mangaFoxUrl = CONSTANTS.URL.MANGAFOX
    const { Utils, Mangafox } = TOOLS.FUNCTIONS

    const mangafoxInterface = {
        index: (message, args) => {
            const embed = new RichEmbed({
                title: `All about \`${prefix}mangafox\` commands`,
                description: 'You can browse the most popular mangas available, search for titles, get a manga\'s details... Give it a try!',
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
                        name: 'Get the Hottest Manga Titles :fire:',
                        value: `${prefix}mangafox popular`
                    },
                    {
                        name: 'More Awesome Commands Coming Soon! :mag:',
                        value: `${prefix}mangafox ...`
                    }
                ]
            }).setTimestamp()
            
            return message.channel.send({ embed }).catch(err => {
                logger.error(err)
                message.channel.send("You lack the **Embed Links** permission!")
            })
        },

        new: async (message, args) => {
            try {
                const waitMessage = await Utils.sendWaitMessage(message, 'get', 'Getting the latest manga updates...')
                let latestMangaData = await Mangafox.getLatestUpdates()
                waitMessage.delete()

                latestMangaData = latestMangaData.map((manga, index) => {
                    return {
                        name: `${index + 1}. ${manga.title}`,
                        value: `ID: ${manga.thumbnailUrl.split('/')[5]}\nLink: [${manga.url}](${manga.url})`
                    }
                })

                const embed = new RichEmbed({
                    title: 'Latest Manga Updates',
                    description: `**Hey, ${message.author}!**\nHere's the current list of the latest manga updates on MangaFox 🔥`,
                    url: `${mangaFoxUrl}/directory/new/`,
                    color: 1467591,
                    footer: {
                        icon_url: message.author.displayAvatarURL,
                        text: 'Mori Summer Project'
                    },
                    thumbnail: {
                        url: "https://pbs.twimg.com/profile_images/1758860726/icon_400x400.png"
                    },
                    fields: latestMangaData
                }).setTimestamp()

                return message.channel.send({ embed })  
            } catch (error) {
                return Utils.sendErrorMessage(message, error)
            }
        },

        recent: async (message, args) => {
            try {
                const waitMessage = await Utils.sendWaitMessage(message, 'get', 'Getting the freshest manga titles...')
                let latestMangaData = await Mangafox.getRecents()
                waitMessage.delete()

                latestMangaData = latestMangaData.map((manga, index) => {
                    return {
                        name: `${index + 1}. ${manga.title}`,
                        value: `ID: ${manga.id}\nLink: [${manga.href}](${manga.href})`
                    }
                })

                const embed = new RichEmbed({
                    title: 'Latest Manga Updates',
                    description: `**Hey, ${message.author}!**\nHere's the current list of the most fresh manga titles on MangaFox 🔥`,
                    url: `${mangaFoxUrl}/directory/new/`,
                    color: 1467591,
                    footer: {
                        icon_url: message.author.displayAvatarURL,
                        text: 'Mori Summer Project'
                    },
                    thumbnail: {
                        url: "https://pbs.twimg.com/profile_images/1758860726/icon_400x400.png"
                    },
                    fields: latestMangaData
                }).setTimestamp()

                return message.channel.send({ embed })  
            } catch (error) {
                return Utils.sendErrorMessage(message, error)
            }
        },

        popular: async (message, args) => {
            try {
                const waitMessage = await Utils.sendWaitMessage(message, 'get', 'Getting the hottest manga titles...')
                let popularMangaData = await Mangafox.getPopular()
                waitMessage.delete()

                popularMangaData = popularMangaData.map((manga, index) => {
                    return {
                        name: `${index + 1}. ${manga.title}`,
                        value: `ID: ${manga.thumbnailUrl.split('/')[5]}\nLink: [${manga.url}](${manga.url})`
                    }
                })

                const embed = new RichEmbed({
                    title: 'Manga Ranks Based on Popularity',
                    description: `**Hey, ${message.author}!**\nHere's the current list of the most popular mangas on MangaFox 🔥`,
                    url: `${mangaFoxUrl}/directory/`,
                    color: 1467591,
                    footer: {
                        icon_url: message.author.displayAvatarURL,
                        text: 'Mori Summer Project'
                    },
                    thumbnail: {
                        url: "https://pbs.twimg.com/profile_images/1758860726/icon_400x400.png"
                    },
                    fields: popularMangaData
                }).setTimestamp()

                return message.channel.send({ embed })  
            } catch (error) {
                return Utils.sendErrorMessage(message, error)
            }
        },

        search: async (message, args, page) => {
            try {
                const [, ...searchQuery] = args
                page = page || 1

                const waitMessage = await Utils.sendWaitMessage(message, 'search')
                let searchResultsData = await Mangafox.search(searchQuery, page)
                waitMessage.delete()

                let indexNumbers = []
                let searchResults = searchResultsData.map((manga, index) => {
                    const entryNumber = (page * 10) - 10 + index + 1
                    indexNumbers.push(entryNumber.toString())
                    return `[${entryNumber}] ${manga.title}\n`
                })

                if(page != 1) searchResults.push('[-] Prev Page\n')
                searchResults.push('[+] Next Page')

                const embed = new RichEmbed({
                    title: 'Mangafox Manga Search',
                    description: `
                    Yo, here's the search result! 👌
                    Type an index number from below to see the details about that specific manga.
                    *Please note that search results may contain fan-made comics (Doujinshi).*\`\`\`\n${searchResults.join('')}\`\`\``,
                    url: `${mangaFoxUrl}/search.php?name_method=cw&name=${encodeURIComponent(searchQuery)}&type=&author_method=cw&author=&artist_method=cw&artist=&genres%5BAction%5D=0&genres%5BAdult%5D=0&genres%5BAdventure%5D=0&genres%5BComedy%5D=0&genres%5BDoujinshi%5D=0&genres%5BDrama%5D=0&genres%5BEcchi%5D=0&genres%5BFantasy%5D=0&genres%5BGender+Bender%5D=0&genres%5BHarem%5D=0&genres%5BHistorical%5D=0&genres%5BHorror%5D=0&genres%5BJosei%5D=0&genres%5BMartial+Arts%5D=0&genres%5BMature%5D=0&genres%5BMecha%5D=0&genres%5BMystery%5D=0&genres%5BOne+Shot%5D=0&genres%5BPsychological%5D=0&genres%5BRomance%5D=0&genres%5BSchool+Life%5D=0&genres%5BSci-fi%5D=0&genres%5BSeinen%5D=0&genres%5BShoujo%5D=0&genres%5BShoujo+Ai%5D=0&genres%5BShounen%5D=0&genres%5BShounen+Ai%5D=0&genres%5BSlice+of+Life%5D=0&genres%5BSmut%5D=0&genres%5BSports%5D=0&genres%5BSupernatural%5D=0&genres%5BTragedy%5D=0&genres%5BWebtoons%5D=0&genres%5BYaoi%5D=0&genres%5BYuri%5D=0&released_method=eq&released=&rating_method=eq&rating=&is_completed=&advopts=1`,
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
                    return mangafoxInterface.info(message, [undefined, searchResultsData.data[selectedIndex].id])
                } else if(response == '-') {
                    return mangafoxInterface.search(message, args, page - 1)
                } else if(response == '+') {
                    return mangafoxInterface.search(message, args, page + 1)
                }
                
            } catch (error) {
                return Utils.sendErrorMessage(message, error)
            }
        },

        info: async (message, args) => {
            try {
                const [, id] = args

                const waitMessage = await Utils.sendWaitMessage(message, 'get', 'Getting your manga info...')
                let mangaData = await Mangafox.getInfo(id)
                waitMessage.delete()

                const embed = new RichEmbed({
                    title: "MangaFox Manga Details",
                    description: `**Hey, ${message.author}!**\nHere's the info on the manga you just requested 💯`,
                    url: mangaData.url,
                    color: 65330,
                    footer: {
                        icon_url: message.author.displayAvatarURL,
                        text: "Mori Summer Project"
                    },
                    thumbnail: {
                        url: "https://pbs.twimg.com/profile_images/1758860726/icon_400x400.png"
                    },
                    image: {
                        url: mangaData.cover
                    },
                    fields: [
                        {
                            name: mangaData.title,
                            value: Utils.truncateString(`
                                **Title:** ${mangaData.title}
                                **Alternate Title(s)**: ${mangaData.altTitle}
                                **Link:** [${mangaData.url}](${mangaData.url})
                                **Genres:** ${mangaData.genre}
                                **Author:** ${mangaData.author}
                                **Artist:** ${mangaData.artist}
                                **Rank:** #${mangaData.rank}
                                **Rating:** ${mangaData.rating}
                                **Release Date:** ${mangaData.releaseDate}
                                **Summary:**
                                {res.summary}
                            `, 1021)
                        }
                    ]
                }).setTimestamp();
    
                return message.channel.send({ embed })
            } catch (error) {
                return Utils.sendErrorMessage(message, error)
            }
        }
    }

    return mangafoxInterface
}

module.exports.config = {
    aliases: {
        command: ['m'],
        methods: {
            index: ['m']
        }
    }
}