#!/bin/sh

npm run build && hugo && aws s3 sync ./public s3://biesnecker.com/