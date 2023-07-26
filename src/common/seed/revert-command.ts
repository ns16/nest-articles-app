import SeedsManager from './seeds-manager';

SeedsManager.revert().catch(error => console.log(error)).finally(() => process.exit());
