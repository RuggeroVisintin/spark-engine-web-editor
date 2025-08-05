# 3. Script Serialization

Date: 2025-08-05

## Status

Accepted

## Context

In order to implement richer game logic, some entities and components may require scripted actions, for example when wanting to react to specific trigger collider,
Or when wanting to handle inputs from the user.

That's why we need to introduce some form of scripting in the editor, which also comes with the challenge of serializing/deserializing those scripts

Within this ADR, we take into account two fundamentally different approaches

### Solution - Callback Serialization

In this solution, we would serialize each callback individually like so

```javascript
function onTriggerCb() {
  // Do things
}

function onInputEventCB() {
  // Do things
}
```

* Good because this is very simple to start with
* Good because this can be applied both at the entity and component level
* Good because it enables for different component's instances script
* Bad because it creates bloated scene files due to the need of having to copy/paste the same script over and over again when wanting to share the same logic
* Bad because it creates unnecessary overhead onto game developers to keep those copy/pasted scripts in sync
* Bad because it requires parsing of javascript string, which creates additional complexity (for example: in editor linting, the actual parsing, and more)
* Bad because the whole scripting logic has to be self contained in the function body and no external references are allowed
    * This could be mitigated/solved at the expense of bringing a lot of unnecessary complexity

### Solution - Inject components/entities dynamically

This is not a problem no body did solve before, very popular engines like Unreal Engine and Unity already managed to solve this problem by allowing game developers
to defined their own entities/components through inheritance of the construct already provided by the engine. While this introduces another set of interesting problems, 
like dynamically inject those components and having the editor adapt for them, it solves the issue at its root cause and provide a foundational ground for higher scalability in feature's complexity

```typescript
class MyCustomEntity extends TriggerEntity {

    protected onTriggerCB(target: IEntity) {
        // my custom game logic
    }
}
```

* Good because it avoids bloating up the scene's file
* Good because it minimizes --Or avoids completely even-- additional code parsing by leveraging existing language functionalities
* Good because it opens up to the possibility of editing these files in the game developer's favourite IDE, and potentially also removing the need of an integrated IDE
* Good because it allows game developers to build their own set of tools on top of the logic, for example by bundling code distributed across different files into a single file
    * This also creates an opportunity to add this feature later on much easily and through well supported tools
* Bad because it requires a considerable amount of work before getting to a POC
* Bad because it forces the game developer to always create entities/components even for one-off instances, which may result in confusing management of entities/components catalog

## Decision

The final decision is to use the "Callback Serialization" approach. Although very limited compared to the alternative, it allows to quickly integrate scripting logic into the editor. 

Additionally, the same approach would still provide a low valid alternatives for unique scripts when eventually a fundamentally better approach will be necessary.

1) We will offer an integrated scripting editor to edit scripted callbacks

2) We will serialize scritped callbacks in the scene file as string to be able to re-inject them upon loading a scene

3) We will use append a "function::" prefix to properties representing scripted callbacks to be able to identify them uniquely when loading scenes

4) We will implement minimal parsing and linting to reduce complexity

## Consequences

👍 Fast way to unblock the scripting problem in the editor

👍 The integrated editor will still prove useful in future iteration

👎 While fast to integrate for the engine MVP, this solutions is fundamentally flawed and a will require a drastic change in the approach, resulting in avoidable rewrite