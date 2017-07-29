const expect = require('chai').expect;
const storage = require('developmentsoftware-api-commons').storage;
const platform = require('../../resources/PlatformService');
const Promise = require('bluebird');

describe('The platform service happy pass', () => {

    it('try get all platforms ', function (done) {
        this.sandbox.stub(storage, 'getCollection').callsFake(findObject);
        platform.all()
            .then(data => {
                expect(data.length).to.be.equal(2);
                done();
            });
    });

    it('try get one platform ', function (done) {
        this.sandbox.stub(storage, 'getCollection').callsFake(updatedObject);
        const promise = platform.get('one-id-fake');
        promise.then(data => {
            expect(data.id).to.be.equal('one-id-fake');
            done();
        });
    });

    it('try get one platform but not exist', function (done) {
        this.sandbox.stub(storage, 'getCollection').callsFake(notFoundObject);
        platform.get('one-id-fake')
            .then(() => {
                done();
                throw new Error('Check this!');
            })
            .catch(err => {
                expect(err.message).to.be.equal('Not Found');
                done();
            });
    });

    it('try create one platform', function (done) {
        this.sandbox.stub(storage, 'getCollection').callsFake(insertObject);
        const promise = platform.create(
            {
                name: 'newPlatform',
                type: 'example'
            });
        promise
            .then(data => {
                expect(data.id).to.be.a('string');
                expect(data.type).to.be.equal('example');
                expect(data.name).to.be.equal('newPlatform');
                done();
            });
    });

    it('try update name ', function (done) {
        this.sandbox.stub(storage, 'getCollection').callsFake(updatedObject);
        let updateObject = {
            name: 'goodPlatform'
        };
        const promise = platform.update('one-id-fake', updateObject);
        promise
            .then(data => {
                expect(data.id).to.be.a('string');
                expect(data.name).to.be.equal('goodPlatform');
                expect(data.type).to.be.equal('exampleType');
                done();
            });
    });

    it('try update type ', function (done) {
        this.sandbox.stub(storage, 'getCollection').callsFake(updatedObject);
        let updateObject = {
            type: 'e-commerce'
        };
        const promise = platform.update('one-id-fake', updateObject);
        promise
            .then(data => {
                expect(data.id).to.be.a('string');
                expect(data.name).to.be.equal('myPlatform');
                expect(data.type).to.be.equal('e-commerce');
                done();
            });
    });

});

describe('The platform service fail', () => {

    it('try get all platforms ', function (done) {
        this.sandbox.stub(storage, 'getCollection').callsFake(failObject);
        platform.all()
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
        this.sandbox.stub(storage, 'getCollection').callsFake(failObject);
        platform.get('one-id-fake')
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
        this.sandbox.stub(storage, 'getCollection').callsFake(failObject);
        const promise = platform.create(
            {
                name: 'onePlatform',
                type: 'oneType'
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
        this.sandbox.stub(storage, 'getCollection').callsFake(failObject);
        let updateObject = {
            name: 'myPlatform',
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
function findObject() {
    return new Promise((resolv) => {
        resolv({
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

function insertObject() {
    return new Promise((resolv) => {
        resolv({
            insertMany: (object) => {
                return new Promise((resolv) => {
                    resolv({
                        ops: object
                    })
                });
            }
        });
    });
}

function updatedObject() {
    return new Promise((resolv) => {
        resolv({
            find: () => {
                return {
                    toArray: () => {
                        return new Promise((resolv) => {
                            resolv([
                                {
                                    id: 'one-id-fake',
                                    name: 'myPlatform',
                                    type: 'exampleType'
                                }
                            ]);
                        });
                    }
                }
            },
            updateOne: (object) => {
                return new Promise((resolv) => {
                    resolv({
                        ops: object
                    })
                });
            }
        });
    });
}


function notFoundObject() {

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
        }
    );
}

function failObject() {

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


function promiseReject() {

    return new Promise((resolv, reject) => {
        reject({
            code: 500,
            message: 'Some problem!'
        });
    });
}