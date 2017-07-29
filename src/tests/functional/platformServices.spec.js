const client = require('mongodb');

const expect = require('chai').expect;

const storage = require('../../resources/StorageService');

const platform = require('../../resources/PlatformService');

const Promise = require('bluebird');

describe('The platform service happy pass', () => {

    it('try get all platforms ', function (done) {

        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        storage.db = null;
        storage.getDB();

        const promise = platform.all();

        promise.then(data => {
            expect(data.length).to.be.equal(2);
            done();
        });
    });

    it('try get one platform ', function (done) {

        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        storage.db = null;
        storage.getDB();

        const promise = platform.get('one-id-fake');

        promise.then(data => {
            expect(data.id).to.be.equal('one-id-fake');
            done();
        });
    });

    it('try get one platform but not exist', function (done) {

        this.sandbox.stub(client.MongoClient, 'connect').callsFake(notFoundObject);
        storage.db = null;
        storage.getDB();

        const promise = platform.get('one-id-fake');

        promise
            .then(() => {
                done();
                throw new Error('Check this!');
            })
            .catch(err => {
                expect(err.message).to.be.equal('Not Found');
                done();
            });
    });

    it('try update name ', function (done) {

        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        storage.db = null;
        storage.getDB();

        let updateObject = {
             name: 'newName'
        };

        const promise = platform.update('one-id-fake', updateObject);

        promise.then(data => {
            expect(data.id).to.be.a('string');
            expect(data.type).to.be.equal('social');
            expect(data.name).to.be.equal('newName');
            done();
        });
    });

    it('try update type ', function (done) {

        this.sandbox.stub(client.MongoClient, 'connect').callsFake(successObject);
        storage.db = null;
        storage.getDB();

        let updateObject = {
            type: 'e-commerce'
        };

        const promise = platform.update('one-id-fake', updateObject);

        promise.then(data => {
            expect(data.id).to.be.a('string');
            expect(data.name).to.be.equal('YouPlatform');
            expect(data.type).to.be.equal('e-commerce');
            done();
        });
    });

})
;

describe('The platform service fail', () => {


    it('try get all platforms ', function (done) {

        this.sandbox.stub(client.MongoClient, 'connect').callsFake(failObject);
        storage.db = null;
        storage.getDB();

        const promise = platform.all();

        promise
            .then(() => {
                done();
                throw new Error('Check this!');
            })
            .catch(err => {
                expect(err.message).to.be.equal('Some problem!');
                done();
            });
    });

    it('try get one platform ', function (done) {

        this.sandbox.stub(client.MongoClient, 'connect').callsFake(failObject);
        storage.db = null;
        storage.getDB();

        const promise = platform.get('one-id-fake');

        promise
            .then(() => {
                done();
                throw new Error('Check this!');
            })
            .catch(err => {
                expect(err.message).to.be.equal('Some problem!');
                done();
            });
    });

    it('try create one platform ', function (done) {

        this.sandbox.stub(client.MongoClient, 'connect').callsFake(failObject);
        storage.db = null;
        storage.getDB();

        const promise = platform.create(
            {
                name: 'YouPlatform',
                type: 'social',
            });

        promise
            .then(() => {
                done();
                throw new Error('Check this!');
            })
            .catch(err => {
                expect(err.message).to.be.equal('Some problem!');
                done();
            });
    });

    it('try update one platform ', function (done) {

        this.sandbox.stub(client.MongoClient, 'connect').callsFake(failObject);
        storage.db = null;
        storage.getDB();

        let updateObject = {
            name: 'newName'
        };

        const promise = platform.update('one-id-fake', updateObject);

        promise
            .then(() => {
                done();
                throw new Error('Check this!');
            })
            .catch(err => {
                expect(err.message).to.be.equal('Some problem!');
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

function notFoundObject() {

    return new Promise((resolv) => {
        resolv({
                collection: () => {
                    return new Promise((resolv) => {
                        resolv({
                            find: () => {
                                return {
                                    toArray: () => {
                                        return new Promise((resolv) => {
                                            resolv([]);
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

function failObject() {

    return new Promise((resolv) => {
        resolv({
                collection: () => {
                    return new Promise((resolv) => {
                        resolv({
                            insertMany: promiseReject,
                            updateOne: promiseReject,
                            find: () => {
                                return {
                                    toArray: promiseReject
                                }
                            }
                        });
                    });
                }
            }
        );
    });
}

function promiseReject() {

    return new Promise((resolv, reject) => {
        reject({
            code: 500,
            message: 'Some problem!'
        });
    });
}