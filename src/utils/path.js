import path from "path";

const ROOT_PATH = path.resolve();

const SRC_PATH = path.join(ROOT_PATH, "src");

const FRONT_PATH = path.join(ROOT_PATH, "front");

const paths = {
    root: ROOT_PATH,
    src: SRC_PATH,
    front: FRONT_PATH,
    public: path.join(SRC_PATH, "public"),
    views: path.join(SRC_PATH, "views"),
    js: path.join(FRONT_PATH, "js")
}

export default paths;