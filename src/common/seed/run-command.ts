import SeedsManager from './seeds-manager';

SeedsManager.run().catch(error => console.log(error)).finally(() => process.exit());
