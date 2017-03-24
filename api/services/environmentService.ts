import { ResObject } from '../common/res_object';
import { Connection } from 'typeorm';
import { Collection } from '../models/collection';
import { Environment } from '../models/environment';
import { Team } from '../models/team';
import { User } from '../models/user';
import { ConnectionManager } from "./connectionManager";
import { ObjectLiteral } from "typeorm/common/ObjectLiteral";
import { Variable } from "../models/variable";

export class EnvironmentService {

    static async get(id: string, needVars: boolean = false): Promise<Environment> {
        const connection = await ConnectionManager.getInstance();
        let rep = await connection.getRepository(Environment).createQueryBuilder('env');
        if (needVars) {
            rep = rep.innerJoinAndSelect('env.variables', 'variable');
        }
        return await rep.where('id=:id').addParameters({ 'id': id }).getOne();
    }

    static async create(name: string, variables: Variable[], owner: User): Promise<ResObject> {
        const env = new Environment(name, variables, owner);
        await env.save();

        return { success: true, message: '' };
    }

    static async update(id: string, name: string, variables: Variable[], owner: User): Promise<ResObject> {
        const env = new Environment(name, variables, owner);
        env.id = id;
        await env.save();

        return { success: true, message: '' };
    }

    static async delete(id: string): Promise<ResObject> {
        const connection = await ConnectionManager.getInstance();
        const env = await EnvironmentService.get(id);
        if (env) {
            await connection.getRepository(Environment).remove(env);
        }

        return { success: true, message: '' };
    }
}