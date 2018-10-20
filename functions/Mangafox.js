module.exports = (TOOLS, MODULES, CONSTANTS) => {
    const $ = MODULES.CHEERIO
    const axios = MODULES.AXIOS
    const qs = MODULES.QUERYSTRING
    const { Parser } = MODULES.MANGAPARSER
    const mangaFoxUrl = CONSTANTS.URL.MANGAFOX

    const mangafoxFunction = {
        getLatestUpdates: async () => {
            const { mangas } = await Parser.getLatestUpdatesList('mangafox', 1)

            return mangas.slice(0, 10)
        },

        getRecents: async () => {
            try {
                const { data } = await axios.get(mangaFoxUrl + '/directory/new')
                let list = []

                $(data).find('.manga_text .title').slice(0, 10).each((index, element) => {
                    let el = $(element)
                    list.push({
                        id: el.attr('rel'),
                        title: el.text(),
                        href: 'http:' + el.attr('href')
                    })
                })

                return list
            } catch (error) {
                throw error
            }
        },

        getPopular: async () => {
            const { mangas } = await Parser.getPopularMangaList('mangafox', 1)

            return mangas.slice(0, 10)
        },

        search: async (query, page) => {
            page = page || 1
            const { mangas } = await Parser.searchManga('mangafox', query, page)

            return mangas
        },

        getInfo: async (id) => {
            const { data } = await axios.post(mangaFoxUrl + '/ajax/series.php', qs.stringify({ sid: id }))
            if (!data) {
                return data
            }

            const mangaInfo = {
                title: data[0],
                altTitle: data[1],
                url: mangaFoxUrl + '/manga/' + data[0].toLowerCase().replace(/\W+/g, '_'),
                genre: data[2],
                author: data[3],
                artist: data[4],
                rank: data[5],
                rating: data[7],
                releaseDate: data[8],
                summary: data[9].replace(/&quot;/g,' ').replace(/<br \/>/g,'').replace(/\n/g, ''),
                cover: data[10]
            }
            return mangaInfo
        }
    }

    return mangafoxFunction
}