API Platform  [![Build Status](https://travis-ci.org/developmentsoftware/api-platform.svg?branch=master)](https://travis-ci.org/developmentsoftware/api-platform) [![Coverage Status](https://coveralls.io/repos/developmentsoftware/api-platform/badge.svg?branch=master)](https://coveralls.io/r/developmentsoftware/api-platform?branch=master)

=======

### Please, it is necessary to have
* docker:  [Ubuntu](https://docs.docker.com/engine/installation/linux/ubuntu/) or [Mac](https://docs.docker.com/docker-for-mac/install/)
* docker-compose [Ubuntu](https://docs.docker.com/compose/install/) 

## First steps
```
git clone git@github.com:developmentsoftware/api-platform.git
cd api-platform
cp src/.env.dist src/.env
docker-compose build
docker-compose up -d
exit
```
Go to: [localhost](http://localhost:3000/) 

## Usage

Just run `cd api-platform; docker-compose up -d`, then:
