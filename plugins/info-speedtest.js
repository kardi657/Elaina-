import cp from 'child_process'
import { promisify } from 'util'
let exec = promisify(cp.exec).bind(cp)
let handler = async (m) => {
    let o
    try {
        o = await exec('python3 speed.py')
    } catch (e) {
        o = e
    } finally {
        let { stdout, stderr } = o
        if (stdout.trim()) m.reply(stdout)
        if (stderr.trim()) m.reply(stderr)
    }
}
handler.help = ['testspeed']
handler.tags = ['info']
handler.command = /^(testspeed|speedtest)$/i

export default handler