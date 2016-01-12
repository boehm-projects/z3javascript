#!/bin/bash -e

entry="$(cat ./templates/pre_ref_bindings.js)"
binding="$(cat ./compiled/z3_bindings_built.js)"
exit="$(cat ./templates/post_ref_bindings.js)"

printf "$entry \n\n$binding \n\n$exit" > ./compiled/z3_bindings_ref.js
node ./node_modules/babel-cli/bin/babel ./compiled/z3_bindings_ref.js > ./compiled/z3_bindings_ref_es5.js