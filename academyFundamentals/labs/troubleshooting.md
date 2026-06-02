# Troubleshooting Tips and Tricks

This document provides a few options to help you resolve any issues you might potentially encounter in the lab notebooks.

## Lab 1

### Cannot find function {Some Persistable Type method} in object {Type Name}.

The following code snippet contains an example error output after running `Store.fetch()`:

```
TypeError: Cannot find function fetch in object Store. (eval code#1(eval)#1)!
```

If you see this error while trying to use any methods on a Persistable Type in your application package, there are a few fixes. We recommend checking these in order:

1. Ensure that you include the `entity` keyword in the Type declaration. You can refer to the [lab 1 solutions](../src/doc/create-and-query-persistable-types-solution.c3doc.md) for the expected implementation.
2. Try restarting the notebook by selecting **Restart notebook** in the notebook toolbar. Sometimes, Type definition changes aren't picked up in the notebook.
3. As a last resort, delete and recreate the Type definition.

## Lab 2

### My collection and reference fields are not updating in the notebook

For activities 2.2 and 2.3, if your collection and reference fields are not updating or returning results, try restarting the notebook by selecting **Restart notebook** in the notebook toolbar.
