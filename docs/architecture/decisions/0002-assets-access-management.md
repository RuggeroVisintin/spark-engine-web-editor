# 2. assets-access-management

Date: 2024-09-20

## Status

Accepted

## Context

At the moment the only type of asset that can be loaeded from the filesystem is a JSON containing the scene data.
The way it works is by leveraging the browser [FileSystem Web API](https://developer.mozilla.org/en-US/docs/Web/API/FileSystem) to gather access to the specified file,
specifically the `showOpenFilePicker`.

When picking up [#57](https://github.com/RuggeroVisintin/spark-engine-web-editor/issues/57) the current implementation
already hit its limitations.

### The issue

A scene might contain assets (images, sound, etc) expressed as filesystem paths. Right now there is no opinionated way to express those paths
which could be represented through absolute and relative paths.

Due to browsers' security feature, a javascript runtime cannot access an arbitrary file or directory without the use choosing to give access to
the specified file/directory, **which means specified assets cannot be loaded at the moment**.

Access to specific directories/files can be requested through [FileSystem Web API](https://developer.mozilla.org/en-US/docs/Web/API/FileSystem)

### Solution #1 - Load a project as a whole directory

With this solution, instead of opening/saving a single scene, the user would be prompted to select a directory which must contain a valid `.proj.spark.json` file.
This way the editor would be able to access all the directories inside the project directory, and load assets in the scene, which would use a path relative to the
project's directory.

```tree
├──my-spark-proj
├  ├──project.proj.spark.json
├  ├──assets
├  ├  ├──my-special-texture.png
├  ├──scenes
├  ├  ├──scene1.scene.spark.json
```

```json
{
    "name": "myAwesomeGame"
    "scenes": ["/scenes/scene1.scene.spark.json", ...]
}
```

```json
{
    "GameObject1": {
        "__type": "GameObject",
        "name": "GameObject1",
        "transform": {
            "__type": "TransformComponent",
            "position": {
                "x": 55,
                "y": 55
            },
            "size": {
                "width": 30,
                "height": 30
            },
            "depthIndex": 0,
            "velocity": {
                "x": 0,
                "y": 0
            }
        },
        "shape": {
            "__type": "ShapeComponent",
            "transform": {
                "__type": "TransformComponent",
                "position": {
                    "x": 55,
                    "y": 55
                },
                "size": {
                    "width": 30,
                    "height": 30
                },
                "depthIndex": 0,
                "velocity": {
                    "x": 0,
                    "y": 0
                }
            },
            "shapeType": 0,
            "isWireframe": false
        },
        "material": {
            "__type": "MaterialComponent",
            "diffuseColor": {
                "r": 255,
                "g": 0,
                "b": 0
            },
            "diffuseTexturePath": "/assets/my-special-texture.png",
            "opacity": 100
        }
    }
}
```

| # |Stressor | Residue | Technical Solution |
|---|-------- | ------- | ------------------ |
| 1 | User picks a directory without a project file | The project cannot be loaded | Inform the user about the issue |
| 2 | User picks a directory with an invalid project file | See Residue #1 | See Residue #1 |
| 3 | Components point to a non existing assets | The specific asset cannot be loaded | Use a default material diffuse color to make the issue more obvious |
| 4 | When assigning an asset to a component, the asset comes from a directory outside the project's directory scope | The asset won't be loaded upon project reloaded | Copy the asset in an "assets" directory |
| 5 | User picks a directory with multiple project files inside | The system cannot tell which is the right one to load | enforce a specific project name to avoid having more than a file

### Solution #2 - Prompt use to select an asset directory

In this proposal we consider prompting the user to select the directory where the assets are stored.
This solution presents the major issue of not asking for a project's directory, which means no directory scope can be enforced, opening up to assets scattered across
multiple directories of the file system, essentially failing to effectively solve the aforementioned issue.

This solution is therefore excluded without further analaysis.

## Decision

1) We will prompt the user to select a project directory when wanting to work on an existing project to gather access to the specified directory and subdirs

2) We will use an opinionated "assets" directory for assets to have a well known location where to load and save assets

3) We will use a specific material default diffuse color when assets are missing to better highlight the missing asset to the user

4) We will copy assets assigned to a component in the opinionated "assets" directory to ensure assets are always accessible once a project's directory permissions are gathered

5) We will notify the user when a project file is not present in the selected project directory to make sure they are aware

6) We will notify the user when the project file inside a directory is invalid to make sure they are aware

7) We will use `.project-manifest.spark.json` filename to ensure only a single project manifest exists in every project directory

## Consequences

👍 Getting access to the project's directory automatically provides access to every subdir

👍 Enforcing a directory structure ensures assets are always under reach

👎 Introducing an opinionated project file format / directory structure increases the risk of future breaking changes and potentially introduces the need of managing versions migrations

👎 Introducing an opinionated project file format / directory structure requires additional validation overhead
