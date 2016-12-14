import { AbstractDao } from './abstract-dao-ng';

export class ReplicationDao extends AbstractDao {

    public constructor() {
        super('Replication');
    }

    public replicateDataset(dataset: Object, replicationOptions: Object, transportOptions: Array<Object>) {
        return this.middlewareClient.submitTask('replication.replicate_dataset', [dataset, replicationOptions, transportOptions]);
    }
}


