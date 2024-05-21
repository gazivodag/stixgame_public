class Player {
    name;
    location;
    destination;

    constructor(name, location)
    {
        this.name = name;
        this.location = location;
    }

    getName()
    {
        return this.name;
    }

    getLocation()
    {
        return this.location;
    }

    setLocation(pos)
    {
        this.location = pos;
    }

    getDestination()
    {
        return this.destination;
    }

    setDestination(pos)
    {
        this.destination = pos;
    }
}

module.exports = Player;