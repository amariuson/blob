## Patches

### `@sveltejs/kit@2.50.1`

| Patch                                             | Status    | Reference                                               |
| ------------------------------------------------- | --------- | ------------------------------------------------------- |
| Server path detection & `remote/index.ts` support | Permanent | -                                                       |
| `RemoteForm.reset()` method                       | Temporary | [PR #14779](https://github.com/sveltejs/kit/pull/14779) |

**When PR #14779 is merged:** Run `pnpm patch @sveltejs/kit`, apply only the permanent changes from `git show HEAD:patches/@sveltejs__kit@2.50.1.patch`, then `pnpm patch-commit`.
