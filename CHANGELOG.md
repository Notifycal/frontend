# Changelog

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
