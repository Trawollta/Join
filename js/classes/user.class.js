class User {
    name;
    email;
    phone;
    color;
    canLogin;
    id;

    constructor(name, email, phone, color, id) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.canLogin = false;

        if (color != undefined) {
            this.color = color;
        } else {
            this.color = getColor(name);
        }

        if (id != undefined) {
            this.id = id;
        } else {
            this.id = new Date().getTime();
        }

    }
    setName(name) {
        this.name = name;
    }

    setPhone(phone) {
        this.phone = phone;
    }

    setEmail(email) {
        this.email = email;
    }

    // Methode zum Serialisieren des Objekts in JSON
    toJSON() {
        return {
            name: this.name,
            email: this.email,
            phone: this.phone,
            color: this.color,
            canLogin: this.canLogin,
            id: this.id,
        };
    }

    // Statische Methode zum Parsen von JSON in ein Objekt der Klasse
    static fromJSON(json) {
        return new User(json.name, json.email, json.phone, json.color, json.id);
    }
}