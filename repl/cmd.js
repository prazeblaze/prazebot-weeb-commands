module.exports = (TOOLS, MODULES, CONSTANTS) => {
    const chalk = MODULES.CHALK
    const repl = TOOLS.INSTANCE.REPL
    const { table } = MODULES.TABLE

    repl
        .command('cmd', 'Shows all commands')
        .action((args, done) => {
            const commands = Object.keys(TOOLS.INTERFACES.METHODS)
            let data = commands.map(key => [
                key, 
                chalk.dim(TOOLS.INTERFACES.CONFIGS[key].aliases.command.join(', ') || '-'), 
                TOOLS.INTERFACES.CONFIGS[key].description || chalk.dim('-')
            ])
            data.unshift([chalk.bold('Command'), chalk.bold('Aliases'), chalk.bold('Description')])

            console.log(table(data, {
                drawHorizontalLine: (index, size) => {
                    return index === 0 || index === 1 || index === size;
                }
            }))

            done()
        })
}