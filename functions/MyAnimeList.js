module.exports = (TOOLS, MODULES, CONSTANTS) => {
    const $ = MODULES.CHEERIO
    const axios = MODULES.AXIOS
    const MALUrl = CONSTANTS.URL.MAL

    const myAnimeListFunction = {
        getProfilePage: (username) => {
            const { data: profilePage } = axios.get(MALUrl + '/profile/' + username)

            let isNotFound
            $(profilePage).find('#content > div > p').each((index, element) => {
                isNotFound = $(element)
            })
            if (isNotFound === 'This page doesn\'t exist.') return false

            return profilePage
        }
    }

    return myAnimeListFunction
}