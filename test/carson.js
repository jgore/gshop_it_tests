assert = require('assert')
var chai = require('chai')
    , chaiHttp = require('chai-http');

var expect = chai.expect;

chai.use(chaiHttp);

describe('car ', async () => {

    const app = "http://localhost:8082"

    it('should create car', async () => {
        car = {
            make: "BMW",
            model: "E90",
            year: 2011,
            course: 0
        }

        const responseCategory = await chai.request(app)
            .post("/car")
            .auth("admin", "admin")
            .send(car);
    })

    it('should get car', async () => {

        const responseCar = await chai.request(app)
            .get("/car")
            .auth("admin", "admin")
            .send();

    })

    it('should add routes to car', async () => {

        const responseCar = await chai.request(app)
            .get("/car")
            .auth("admin", "admin")
            .send();

        let No = responseCar.body.No
        var times = 100;

        for( var i=0; i < times; i++){

            let route = {
                from: "Wroclaw",
                to: "Katowice",
                distance: 200
            }

            const addRoute = await chai.request(app)
                .post("/car/route")
                .auth("admin", "admin")
                .send(route);

            const responseCarAfterRouteAdd = await chai.request(app)
                .get("/car")
                .auth("admin", "admin")
                .send();
        }


    })


});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

