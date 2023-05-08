export default class RunLog {
    private constructor() { }
    public static output(...msg: string[]) {
        console.log(new Date().toLocaleString(), msg);
    }
    public static assert(...msg: string[]): void {
        console.assert(false, "[%s] %s", new Date().toLocaleString(), msg);
    }
}
