module.exports = (TOOLS, MODULES, CONSTANTS) => {
    const os = MODULES.OS
    const client = TOOLS.CLIENT
    const chalk = MODULES.CHALK
    const moment = MODULES.MOMENT
    const repl = TOOLS.INSTANCE.REPL
    const package = CONSTANTS.PACKAGE

    repl
        .command('info', 'Shows information about the bot')
        .action((args, done) => {
            const printHeader = name => {
                const title = '  ' + name + '  '
                const lines = '='.repeat(title.length)
                console.log(chalk.bold(lines))
                console.log(chalk.bold(title))
                console.log(chalk.bold(lines))
                console.log('')
            }
            const print = (caption, value) => console.log('   ', caption.padEnd(25, ' ') + (value !== null ? ': ' + chalk.bold(value) : ''))
            const cpu = process.cpuUsage().system / 1024 / 1024

            printHeader('Bot Information')
            print('App Name', CONSTANTS.APP_NAME)
            print('Username', CONSTANTS.USERNAME)
            print('Prefix', CONSTANTS.PREFIX)
            console.log('')
            print('CPU Usage', (Math.round(cpu * 100) / 100) + '%')
            print('Memory Usage', (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + ' MB')
            print('OS', (os.platform()) + ' (' + (os.type()) + ')')
            print('Hostname', os.hostname())
            console.log('')
            print('Users', client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString() + ' user(s)')
            print('Uptime', moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]'))
            print('Servers', client.guilds.size + ' server(s)')
            console.log('')
            print('Node Version', process.version)
            print('Bot Version', package.version)
            print('Library', 'discord.js v' + package.dependencies['discord.js'].replace('^', ''))
            console.log('')
            done()
        })
}