assert = require('assert')
var chai = require('chai')
    , chaiHttp = require('chai-http');

var expect = chai.expect;

chai.use(chaiHttp);

describe('get all products by category', async () => {

    const app = "http://localhost:8080"

    it('should return IT products', async () => {
        const response = await sendProductRequest(app, "IT");
        expect(response.body.length).to.be.greaterThan(0)
    });

    it('should create cart', async () => {

        const response = await sendProductRequest(app, 'IT')

        for(let product of response.body) {
            console.log(product)
            console.log("------\n\n")

            await chai.request(app)
                .post("/carts/cartLine")
                .auth('admin', 'admin')
                .send({
                    cartId: "admin",
                    productTitle: product.title,
                    quantity: getRandomInt(10),
                    sellerId:product.sellerId
                })
        }

        const confirmResponse = await chai.request(app)
            .post("/carts/confirm")
            .auth('admin', 'admin')
            .send()

        console.log(confirmResponse.body)

    })

});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

async function sendProductRequest(app, category) {
    return chai.request(app)
        .get(`/products/byCategory/${category}`)
        .auth('admin', 'admin')
        .send();
}