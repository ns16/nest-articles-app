import SeedsManager from './seeds-manager';

SeedsManager.revert()
  .catch(error => console.log(error)) // eslint-disable-line no-console
  .finally(() => process.exit());
