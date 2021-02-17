const chai = require('chai')
const chaiHttp = require('chai-http')
const config = require('./config')
const app = require('./server')(config.host, config.port)
const suppressLogs = require('mocha-suppress-logs')

chai.use(chaiHttp);
chai.should();

describe("Test", () => {
    suppressLogs();
    describe("Alap todo fetch tesztelése", () => {
        it("Összes todo lekérése", (done) => {
             chai.request(app)
                 .get('/api/todos')
                 .end((err, res) => {
                     res.should.have.status(200)
                     res.body.length.should.equal(1)
                     done();
                });
        });
    });
    describe("Todo fetch id alapján tesztelése", () => {
        it("id=0 todo lekérése", (done) => {
             chai.request(app)
                 .get('/api/todos/0')
                 .end((err, res) => {
                     res.should.have.status(200)
                     done();
                });
        }),
        it("Nem létező todo lekérése", (done) => {
            chai.request(app)
                .get('/api/todos/98')
                .end((err, res) => {
                    res.should.have.status(404)
                    done();
               });
       });
    });
    describe("Todo törlés tesztelése", () => {
        it("id=0 todo törlése", (done) => {
             chai.request(app)
                 .delete('/api/todos/0')
                 .end((err, res) => {
                     res.should.have.status(202)
                     done();
                });
        })
    });
    describe("Todo létrehozás tesztelése", () => {
        it("Új todo hozzáadása", (done) => {
             chai.request(app)
                 .put('/api/todos')
                 .set('content-type', 'application/json')
                 .send({description: "Walk the dog", time: 420})
                 .end((err, res) => {
                     res.should.have.status(201)
                     res.body.id.should.equal(0)
                     res.body.description.should.equal("Walk the dog")
                     res.body.time.should.equal(420)
                     done();
                });
        })
    });
    describe("Todo módosítás tesztelése", () => {
        it("id=0 todo módosítása", (done) => {
             chai.request(app)
                 .patch('/api/todos/0')
                 .set('content-type', 'application/json')
                 .send({description: "Walk and feed the dog", time: 480})
                 .end((err, res) => {
                     res.should.have.status(201)
                     res.body.id.should.equal(0)
                     res.body.description.should.equal("Walk and feed the dog")
                     res.body.time.should.equal(480)
                     res.body.complete.should.equal(false)
                     done();
                });
        }),
        it("Nem létező todo módosítása", (done) => {
            chai.request(app)
                .patch('/api/todos/56')
                .set('content-type', 'application/json')
                .send({complete: true})
                .end((err, res) => {
                    res.should.have.status(404)
                    done();
               });
       })
    });
});