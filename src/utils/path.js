import path from "path";

const ROOT_PATH = path.resolve();

// Ruta 'src' del proyecto.

const SRC_PATH = path.join(ROOT_PATH, "src");

const paths = {
    root: ROOT_PATH,
    src: SRC_PATH,
    public: path.join(SRC_PATH, "public"),
    views: path.join(SRC_PATH, "views")
}

export default paths;