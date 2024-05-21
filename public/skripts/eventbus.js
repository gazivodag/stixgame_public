class GameEventBus {

    runnables = [];

    constructor() {
    }

    on(eventName, runnable)
    {
        console.log(`eb: on ${eventName}`)
        this.runnables.push({"eventName": eventName, "runnable": runnable, "once": false});
        return this.runnables.length - 1;
    }

    once(eventName, runnable)
    {
        console.log(`eb: on ${eventName}`)
        this.runnables.push({"eventName": eventName, "runnable": runnable, "once": true});
    }

    unsubscribe(int)
    {
        this.runnables.splice(int, 1);
    }

    post(eventName, eventData)
    {
        console.log(`eb: posted ${eventName}`)
        var filteredRunnables = this.runnables.filter(subscriber => subscriber.eventName === eventName);
        filteredRunnables.forEach(subscriber => subscriber.runnable(eventData));
        this.runnables = this.runnables.filter(subscriber => (subscriber.eventName !== eventName) || (subscriber.eventName === eventName && subscriber.once === false));
    }

}

eventBus = new GameEventBus();
console.log("eventBus initialized")