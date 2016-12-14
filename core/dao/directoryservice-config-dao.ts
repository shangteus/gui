import { AbstractDao } from './abstract-dao-ng';

export class DirectoryserviceConfigDao extends AbstractDao {

    public constructor() {
        super('DirectoryserviceConfig', {
            queryMethod: 'directoryservice.get_config'
        });
    }

}
