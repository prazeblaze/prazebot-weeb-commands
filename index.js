'use strict'
const MODULES = require('./config/modules')

function PrazeBotWeebCommands (TOOLS) {
    const path = MODULES.PATH
    const { load } = TOOLS.LOADER
    const extend = MODULES.DEEPEXTEND

    const interfacePath = path.join(__dirname, '/interfaces')
    const functionPath = path.join(__dirname, '/functions')

    const NEW_FUNCTIONS = load(TOOLS, {
        overrideModules: MODULES,
        options: { cwd: functionPath }
    })
    TOOLS.FUNCTIONS = extend(TOOLS.FUNCTIONS, NEW_FUNCTIONS)

    const NEW_INTERFACES = {
        METHODS: load(TOOLS, {
            overrideModules: MODULES,
            options: { cwd: interfacePath }
        }), 
        CONFIGS: load(TOOLS, {
            key: 'config',
            options: { cwd: interfacePath }
        }) 
    }
    TOOLS.INTERFACES = extend(TOOLS.INTERFACES, NEW_INTERFACES)

    return {
        INTERFACES: NEW_INTERFACES,
        FUNCTIONS: NEW_FUNCTIONS
    }
}

module.exports = PrazeBotWeebCommands