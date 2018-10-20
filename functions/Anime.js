module.exports = (TOOLS, MODULES, CONSTANTS) => {
    const axios = MODULES.AXIOS
    const qs = MODULES.QUERYSTRING
    const host = CONSTANTS.URL.KITSU_API

    const AnimeFunction = {
        sendRequest: (options) => {
            options = qs.stringify(options)
            return axios.get(host + '/anime?' + options)
        },

        getPopular: (limit, page) => {
            page = page || 1
            let options = {
                'sort': 'popularityRank',
                'page[limit]': limit,
                'page[offset]': (limit * page) - limit
            }
            return AnimeFunction.sendRequest(options)
        },

        search: (query, page) => {
            page = page || 1
            let options = {
                'filter[text]': encodeURIComponent(query),
                'page[limit]': 10,
                'page[offset]': (10 * page) - 10
            }
            return AnimeFunction.sendRequest(options)
        },

        getInfo: (id) => {
            let options = {
                'filter[id]': id,
                'include': 'productions.company,genres'
            }
            return AnimeFunction.sendRequest(options)
        }
    } 

    return AnimeFunction
}