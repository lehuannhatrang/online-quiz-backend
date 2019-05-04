import { Schema, Types } from 'mongoose';
import { UserActionModel } from "../models";
import diff from 'deep-diff';

function createSchema(schemaObject, versionKey, collection) {
    schemaObject = {
        ...schemaObject,
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: Date,
        createdBy: { type: Schema.ObjectId, ref: 'User'},
        updatedBy: { type: Schema.ObjectId, ref: 'User'},
    }
    const schema = new Schema(schemaObject, {versionKey, collection});
    schema.virtual('id').get(function () {
        return this._id.toString();
    });

    schema.set('toJSON', { virtuals: true });
    schema.set('toObject', { virtuals: true });

    schema.statics.list = async function (populate, select) {
        let result = this.find({});
        if (populate) {
            populate.forEach(i => result.populate(i))
        }
        if (select) {
            result.select(select);
        }
        result = await result.exec();
        return result ? result : []
    }

    // Build CRUD
    schema.statics.getById = async function (id, populate) {
        let result = this.findOne({_id: id});
        if (populate) {
            if (Array.isArray(populate)) {
                populate.forEach(i => result.populate(i))
            } else {
                result.populate(populate);
            }
        }
        result = await result.exec();
        return result ? result.toObject() : null;
    }
    schema.statics.getById = async function (id, populate,select) {
        let result = this.findOne({_id: id});
        if (populate) {
            if (Array.isArray(populate)) {
                populate.forEach(i => result.populate(i))
            } else {
                result.populate(populate);
            }
        }
        if (select) {
            result.select(select);
        }
        result = await result.exec();
        return result ? result.toObject() : null;
    }
    schema.statics.createModel = async function(model, user) {
        model.createdBy = user;
        let result = await this.create(model);
        const action = {
            type: 'CREATE',
            user,
            collectionName: this.collection.name,
            oldValue: null,
            newValue: JSON.stringify(result)
        }
        UserActionModel.create(action);
        return result ? result.toObject() : null;
    }
    schema.statics.createModel1 = async function(model, user) {
        model.createdBy = user;
        let result = await this.create(model);
        const action = {
            type: 'CREATE',
            user,
            collectionName: this.collection.name,
            oldValue: null,
            newValue: JSON.stringify(result)
        }
        UserActionModel.create(action);
        return result ? result : null;
    }
    schema.statics.deleteModel = async function(id, updatedAt, user) {
        const oldVersion = await this.findOne({_id: id}).exec();
        if (oldVersion) {
            let result = await this.findByIdAndDelete(id);
            const action = {
                type: 'DELETE',
                user,
                collectionName: this.collection.name,
                oldValue: JSON.stringify(oldVersion),
                newValue: null
            }
            UserActionModel.create(action);
            return result ? result.toObject() : null;
        }
        return null;
    }

    schema.statics.updateModel = async function(id, model, user) {
        const oldVersion = await this.findOne({_id: id}).exec();

        //Update
        model.updatedAt = new Date();
        model.updatedBy = user;
        await this.findByIdAndUpdate(id, model).exec();
        const result = await this.findById(id).exec();

        const oldValueToDiff = oldVersion.toObject();
        const newValueToDiff = result.toObject();

        delete oldValueToDiff.updatedAt;
        delete oldValueToDiff.updatedBy;
        delete oldValueToDiff.createdBy;

        delete newValueToDiff.updatedAt;
        delete newValueToDiff.updatedBy;
        delete newValueToDiff.createdBy;

        const differ = diff(JSON.parse(JSON.stringify(oldValueToDiff)), JSON.parse(JSON.stringify(newValueToDiff)));
        if (differ) {
            const action = {
                type: 'UPDATE',
                user,
                collectionName: this.collection.name,
                diff: differ,
            }
            UserActionModel.create(action);
        }
        return result ? result.toObject() : null;
    }

    schema.statics.deleteById = async function(id) {
        await this.deleteOne({_id: id});
    }

    schema.statics.getByQuery = async function(query, populate) {
        let result = null;
        if (query.id) {
            const id = query.id || query._id;
            delete query.id;
            query = {
                ...query,
                _id: id,
            }
            if (!Types.ObjectId.isValid(query._id)) throw 'Invalid ID';
        }
        result = this.find(query);
        if (populate) {
            populate.forEach(item => result.populate(item));
        }
        result = await result.exec();
        return result ? result : [];
    }

    return schema;
}

export default createSchema;