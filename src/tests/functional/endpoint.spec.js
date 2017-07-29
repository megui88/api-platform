const client = require('mongodb');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../../app');
const storage = require('../../resources/StorageService');
chai.use(chaiHttp);

describe('/GET not found', () => {
    it('it should GET other endpoint', function (done) {
        chai.request(server)
            .get('/types')
            .end((err, res) => {
                expect(res).have.status(404);
                expect(err.message).to.be.eql('Not Found');
                done();
            });
    });
});


describe('/GET platforms', () => {
    it('it should GET all platforms', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        chai.request(server)
            .get('/platforms')
            .end((err, res) => {
                expect(res).have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(2);
                done();
            });
    });

    it('it should GET one platform', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        chai.request(server)
            .get('/platforms/one-id-fake')
            .end((err, res) => {
                expect(res).have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.id).to.be.a('string');
                done();
            });
    });

    it('it should POST the platform', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        chai.request(server)
            .post('/platforms')
            .send({
                name: 'MyPlatform',
                type: 'example'
            })
            .end((err, res) => {
                expect(res).have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body.id).to.be.a('string');
                expect(res.body.name).to.be.eql('MyPlatform');
                expect(res.body.type).to.be.eql('example');
                done();
            });
    });

    it('it should PATH the platform', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        chai.request(server)
            .patch('/platforms/one-id-fake')
            .send({
                name: 'The Bin Platform'
            })
            .end((err, res) => {
                expect(res).have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.id).to.be.eql('one-id-fake');
                expect(res.body.name).to.be.eql('The Bin Platform');
                done();
            });
    });

    it('it should PUT the platform', function (done) {
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        chai.request(server)
            .put('/platforms/one-id-fake')
            .send({
                name: 'The Bin Platform'
            })
            .end((err, res) => {
                expect(res).have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.id).to.be.eql('one-id-fake');
                expect(res.body.name).to.be.eql('The Bin Platform');
                done();
            });
    });
});


describe('/GET platforms fail', () => {
    it('it should GET all the platforms', function (done) {
        storage.db = null;
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(failObject);
        chai.request(server)
            .get('/platforms')
            .end((err, res) => {
                expect(res).have.status(500);
                expect(err.message).to.be.eql('Internal Server Error');
                done();
            });
    });
    it('it should GET force prod env', function (done) {
        storage.db = null;
        server.set('env', 'prod');
        this.sandbox.stub(client.MongoClient, 'connect').callsFake(failObject);
        chai.request(server)
            .get('/platforms')
            .end((err, res) => {
                expect(res).have.status(500);
                expect(err.message).to.be.eql('Internal Server Error');
                done();
            });
    });
});


// Mock Objects
function successObject() {

    return new Promise((resolv) => {
        resolv({
                collection: () => {
                    return new Promise((resolv) => {
                        resolv({
                            insertMany: (object) => {
                                return new Promise((resolv) => {
                                    resolv({
                                        ops: object
                                    })
                                });
                            },
                            updateOne: (object) => {
                                return new Promise((resolv) => {
                                    resolv({
                                        ops: object
                                    })
                                });
                            },
                            find: () => {
                                return {
                                    toArray: () => {
                                        return new Promise((resolv) => {
                                            resolv([
                                                {
                                                    id: 'one-id-fake',
                                                    name: 'YouPlatform',
                                                    type: 'social',
                                                },
                                                {
                                                    id: 'other-id-fake',
                                                    name: 'OtherPlatform',
                                                    type: 'e-commerce',
                                                }
                                            ]);
                                        });
                                    }
                                }
                            }
                        });
                    });
                }
            }
        );
    });
}

// Mock Objects
function failObject() {

    return new Promise((resolv) => {
        resolv({
                collection: () => {
                    return new Promise((resolv) => {
                        resolv({
                            find: () => {
                                return {
                                    toArray: () => {
                                        return new Promise((resolv, reject) => {
                                            reject({
                                                code: 500,
                                                message: 'Some problem!'
                                            });
                                        });
                                    }
                                }
                            }
                        });
                    });
                }
            }
        );
    });
}
