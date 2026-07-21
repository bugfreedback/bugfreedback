# Changelog

## [0.0.5](https://github.com/bugfreedback/bugfreedback/compare/bugfreedback-v0.0.4...bugfreedback-v0.0.5) (2026-07-21)


### Features

* initial @bugfreedback/bugfreedback Nuxt module ([80a70f3](https://github.com/bugfreedback/bugfreedback/commit/80a70f373bcddef1dfcb6e963e2b68b33ca7cb4b))
* modal/annotate colors and Nuxt UI icon support ([09a73ef](https://github.com/bugfreedback/bugfreedback/commit/09a73ef4db9133d790161d3d96d5ce7651ff7ae1))


### Bug Fixes

* drop publishConfig.provenance for local npm publish ([90a7a2e](https://github.com/bugfreedback/bugfreedback/commit/90a7a2ee53dee98f0d2f2e64ea66ad7b20f6e4fb))
* explicitly import composables in module runtime ([c248078](https://github.com/bugfreedback/bugfreedback/commit/c248078e7c28f2449782ba272e734d5288e56934))
* remove prepare script so git installs use committed dist ([7ddcdde](https://github.com/bugfreedback/bugfreedback/commit/7ddcddee1ef9a4dac10d79d3787ade857f06033d))
* stabilize annotator toolbar layout for 0.0.3 ([d51e3a1](https://github.com/bugfreedback/bugfreedback/commit/d51e3a1150a851a86513e1ace082bd3fa71d028f))
* stop auto-importing runtime utils into host apps ([c6fff9b](https://github.com/bugfreedback/bugfreedback/commit/c6fff9b9b1454746f9ba317031477237a8d16511))

## [0.0.4](https://github.com/bugfreedback/bugfreedback/compare/v0.0.3...v0.0.4) (2026-07-21)


### Documentation

* simplify README for integrators ([bbf8ecd](https://github.com/bugfreedback/bugfreedback/commit/bbf8ecd7e79e264874d234917568202fb04165ae))

## [0.0.3](https://github.com/bugfreedback/bugfreedback/compare/bugfreedback-v0.0.2...bugfreedback-v0.0.3) (2026-07-20)


### Features

* initial @bugfreedback/bugfreedback Nuxt module ([80a70f3](https://github.com/bugfreedback/bugfreedback/commit/80a70f373bcddef1dfcb6e963e2b68b33ca7cb4b))
* modal/annotate colors and Nuxt UI icon support ([09a73ef](https://github.com/bugfreedback/bugfreedback/commit/09a73ef4db9133d790161d3d96d5ce7651ff7ae1))


### Bug Fixes

* drop publishConfig.provenance for local npm publish ([90a7a2e](https://github.com/bugfreedback/bugfreedback/commit/90a7a2ee53dee98f0d2f2e64ea66ad7b20f6e4fb))
* explicitly import composables in module runtime ([c248078](https://github.com/bugfreedback/bugfreedback/commit/c248078e7c28f2449782ba272e734d5288e56934))
* remove prepare script so git installs use committed dist ([7ddcdde](https://github.com/bugfreedback/bugfreedback/commit/7ddcddee1ef9a4dac10d79d3787ade857f06033d))
* stabilize annotator toolbar layout for 0.0.3 ([d51e3a1](https://github.com/bugfreedback/bugfreedback/commit/d51e3a1150a851a86513e1ace082bd3fa71d028f))
* stop auto-importing runtime utils into host apps ([c6fff9b](https://github.com/bugfreedback/bugfreedback/commit/c6fff9b9b1454746f9ba317031477237a8d16511))

## [0.0.2] - 2026-07-19

### Features

- Annotator and host theming: `modalBgColor`, `modalTextColor`, `annotateBgColor`, `annotateTextColor`.
- Nuxt UI toolbar buttons with bundled Lucide icons.

## [0.0.1] - 2026-07-19

### Bug Fixes

- Explicit `#imports` and relative composable imports for published module runtime (fixes `useBugfreedbackWidget is not defined` in host apps).

## [0.0.0] - 2026-07-19

- Initial Nuxt module scaffold with storage/export adapters, docs site, and Release-driven publishing.
