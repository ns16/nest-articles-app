import SeedsManager from './seeds-manager';

SeedsManager.run()
  .catch(error => console.log(error)) // eslint-disable-line no-console
  .finally(() => process.exit());
