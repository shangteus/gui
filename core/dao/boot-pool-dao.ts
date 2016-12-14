import { AbstractDao } from './abstract-dao-ng';

export class BootPoolDao extends AbstractDao {

    public constructor() {
        super({}, {
            typeName: 'BootPoolConfig'
        });
    }

    public getConfig() {
        return this.middlewareClient.callRpcMethod('boot.pool.get_config');
    }

    public scrub() {
        return this.middlewareClient.callRpcMethod('boot.pool.scrub');
    }
}

