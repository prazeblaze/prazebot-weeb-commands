module.exports = (TOOLS, MODULES, CONSTANTS) => {
    const MAL = TOOLS.FUNCTIONS.MyAnimeList

    const MALInterface = {
        index: async (message, args) => {
            let username = args[0]

            let profilePage = await MAL.getProfilePage(username)
            if(profilePage === false) return message.channel.send('User not found.')

        }
    }

    return MALInterface
}

module.exports.config = {
    aliases: {
        command: [],
        methods: {}
    }
}