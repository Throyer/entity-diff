# Entity diff

A simple entity diff generator.

generates a list of changes made to the entity.

All you need are two objects, one with the entity before the changes and the other with it after the changes.

<a target="_blank" href="https://stackblitz.com/edit/typescript-3heozh?file=index.ts">Try it out</a>

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

*****

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

## Working with `array` diffs

when working with arrays, diffs are generated only when there is some value in `"arrayOptions"`.

The `"key"` property represents the key used to find the entities within the other array. it is optional, but by default entity-diff looks for the `"id"` key.

```typescript
  import { Audit } from "entity-diff";

  const before = {
    name: "Mason",
    age: 20,
    roles: [
      {
        id: 1,
        name: "ADM"
      },
      {
        id: 2,
        name: "USER"
      }
    ]
  };

  const after = {
    name: "Mason",
    age: 20,
    roles: [
      {
        id: 1,
        name: "SUPER_USER"
      },
      {
        id: 3,
        name: "TEC"
      }
    ]
  };

  const options = [
    {
      key: "roles",
      arrayOptions: {
        name: "name"
      }
    }
  ]; 

  const audit = new Audit({ options });

  const result = audit.diff(before, after);

  // resut:
  // [
  //     {
  //         "key": "roles",
  //         "type": "ARRAY",
  //         "details": [
  //             {
  //                 "key": "ADM",
  //                 "type": "MODIFIED",
  //                 "details": [
  //                     {
  //                         "key": "name",
  //                         "from": "ADM",
  //                         "to": "SUPER_USER"
  //                     }
  //                 ]
  //             },
  //             {
  //                 "key": "TEC",
  //                 "type": "NEW",
  //                 "details": [
  //                     {
  //                         "key": "id",
  //                         "from": null,
  //                         "to": 3
  //                     },
  //                     {
  //                         "key": "name",
  //                         "from": null,
  //                         "to": "TEC"
  //                     }
  //                 ]
  //             },
  //             {
  //                 "key": "USER",
  //                 "type": "REMOVED",
  //                 "details": [
  //                     {
  //                         "key": "id",
  //                         "from": 2,
  //                         "to": null
  //                     },
  //                     {
  //                         "key": "name",
  //                         "from": "USER",
  //                         "to": null
  //                     }
  //                 ]
  //             }
  //         ]
  //     }
  // ]
```


