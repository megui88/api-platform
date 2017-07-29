const Promise = require('bluebird');
const storage = require('developmentsoftware-api-commons').storage;
const uuidV4 = require('uuid/v4');

class PlatformService {

    constructor(storage) {
        this.COLLECTION = 'platforms';
        this.storage = storage;
    }

    all() {
        return new Promise((resolv, reject) => {
            this.storage.getCollection(this.COLLECTION)
                .then(col => {
                    col.find({}).toArray()
                        .then(items => {
                            resolv(items.map(this.modelMap))
                        })
                        .catch(reject)
                })
                .catch(reject)
        })
    }

    get(id) {
        return new Promise((resolv, reject) => {
            this.find({id: id})
                .then(data => {
                    if (0 >= data.length) {
                        reject({
                            status: 404,
                            message: 'Not Found'
                        })
                    }
                    resolv(data[0])

                })
                .catch(reject)
        });
    }

    find(query) {

        return new Promise((resolv, reject) => {
            this.storage.getCollection(this.COLLECTION)
                .then(col => {
                    col.find(query)
                        .toArray()
                        .then(items => {
                            resolv(items.map(this.modelMap));
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    create(data) {
        return new Promise((resolv, reject) => {
            this.bulkCreate([data])
                .then(data => {
                    resolv(data[0])
                })
                .catch(reject);
        });

    }

    update(id, data) {
        return new Promise((resolv, reject) => {
            this.get(id)
                .then(platform => {
                    let object = this.modelMap(data, platform);
                    this.storage.getCollection(this.COLLECTION).then(col => {
                        col.updateOne({id: id}, object)
                            .then(() => {
                                resolv(this.modelMap(object));
                            })
                            .catch(reject);
                    });
                })
                .catch(reject);
        });
    }

    bulkCreate(data) {
        let platforms = data.map(this.modelMap);

        return new Promise((resolv, reject) => {
            this.storage.getCollection(this.COLLECTION)
                .then(col => {
                    col.insertMany(platforms)
                        .then(items => {
                            resolv(items.ops.map(item => {
                                return this.modelMap(item);
                            }));
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    modelMap(data, model) {
        return {
            id: data.id || model.id || uuidV4(),
            name: data.name || model.name,
            type: data.type || model.type,
        }
    }
}

module.exports = new PlatformService(storage);