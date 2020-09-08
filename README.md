# Entity diff

A simple entity diff generator.

generates a list of changes made to the entity.

All you need are two objects, one with the entity before the changes and the other with it after the changes.

[Try it out](https://stackblitz.com/edit/typescript-3heozh?file=index.ts)

## how to Install

npm:
```shell
npm install entity-diff
```

yarn:
```shell
yarn add entity-diff
```


*****


## How to use:
``` typescript

import { Audit } from "entity-diff";

const audit = new Audit();

const before = {
  name: "Mason",
  age: 20
};

const after = {
  name: "Mason Floyd",
  age: 20
};

const result = audit.diff(before, after);

// result:
// [
//   {
//     key: "name",
//     from: "Mason",
//     to: "Mason Floyd"
//   }
// ]

```

# Audit Options:

It is possible to change some information in the final result of the diffs using parameters.

### Ignoring properties

It is possible to ignore some keys of the objects audited through a list.

```typescript
  import { Audit } from "entity-diff";

  const before = {
    name: "Mason",
    age: 20
  };

  const after = {
    name: "Mason Floyd", // this change will be ignored
    age: 25
  };

  const ignore = ["name"]; 

  const audit = new Audit({ ignore });

  const result = audit.diff(before, after);

  // result:
  // [
  //   {
  //     key: "age",
  //     from: 20,
  //     to: 25
  //   }
  // ]
```

### Different name in the keys

Changing the name that appears in the key in the result

```typescript
  import { Audit } from "entity-diff";

  const before = {
    name: "Mason",
    age: 20
  };

  const after = {
    name: "Mason Floyd",
    age: 25
  };

  const options = [{ key: "name", title: "Person name" }]; 

  const audit = new Audit({ options });

  const result = audit.diff(before, after);

  // result:
  // [
  //   {
  //     key: "Person name", // title defined in options
  //     from: "Mason",
  //     to: "Mason Floyd"
  //   }
  // ]
```


### formatting the values displayed in "from" and "to"

It can be done through a function defined in options

```typescript
  import { format } from 'date-fns'
  import { Audit } from "entity-diff";

  const before = {
    name: "Mason",
    age: 20
  };

  const after = {
    name: "Mason Floyd",
    age: 20,
    updatedAt: "2020-09-08T18:04:56.627Z"
  };

  const options = [
    {
      key: "updatedAt",
      customFormatter: date => format(new Date(date), "MM/dd/yyyy")
    }
  ]; 

  const audit = new Audit({ options });

  const result = audit.diff(before, after);

  // result:
  // [
  //   {
  //     key: "updatedAt",
  //     from: null,
  //     to: "09/08/2020"
  //   }
  // ]
```


