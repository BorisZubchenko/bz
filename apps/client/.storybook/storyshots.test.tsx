import initStoryshots from '@storybook/addon-storyshots'

if (process.env.STORYSHOTS_ENABLED) {
  initStoryshots({
    configPath: __dirname,
  })
} else {
  it('', () => {
    // Storyshot is not initialized
  })
}
