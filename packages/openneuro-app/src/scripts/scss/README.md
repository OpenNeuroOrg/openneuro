Adding to the global SASS should be avoided if possible. New styles should be added as reusable components with the [Emotion package](https://emotion.sh).

These global styles cross many components that haven't been refactored. Style changes that can do this would allow for more isolated component styles with less chance of breaking on cross component changes.
