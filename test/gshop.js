assert = require('assert')
var chai = require('chai')
    , chaiHttp = require('chai-http');

var expect = chai.expect;

chai.use(chaiHttp);

async function addCartLineRequest(app, product) {
    await chai.request(app)
        .post("/carts/cartLine")
        .auth('admin', 'admin')
        .send({
            userId: "admin",
            productTitle: product.title,
            quantity: getRandomInt(10),
            sellerId: product.sellerId
        })
}

async function removeCartLineRequest(app) {
    await chai.request(app)
        .delete("/carts/cartLine")
        .auth('admin', 'admin')
        .send({
            userId: "admin",
            No : "1"
        })
}

describe('get all products by category', async () => {

    const app = "http://localhost:8080"

    it('should return IT products', async () => {
        const response = await sendProductRequest(app, "IT");
        expect(response.body.length).to.be.greaterThan(0)
    });

    it('should create  cart/order  with it products from all categories ', async () => {

        const responseCategory = await chai.request(app)
            .get("/category")
            .send();

        for( let category of responseCategory.body){
            const response = await sendProductRequest(app, category.name)

            for(let product of response.body) {
                await addCartLineRequest(app, product);
            }

            await removeCartLineRequest(app)

            const confirmResponse = await chai.request(app)
                .post("/carts/confirm")
                .auth('admin', 'admin')
                .send()

            console.log(confirmResponse.body)
        }



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