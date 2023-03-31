# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

I started by writing unit tests with several possible input values that the function `deterministicPartitionKey` could receive. Then I looked for patterns in the unit tests so I could group them. I found 3 groups:

- When the function returns a trivial key
- When the function returns a string key
- When the function returns a hashed key

Then, I started the refactoring by removing the most obvious conditions / branches that were superfluous.

After that, I tried to capture the 3 test groups in code:

- First, an early exit for the trivial key case.
- Second, the string key, which is returned when a partition key is provided.
- And third the hash case, which is a kind of fallback in case the partition key is not provided.

Finally, I cleaned the code: Reordered the code (3 groups) so nested conditionals are removed. Renamed some variables, deleted debugging statements. And renamed and refactored the unit tests.
