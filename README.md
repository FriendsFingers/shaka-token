# Shaka Token

[![Build Status](https://travis-ci.org/FriendsFingers/shaka-token.svg?branch=master)](https://travis-ci.org/FriendsFingers/shaka-token) 
[![Coverage Status](https://coveralls.io/repos/github/FriendsFingers/shaka-token/badge.svg?branch=master)](https://coveralls.io/github/FriendsFingers/shaka-token?branch=master)

Smart Contracts for the Shaka Token issued by FriendsFingers.

Official website: [https://www.friendsfingers.com/shaka](https://www.friendsfingers.com/shaka)

## Prerequisites

Install truffle

```bash
npm install -g truffle      // Version 4.1.15+ required
```

### Install dependencies

```bash
npm install
```

### Linter

Use Ethlint

```bash
npm run lint:sol
```

Use ESLint

```bash
npm run lint:js
```

Use both and fix

```bash
npm run lint:fix
```

### Compile and test the contracts
 
Open the Truffle console

```bash
truffle develop
```

Compile 

```bash
compile 
```

Test

```bash
test
```

## Optional

Install the [truffle-flattener](https://github.com/alcuadrado/truffle-flattener)

```bash
npm install -g truffle-flattener
```

Usage 

```bash
truffle-flattener contracts/token/ShakaToken.sol > .dist/ShakaToken.dist.sol
```

## License

Code released under the [MIT License](https://github.com/FriendsFingers/shaka-token/blob/master/LICENSE).
