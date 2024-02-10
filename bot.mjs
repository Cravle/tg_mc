import dotenv from 'dotenv'
import fs from 'fs'
import {
  Telegraf,
} from 'telegraf'

dotenv.config()

export class Bot {
  groupIdState = new Map()

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN)
  }
  sendMessage(name) {
    console.log(this.groupIdState, 'groupIdState message')
    this.groupIdState.forEach((value, key) => {
      if (value === 'active') {
        this.bot.telegram.sendMessage(key, `${name} just joined to the minecraft server \n\`IP: 49.12.127.213:25788\``, {
          parse_mode: 'Markdown'
        })
      }
    })
  }

  saveGroupInLocalFile() {
    const data = JSON.stringify(Array.from(this.groupIdState.entries()))
    fs.writeFileSync('groupIdState.json', data)
  }

  loadGroupFromLocalFile() {
    try {
      const data = fs.readFileSync('groupIdState.json')
      const parsedData = JSON.parse(data)
      this.groupIdState = new Map(parsedData)
    } catch (error) {
      console.log(error, 'error')
    }
  }

  bootstrap() {
    this.loadGroupFromLocalFile()
    this.bot.start((ctx) => {
      console.log(ctx.chat, 'ctx')

      if (ctx.chat.type === 'group') {

        this.groupIdState.set(ctx.chat.id, 'active')
        console.log(this.groupIdState, 'groupIdState')
      }
    })
    this.bot.launch()

    process.once('SIGINT', () => {
      this.bot.stop('SIGINT')
      this.saveGroupInLocalFile()
  })
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
  }


}