# Meteor Astronomy

Model layer for Meteor

**Table of Contents**

- [Functionalities](#functionalities)
- [Installation](#installation)
- [Key Concepts](#key-concepts)
  - [Documents transformation](#documents-transformation)
  - [Saving, updating and removing documents](#saving-updating-and-removing-documents)
  - [Fetching documents](#fetching-documents)
  - [Model schema](#model-schema)
    - [Constructor](#constructor)
    - [Fields](#fields)
    - [Methods](#methods)
    - [Getting modified fields](#getting-modified-fields)
    - [Cloning](#cloning)
    - [Reloading](#reloading)
    - [Events](#hooks)
    - [Behaviors](#behaviors)
      - [NestedSet](#nestedset)
      - [Sort](#sort)
      - [Timestamp](#timestamp)
    - [Inheritance](#inheritance)
- [Writing behaviors](#writing-behaviors)
- [Contribution](#contribution)
- [License](#license)

## Functionalities

- Automatic documents transformation
- Fields definition
- Methods definition
- Events (before/after save, update, insert and remove)
- Modified fields getter
- Documents cloning
- Documents reloading
- Inheritance
- Built in behaviors (NestedSet, Sort, Timestamp)
- Possibility to extend functionality through custom behaviors
- Setters and getters (partially implemented)
- Validators (soon)
- Relations definition (soon)
- Automatic related object fetching (soon)
