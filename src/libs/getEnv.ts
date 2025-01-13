type Env = "phone" | "pc";

function getEnv() {
    const width = window.innerWidth;
    let env: Env;
    if (width < 768) {
        env = "phone";
    } else {
        env = "pc";
    }
    return env;
}

export default getEnv;