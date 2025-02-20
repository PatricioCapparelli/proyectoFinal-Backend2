import { Command } from "commander";

const program = new Command();
program.option('--port <port>', "Puerto de la app")
    .option("--mode, -m <mode>", "Entorno de la app")
    .parse();

export default program;