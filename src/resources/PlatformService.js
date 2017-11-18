const commons = require('developmentsoftware-api-commons');
const ModelAbstractService = commons.model;
const uuidV4 = require('uuid/v4');

class PlatformService extends ModelAbstractService {

    constructor(storage) {
        super('platforms', storage);
    }

    modelMap(data, model) {
        return {
            id: data.id || model.id || uuidV4(),
            name: data.name || model.name,
            type: data.type || model.type,
        }
    }
}

module.exports = new PlatformService(commons.storage);