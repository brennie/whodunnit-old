# Hooks

The hooks in this directory are intended to be symlinked into the `.git/hooks`
directory of the project to aid in development.

The hooks are:

## pre-commit

This hook runs the `gulp lint` task before committing to ensure code that is
committed is syntactically correct and well formatted.
