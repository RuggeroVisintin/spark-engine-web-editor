# Git Conventions

In order to facilitate contributions to the project, please make sure to follow the conventions detailed below.

For most of the conventions, enforcing happens through automations. Any change proposal can be submitted through the usual contribution process and a maintainer will review it.

## Pull Request Process

1. Ensure your code passes all CI checks
2. Update the README.md with details of changes to the interface, if applicable.
3. Your Pull Request will be reviewed by maintainers, who may request changes or provide feedback.

## Git Hooks

The project adopts conventional commit to ensure commits' messages adhere to a common standard and enable automated release notes generation.

### Pre Commit

**code lint**\
the code is linted and automatically fixed whenever possible. The lint pass is a non blocking

### Commit Message

**linting**\
the commit message is checked against the conventional commit configuration. When the check fails, it will either exit with an error code (VSCode) or open an editor in the terminal and let you edit the message

**spell check**\
a spell check is performed against the commit message to ensure the message does not contain any grammar issue. Any potential issue will be highlighted and will make the commit fail. If the issue turns out to be a false positive you can add exceptions in the `.git-dictionary.txt` file
