import { EventEmitter } from "node:events";

class EventNotify {
    private emitter = new EventEmitter();
    private events: string[] = [];
    public addListener(name: string, onEvent: (...args: any[]) => void) {
        if (this.events.includes(name)) return;
        this.events.push(name);
        this.emitter.on(name, (...args: any[]) => {
            onEvent(...args);
        });
    }
    public removeListener(name: string, onEvent: (...args: any[]) => void) {
        const index = this.events.indexOf(name);
        if (index < 0) return;
        this.events.splice(index, 1);
        this.emitter.off(name, onEvent);
    }

    public fireEvent(name: string, ...args: any[]) {
        this.emitter.emit(name, ...args);
    }
}

const inst = new EventNotify();
export default inst;