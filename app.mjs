import fastify from "fastify";
import { Bot } from "./bot.mjs";

const initRoutes = (app) => {
  app.app.get("/sendTgMessage/:name", async (request, reply) => {
    const {name} = request.params

    if(!name) return reply.code(400).send({error: 'Name is required'})

    console.log(name, 'name')
    app.bot.sendMessage(name);
    return { hello: "world" };
  })
}


class App {
  
  constructor() {
    this.bot = new Bot()
    this.app = fastify({
      logger: true,
    });
  }

  start() {
    initRoutes(this)
    this.bot.bootstrap()

    this.app.listen(3000, (err, address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
      this.app.log.info(`server listening on ${address}`);
    })

    this.app.addHook('onClose', (instance, done) => {
      this.bot.saveGroupInLocalFile();
      done();
    })
  }
  
}

const app = new App()
app.start()