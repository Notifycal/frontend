# Changelog

## [0.8.2](https://github.com/Notifycal/frontend/compare/v0.8.1...v0.8.2) (2025-01-28)


### Bug Fixes

* use App token for commits to trigger workflow ([#125](https://github.com/Notifycal/frontend/issues/125)) ([f323b80](https://github.com/Notifycal/frontend/commit/f323b80fe89e006427eb256c86b2cb27f470f349))

## [0.8.1](https://github.com/Notifycal/frontend/compare/v0.8.0...v0.8.1) (2025-01-26)


### Bug Fixes

* trigger new release ([#106](https://github.com/Notifycal/frontend/issues/106)) ([a90efd4](https://github.com/Notifycal/frontend/commit/a90efd47a42979161e6a1d913ce5a267e636a6dc))

## [0.8.0](https://github.com/Notifycal/frontend/compare/v0.7.0...v0.8.0) (2025-01-22)


### Features

* absorb API breaking changes ([ae8c8c1](https://github.com/Notifycal/frontend/commit/ae8c8c13e90ddc8c88c47b24ba89854e66dc2904))
* previous commit was not a chore. it was actually a breaking change ([964a0b6](https://github.com/Notifycal/frontend/commit/964a0b693074fc7a33dd84097efa0bd85efd65b4))

## [0.7.0](https://github.com/Notifycal/frontend/compare/v0.6.2...v0.7.0) (2025-01-14)


### Features

* add config so app can interact with localstack too ([#93](https://github.com/Notifycal/frontend/issues/93)) ([3c103ff](https://github.com/Notifycal/frontend/commit/3c103fff57fdc47b1a9a138e6c9e0f6ea5ac1fee))

## [0.6.2](https://github.com/Notifycal/frontend/compare/v0.6.1...v0.6.2) (2025-01-08)


### Bug Fixes

* stop relying in STATIC_LANDING_URL for now ([#77](https://github.com/Notifycal/frontend/issues/77)) ([1e21efb](https://github.com/Notifycal/frontend/commit/1e21efbe5c3df7ff33a3f43533eddb7c7616c7e4))

## [0.6.1](https://github.com/Notifycal/frontend/compare/v0.6.0...v0.6.1) (2025-01-08)


### Bug Fixes

* bump static website module. Remove unused variable ([#75](https://github.com/Notifycal/frontend/issues/75)) ([8a9237d](https://github.com/Notifycal/frontend/commit/8a9237d38808560396faf3e8ddaa1498260f6aad))

## [0.6.0](https://github.com/Notifycal/frontend/compare/v0.5.3...v0.6.0) (2025-01-07)


### Features

* add cloudflare_config parameter to determine whether or not cloudfla… ([#73](https://github.com/Notifycal/frontend/issues/73)) ([88b084e](https://github.com/Notifycal/frontend/commit/88b084e14d80f63eb3da09ad2d42acbdc0732ad6))

## [0.5.3](https://github.com/Notifycal/frontend/compare/v0.5.2...v0.5.3) (2025-01-07)


### Bug Fixes

* define base_domain at stack level as it will not change that often ([#70](https://github.com/Notifycal/frontend/issues/70)) ([388ccf7](https://github.com/Notifycal/frontend/commit/388ccf71beb9045260c0d8214c03aca5cbe289e2))
* empty S3 bucket before syncing the build to it ([#72](https://github.com/Notifycal/frontend/issues/72)) ([9cb4f2b](https://github.com/Notifycal/frontend/commit/9cb4f2b30d3df7181668406191686a23ec019a5a))

## [0.5.2](https://github.com/Notifycal/frontend/compare/v0.5.1...v0.5.2) (2025-01-03)


### Bug Fixes

* use proper path on post-apply script ([#63](https://github.com/Notifycal/frontend/issues/63)) ([38def00](https://github.com/Notifycal/frontend/commit/38def00c8ee1d4da56e0ef9b5e1cb56ddf2c56c3))

## [0.5.1](https://github.com/Notifycal/frontend/compare/v0.5.0...v0.5.1) (2025-01-02)


### Bug Fixes

* skel file name ([#61](https://github.com/Notifycal/frontend/issues/61)) ([09e38e8](https://github.com/Notifycal/frontend/commit/09e38e89471c1bff441838a1780b285903af3158))

## [0.5.0](https://github.com/Notifycal/frontend/compare/v0.4.0...v0.5.0) (2025-01-02)


### Features

* improve config handling for prod and dev ([#59](https://github.com/Notifycal/frontend/issues/59)) ([a0e50fd](https://github.com/Notifycal/frontend/commit/a0e50fd907f3ffafcb643e436a91c693350cc466))

## [0.4.0](https://github.com/Notifycal/frontend/compare/v0.3.0...v0.4.0) (2025-01-02)


### Features

* validate globalConfig on app mount and make it available throughout the app with a Provider/Context pattern ([#54](https://github.com/Notifycal/frontend/issues/54)) ([875b415](https://github.com/Notifycal/frontend/commit/875b415e874653f9d80925d6cbedecd5285d4ba1))


### Bug Fixes

* initialize axios client outside of the callback ([#56](https://github.com/Notifycal/frontend/issues/56)) ([519a71a](https://github.com/Notifycal/frontend/commit/519a71a589878a70d8c7a3a466b97c26ac94e19d))

## [0.3.0](https://github.com/Notifycal/frontend/compare/v0.2.1...v0.3.0) (2024-12-30)


### Features

* full auth and refresh ([#47](https://github.com/Notifycal/frontend/issues/47)) ([d25fc0c](https://github.com/Notifycal/frontend/commit/d25fc0cef7535fde1e40509e5ac79408eefd3005))

## [0.2.1](https://github.com/Notifycal/frontend/compare/v0.2.0...v0.2.1) (2024-12-27)


### Bug Fixes

* use types for globalConfig keys and values for better intellisense ([#41](https://github.com/Notifycal/frontend/issues/41)) ([b0b9a3b](https://github.com/Notifycal/frontend/commit/b0b9a3b7377d83dce1d87e606c2b525acd1469e1))

## [0.2.0](https://github.com/Notifycal/frontend/compare/v0.1.1...v0.2.0) (2024-12-27)


### Features

* use axios with interceptor for Auth Bearer (with ability to disable) ([#39](https://github.com/Notifycal/frontend/issues/39)) ([176369b](https://github.com/Notifycal/frontend/commit/176369b660d8fd225b37480c230b47e76762b74b))


### Bug Fixes

* drop es-specific redirect vars ([#43](https://github.com/Notifycal/frontend/issues/43)) ([9c06edd](https://github.com/Notifycal/frontend/commit/9c06edd79dedcf0df2af3355859984c29134a076))

## [0.1.1](https://github.com/Notifycal/frontend/compare/v0.1.0...v0.1.1) (2024-12-25)


### Bug Fixes

* use hashHistory for compatibility with S3 static sites ([#35](https://github.com/Notifycal/frontend/issues/35)) ([066fc2f](https://github.com/Notifycal/frontend/commit/066fc2f15852a03103f2bf0585eff9b1bf0fc06d))
* use typescript path alias (@) to avoid relative imports ([#38](https://github.com/Notifycal/frontend/issues/38)) ([e91d1c1](https://github.com/Notifycal/frontend/commit/e91d1c11fc950443c49da30b5766b501813d223b))

## [0.1.0](https://github.com/Notifycal/frontend/compare/v1.0.0...v0.1.0) (2024-12-24)


### Features

* add dashboard page ([#10](https://github.com/Notifycal/frontend/issues/10)) ([c763914](https://github.com/Notifycal/frontend/commit/c7639143f14b41d692a71ec20f3ca439aaa21361))
* add tofu code and CI related stuff ([#21](https://github.com/Notifycal/frontend/issues/21)) ([5d32d59](https://github.com/Notifycal/frontend/commit/5d32d59721d90079af628238433b81073b94b8dd))
* Private routes the madness ([#20](https://github.com/Notifycal/frontend/issues/20)) ([192cff6](https://github.com/Notifycal/frontend/commit/192cff6d4b9463e2320c3962d358c953d26fb8b2))
* re setup storybook ([#11](https://github.com/Notifycal/frontend/issues/11)) ([ba5c6bf](https://github.com/Notifycal/frontend/commit/ba5c6bf2ca65c29c267eeba8aebe4c9f75b95d37))


### Miscellaneous Chores

* update gh repo for release-please action and restart semver ([192df14](https://github.com/Notifycal/frontend/commit/192df14881d8c2de63e0e0419693d510fdf844c9))
